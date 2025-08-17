import { register } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
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
    const [userInfo, setUserInfo] = useState({ username: "", password: "", image: "" });

    const { mutate } = useMutation({
      mutationKey: ["register"],
      mutationFn: register,
      onSuccess: async (data) => console.log("registered successfully", data),
      onError: (err) => {
        console.error("Register error:", err);
      },
    });
    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!res.canceled) {
          const pic: string = res.assets[0].uri;
          setUserInfo({ ...userInfo, image: pic });
        }
    
        console.log(res);
      };
    const handleRegister = async () => {
        const formData = new FormData();
        formData.append("username", userInfo.username);
        formData.append("password", userInfo.password);
        formData.append("image", userInfo.image);
        
        mutate(formData);
      };
    return (

      <View style={styles.background}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}></TouchableWithoutFeedback>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/cube-funding-logo-sm.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Register</Text>

          <TouchableOpacity onPress={pickImage}>
            <Text>Pick Image</Text>
          </TouchableOpacity>
          <Image source={{ uri: userInfo.image }} style={styles.image} />

          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            value={userInfo.username}
            onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
          />
  
          <TextInput
            style={styles.input}
            placeholder="Password"
            keyboardType="visible-password"
            secureTextEntry
            value={userInfo.password}
            onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
          />
  
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
  
          {/* Add social login buttons or other options here */}
        </View>
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
  });

export default RegisterScreen;