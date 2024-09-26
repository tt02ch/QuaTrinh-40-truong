// screens/AddServiceScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const AddServiceScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddService = async () => {
    if (name && price) {
      try {
        await addDoc(collection(db, 'services'), {
          name,
          price: `${price} ₫`,
        });
        alert('Dịch vụ đã được thêm thành công!');
        route.params.refreshServices(); // Gọi hàm làm mới ở đây
        navigation.goBack();
      } catch (error) {
        alert('Lỗi khi thêm dịch vụ');
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  };

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
      <Button title="Thêm dịch vụ" onPress={handleAddService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
});

export default AddServiceScreen;
