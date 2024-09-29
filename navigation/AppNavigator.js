import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import TransactionScreen from "../screens/TransactionScreen";
import CustomerScreen from "../screens/CustomerScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen"; // Import AdminHomeScreen
import EditServiceScreen from "../screens/EditServiceScreen"; // Import EditServiceScreen
import AddServiceScreen from "../screens/AddServiceScreen"; // Import AddServiceScreen

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigation for all users (including admin)
function MainTabs({ isAdmin }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={isAdmin ? AdminHomeScreen : HomeScreen} // Navigate to AdminHomeScreen if user is admin
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Customers"
        children={(props) => <CustomerScreen {...props} isAdmin={isAdmin} />} // Pass isAdmin to CustomerScreen
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main navigation logic
function AppNavigator() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

  // Check user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const isUserAdmin = currentUser.email === "admin@gmail.com"; // Replace this logic as per your requirements
        setIsAdmin(isUserAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              options={{ headerShown: false }} // Hide header
              children={() => <MainTabs isAdmin={isAdmin} />} // Use children prop
            />
            <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} />
            <Stack.Screen name="AddServiceScreen" component={AddServiceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }} // Hide header
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }} // Hide header
            />
            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }} // Hide header
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
