import { UserProfile } from "@/types/UserProfile";
import { Platform } from "react-native";
import instance from ".";
import { getToken } from "./storage";


export interface ApiUser {
  _id: number;
  username: string;
  image?: string | null;
  balance: number;
  email?: string | null;
}
/** Helpers */
function filenameFromUri(uri: string) {
  const last = uri.split("/").pop() || `photo_${Date.now()}.jpg`;
  return /\.(jpg|jpeg|png|webp|heic)$/i.test(last) ? last : `${last}.jpg`;
}
function mimeFromFilename(name: string) {
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.webp$/i.test(name)) return "image/webp";
  if (/\.heic$/i.test(name)) return "image/heic";
  return "image/jpeg";
}
{ /*get user profile */
}
export const getProfile = async () => {
  const { data } = await instance.get("/mini-project/api/auth/me");
  return data;
};
{
  /*update user image */
}
export async function updateUserProfile(imageUri: string): Promise<UserProfile> {
  if (!imageUri) throw new Error("No image URI provided");

  const name = filenameFromUri(imageUri);
  const type = mimeFromFilename(name);

  const form = new FormData();
  form.append(
    "image",
    {
      // @ts-ignore RN FormData file object
      uri: Platform.OS === "ios" || Platform.OS === "android" ? imageUri : imageUri,
      name,
      type,
    } as any
  );
  const { data } = await instance.put<UserProfile>(
    "/mini-project/api/auth/profile",
    form
  );
  return data;
}

 
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