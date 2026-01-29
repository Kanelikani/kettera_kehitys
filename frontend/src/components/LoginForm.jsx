import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user, data.token); // talletetaan contextiin + localStorageen
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "0 auto" }}>
      <h2>Kirjaudu WufWufiin</h2>
      <div>
        <label>Sähköposti</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Salasana</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
