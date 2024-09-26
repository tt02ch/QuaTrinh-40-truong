// screens/EditServiceScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EditServiceScreen = ({ route, navigation }) => {
  const { serviceId, onUpdate } = route.params; // Nhận thêm onUpdate từ params
  const [service, setService] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const fetchService = async () => {
    const docRef = doc(db, 'services', serviceId);
    const serviceDoc = await getDoc(docRef);
    if (serviceDoc.exists()) {
      const serviceData = serviceDoc.data();
      setService(serviceData);
      setName(serviceData.name);
      setPrice(serviceData.price.replace(' ₫', ''));
    }
  };

  const handleUpdateService = async () => {
    if (name && price) {
      try {
        const docRef = doc(db, 'services', serviceId);
        await updateDoc(docRef, { name, price: `${price} ₫` });
        alert('Dịch vụ đã được cập nhật!');
        if (onUpdate) {
          onUpdate(); // Gọi hàm onUpdate để cập nhật lại dữ liệu trên HomeScreen
        }
        navigation.goBack();
      } catch (error) {
        alert('Lỗi khi cập nhật dịch vụ');
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (!service) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên dịch vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên dịch vụ"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Giá dịch vụ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá dịch vụ"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Cập nhật dịch vụ" onPress={handleUpdateService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
});

export default EditServiceScreen;
