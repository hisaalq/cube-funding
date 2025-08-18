import { register } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
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
const RegisterScreen = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    image: "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: register,
    onSuccess: async (data) => {
      console.log("registered successfully", data),
        router.push("/(tabs)/current-user");
    },
    onError: (err) => {
      console.error("Register error:", err);
    },
  });

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ fixed
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0,
    });

    if (!res.canceled) {
      const pic: string = res.assets[0].uri;
      setUserInfo({ ...userInfo, image: pic });
    }

    console.log(res);
  };

  const handleRegister = async () => {
    mutate(userInfo);
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={require("../assets/images/cube-funding-logo-sm.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Register</Text>

            <TouchableOpacity onPress={pickImage}>
              <Image
                style={styles.addImage}
                source={require("../assets/images/add-image.png")}
              />
            </TouchableOpacity>
            {userInfo.image ? (
              <Image source={{ uri: userInfo.image }} style={styles.image} />
            ) : null}

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
              <Text>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/loginPage")}
              >
                <Text style={styles.forgotPassword}>Log in</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.loginButton, isPending && styles.disableButton]}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>
                {isPending ? "Regisetering..." : "Register"}
              </Text>
            </TouchableOpacity>
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
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  disableButton: {
    backgroundColor: "#98c6f8ff",
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
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  addImage: {
    width: 80,
    height: 90,
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#007bff",
    marginBottom: 20,
  },
});

export default RegisterScreen;
