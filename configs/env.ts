/** @format */

export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const AUTH_URL = API_URL.split("/api")[0];
export const WS_URL: string =
  process.env.NEXT_PUBLIC_WS_URL || AUTH_URL.replace("http", "ws") + "/ws";
