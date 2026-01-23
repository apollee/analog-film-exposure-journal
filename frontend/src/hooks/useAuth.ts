import { useEffect, useState } from "react";
import type { ClientPrincipal } from "../types/auth";

export function useAuth() {
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