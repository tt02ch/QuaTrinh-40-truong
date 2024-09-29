import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EditServiceScreen = ({ route, navigation }) => {
  const { serviceId, onUpdate } = route.params; // Retrieve onUpdate from params
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchService = async () => {
    const docRef = doc(db, 'services', serviceId);
    const serviceDoc = await getDoc(docRef);
    if (serviceDoc.exists()) {
      const serviceData = serviceDoc.data();
      setName(serviceData.name);
      setPrice(serviceData.price.replace(' ₫', '')); // Keep the value and remove the ' ₫' character
    } else {
      setError('Dịch vụ không tồn tại.');
    }
    setLoading(false);
  };

  const handleUpdateService = async () => {
    if (!name || !price) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Giá dịch vụ phải là số dương.');
      return;
    }

    try {
      const docRef = doc(db, 'services', serviceId);
      await updateDoc(docRef, { name, price: `${price} ₫` });
      alert('Dịch vụ đã được cập nhật!');

      if (onUpdate) {
        onUpdate(); // Refresh data on HomeScreen
      }

      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      setError('Lỗi khi cập nhật dịch vụ.');
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" />; // Spinner color matches the theme
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.title}>Sửa Dịch Vụ</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleUpdateService}>
        <Text style={styles.buttonText}>Cập Nhật Dịch Vụ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
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

export default EditServiceScreen;
