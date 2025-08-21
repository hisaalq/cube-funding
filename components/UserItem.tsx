import { transferMoney } from "@/api/transactions";
import { UserCard } from "@/types/UserCard";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = UserCard & { myId: number };

const IMAGE_BASE_URL = "https://react-bank-project.eapi.joincoded.com";

const UserItem = ({ _id, username, balance, image, myId }: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleTransfer = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert("Invalid amount", "Enter a positive number");
      return;
    }
    if (myId === _id) {
      Alert.alert("Invalid transfer", "Cannot transfer to yourself");
      return;
    }
    if (num > balance) {
      Alert.alert("Insufficient funds", "Not enough balance");
      return;
    }

    try {
      setSubmitting(true);
      await transferMoney({ amount: num, receiverId: _id });
      Alert.alert(
        "Success",
        `Transferred ${num.toFixed(3)} KWD to ${username}`
      );
      setAmount("");
      setShowInput(false);
    } catch (e: any) {
      Alert.alert(
        "Failed",
        e?.response?.data?.message || e?.message || "Try again"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const imageSource =
    image?.startsWith("http") || image?.startsWith("https")
      ? { uri: image }
      : image
      ? { uri: `${IMAGE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}` }
      : require("@/assets/images/default.png");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.balance}>Balance: {balance.toFixed(3)} KWD</Text>

        {showInput ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Amount"
              value={amount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, "");
                setAmount(cleaned.replace(/(\..*)\./g, "$1"));
              }}
            />
            <Button
              title={submitting ? "Sending..." : "Send"}
              onPress={handleTransfer}
              disabled={
                submitting ||
                !amount ||
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > balance
              }
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => setShowInput(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {balance <= 0 ? "تصدق" : "Transfer"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default UserItem;

const styles = StyleSheet.create({
  background: { alignItems: "center", padding: 20 },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  username: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  balance: { fontSize: 18, color: "#007bff", marginBottom: 16 },
  transferButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: "#f9f9f9",
  },
});
