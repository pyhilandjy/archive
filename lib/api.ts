// lib/api.ts
import { fetcher } from "./fetcher";

export const login = async (email: string, password: string) => {
  return fetcher<{ token: string; user_id: string }>("/login", {
    method: "POST",
    body: { email, password },
  });
};
