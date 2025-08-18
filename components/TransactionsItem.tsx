import React from "react";
import { StyleSheet, Text, View } from "react-native";
interface MockTransactions {
  id: number;
  amount: number;
  date: string;
  type: string;
}
const TransactionsItem = (transactionsInfo: MockTransactions) => {
  return (
    <View style={styles.container}>
      <Text
        style={transactionsInfo.type === "deposit" ? styles.green : styles.red}
      >
        {transactionsInfo.type !== "deposit" ? "- " : "+ "}
        {transactionsInfo.amount}
      </Text>
      <Text>{transactionsInfo.date}</Text>
      <Text style={{ color: "#007bff" }}>{transactionsInfo.type}</Text>
    </View>
  );
};

export default TransactionsItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    textAlign: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000", // shadow color
    shadowOffset: { width: 0, height: 4 }, // first part of box-shadow
    shadowOpacity: 0.2, // alpha of first shadow
    shadowRadius: 8, // blur radius
    elevation: 6, // Android shadow
  },
  green: {
    color: "green",
  },
  red: {
    color: "red",
  },
});
