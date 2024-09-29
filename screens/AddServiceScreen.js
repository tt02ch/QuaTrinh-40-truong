import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const AddServiceScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddService = async () => {
    if (!name || !price) {
      Alert.alert('Cảnh báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const priceValue = parseFloat(price); // Convert price to number

    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Cảnh báo', 'Vui lòng nhập giá dịch vụ hợp lệ');
      return;
    }

    try {
      await addDoc(collection(db, 'services'), {
        name,
        price: `${priceValue} ₫`, // Store the converted value
      });
      Alert.alert('Thành công', 'Dịch vụ đã được thêm thành công!');

      // Check if refreshServices function exists before calling
      if (route.params?.refreshServices) {
        route.params.refreshServices(); // Call the function to refresh service list
      } else {
        console.warn('refreshServices không tồn tại');
      }

      navigation.goBack();
    } catch (error) {
      // Show error details
      Alert.alert('Lỗi', `Lỗi khi thêm dịch vụ: ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Dịch Vụ</Text>
      <Text style={styles.label}>Tên Dịch Vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên dịch vụ"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Giá Dịch Vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá dịch vụ"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddService}>
        <Text style={styles.buttonText}>Thêm Dịch Vụ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f6f8', // Light gray background for the entire screen
    justifyContent: 'center', // Center content vertically
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Title color matching the theme
    textAlign: 'center', // Center the title
    marginBottom: 20, // Space below the title
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333', // Dark color for labels
  },
  input: {
    borderWidth: 1,
    borderColor: '#007BFF', // Border color matching the theme
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff', // White background for inputs
    shadowColor: '#000', // Shadow effect for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow effect
  },
  button: {
    backgroundColor: '#007BFF', // Blue color for the button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 3, // Elevation for Android shadow
  },
  buttonText: {
    color: '#fff', // White text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddServiceScreen;
