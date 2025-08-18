import { UserProfile } from "@/types/UserProfile";
import instance from "./index";

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await instance.get(`/mini-project/api/auth/me`);
    return response.data;
};

//export const updateUserProfile = async (UserId: string, profile: UserProfile): Promise<UserProfile> => {
//    const response = await instance.put(`/users/${UserId}`, profile);
//    return response.data;
//};