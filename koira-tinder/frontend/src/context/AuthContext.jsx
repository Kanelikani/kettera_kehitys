// src/context/AuthContext.jsx

// Globaali auth-tila: jakaa user/token/login/logout kaikkialle ilman proppeja
// AuthContext = "kanava", jolla auth-tiedot kulkevat (luotu createContext():lla)
// AuthProvider = "lähetin" joka lähettää user/token/funktiot KAIKILLE lapsille automaattisesti
// value={{ user, token, login, logout, updateUser }} = TILA joka lähetetään
// {children} = Vastaanottajat (Appin sisällä olevat komponentit)

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

// Tyhjä auth-tilalle (user, token ...)
const AuthContext = createContext(null);

// AuthProvider: Lähettää auth-tilaa lapsille (main.jsx:ssä Appin ympärillä)
export function AuthProvider({ children }) {
    // Luetaan localStorage heti initial renderissä (vain kerran).
    // Näin ProtectedRoute näkee user/token arvot heti refreshin jälkeen.
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Login: käytä tätä vain kirjautumisessa (kun saat tokenin backendiltä).
    // TÄRKEÄ: älä kutsu login(user) ilman tokenia, muuten token voisi tyhjentyä.
    function login(userData, jwtToken) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Suojaus: älä ylikirjoita tokenia, jos jwtToken puuttuu
        if (jwtToken) {
            setToken(jwtToken);
            localStorage.setItem("token", jwtToken);
        }
    }

    // updateUser: päivitä pelkkä user (esim. email/dogName/visibility muuttuu)
    // Token pysyy samana.
    function updateUser(userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    // Logout: tyhjennä kaikki
    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    // Jaa tila lapsikomponenteille: Login, Register, Navbar...
    return (
        <AuthContext.Provider value={{ user, token, login, updateUser, logout }}>
            {children} {/* App, Login, Register... */}
        </AuthContext.Provider>
    );
}

// Kuuntele auth-tilaa missä tahansa komponentissa
// useAuth() on silta Providerin ja komponenttien välillä
export function useAuth() {
    const context = useContext(AuthContext); // Hakee lähimmän Providerin tilan
    // Jos ei ole AuthProvideria main.jsx:ssä
    if (!context) throw new Error("useAuth pitää käyttää AuthProviderin sisällä!");
    return context; // Palauttaa { user, token, login, updateUser, logout }
}
