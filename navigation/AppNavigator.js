import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase/firebaseConfig'; 

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import TransactionScreen from '../screens/TransactionScreen';
import CustomerScreen from '../screens/CustomerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for Home related screens
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="AddServiceScreen" component={AddServiceScreen} options={{ title: 'Add Service' }} />
      <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} options={{ title: 'Edit Service' }} />
    </Stack.Navigator>
  );
}

// Tab navigation for the main app
function MainAppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionScreen} 
        options={{ 
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomerScreen} 
        options={{ 
          title: 'Customers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(currentUser.email === 'admin@example.com');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen 
            name="MainAppTabs" 
            component={MainAppTabs} 
            options={{ headerShown: false, params: { isAdmin } }} 
          />
        ) : (
          <>
            <Stack.Screen 
              name="LoginScreen" 
              component={LoginScreen} 
              options={{ title: 'Login' }} 
            />
            <Stack.Screen 
              name="RegisterScreen" 
              component={RegisterScreen} 
              options={{ title: 'Register' }} 
            />
            <Stack.Screen 
              name="ForgotPasswordScreen" 
              component={ForgotPasswordScreen} 
              options={{ title: 'Forgot Password' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
