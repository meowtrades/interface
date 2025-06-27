/** @format */

export const API_URL: string = import.meta.env.VITE_API_URL;
export const AUTH_URL = API_URL.split("/api")[0];
export const WS_URL: string =
  import.meta.env.VITE_WS_URL || AUTH_URL.replace("http", "ws") + "/ws";
