import instance from ".";
import { storeToken } from "./storage";
interface UserInfo {
  username: string;
  password: string;
}

const login = async (userInfo: UserInfo) => {
  const { data } = await instance.post(
    "/mini-project/api/auth/login",
    userInfo
  );
  await storeToken(data.token);

  return data;
};

const register = async (userInfo: FormData) => {
  const { data } = await instance.post(
    "/mini-project/api/auth/register",
    userInfo
  );
  await storeToken(data.token);
  return data;
};

export { login, register };
