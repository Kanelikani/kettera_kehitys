import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  // replace estää sen, että käyttäjä voi “Back”-napilla palata suojatulle sivulle redirectin jälkeen.
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
