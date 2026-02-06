import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h2>WufWuf</h2>
            <p>Löydä koirallesi leikkikaveri ja sopivia lenkkiseuralaisia.</p>

            <p>
                <Link to="/register">Rekisteröidy</Link>{" "}
        tai{" "}
                <Link to="/login">kirjaudu sisään</Link>.
            </p>
        </div>
    );
}

export default Home;
