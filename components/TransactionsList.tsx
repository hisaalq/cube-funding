import { getAllTransactions } from "@/api/transactions";
import mockTransactions from "@/data/transactions";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
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

  console.log(data);

  if (isLoading) return <ActivityIndicator />;
  return (
    <ScrollView style={{ backgroundColor: "beige" }}>
      {mockTransactions.map((item: MockTransactions) => (
        <View key={item.id}>
          <TransactionsItem
            amount={item.amount}
            date={item.date}
            type={item.type}
            id={item.id}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default TransactionsList;

const styles = StyleSheet.create({});
