import { UserProfile } from "@/types/UserProfile";
import instance from ".";


{/*update user image */}
export const updateUserProfile = async (image: string, profile: UserProfile): Promise<UserProfile> => {
  const response = await instance.put(`/mini-project/api/auth/profile/${image}`, profile);
   return response.data;
};
{/*get user profile */}
export const getProfile = async () => {
  const { data } = await instance.get("/mini-project/api/auth/me");
  return data;
};
{/*get all users */}
export const getAllUsers = async () => {
  const { data } = await instance.get("/mini-project/api/auth/users");

  return data;
};
export const getUserId = async () => {
  const { data } = await instance.get("/mini-project/api/auth/user/<userId>");
  return data;
}
