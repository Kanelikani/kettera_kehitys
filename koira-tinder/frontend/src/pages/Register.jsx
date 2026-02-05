import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div>
      <h1>Koira-tinder</h1>
      <p>No tervettulloo rekisteröitymmään tänne Koirien Tinderiin!</p>
      <RegisterForm />
        <p>
        Onko tili jo? <Link to="/login">Kirjaudu sisään!</Link>
        </p>
    </div>
  );
}