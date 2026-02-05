// src/pages/Login.jsx

import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <h1>Koira-tinder</h1>
      <p>Juu mukava jotta sulla on jo accounti, eikö kirjautumaan koirien Tinderiin</p>
      <LoginForm />
		<div>
            <p>Eikö ole tiliä?</p>
            <Link to="/register">
        		Rekisteröidy Koira-Tinderiin!
            </Link>
        </div>
    </div>
  );
}