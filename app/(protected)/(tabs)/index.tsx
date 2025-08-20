import { depositMoney, withdrawMoney } from "@/api/transactions";
import { getProfile } from "@/api/user";
import { UserProfile } from "@/types/UserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Txn = { type: "deposit" | "withdraw"; amount: number };

const Home = () => {
  const queryClient = useQueryClient();

  const { data: userInfo, isLoading } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getProfile,
  });

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // Single mutation + optimistic update for instant UI changes
  const txnMutation = useMutation({
    mutationFn: async ({ type, amount }: Txn) => {
      if (type === "deposit") {
        return await depositMoney(amount);
      }
      return await withdrawMoney(amount);
    },
    onMutate: async ({ type, amount }) => {
      // Cancel any outgoing refetches for userInfo
      await queryClient.cancelQueries({ queryKey: ["userInfo"] });

      // Snapshot previous value
      const prev = queryClient.getQueryData<UserProfile>(["userInfo"]);

      // Optimistically update to the new value
      if (prev) {
        const nextBalance =
          type === "deposit" ? prev.balance + amount : prev.balance - amount;
        queryClient.setQueryData<UserProfile>(["userInfo"], {
          ...prev,
          balance: nextBalance,
        });
      }

      // Context for rollback
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Rollback on error
      if (ctx?.prev) {
        queryClient.setQueryData(["userInfo"], ctx.prev);
      }
    },
    onSettled: () => {
      // Ensure server truth wins after mutation finishes
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });

  const handleConfirmDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      txnMutation.mutate({ type: "deposit", amount });
    }
    setDepositAmount("");
    setIsDepositModalVisible(false);
  };

  const handleConfirmWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!isNaN(amount) && amount > 0) {
      txnMutation.mutate({ type: "withdraw", amount });
    }
    setWithdrawAmount("");
    setIsWithdrawModalVisible(false);
  };

  const balance = userInfo?.balance ?? 0;

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isLoading
            ? "Loading..."
            : `Welcome Back, ${userInfo?.username || ""}!`}
        </Text>

        <Text style={styles.subtitle}>Your current balance is {balance}</Text>

        {/* Deposit */}
        {isDepositModalVisible ? (
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount to deposit"
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
            />
            <Button
              onPress={handleConfirmDeposit}
              title={txnMutation.isPending ? "Sending..." : "Send"}
              disabled={txnMutation.isPending}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.depositButton,
              txnMutation.isPending && styles.disableButton,
            ]}
            disabled={txnMutation.isPending}
            onPress={() => setIsDepositModalVisible(true)}
          >
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
        )}

        {/* Withdraw */}
        {isWithdrawModalVisible ? (
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount to withdraw"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
            <Button
              onPress={handleConfirmWithdraw}
              title={txnMutation.isPending ? "Sending..." : "Send"}
              disabled={txnMutation.isPending}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.withdrawButton,
              txnMutation.isPending && styles.disableButton,
            ]}
            disabled={txnMutation.isPending}
            onPress={() => setIsWithdrawModalVisible(true)}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        )}

        {/* View transactions */}
        <TouchableOpacity
          style={styles.viewTransactionsButton}
          onPress={() => router.push("/(protected)/(tabs)/transactions")}
        >
          <Text style={styles.buttonText}>View Transactions</Text>
        </TouchableOpacity>

        {/* Transfer */}
        <TouchableOpacity
          style={styles.transferButton}
          onPress={() => router.push("/(protected)/(tabs)/users")}
        >
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "GothicA1-Regular",
    textAlign: "center",
    marginBottom: 30,
    color: "#00244c",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  depositButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#019ee7",
    borderColor: "#00244c",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  withdrawButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#0fa639",
    borderColor: "#00244c",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  viewTransactionsButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fa7317",
    borderColor: "#00244c",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  transferButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fed810",
    borderColor: "#00244c",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  disableButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
    color: "#00244c",
  },
});
