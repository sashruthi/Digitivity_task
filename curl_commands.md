# Task Manager API - cURL Commands
These commands can be run directly in your terminal/command prompt to test your API ends.

### 1. Register a User
```bash
curl -X POST http://localhost:5000/register \
-H "Content-Type: application/json" \
-d "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"password123\"}"
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/login \
-H "Content-Type: application/json" \
-d "{\"email\": \"test@example.com\", \"password\": \"password123\"}"
```
*(Copy the "token" from the response of this request for the following commands!)*

### 3. Get Profile
Replace `YOUR_TOKEN_HERE` with the actual token.
```bash
curl -X GET http://localhost:5000/profile \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Task
```bash
curl -X POST http://localhost:5000/tasks \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d "{\"title\": \"My first task\", \"description\": \"Task description here\"}"
```

### 5. Get All Tasks (with Pagination)
```bash
curl -X GET "http://localhost:5000/tasks?page=1&limit=10" \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Update Task Status
Provide the Task ID in the URL (e.g. `1` here).
```bash
curl -X PUT http://localhost:5000/tasks/1 \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d "{\"status\": \"completed\"}"
```

### 7. Delete Task
```bash
curl -X DELETE http://localhost:5000/tasks/1 \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```
