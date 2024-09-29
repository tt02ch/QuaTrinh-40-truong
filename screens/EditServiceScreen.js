import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EditServiceScreen = ({ route, navigation }) => {
  const { serviceId, onUpdate } = route.params; // Lấy onUpdate từ params
  const [service, setService] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(''); // Thêm state để hiển thị lỗi

  const fetchService = async () => {
    const docRef = doc(db, 'services', serviceId);
    const serviceDoc = await getDoc(docRef);
    if (serviceDoc.exists()) {
      const serviceData = serviceDoc.data();
      setService(serviceData);
      setName(serviceData.name);
      setPrice(serviceData.price.replace(' ₫', ''));
    } else {
      setError('Dịch vụ không tồn tại.');
    }
    setLoading(false); // Đặt loading là false sau khi tải xong
  };

  const handleUpdateService = async () => {
    if (!name || !price) {
      setError('Vui lòng nhập đầy đủ thông tin'); // Cập nhật thông báo lỗi
      return;
    }

    // Kiểm tra giá hợp lệ
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Giá dịch vụ phải là số dương.');
      return;
    }

    try {
      const docRef = doc(db, 'services', serviceId);
      await updateDoc(docRef, { name, price: `${price} ₫` });
      alert('Dịch vụ đã được cập nhật!');

      // Gọi hàm onUpdate để làm mới dữ liệu trên HomeScreen
      if (onUpdate) {
        onUpdate();
      }

      navigation.goBack();
    } catch (error) {
      setError('Lỗi khi cập nhật dịch vụ');
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị spinner khi đang tải
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null} {/* Hiển thị lỗi nếu có */}
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
  error: { color: 'red', marginBottom: 10 }, // Thêm style cho thông báo lỗi
});

export default EditServiceScreen;
