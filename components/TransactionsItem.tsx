// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { UserTransaction } from "@/types/UserTransaction";

// //const TransactionsItem = (transactionsInfo: UserTransaction) => {
//  // return (
//     <View style={styles.container}>
//       <Text
//         style={transactionsInfo.amount > 0 ? styles.green : styles.red}
//       >
//         {transactionsInfo.amount > 0 ? "+ " : "- "}
//         {transactionsInfo.amount}
//       </Text>
//       <Text>{transactionsInfo.createdAt}</Text>
//       <Text style={{ color: "#007bff" }}>{transactionsInfo.transactionType}</Text>
//     </View>
//   );
// };

// export default TransactionsItem;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     padding: 20,
//     textAlign: "center",
//     justifyContent: "space-evenly",
//     borderRadius: 10,
//     margin: 10,
//     shadowColor: "#000", // shadow color
//     shadowOffset: { width: 0, height: 4 }, // first part of box-shadow
//     shadowOpacity: 0.2, // alpha of first shadow
//     shadowRadius: 8, // blur radius
//     elevation: 6, // Android shadow
//   },
//   green: {
//     color: "green",
//   },
//   red: {
//     color: "red",
//   },
// });

// import axios from "axios";
// import { getToken } from "./storage";

// export type Transaction = {
//   id: string;
//   type: "deposit" | "withdraw" | "transfer";
//   amount: number;
//   date: string;
// };

// export const getTransactions = async (): Promise<Transaction[]> => {
//   const token = await getToken();
//   const res = await axios.get("https://your-api.com/transactions", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };

// export const addTransaction = async (
//   transaction: Omit<Transaction, "id" | "date">
// ) => {
//   const token = await getToken();
//   const res = await axios.post(
//     "https://your-api.com/transactions",
//     transaction,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return res.data; // updated transaction list or new transaction
// };
