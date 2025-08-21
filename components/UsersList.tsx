import { getAllUsers, getUserId } from "@/api/user";
import { UserCard } from "@/types/UserCard";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import UserItem from "./UserItem";
const UsersList = () => {
  const [myId, setMyId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const id = await getUserId();
        setMyId(id);
      } catch (e) {
        console.warn("Failed to fetch current user ID", e);
        setMyId(null);
      } finally {
        setLoadingId(false);
      }
    })();
  }, []);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });

  // Show loading indicator while fetching either users or myId
  if (isLoading || loadingId)
    return <ActivityIndicator style={{ marginTop: 30 }} />;

  return (
    <ScrollView style={{ backgroundColor: "beige" }}>
      {isSuccess &&
        data
          .filter((user: UserCard) => Number(user._id) !== Number(myId)) // remove yourself
          .map((item: UserCard) => (
            <View key={item._id}>
              <UserItem
                username={item.username}
                balance={item.balance}
                image={item.image}
                _id={item._id}
                myId={myId!} // non-null assertion because we waited for loading
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
