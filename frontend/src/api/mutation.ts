import { API } from "./client";

interface Auth {
  name: string;
  email: string;
  password: string;
}

export const REGISTER_USER = async ({ name, email, password }: Auth) => {
  return (
    await API.post("/api/v1/auth/register", {
      name,
      email,
      password,
    })
  ).data;
};
