import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const register = async (uid, email) => {
  const response = await $host.post("api/user/registration", { uid, email });
  return response;
};

export const login = async (uid, email) => {
  const { data } = await $host.post("api/user/login", { uid, email });
  localStorage.setItem("user-token", data);
  return jwt_decode(data);
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("user-token", data);
  return jwt_decode(data);
};
