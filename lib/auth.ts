import { AUTH_URL } from "@/configs/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: AUTH_URL, // the base url of your auth server
});
