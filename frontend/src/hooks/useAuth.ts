import { useEffect, useState } from "react";
import type { ClientPrincipal } from "../types/auth";

// Fetch authenticated user from Azure Static Web Apps built-in auth endpoint
// This endpoint injects identity info when user is logged in
// clientPrincipal contains Entra ID user metadata

export function useAuth() {
  // User is optional (null if not logged in)
  const [user, setUser] = useState<ClientPrincipal | null>(null);

   useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.clientPrincipal);
      });
  }, []);

  return user;
}