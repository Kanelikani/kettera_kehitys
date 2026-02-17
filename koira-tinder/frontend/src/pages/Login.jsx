// src/pages/Login.jsx
import LoginForm from "../features/auth/LoginForm";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  return (
    <div className="auth-container">
      <h1 className="auth-title">Koira-tinder</h1>
      <p className="auth-subtitle">
        Kirjaudu täältä sisään ja jatka siitä, mihin jäit viimeksi.
      </p>

      <LoginForm />

      <p className="auth-footer">
        Eikö ole tiliä?{" "}
        <Link to="/register">Rekisteröidy Koira-Tinderiin!</Link>
      </p>
    </div>
  );
}
