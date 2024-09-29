import React from 'react';
import { LogBox } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

// Ẩn cảnh báo không cần thiết
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
  "The action 'REPLACE' with payload"
]);

export default function App() {
  return <AppNavigator />;
}
