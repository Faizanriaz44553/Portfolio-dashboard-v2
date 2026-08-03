import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Customloader from "./UI/Customloader";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Customloader />;
  }

  if (user) {
    return <Navigate to="/add-projects" replace />;
  }

  return children;
};

export default GuestRoute;