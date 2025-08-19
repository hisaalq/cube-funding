// create a user profile page

import { getUserProfile } from "@/api/users";
import AuthContext from "@/context/AuthContext";
import { UserProfile } from "@/types/UserProfile";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function ClientProfile() {
  const { getToken } = useContext(AuthContext);
  const { data, isLoading, isError, error } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

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
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/cube-funding-logo-sm.png")}
          style={styles.logo}
        />
        <Image source={{ uri: data.image }} style={styles.image} />
        <Text style={styles.username}>Username: {data.username}</Text>
        <Text style={styles.balance}>Balance: {data.balance}</Text>
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
  },
  container: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000", // shadow color
    shadowOffset: { width: 0, height: 4 }, // first part of box-shadow
    shadowOpacity: 0.2, // alpha of first shadow
    shadowRadius: 8, // blur radius
    elevation: 6, // Android shadow
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
    color: "#007bff", // nice blue
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
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});
