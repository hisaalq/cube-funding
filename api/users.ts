import instance from ".";
import { getToken } from "./storage";

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await instance.get(`/mini-project/api/auth/me`);
  return response.data;
};
{/*get all users */}
const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");

  return data;
};
{/*update balance */}
export const updateBalance = async (amount: number) => {
  const token = await getToken();
  const res = await instance.post(
    "/mini-project/api/auth/me",
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // return updated user info
};

{/*update user image */}
//export const updateUserProfile = async (UserId: string, profile: UserProfile): Promise<UserProfile> => {
//    const response = await instance.put(`/users/${UserId}`, profile);
//    return response.data;
//};
export { getAllUsers };
