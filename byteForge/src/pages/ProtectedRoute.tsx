import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/components/context/UserContext";

const ProtectedRoute = () => {
  const { user, isReady } = useUser();
  if (!isReady) return null;
  if (!user) return <Navigate to={"/auth"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
