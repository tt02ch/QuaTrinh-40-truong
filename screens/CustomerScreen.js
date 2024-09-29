import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase/firebaseConfig';

const CustomerScreen = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const db = getFirestore();

  const fetchUsersFromFirestore = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error("Đã xảy ra lỗi khi lấy danh sách người dùng từ Firestore:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsersFromFirestore();
      Alert.alert("Thông báo", "Tài khoản đã được xóa thành công.");
    } catch (error) {
      console.error("Đã xảy ra lỗi khi xóa tài khoản:", error);
      Alert.alert("Thông báo", "Xóa tài khoản không thành công.");
    }
  };

  const confirmDeleteUser = (userId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa tài khoản này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: () => handleDeleteUser(userId) }
      ]
    );
  };

  useEffect(() => {
    fetchUsersFromFirestore();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Username: {item.username}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Role: {item.isAdmin ? 'Admin' : 'User'}</Text>
      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDeleteUser(item.id)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}> Xóa tài khoản</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách người dùng</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e9ecef', // Màu nền sáng hơn
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#343a40', // Màu sắc tiêu đề đậm
    textAlign: 'center', // Căn giữa tiêu đề
  },
  list: {
    paddingBottom: 16,
  },
  userItem: {
    backgroundColor: '#fff', // Màu nền cho card
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userText: {
    fontSize: 16,
    color: '#495057', // Màu văn bản
    marginBottom: 5, // Thêm khoảng cách giữa các dòng
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545', // Màu đỏ cho nút xóa
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start', // Căn trái nút xóa
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default CustomerScreen;
