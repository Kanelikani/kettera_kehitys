// frontend/src/App.jsx
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/AuthContext";
import DogCard from "./components/DogCard"; // sinun aiempi DogCard

function App() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>WufWuf 🐶</h1>
      <p>Kirjautunut: {user.email} (koira: {user.dogName || "ei vielä"})</p>
      <button onClick={logout}>Logout</button>

      {/* toistaiseksi voit näyttää täällä demo DogCardit */}
      <DogCard
        dog={{
          name: user.dogName || "Rollo",
          breed: "Mixed",
          age: 4,
          bio: "Ensimmäinen koiraprofiliisi WufWufissa",
          photo: "https://placedog.net/400/300?id=10"
        }}
        onLike={() => {}}
        onPass={() => {}}
      />
    </div>
  );
}

export default App;
