import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h2>Koirien Tinder 🐶</h2>
      </div>

      <p className="home-text">
        Löydä koirallesi leikkikaveri ja sopivia lenkkiseuralaisia.
      </p>

      <p className="home-links">
        <Link to="/register">Rekisteröidy</Link> tai{" "}
        <Link to="/login">kirjaudu sisään</Link>.
      </p>
    </div>
  );
}

export default Home;
