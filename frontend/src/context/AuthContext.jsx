// src/context/AuthContext.jsx

// Globaali auth-tila: jakaa user/token/login/logout kaikkialle ilman proppeja

// AuthContext = "kanava", jolla auth-tiedot kulkevat (luotu createContext():lla)
// AuthProvider = "lähetin" joka lähettää user/token/funktiot KAIKILLE lapsille automaattisesti
// value={{ user, token, login, logout }} = TILA joka lähetetään
// {children} = Vastaanottajat (Appin sisällä olevat komponentit)

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";  

// Tyhjä auth-tilalle (user, token ...)
const AuthContext = createContext(null);

// AuthProvider: Lähettää auth-tilaa lapsille (main.jsx:ssä Appin ympärillä)
export function AuthProvider({ children }) {  // children = App + kaikki lomakkeet

    const [user, setUser] = useState(null);     
    const [token, setToken] = useState(null);   // JWT-token

    // Kun sivu ladataan, tarkista localStorage (kirjautuminen säilyy)
    useEffect(() => {
        const savedToken = localStorage.getItem("token");   // Selaimesta
        const savedUser = localStorage.getItem("user");  
         
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Login, tallenna uudet user/token localstorageen ja react-tilaan
    function login(userData, jwtToken) {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);           // Selaimeen
        localStorage.setItem("user", JSON.stringify(userData));
    }

    // Logout, tyhjennä kaikki
    function logout() {
        setUser(null);     
        setToken(null);
        localStorage.removeItem("token"); 
        localStorage.removeItem("user");
    }

    // Jaa tila lapsikomponenteille: Login, Register, Navbar...
    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}  {/* App, Login, Register... */}
        </AuthContext.Provider>
    );
}

// Kuuntele auth-tilaa missä tahansa komponentissa
// useAuth() on silta Providerin ja komponenttien välillä
export function useAuth() {
    const context = useContext(AuthContext);  // Hakee lähimmän Providerin tilan
    // Jos ei ole AuthProvideria main.jsx:ssä
    if (!context) throw new Error("useAuth pitää käyttää AuthProviderin sisällä!");
    return context;  // Palauttaa { user, token, login, logout }
}
