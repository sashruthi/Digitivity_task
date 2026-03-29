import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'sasroot16')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'task_db')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-super-secret-key-change-it')

mysql = MySQL(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (data['user_id'],))
            current_user = cursor.fetchone()
            if not current_user:
                return jsonify({'error': 'Invalid token user!'}), 401
            current_user = {"id": current_user[0], "name": current_user[1], "email": current_user[2]}
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# ---------------- HOME ROUTE ----------------
@app.route('/')
def home():
    return "Task Manager API Running 🚀"


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Name, email, and password are required"}), 400

        name = data['name'].strip()
        email = data['email'].strip()
        password = data['password']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User with this email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, hashed_password)
        )
        mysql.connection.commit()
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400

        email = data['email']
        password = data['password']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            token = jwt.encode({
                'user_id': user[0],
                'exp': datetime.utcnow() + timedelta(days=7)
            }, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({"token": token}), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify(current_user)


@app.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    try:
        data = request.get_json()

       
        if not data or not data.get('title'):
            return jsonify({"error": "Title is required"}), 400
            
        title = str(data['title']).strip()
        if len(title) > 255:
            return jsonify({"error": "Title must be less than 255 characters"}), 400
            
        description = data.get('description', '')
        if description:
            description = str(description).strip()
            if len(description) > 1000:
                return jsonify({"error": "Description too long (max 1000 characters)"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO tasks (user_id, title, description) VALUES (%s, %s, %s)",
            (current_user['id'], title, description)
        )
        mysql.connection.commit()

        return jsonify({"message": "Task created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        if page < 1: page = 1
        if limit < 1 or limit > 100: limit = 10
            
        offset = (page - 1) * limit

        cursor = mysql.connection.cursor()
        
        # Get total count for user
        cursor.execute("SELECT COUNT(*) FROM tasks WHERE user_id = %s", (current_user['id'],))
        total_tasks = cursor.fetchone()[0]
        
        # Get paginated data
        cursor.execute(
            "SELECT id, title, description, status, created_at FROM tasks WHERE user_id = %s ORDER BY id DESC LIMIT %s OFFSET %s", 
            (current_user['id'], limit, offset)
        )
        rows = cursor.fetchall()

        tasks = []
        for row in rows:
            tasks.append({
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "status": row[3],
                "created_at": str(row[4])
            })

        return jsonify({
            "tasks": tasks,
            "total": total_tasks,
            "page": page,
            "limit": limit,
            "total_pages": (total_tasks + limit - 1) // limit if total_tasks > 0 else 1
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    try:
        data = request.get_json()
        status = data.get('status')

        if status not in ['pending', 'completed']:
            return jsonify({"error": "Invalid status"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE tasks SET status=%s WHERE id=%s AND user_id=%s", (status, task_id, current_user['id']))
        mysql.connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found or unauthorized"}), 404

        return jsonify({"message": "Task updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM tasks WHERE id=%s AND user_id=%s", (task_id, current_user['id']))
        mysql.connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found or unauthorized"}), 404

        return jsonify({"message": "Task deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)