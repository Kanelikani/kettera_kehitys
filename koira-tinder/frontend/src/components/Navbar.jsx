import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dogs">Dogs</Link>
      <Link to="/profile">Create Dog</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
