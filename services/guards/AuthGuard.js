import React, { useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import RouterLinks from "../../enums/RouterLinks";

export function AuthGuard({ children }) {
  const { isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push(RouterLinks.LOGIN);
    return null;
  }

  return children;
}
