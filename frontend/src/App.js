import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskCard from "./components/TaskCard";

const API = "http://127.0.0.1:5000";

function App() {
  // ---- STATE ----
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // auth
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // filter
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ---- EFFECT ----
  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setTasks([]);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    loadUser();
    loadTasks(1);
  }, [token]);

  // ---- API CALLS ----
  const loadUser = async () => {
    try {
      const res = await axios.get(`${API}/profile`);
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const loadTasks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks?page=${page}&limit=100`);

      setTasks(res.data.tasks);
      setMeta({
        total: res.data.total,
        page,
        totalPages: res.data.total_pages
      });
    } catch (err) {
      console.log("Task fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- AUTH ----
  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        await axios.post(`${API}/register`, form);
        alert("Account created, login now 👍");
        setMode("login");
      } else {
        const res = await axios.post(`${API}/login`, {
          email: form.email,
          password: form.password
        });

        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setForm({ name: "", email: "", password: "" });
  };

  // ---- TASK ACTIONS ----
  const addTask = async (title, description) => {
    try {
      await axios.post(`${API}/tasks`, { title, description });
      loadTasks(meta.page);
    } catch (err) {
      alert(err.response?.data?.error || "Couldn't add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      loadTasks(meta.page);
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  const toggleTask = async (task) => {
    const status = task.status === "completed" ? "pending" : "completed";

    try {
      await axios.put(`${API}/tasks/${task.id}`, { status });
      loadTasks(meta.page);
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  // ---- AUTH UI ----
  if (!token) {
    return (
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleAuth}>
          <h2>{mode === "login" ? "Welcome back " : "Create account "}</h2>

          {mode === "register" && (
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="action-btn primary-btn">
            {mode === "login" ? "Login" : "Register"}
          </button>

          <p
            className="auth-toggle"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "New to Taskify? Register"
              : "Already have an account? Login"}
          </p>
        </form>
      </div>
    );
  }

  // ---- FILTER ----
  const filteredTasks = tasks.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;

    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      (!t.description ||
        !t.description.toLowerCase().includes(search.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  // ---- MAIN UI ----
  return (
    <div className="app-container">
      <Header user={user} handleLogout={logout} />

      <main className="main-content">
        <section className="left-panel">
          <Dashboard tasks={tasks} />

          <div className="card-box">
            <h2>Add Task</h2>
            <TaskForm onAdd={addTask} />
          </div>
        </section>

        <section className="right-panel">
          <div className="card-box">
            <TaskFilter
              currentFilter={filter}
              setFilter={setFilter}
              searchQuery={search}
              setSearchQuery={setSearch}
            />

            {loading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className="task-scroll-area">
                {filteredTasks.length ? (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      toggleStatus={toggleTask}
                      deleteTask={deleteTask}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No tasks </p>
                  </div>
                )}
              </div>
            )}

            {meta.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={meta.page === 1}
                  onClick={() => loadTasks(meta.page - 1)}
                >
                  ← Prev
                </button>

                <span>
                  Page {meta.page} / {meta.totalPages}
                </span>

                <button
                  disabled={meta.page === meta.totalPages}
                  onClick={() => loadTasks(meta.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;