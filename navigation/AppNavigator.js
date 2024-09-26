import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons'; // Nhập biểu tượng từ thư viện
import HomeScreen from '../screens/HomeScreen';
import AddServiceScreen from '../screens/AddServiceScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import TransactionScreen from '../screens/TransactionScreen';
import CustomerScreen from '../screens/CustomerScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="AddServiceScreen" component={AddServiceScreen} options={{ title: 'Add Service' }} />
      <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} options={{ title: 'Edit Service' }} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} /> // Biểu tượng cho Home
            ),
          }} 
        />
        <Tab.Screen 
          name="Transactions" 
          component={TransactionScreen} 
          options={{ 
            title: 'Transactions',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="file-tray-full-outline" size={size} color={color} /> // Biểu tượng cho Transactions
            ),
          }} 
        />
        <Tab.Screen 
          name="Customers" 
          component={CustomerScreen} 
          options={{ 
            title: 'Customers',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} /> // Biểu tượng cho Customers
            ),
          }} 
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ 
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} /> // Biểu tượng cho Settings
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
