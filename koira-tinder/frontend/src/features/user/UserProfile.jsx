// frontend/src/features/user/UserProfile.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function UserProfile() {
    const { token, updateUser } = useAuth();

    const [loading, setLoading] = useState(true);

    // DEBBUGGAUSTA
    const [serverUser, setServerUser] = useState(null);

    // Profiilin muokkaus (vaatii currentPassword)
    const [formData, setFormData] = useState({
        email: "",
        dogName: "",
        visibility: "public",
        currentPassword: "",
    });

    // Salasanan vaihto (vaatii currentPassword)
    const [pwData, setPwData] = useState({
        currentPassword: "",
        newPassword: "",
        newPassword2: "",
    });

    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handlePwChange = (e) =>
        setPwData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    // GET /api/auth/me
    useEffect(() => {
        let ignore = false;

        async function fetchMe() {
            setLoading(true);
            setError("");
            setOk(false);

            try {
                const res = await axios.get(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ignore) return;

                setServerUser(res.data);
                setFormData((prev) => ({
                    ...prev,
                    email: res.data.email || "",
                    dogName: res.data.dogName || "",
                    visibility: res.data.visibility || "public",
                    currentPassword: "",
                }));
            } catch (err) {
                if (ignore) return;
                setError(err.response?.data?.error || "Profiilin haku epäonnistui");
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        if (token) fetchMe();
        else setLoading(false);

        return () => {
            ignore = true;
        };
    }, [token]);

    async function handleSaveProfile(e) {
        e.preventDefault();
        setError("");
        setOk(false);

        try {
            if (!formData.currentPassword) {
                setError("Anna nykyinen salasana vahvistukseksi.");
                return;
            }

            const res = await axios.put(
                `${API_BASE}/api/auth/me`,
                {
                    email: formData.email,
                    dogName: formData.dogName,
                    visibility: formData.visibility,
                    currentPassword: formData.currentPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            // Päivitä näkymä + AuthContext/localStorage (email voi muuttua)
            setServerUser(res.data);
            updateUser(res.data); // TÄRKEÄ: token pysyy samana
            setOk(true);

            setFormData((prev) => ({ ...prev, currentPassword: "" }));
        } catch (err) {
            setError(err.response?.data?.error || "Tallennus epäonnistui");
        }
    }

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

            // Huom: tässä ei tarvitse päivittää tokenia eikä useria (paitsi jos te päätätte niin backendissä)
            setOk(true);
            setPwData({ currentPassword: "", newPassword: "", newPassword2: "" });
        } catch (err) {
            setError(err.response?.data?.error || "Salasanan vaihto epäonnistui");
        }
    }

    if (!token) return <p>Et ole kirjautunut.</p>;
    if (loading) return <p>Ladataan profiilia...</p>;

    return (
        <div>
            <h2>Omat käyttäjätiedot</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {ok && <p style={{ color: "green" }}>Tallennettu!</p>}

            <form onSubmit={handleSaveProfile}>
                <label>
          Sähköposti:
                    <input name="email" value={formData.email} onChange={handleChange} />
                </label>

                <label>
          Koiran nimi:
                    <input name="dogName" value={formData.dogName} onChange={handleChange} />
                </label>

                <label>
          Näkyvyys:
                    <select name="visibility" value={formData.visibility} onChange={handleChange}>
                        <option value="public">Julkinen</option>
                        <option value="private">Yksityinen</option>
                    </select>
                </label>

                <label>
          Nykyinen salasana (vahvistus):
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">Tallenna muutokset</button>
            </form>

            <h3>Vaihda salasana</h3>
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

                <button type="submit">Vaihda salasana</button>
            </form>

            {/* <pre>{JSON.stringify(serverUser, null, 2)}</pre> */}


        </div>
    );
}
