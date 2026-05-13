import { Navigate, useLocation } from "react-router-dom";
import { getTokens } from "../util/auth";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const tokens = getTokens();
  const location = useLocation();

  if (!tokens || !tokens.accessToken) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
