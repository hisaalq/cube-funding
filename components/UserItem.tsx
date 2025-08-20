import { transferMoney } from "@/api/transactions";
import { getUserId } from "@/api/user";
import { UserCard } from "@/types/UserCard";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = UserCard; // {_id: number; username: string; image?: string; balance: number}

const IMAGE_BASE_URL = "https://react-bank-project.eapi.joincoded.com";

const UserItem = (user: Props) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [amountStr, setAmountStr] = useState("");
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const id = await getUserId(); // number
        setMyUserId(id);
      } catch (e) {
        console.warn("Failed to fetch current user id", e);
        setMyUserId(null);
      } finally {
        setLoadingId(false);
      }
    })();
  }, []);

  const imageSource = (() => {
    const img = user.image ?? "";
    if (img.startsWith("http://") || img.startsWith("https://")) return { uri: img };
    if (img.length > 0) {
      const withSlash = img.startsWith("/") ? img : `/${img}`;
      return { uri: `${IMAGE_BASE_URL}${withSlash}` };
    }
    return require("@/assets/images/default.png");
  })();

  const formattedBalance = `${Number(user.balance ?? 0).toFixed(3)} KWD`;
  const recipientId = user._id; // numeric, per your interface

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
    if (!recipientId || recipientId === myUserId) {
      Alert.alert("Invalid recipient", "You cannot transfer to this user.");
      return;
    }

    try {
      setSubmitting(true);

      await transferMoney({ amount, receiverId: recipientId });

      Alert.alert("Success", `Transferred ${amount.toFixed(3)} KWD to ${user.username}.`);
      setAmountStr("");
      setShowTextInput(false);
    } catch (e: any) {
      console.warn("transferMoney failed", e);
      Alert.alert("Transfer failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendDisabled = submitting || loadingId || !recipientId || !myUserId;

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />

        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.balance}>Balance: {formattedBalance}</Text>

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
              title={loadingId ? "Loading..." : submitting ? "Sending..." : "Send"}
              onPress={handleTransfer}
              disabled={sendDisabled}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowTextInput(true)}
            style={styles.transferButton}
            disabled={loadingId}
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
  background: { flex: 1, justifyContent: "center", alignItems: "center", padding: 15 },
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
  image: { borderRadius: 100, width: 100, height: 100, resizeMode: "cover", marginBottom: 12 },
  username: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 6, textAlign: "center" },
  balance: { fontSize: 18, fontWeight: "600", color: "#007bff", marginBottom: 16, textAlign: "center" },
  transferRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#00244c",
    padding: 6,
    borderRadius: 10,
    width: "100%",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  amountInput: {
    flex: 1,
    height: 44,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  transferButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
