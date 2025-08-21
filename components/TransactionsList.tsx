import { getAllTransactions } from "@/api/transactions";
import { UserTransaction } from "@/types/UserTransaction";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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

  // --- UI state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "deposit" | "withdraw" | "transfer"
  >("all");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // --- helpers
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  const fmt = (d: Date | null) => (d ? d.toLocaleDateString() : "—");

  // --- combined filtering (amount search + type + date range)
  const filteredList = useMemo(() => {
    if (!data) return [];

    const q = search.trim().toLowerCase();

    return data.filter((item) => {
      // Search by amount (string compare for simplicity)
      const matchesSearch =
        q.length === 0 || item.amount.toString().toLowerCase().includes(q);
      if (!matchesSearch) return false;

      // Type filter (backend field assumed "type")
      if (typeFilter !== "all" && item.type?.toLowerCase() !== typeFilter)
        return false;

      // Date filter (inclusive)
      if (startDate || endDate) {
        const dt = new Date(item.createdAt);
        if (startDate && dt < startOfDay(startDate)) return false;
        if (endDate && dt > endOfDay(endDate)) return false;
      }

      return true;
    });
  }, [data, search, typeFilter, startDate, endDate]);

  if (isLoading) return <ActivityIndicator style={{ marginTop: 30 }} />;

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search amount"
        keyboardType="numeric"
        value={search}
        onChangeText={setSearch}
      />

      {/* Filters */}
      <View style={styles.filterContainer}>
        {(["all", "deposit", "withdraw", "transfer"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.button, typeFilter === type && styles.activeButton]}
            onPress={() => setTypeFilter(type)}
          >
            <Text style={styles.buttonText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Pickers */}
      <View style={styles.datePickerContainer}>
        <View style={styles.dateSummaryRow}>
          <View style={styles.dateColumn}>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateSummaryText}>From: {fmt(startDate)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                maximumDate={endDate ?? undefined}
                onChange={(event, date) => {
                  if (event.type === "set" && date) setStartDate(date);
                  setShowStartPicker(false);
                }}
              />
            )}
          </View>

          <View style={styles.dateColumn}>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateSummaryText}>To: {fmt(endDate)}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                minimumDate={startDate ?? undefined}
                onChange={(event, date) => {
                  if (event.type === "set" && date) setEndDate(date);
                  setShowEndPicker(false);
                }}
              />
            )}
          </View>

          {(startDate || endDate) && (
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Transactions */}
      <ScrollView>
        {filteredList.map((item) => (
          <View key={item._id} style={styles.transactionsContainer}>
            <Text style={item.type === "deposit" ? styles.green : styles.red}>
              {`${item.amount} KWD`}
            </Text>
            <Text style={item.type === "deposit" ? styles.green : styles.red}>
              {item.type === "deposit" ? (
                <AntDesign name="arrowdown" size={24} color="green" />
              ) : item.type === "withdraw" ? (
                <AntDesign name="arrowup" size={24} color="red" />
              ) : (
                <Octicons name="arrow-switch" size={24} color="gray" />
              )}
            </Text>
            <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text style={{ color: "#007bff" }}>{item.type}</Text>
          </View>
        ))}
        {filteredList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            No transactions match your filters.
          </Text>
        )}
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
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  activeButton: {
    backgroundColor: "#0056b3",
  },
  clearButton: {
    height: 32,
    marginTop: 0,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateSummaryRow: {
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  dateColumn: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
  },
  dateSummaryText: {
    color: "#00244c",
    fontWeight: "600",
  },
  transactionsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    justifyContent: "space-evenly",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  green: { color: "green" },
  red: { color: "red" },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
});
