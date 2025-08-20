import { getAllUsers } from "@/api/user";
import { UserCard } from "@/types/UserCard";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import UserItem from "./UserItem";

const UsersList = () => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });
  if (isLoading) return <ActivityIndicator style={{ marginTop: 30 }} />;
  return (
<View>

    <ScrollView style={{ backgroundColor: "beige" }}>
      {isSuccess &&
        data.map((item: UserCard) => (
          <View key={item._id}>
            <UserItem
              username={item.username}
              balance={item.balance}
              image={item.image}
              _id={item._id}
            />
          </View>
        ))}
    </ScrollView>
</View>
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
