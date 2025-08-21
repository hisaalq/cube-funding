import { getProfile, updateUserProfile } from "@/api/user";
import { UserProfile } from "@/types/UserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ClientProfile() {
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = React.useState({
    username: "",
    password: "",
    image: "", // local URI from picker
  });

  // Ask for gallery permission once (Android needs this)
  React.useEffect(() => {
    (async () => {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (e) {
        console.warn("Permission request failed:", e);
      }
    })();
  }, []);

  const { data, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (image: string) => updateUserProfile(image),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setUserInfo(prev => ({ ...prev, image: "" }));
    },
    onError: (err) => {
      console.error("upload error:", err);
    },
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!res.canceled) {
      setUserInfo((prev) => ({ ...prev, image: res.assets[0].uri })); // "file://..." URI
    }
  };

  const handleUpdateProfile = () => {
    if (userInfo.image) mutate(userInfo.image);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: {(error as Error)?.message ?? "Something went wrong"}
        </Text>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={styles.container}>
        <Text>No user profile found.</Text>
      </View>
    );
  }

  const imageUri = userInfo.image || data.image;

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/cube-funding-logo-sm.png")}
          style={styles.logo}
        />

        {/* Correct conditional render (ternary), BOTH options included */}
        {imageUri ? (
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <Image
              key={imageUri}         // ensure refresh if URI changes
              source={{ uri: imageUri }}
              style={styles.image}
            />
          </TouchableOpacity>
        ) : (
          // Show placeholder button until an image is chosen
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <Image
              style={styles.image}
              source={require("../assets/images/add-image.png")}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.username}>Username: {data.username}</Text>
        <Text style={styles.balance}>Balance: {data.balance} KWD</Text>

        <Button
          title={isPending ? "Update..." : "Update Profile"}
          onPress={handleUpdateProfile}
          disabled={isPending || !userInfo.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "beige",
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
    resizeMode: "contain",
  },
  container: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  balance: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007bff",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  forgotPassword: {
    color: "#007bff",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    borderRadius: 100,
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginBottom: 20,
    backgroundColor: "#eee",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});
