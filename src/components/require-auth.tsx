import React, { useEffect } from "react";
import { useUserContext } from "../context/user-context";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./loading-spinner";

interface Props {
  children: React.ReactNode;
}

function RequireAuth({ children }: Props) {
  const { isAuthenticated, initialized } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate("/signup");
    }
  }, [isAuthenticated, initialized, navigate]);

  if (!initialized) {
    return <LoadingSpinner fullPage />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }
  return null;
}

export default RequireAuth;
