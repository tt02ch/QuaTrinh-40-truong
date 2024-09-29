import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import icon package

const SettingsScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = auth.currentUser;

  // Xử lý đăng xuất
  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: () => {
            signOut(auth)
              .then(() => {
                console.log('Đã đăng xuất');
                navigation.navigate('LoginScreen');
              })
              .catch((error) => {
                console.error('Lỗi khi đăng xuất: ', error);
              });
          }
        }
      ]
    );
  };

  // Xử lý tái xác thực và đổi mật khẩu
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập cả mật khẩu hiện tại và mật khẩu mới.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            Alert.alert("Thành công", "Mật khẩu đã được đổi.");
            setCurrentPassword('');
            setNewPassword('');
            setIsModalVisible(false);
          })
          .catch((error) => {
            console.error("Lỗi khi đổi mật khẩu: ", error);
            Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại.");
          });
      })
      .catch((error) => {
        console.error("Lỗi khi xác thực: ", error);
        Alert.alert("Lỗi", "Mật khẩu hiện tại không đúng. Vui lòng thử lại.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cài Đặt</Text>
      
      {/* Hiển thị thông tin người dùng */}
      <View style={styles.userInfo}>
        <Text style={styles.label}>Email:</Text>
        <View style={styles.userInfoRow}>
          <Ionicons name="mail-outline" size={20} color="#333" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>

        <Text style={styles.label}>UID:</Text>
        <View style={styles.userInfoRow}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.infoText}>{user?.uid}</Text>
        </View>
      </View>

      {/* Nút đổi mật khẩu mở modal */}
      <TouchableOpacity style={styles.changePasswordPrompt} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="key-outline" size={24} color="#007BFF" />
        <Text style={styles.changePasswordText}> Đổi mật khẩu</Text>
      </TouchableOpacity>

      {/* Modal đổi mật khẩu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            
            {/* Nhập mật khẩu hiện tại */}
            <TextInput
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.input}
            />
            
            {/* Nhập mật khẩu mới */}
            <TextInput
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleChangePassword}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" /> 
        <Text style={styles.logoutButtonText}> Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  userInfo: {
    marginBottom: 40,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  changePasswordPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  changePasswordText: {
    color: '#007BFF',
    fontSize: 18,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;
