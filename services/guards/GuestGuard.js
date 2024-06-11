import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import RouterLinks from "../../enums/RouterLinks";

export default function GuestGuard({ children }) {
  const { isInitialized, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    router.push(RouterLinks.HOME);
    return null;
  }

  return <>{children}</>;
}
