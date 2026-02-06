import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

export default function Dogs() {
    const { token } = useAuth();

    const [dogs, setDogs] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function fetchDogs() {
            setLoading(true);
            setError("");

            try {
                const res = await axios.get(`${API_BASE}/api/dogs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ignore) return;

                setDogs(res.data);
                setIndex(0);
            } catch (err) {
                if (ignore) return;
                setError(err.response?.data?.error || "Koirien haku epäonnistui");
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        if (token) fetchDogs();
        else setLoading(false);

        return () => {
            ignore = true;
        };
    }, [token]);

    async function swipe(action) {
        const current = dogs[index];
        if (!current) return;

        try {
            await axios.post(
                `${API_BASE}/api/swipes`,
                { toDogId: current._id, action },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            setIndex((prev) => prev + 1);
        } catch (err) {
            setError(err.response?.data?.error || "Swipe epäonnistui");
        }
    }

    if (!token) return <p>Et ole kirjautunut.</p>;
    if (loading) return <p>Ladataan koiria...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const currentDog = dogs[index];

    if (!currentDog) {
        return (
            <div>
                <h2>Selaa koiria</h2>
                <p>Ei enempää koiria juuri nyt.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Selaa koiria</h2>

            <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
                <h3>{currentDog.name}</h3>
                <p>Rotu: {currentDog.breed || "-"}</p>
                <p>Ikä: {currentDog.age ?? "-"}</p>
                <p>Kuvaus: {currentDog.bio || "-"}</p>

                {currentDog.imageUrl && (
                    <img
                        src={`${API_BASE}${currentDog.imageUrl}`}
                        alt="Koiran kuva"
                        style={{ maxWidth: 320, display: "block" }}
                    />
                )}
            </div>

            <button type="button" onClick={() => swipe("pass")}>
                Ohita
            </button>
            <button type="button" onClick={() => swipe("like")}>
                Tykkää
            </button>
        </div>
    );
}
