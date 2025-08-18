import { getAllTransactions } from "@/api/transactions";
import mockTransactions from "@/data/transactions";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TransactionsItem from "./TransactionsItem";
interface MockTransactions {
  id: number;
  amount: number;
  date: string;
  type: string;
}
const TransactionsList = () => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["getAllTransactions"],
    queryFn: getAllTransactions,
  });

  const [list, setList] = useState(mockTransactions);
  const deposits = mockTransactions.filter((item) => item.type === "deposit");
  const withdraws = mockTransactions.filter((item) => item.type === "withdraw");
  const transfers = mockTransactions.filter((item) => item.type === "transfer");
  if (isLoading) return <ActivityIndicator />;
  const transactions = list.map((item: MockTransactions) => (
    <View key={item.id}>
      <TransactionsItem
        amount={item.amount}
        date={item.date}
        type={item.type}
        id={item.id}
      />
    </View>
  ));
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "beige",
      }}
    >
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setList(mockTransactions);
          }}
        >
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setList(deposits);
          }}
        >
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setList(withdraws);
          }}
        >
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setList(transfers);
          }}
        >
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>{transactions}</ScrollView>
    </View>
  );
};

export default TransactionsList;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "beige",
    paddingTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: 80,
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000", // shadow color
    shadowOffset: { width: 0, height: 4 }, // first part of box-shadow
    shadowOpacity: 0.2, // alpha of first shadow
    shadowRadius: 8, // blur radius
    elevation: 6, // Android shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
