import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ReactNode, useContext } from "react";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    return <div>Carregando</div>;
  }
  if (!signed) {
    return <Navigate to="/login" />;
  }

  return children;
}
