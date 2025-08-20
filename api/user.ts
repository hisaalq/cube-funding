import { UserProfile } from "@/types/UserProfile";
import instance from ".";
import { getToken } from "./storage";

export interface ApiUser {
  _id: number;
  username: string;
  image?: string | null;
  balance: number;
  email?: string | null;
}
{
  /*update user image */
}
export const updateUserProfile = async (
  image: string,
  profile: UserProfile
): Promise<UserProfile> => {
  const response = await instance.put(
    `/mini-project/api/auth/profile/${image}`,
    profile
  );
  return response.data;
};
{
  /*get user profile */
}
export const getProfile = async () => {
  const { data } = await instance.get("/mini-project/api/auth/me");
  return data;
};
{
  /*get all users */
}
export const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");

  return data;
};
export const getUserId = async (): Promise<number> => {
  const token = await getToken();
  const { data } = await instance.get<ApiUser>("/mini-project/api/auth/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!data || typeof data._id !== "number") {
    throw new Error("User ID missing or invalid in /auth/user response");
  }
  return data._id; // number
};