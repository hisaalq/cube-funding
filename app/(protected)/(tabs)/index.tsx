import { depositMoney, withdrawMoney } from "@/api/transactions";
import { getProfile } from "@/api/user";
import { UserProfile } from "@/types/UserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getProfile,
  });
  const [userBalance, setUserBalance] = useState<number>(
    userInfo?.balance || 0
  );

  useEffect(() => {
    if (userInfo?.balance !== undefined) {
      setUserBalance(userInfo.balance);
    }
  }, [userInfo]);

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  const balanceMutation = useMutation({
    mutationFn: depositMoney,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["userInfo"], updatedUser);
    },
  });

  const balanceMutation2 = useMutation({
    mutationFn: withdrawMoney,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["userInfo"], updatedUser);
    },
  });

  const handleConfirmDeposit = () => {
    const amount = parseFloat(depositAmount.toString());
    if (!isNaN(amount) && amount > 0) {
      balanceMutation.mutate(amount);
    }
    setDepositAmount(0);
    setIsDepositModalVisible(false);
  };

  const handleConfirmWithdraw = () => {
    const amount = parseFloat(withdrawAmount.toString());
    if (!isNaN(amount) && amount > 0) {
      balanceMutation2.mutate(amount);
    }
    setWithdrawAmount(0);
    setIsWithdrawModalVisible(false);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back, {userInfo?.username}!</Text>
        <Text style={styles.subtitle}>
          Your current balance is {userBalance}
        </Text>

        {isDepositModalVisible ? (
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount to deposit"
              keyboardType="numeric"
              value={depositAmount.toString()}
              onChangeText={(text) => setDepositAmount(Number(text))}
            />
            <Button onPress={handleConfirmDeposit} title="Send" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.depositButton}
            onPress={() => setIsDepositModalVisible(true)}
          >
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
        )}

        {isWithdrawModalVisible ? (
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount to withdraw"
              keyboardType="numeric"
              value={withdrawAmount.toString()}
              onChangeText={(text) => setWithdrawAmount(Number(text))}
            />
            <Button onPress={handleConfirmWithdraw} title="Send" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setIsWithdrawModalVisible(true)}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.viewTransactionsButton}
          onPress={() => router.push("/(protected)/(tabs)/transactions")}
        >
          <Text style={styles.buttonText}>View Transactions</Text>
        </TouchableOpacity>
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
