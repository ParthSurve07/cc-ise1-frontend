"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchTodos = async () => {
    if (!API_URL) return;

    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };


  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const updateTodo = async (id) => {
    if (!editingText.trim()) return;

    await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editingText }),
    });

    setEditingId(null);
    setEditingText("");
    fetchTodos();
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#ffffff",
      padding: "50px 8%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#1a1a1a"
    }}>
      <div style={{ marginBottom: "40px", maxWidth: "1000px", margin: "0 auto 40px auto" }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: "800",
          color: "#1a1a1a",
          marginBottom: "10px",
          letterSpacing: "-1px"
        }}>
          Tasks
        </h1>
        <p style={{ color: "#666", fontSize: "16px", margin: 0 }}>
          Manage your daily goals
        </p>
      </div>

      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "40px",
        maxWidth: "1000px",
        margin: "0 auto 40px auto"
      }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "16px 20px",
            fontSize: "16px",
            border: "2px solid #000",
            borderRadius: "12px",
            outline: "none",
            backgroundColor: "#fff",
            color: "#111",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "0 40px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 10px",
                backgroundColor: "#ffffff",
                opacity: todo.completed ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  flex: 1,
                }}
              >
                <div
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: todo.completed ? "none" : "2px solid #ddd",
                    backgroundColor: todo.completed ? "#000" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  {todo.completed && "✓"}
                </div>

                {editingId === todo.id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateTodo(todo.id)}
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      border: "2px solid #000",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      flex: 1
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: "#1a1a1a",
                    }}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => updateTodo(todo.id)}
                      style={{
                        background: "#000",
                        border: "none",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: "#eee",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditingText(todo.text);
                      }}
                      style={{
                        background: "#eee",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{
                        background: "#eee",
                        border: "none",
                        color: "red",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

          {todos.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#888',
              marginTop: '60px',
              fontSize: "18px"
            }}>
              No tasks yet.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
