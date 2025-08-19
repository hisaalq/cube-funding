import { getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const checkToken = async () => {
    const token = await getToken();
    console.log(token);

    if (token) {
      setIsAuthenticated(true);
    }
    setReady(true);
  };
  useEffect(() => {
    checkToken();
  }, []);
  if (!ready) {
    return <ActivityIndicator />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
        }}
      >
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#007bff",
          }}
        >
          <Tabs.Screen
            name="(auth)/mainPage"
            options={{
              href: null,
              headerShown: false,
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
          <Tabs.Protected guard={isAuthenticated}>
            <Tabs.Screen
              name="current-user"
              options={{
                title: "Profile",
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="user-circle" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color }) => (
                  <Entypo name="home" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="users"
              options={{
                title: "Users",
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="users" size={20} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="transactions"
              options={{
                title: "Transactions",
                tabBarIcon: ({ color }) => (
                  <MaterialIcons
                    name="compare-arrows"
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs.Protected>
        </Tabs>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
