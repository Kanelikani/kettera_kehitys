// src/components/Register.jsx

// Lähettää POST /api/auth/register ja tallettaa tokenin AuthContextin kautta

import { useState } from "react";
// AuthContextin login-funktio tallettaa user/token localStorageen + päivittää tilan
import { useAuth } from "../context/AuthContext";
// Axios CRUD-kutsuihin
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";  // Parempi kuin <a href>

// Backendin API:n perusosoite
const API_BASE = "http://localhost:5000";

function Register() {

    const [formData, setFormData] = useState({
        email: "",          //
        password: "",       // backendissä bcryptillä hashaus
        passwordConfirm: "",
        dogName: "",
        visibility: "public",  // Profiilin näkyvyys: public/private, otetaanko käyttöön?
    });
    const [error, setError] = useState(""); 
    // AuthContextin login-funktio: Tallettaa user/token selaimeen localStorageen + päivittää React-tilan
    const { login } = useAuth();
    const navigate = useNavigate();            // hookki navigointiin, jotta päästään profileen rekisteröinnin jälkeen

    // Muuttaa formDataa reaaliaikaisesti kun käyttäjä kirjoittaa
    const handleChange = (e) => {
    // ... spread-operaattori kopioi vanhan formDatan ja päivittää yhden kentän
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lomakkeen lähetys
    async function handleSubmit(e) {
        e.preventDefault();  // Estää sivun uudelleenlatauksen
        setError("");
        if (formData.password !== formData.passwordConfirm) {
            setError("Salasanat eivät täsmää!");
            return;
        }

        try {
            // Backendille lomaketiedot
            const res = await axios.post(`${API_BASE}/api/auth/register`, formData);
      
            // Onnistuessa kirjautetaan sisään automaattisesti
            login(res.data.user, res.data.token);  

            // Ohjaa heti profiiliin
            navigate("/profile");
      
        } catch (err) {
            setError(err.response?.data?.error || "Rekisteröinti epäonnistui");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Rekisteröidy WufWufiin</h2>

            <label>
        Sähköposti:
                <input
                    name="email"
                    type="email"
                    placeholder="Email (esim. kalle@laakso.fi)"
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
                    placeholder="Salasana (väh. 8 merkkiä)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                />
            </label>

            <label>
        Vahvista salasana:
                <input
                    name="passwordConfirm"
                    type="password"
                    placeholder="Vahvista salasana"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    minLength="8"
                />
            </label>

            <label>
        Koiran nimi:
                <input
                    name="dogName"
                    placeholder="Koiran nimi (esim. Aleksi)"
                    value={formData.dogName}
                    onChange={handleChange}
                    required
                />
            </label>


      
            {/* Tarkistetaan että salasanat täsmäävät */}
            {formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                <p style={{ color: "red" }}>Salasanat eivät täsmää!</p>
            )}

      
            <select 
                name="visibility" 
                value={formData.visibility} 
                onChange={handleChange}
            >
                <option value="public">Julkinen profiili (näkyy muille)</option>
                <option value="private">Yksityinen (vain sinulle)</option>
            </select>
      
            {/* Virheviesti punaisella jos API palautti errorin */}
            {error && <p style={{ color: "red" }}>{error}</p>}
      
            <button type="submit">Rekisteröidy</button>
      
            <p>
        Onko tili jo? <Link to="/login">Kirjaudu sisään!</Link>
            </p>
        </form>
    );
}

export default Register;  // Importtaa App.jsx:ään: <Route path="/register" element={<Register />} />
