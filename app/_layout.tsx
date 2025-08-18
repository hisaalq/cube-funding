import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007bff",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            href: null,
          }}
        />

        <Tabs.Screen
          name="(auth)/mainPage"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(tabs)/current-user"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-circle" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(auth)/loginPage"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(auth)/registerPage"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(tabs)/home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/users"
          options={{
            title: "Users",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/transactions"
          options={{
            title: "Transactions",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="compare-arrows" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
