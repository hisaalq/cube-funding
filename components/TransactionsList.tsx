import { getAllTransactions } from "@/api/transactions";
import { UserTransaction } from "@/types/UserTransaction";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TransactionsList = () => {
  const { data, isLoading } = useQuery<UserTransaction[]>({
    queryKey: ["getAllTransactions"],
    queryFn: () => getAllTransactions().then((res) => res.data),
  });
  const [list, setList] = useState<UserTransaction[]>([]);
  const [search, setSearch] = useState("");

  // sync local list with server data
  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (data) {
      setList(
        data.filter((item) => item.amount.toString().includes(text.trim()))
      );
    }
  };

  const handleFilter = (type: string) => {
    if (!data) return;

    if (type === "all") {
      setList(data);
    } else {
      setList(
        data.filter(
          (item) => item.type && item.type.toLowerCase() === type.toLowerCase()
        )
      );
    }
  };

  if (isLoading) return <ActivityIndicator style={{ marginTop: 30 }} />;

  return (
    <View style={styles.container}>
      {/*Search*/}
      <TextInput
        style={styles.searchBar}
        placeholder="Search amount"
        keyboardType="numeric"
        value={search}
        onChangeText={(text) => handleSearch(text)}
      />
      {/*Filter*/}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFilter("all")}
        >
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFilter("deposit")}
        >
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFilter("withdraw")}
        >
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFilter("transfer")}
        >
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
      </View>
      {/*Transactions*/}
      <ScrollView>
        {list.map((item) => (
          <View key={item._id} style={styles.transactionsContainer}>
            <Text style={item.type === "deposit" ? styles.green : styles.red}>
              {item.type === "deposit"
                ? `⬇️           ${item.amount}`
                : item.type === "withdraw"
                ? `⬆️           ${item.amount}`
                : `🔁           ${item.amount}`}
            </Text>
            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={{ color: "#007bff" }}>{item.type}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TransactionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige",
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
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
  transactionsContainer: {
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
