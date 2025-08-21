import { deleteToken, getToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Tabs } from "expo-router";
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
  const handleLogout = async () => {
    await deleteToken();
    setIsAuthenticated(false);
    router.replace("/(auth)/mainPage");
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
            tabBarActiveTintColor: "#fed810",
            tabBarInactiveTintColor: "white",
            tabBarStyle: {
              backgroundColor: "#019ee7",
              borderTopColor: "#00244c",
              borderTopWidth: 5,
            },
            headerRight: () => (
              <MaterialIcons name="logout" size={24} color="red" style={{marginRight: 10}} onPress={() => handleLogout()} />
            ),
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
              <Tabs.Screen
              name="current-user"
              options={{
                title: "Profile",
                tabBarIcon: ({ color }) => (
                  <FontAwesome name="user-circle" size={20} color={color} />
                ),
              }}
            />
          </Tabs.Protected>
        </Tabs>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
