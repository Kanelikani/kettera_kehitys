// src/features/auth/LoginForm.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link , useNavigate} from "react-router-dom";  // Parempi kuin <a href>

// Backendin API:n perusosoite
const API_BASE = "http://localhost:5000";

function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    // päivittää lomakkeen tilan reaaliaikaisesti kun käyttäjä kirjoittaa inputteihin
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, formData);
            login(res.data.user, res.data.token);  // kutsuu AuthContextin login-funktiota, joka päivittää user ja token
            navigate("/dogs");
        } catch (err) {
            setError(err.response?.data?.error || "Kirjautuminen epäonnistui");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Kirjaudu sisään</h2>

                <label>
        Sähköposti:
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
        Salasana:
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="8"
                    />
                </label>

                {/* Virheviesti punaisella jos API palautti errorin */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Kirjaudu sisään</button>
            </form>
        </div>
    );
}

export default LoginForm;