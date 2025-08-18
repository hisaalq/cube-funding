// create a user profile page

import { getUserProfile } from "@/api/user";
import AuthContext from "@/context/AuthContext";
import { UserProfile } from "@/types/UserProfile";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";



export default function ClientProfile() {
  const { getToken } = useContext(AuthContext);
  const { data, isLoading, isError, error, } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn:  getUserProfile,
  });

  if (isLoading) {return (
  <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>);}
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
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        <Image source={{ uri: data.image }} style={styles.image} />
        <Text>Username: {data.username}</Text>
        <Text>Balance: {data.balance}</Text>

        {/* Add social login buttons or other options here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
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
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});
