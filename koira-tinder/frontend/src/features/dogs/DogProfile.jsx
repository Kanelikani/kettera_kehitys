// src/features/dogs/DogProfile.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "http://localhost:5000";

function DogProfile() {
    const { user, token } = useAuth();

    // Lomakkeen state (tämä täytetään ensin "placeholderilla", ja sen jälkeen tietokannasta)
    const [formData, setFormData] = useState({
        name: user?.dogName || "",
        breed: "",
        age: "",
        visibility: "public",
        bio: "",
    });

    const [imageFile, setImageFile] = useState(null);

    // imagePreviewUrl = paikallisen tiedoston (File) esikatselu-URL (blob:)
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    // DEBUUGAUSTA
    const [serverDog, setServerDog] = useState(null);

    // serverImageUrl = kannassa olevan kuvan URL (esim. /uploads/xxx.jpg -> tehdään siitä täysi URL)
    const [serverImageUrl, setServerImageUrl] = useState("");

    // Näytä/piilota esikatselu napilla
    const [showPreview, setShowPreview] = useState(false);

    // Pieni loading, kun haetaan koiraa kannasta
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // 1) Haetaan koiraprofiilin tiedot kannasta heti kun token on olemassa
    // - Jos koiraa ei ole (404), käyttäjä luo sen ensimmäistä kertaa -> ei ole "virhe"
    // - Jos koira löytyy, täytetään lomake sen tiedoilla
    useEffect(() => {
        let ignore = false;

        async function fetchMyDog() {
            setLoading(true);
            setError("");
            setOk(false);

            try {
                const res = await axios.get(`${API_BASE}/api/dogs/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ignore) return;

                const dog = res.data;

                setServerDog(dog);
                // Täytetään lomake kannasta (source of truth)
                setFormData({
                    name: dog.name || "",
                    breed: dog.breed || "",
                    age: dog.age ?? "", // number -> inputiin käy myös "", jos ei arvoa
                    visibility: dog.visibility || "public",
                    bio: dog.bio || "",
                });

                // Jos serverissä on jo kuva, näytetään se (kunnes user valitsee uuden)
                setServerImageUrl(dog.imageUrl ? `${API_BASE}${dog.imageUrl}` : "");
            } catch (err) {
                if (ignore) return;

                // 404 = "ei vielä koiraprofiilia" -> jätetään defaultit
                if (err.response?.status === 404) {
                    setFormData((prev) => ({
                        ...prev,
                        // Esitäytetään nimi user.dogName:lla, jos sellainen löytyy
                        name: prev.name || user?.dogName || "",
                    }));
                    setServerImageUrl("");
                } else {
                    setError(err.response?.data?.error || "Koiraprofiilin haku epäonnistui");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        if (token) fetchMyDog();
        else setLoading(false);

        return () => {
            ignore = true;
        };
    }, [token, user?.dogName]);

    // Esikatselutila: kun imageFile muuttuu, luodaan siitä objectURL ja näytetään se <img>:ssä.
    useEffect(() => {
        if (!imageFile) {
            setImagePreviewUrl("");
            return;
        }

        // Luodaan selaimen sisäinen väliaikainen "blob:" URL, joka osoittaa imageFile-objektiin.
        // Tämän URL:n voi antaa esim. <img src={...}> ja se näyttää paikallisen kuvan ilman uploadia.
        const url = URL.createObjectURL(imageFile);
        setImagePreviewUrl(url);

        // React kutsuu tätä funktiota kahdessa tilanteessa:
        // 1. Ennen kuin tämä effect ajetaan uudestaan (eli kun imageFile vaihtuu uuteen tiedostoon)
        // 2. Kun komponentti poistuu näkyvistä (unmount)
        // revokeObjectURL "katkaisee" blob-URL:n ja antaa selaimelle luvan vapauttaa siihen liittyvät resurssit.
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [imageFile]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setOk(false);

        try {
            // Rakennetaan normaali "payload" (JS-objekti), jossa age on numero.
            // Huom: input type="number" antaa arvon usein stringinä -> castataan itse.
            const payload = {
                ...formData,
                age: formData.age === "" ? "" : Number(formData.age),
            };

            // 2) Kun mukana on tiedosto (kuva), pyyntö pitää lähettää multipart/form-data -muodossa.
            // Siksi käytetään FormDataa eikä suoraa JSON bodya.
            const lomakedaatta = new FormData();

            // 3) FormData ei "sisällä JSON-objektia" suoraan, eli puetaan sille stringit.
            // Lähetetään se kentässä "data", jonka backend parsii JSON.parse(req.body.data).
            lomakedaatta.append("data", JSON.stringify(payload));

            // 4) Tiedosto lisätään omaan kenttään "image".
            // Backendissä multer: upload.single("image") -> req.file
            if (imageFile) lomakedaatta.append("image", imageFile);

            // 5) lähetetään koko lomakedaatta axiosilla
            const res = await axios.post(`${API_BASE}/api/dogs/me`, lomakedaatta, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Päivityksen jälkeen: päivitä serverikuva-URL (jos backend palauttaa imageUrl)
            if (res.data?.imageUrl) setServerImageUrl(`${API_BASE}${res.data.imageUrl}`);

            setOk(true);
        } catch (err) {
            setError(err.response?.data?.error || "Tallennus epäonnistui");
        }
    }

    if (!user) return null; // varotoimi
    if (loading) return <p>Ladataan koiraprofiilia...</p>;

    // Esikatselussa näytetään ensisijaisesti valittu uusi kuva (blob url),
    // ja jos sitä ei ole, näytetään kannassa oleva kuva (serverImageUrl).
    const previewImageToShow = imagePreviewUrl || serverImageUrl;

    return (
        <div>

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

                {/* Pieni siivous: älä laita <label> sisälle toista <label> */}
                <label>
          Profiiliteksti / kuvaus:
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Esim. hauska, keltainen, iloinen mukava koira jne..."
                    />
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

                <label>
          Kuva:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                </label>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {ok && <p style={{ color: "green" }}>Profiili tallennettu!</p>}

                <button type="submit">Tallenna koiraprofiili</button>
            </form>

            <hr />

            <button type="button" onClick={() => setShowPreview((v) => !v)}>
                {showPreview ? "Piilota esikatselu" : "Näytä esikatselu"}
            </button>

            {showPreview && (
                <>
                    <h2>Profiilin esikatselu</h2>

                    <div style={{ border: "1px solid #ccc", padding: 12, maxWidth: 420 }}>
                        {previewImageToShow ? (
                            <img
                                src={previewImageToShow}
                                alt="Kuvan esikatselu"
                                style={{ width: "100%", maxHeight: 240, objectFit: "cover" }}
                            />
                        ) : (
                            <p>Ei kuvaa</p>
                        )}

                        <p>
                            <strong>Nimi:</strong> {formData.name || "-"}
                        </p>
                        <p>
                            <strong>Rotu:</strong> {formData.breed || "-"}
                        </p>
                        <p>
                            <strong>Ikä:</strong> {formData.age || "-"}
                        </p>
                        <p>
                            <strong>Näkyvyys:</strong> {formData.visibility}
                        </p>
                        <p>
                            <strong>Kuvaus:</strong> {formData.bio || "-"}
                        </p>
                    </div>
                </>
            )}
            <pre>{JSON.stringify(serverDog, null, 2)}</pre>
        </div>
    );
}

export default DogProfile;