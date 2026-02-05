import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dogs from "./pages/Dogs";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
// reitityskirjasto, tekee SPA-sovelluksesta monisivuisen ilman sivunlatauksia
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/Login";
import Register from "./components/Register";
import DogProfile from "./components/DogProfile";   // Käyttäjän koiraprofiili
// import DogCard from './components/DogCard';  // testiä varten

// Navbar, näyttää Login/Register tai Logout riipuen AuthContextin user-tilasta 
function Navbar() {
    const { user, logout } = useAuth(); // Haetaan käyttäjä + logout-funktio AuthContextista
    return (
        <nav>
            <h1>Koira-tinder</h1>
            {user ? (
                <>
                    <span>Hei {user.dogName}! </span>
                    <button onClick={() => logout()}>Kirjaudu ulos</button>
                </>
            ) : (
                <>
                    <Link to="/login">[Kirjaudu]</Link>
                    <Link to="/register">[Rekisteröidy]</Link>
                </>
            )}
        </nav>
    );
}
  
  function App() {
      const { user } = useAuth();  // Haetaan käyttäjä AuthContextista
      return (
          <BrowserRouter>
            <Navbar />  {/* Ylhäällä aina */}
            <div>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/profile" 
                        element={user ? <DogProfile /> : <Navigate to="/login" />} 
                    />
                    <Route path="/dogs" element={<Dogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
