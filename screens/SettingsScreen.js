import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Hiển thị cảnh báo xác nhận trước khi đăng xuất
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          onPress: () => {
            // Thực hiện logic đăng xuất ở đây, ví dụ xóa token hoặc thông tin người dùng
            console.log('Đã đăng xuất'); // Thay bằng logic thực tế của bạn
            navigation.navigate('LoginScreen'); // Điều hướng đến màn hình đăng nhập
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cài Đặt</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#d9534f', // Màu đỏ đẹp cho nút đăng xuất
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SettingsScreen;
