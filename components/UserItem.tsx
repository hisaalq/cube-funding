import { transferMoney } from "@/api/transactions";
import { getUserId } from "@/api/user";
import { UserCard } from "@/types/UserCard";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = UserCard; // expecting: { id, username, image?, balance }

const UserItem = (user: Props) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = await getUserId();
        setMyUserId(id ?? null);
      } catch (e) {
        console.warn("Failed to fetch current user id", e);
      }
    })();
  }, []);

  const imageSource = (() => {
    const img = user.image ?? "";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return { uri: img };
    }
    if (img.length > 0) {
      // relative path → prepend API base
      const withSlash = img.startsWith("/") ? img : `/${img}`;
      return { uri: `${BASE_URL}${withSlash}` };
    }
    return require("@/assets/images/default.png");
  })();

  const formattedBalance = `${Number(user.balance ?? 0).toFixed(3)} KWD`;

  const handleTransfer = async () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive number.");
      return;
    }
    if (!myUserId) {
      Alert.alert("Not authenticated", "Unable to determine your user id.");
      return;
    }
    if (!user.id || user.id === myUserId) {
      Alert.alert("Invalid recipient", "You cannot transfer to this user.");
      return;
    }
    try {
      setSubmitting(true);

      // Adjust this call to match your actual API:
      // If your signature is transferMoney({ amount, receiverId })
      await transferMoney({ amount, receiverId: user.id });

      // If your signature is transferMoney(amount, receiverId):
      // await transferMoney(amount, user.id);
      Alert.alert(
        "Success",
        `Transferred ${amount.toFixed(3)} KWD to ${user.username}.`
      );
      setAmountStr("");
      setShowTextInput(false);
    } catch (e: any) {
      console.warn("transferMoney failed", e);
      Alert.alert("Transfer failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        {showTextInput ? (
         <View style={styles.transferRow}>
         <TextInput
           style={styles.amountInput}
           value={amountStr}
           onChangeText={setAmountStr}
           placeholder="Insert amount"
           keyboardType="decimal-pad"
           inputMode="decimal"
         />
         <Button
              title={submitting ? "Sending..." : "Send"}
              onPress={handleTransfer}
              disabled={submitting}
            />
          </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowTextInput(true)}
              style={styles.transferButton}
            >
              <Text style={styles.buttonText}>
                {Number(user.balance) < 0 ? "تصدق" : "Transfer"}
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
