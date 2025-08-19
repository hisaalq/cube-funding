import { getUserProfile, updateBalance } from "@/api/users";
import { addTransaction } from "@/components/TransactionsItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Home = () => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: getUserProfile,

  });
  const [userBalance, setUserBalance] = useState(userInfo?.balance);

  useEffect(() => {
    if (userInfo?.balance) {
      setUserBalance(userInfo.balance);
    }
  }, [userInfo]);

  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const balanceMutation = useMutation({
    mutationFn: (amount: number) => updateBalance(amount),
    onSuccess: (data) => {
      queryClient.setQueryData(["userInfo"], data);
    },
  });
  const transactionMutation = useMutation({
    mutationFn: (transaction: { type: "deposit" | "withdraw"; amount: number }) => 
      addTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);;
    },
  });

const handleConfirmDeposit = () => {
  const amount = parseFloat(depositAmount);
  if (!isNaN(amount) && amount > 0) {
    balanceMutation.mutate(amount); // positive for deposit
    transactionMutation.mutate({ type: "deposit", amount });
  }
  setDepositAmount("");
  setIsDepositModalVisible(false);
};

const handleConfirmWithdraw = () => {
  const amount = parseFloat(withdrawAmount);
  if (!isNaN(amount) && amount > 0) {
    balanceMutation.mutate(-amount); // negative for withdraw
    transactionMutation.mutate({ type: "withdraw", amount });
  }
  setWithdrawAmount("");
  setIsWithdrawModalVisible(false);
};

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back, {userInfo?.username}!</Text>
        <Text style={styles.subtitle}>Your current balance is {userInfo?.balance}</Text>
        {/* deposit button */}
        <TouchableOpacity 
        style={styles.depositButton} 
        onPress={() => setIsDepositModalVisible(true)}>
          <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
          {isDepositModalVisible && (
            <View style={styles.modalContainer}>
              <TextInput 
              style={styles.input} 
              placeholder="Enter amount to deposit"
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
              />
              <TouchableOpacity 
              style={styles.depositButton} 
              onPress={handleConfirmDeposit}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* withdraw Button */}
        <TouchableOpacity 
        style={styles.withdrawButton} 
        onPress={() => setIsWithdrawModalVisible(true)}>
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        {isWithdrawModalVisible && (
          <View style={styles.modalContainer}>
            <TextInput 
            style={styles.input} 
            placeholder="Enter amount to withdraw"
            keyboardType="numeric"
            value={withdrawAmount}
            onChangeText={setWithdrawAmount}
            />
            <TouchableOpacity 
            style={styles.withdrawButton} 
            onPress={handleConfirmWithdraw}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}  
        {/* view transactions button */}
        <TouchableOpacity 
        style={styles.viewTransactionsButton} 
        onPress={() => router.push("/(tabs)/transactions")}>
          <Text style={styles.buttonText}>View Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.transferButton} 
        onPress={() => router.push("/(tabs)/users")}>
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
    shadowColor: "#000", // shadow color
    shadowOffset: { width: 0, height: 4 }, // first part of box-shadow
    shadowOpacity: 0.2, // alpha of first shadow
    shadowRadius: 8, // blur radius
    elevation: 6, // Android shadow
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
    width: "100%",
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
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
    color: "#00244c",
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
