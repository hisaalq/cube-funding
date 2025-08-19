import { login } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import React, { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LoginScreen = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const { setIsAuthenticated } = useContext(AuthContext);
  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: async (data) => {
      setIsAuthenticated(true), console.log("logged in successfully", data);
      router.push("/(protected)/(tabs)/current-user");
    },
    onError: (err) => {
      console.error("Login error:", err);
    },
  });

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={require("../assets/images/cube-funding-logo-sm.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome Back!</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              autoCapitalize="none"
              value={userInfo.username}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, username: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              keyboardType="visible-password"
              secureTextEntry
              value={userInfo.password}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, password: text })
              }
            />
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/registerPage")}
              >
                <Text style={styles.forgotPassword}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => mutate(userInfo)}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Add social login buttons or other options here */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "beige",
  },
  container: {
    width: 300,
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
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
