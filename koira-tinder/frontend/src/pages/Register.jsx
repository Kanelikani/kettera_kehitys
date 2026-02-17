import RegisterForm from "../features/auth/RegisterForm";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  return (
    <div className="auth-container">
      <h1 className="auth-title">Koira-tinder</h1>
      <p className="auth-subtitle">
        Tervetuloa! Aloita sivuston käyttö rekisteröitymällä.
      </p>

      <RegisterForm />

      <p className="auth-footer">
        Onko sinulla jo tili? <Link to="/login">Kirjaudu sisään!</Link>
      </p>
    </div>
  );
}
