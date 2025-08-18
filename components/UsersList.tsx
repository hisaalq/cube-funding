import { getAllUsers } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import UserItem from "./UserItem";
interface AllUsers {
  username: string;
  balance: number;
  image: string;
  _id: string;
}
const UsersList = () => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView style={{ backgroundColor: "beige" }}>
      {isSuccess &&
        data.map((item: AllUsers) => (
          <View key={item._id}>
            <UserItem
              username={item.username}
              balance={item.balance}
              // image={item.image}
              _id={item._id}
            />
          </View>
        ))}
    </ScrollView>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "beige",
  },
});
