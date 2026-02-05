// src/components/DogProfile.jsx

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

function DogProfile() {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.dogName || "",
        breed: "",
        age: "",
        size: "",
        visibility: "public",
    });
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setOk(false);

        try {
            await axios.post(`${API_BASE}/api/dogs/me`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOk(true);
        } catch (err) {
            setError(err.response?.data?.error || "Tallennus epäonnistui");
        }
    }

    if (!user) return null; // varotoimi

    return (
        <div>
            <h2>Oma koiraprofiili</h2>
            <p>Kirjautunut: {user.email}</p>

            <form onSubmit={handleSubmit}>
                <label>
          Koiran nimi:
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
          Rotu:
                    <input
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
          Ikä:
                    <input
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
          Koko:
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Valitse</option>
                        <option value="small">Pieni</option>
                        <option value="medium">Keskikokoinen</option>
                        <option value="large">Suuri</option>
                    </select>
                </label>

                <label>
          Näkyvyys:
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                    >
                        <option value="public">Julkinen</option>
                        <option value="private">Yksityinen</option>
                    </select>
                </label>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {ok && <p style={{ color: "green" }}>Profiili tallennettu!</p>}

                <button type="submit">Tallenna koiraprofiili</button>
            </form>
        </div>
    );
}

export default DogProfile;
