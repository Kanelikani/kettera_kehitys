import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav>
            {user ? (
                <>
                    <Link to="/dogs">Dogs</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                    <button type="button" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
