import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface AllUsers {
  username: string;
  balance: number;
  //   image: string;
  _id: string;
}
const UserItem = (UserInfo: AllUsers) => {
  const [showTextInput, setShowTextInput] = useState(false);

  const handleTransfer = () => {};
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* <Image source={{ uri: UserInfo.image }} style={styles.image} /> */}
        <Text style={styles.username}>{UserInfo.username}</Text>
        <Text style={styles.balance}>Balance: {UserInfo.balance}</Text>

        {showTextInput ? (
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "gray",
              padding: 5,
              borderRadius: 10,
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <TextInput
              onChangeText={(amount) => {
                UserInfo.balance + amount;
              }}
              placeholder="Insert amount"
            />
            <Button onPress={() => setShowTextInput(false)} title="Send" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setShowTextInput(true);
            }}
            style={styles.loginButton}
          >
            <Text style={styles.buttonText}>
              {UserInfo.balance < 0 ? "تصدق" : "Transfer"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    padding: 15,
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
    textAlign: "center",
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
