import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function Settings() {
    const { token } = useAuth();

    const [pwData, setPwData] = useState({
        currentPassword: "",
        newPassword: "",
        newPassword2: "",
    });

    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    const handlePwChange = (e) =>
        setPwData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    async function handleChangePassword(e) {
        e.preventDefault();
        setError("");
        setOk(false);

        try {
            if (!pwData.currentPassword) {
                setError("Anna nykyinen salasana.");
                return;
            }
            if (!pwData.newPassword || pwData.newPassword.length < 6) {
                setError("Uuden salasanan pitää olla vähintään 6 merkkiä.");
                return;
            }
            if (pwData.newPassword !== pwData.newPassword2) {
                setError("Uudet salasanat eivät täsmää.");
                return;
            }

            await axios.put(
                `${API_BASE}/api/auth/me/password`,
                {
                    currentPassword: pwData.currentPassword,
                    newPassword: pwData.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            setOk(true);
            setPwData({ currentPassword: "", newPassword: "", newPassword2: "" });
        } catch (err) {
            setError(err.response?.data?.error || "Salasanan vaihto epäonnistui");
        }
    }

    return (
        <div className="page-container">
            <div className="profile-card">
                <h2>Asetukset</h2>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {ok && <p style={{ color: "green" }}>Salasana vaihdettu!</p>}

                <form onSubmit={handleChangePassword}>
                    <label>
                        Nykyinen salasana:
                        <input
                            type="password"
                            name="currentPassword"
                            value={pwData.currentPassword}
                            onChange={handlePwChange}
                            required
                        />
                    </label>

                    <label>
                        Uusi salasana:
                        <input
                            type="password"
                            name="newPassword"
                            value={pwData.newPassword}
                            onChange={handlePwChange}
                            required
                        />
                    </label>

                    <label>
                        Uusi salasana uudestaan:
                        <input
                            type="password"
                            name="newPassword2"
                            value={pwData.newPassword2}
                            onChange={handlePwChange}
                            required
                        />
                    </label>

                    <div className="button-row settings-actions">
                        <button type="submit">Vaihda salasana</button>
                        <button type="button" className="danger-btn">
                            Poista profiili
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}