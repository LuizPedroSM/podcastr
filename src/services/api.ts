import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.URL_API || process.env.VERCEL_URL}/api/`
});
