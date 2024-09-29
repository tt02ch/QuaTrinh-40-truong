import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Vui lòng nhập cả email và mật khẩu.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kiểm tra quyền admin của người dùng
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const isAdmin = userDoc.data().isAdmin;

        // Chuyển hướng dựa trên quyền admin
        if (isAdmin) {
          alert('Chào mừng, Admin!');
          navigation.replace('AdminHomeScreen');
        } else {
          alert('Đăng nhập thành công');
          navigation.replace('HomeScreen');
        }
      } else {
        showModal('Không tìm thấy người dùng. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (error) {
      showModal('Đăng nhập thất bại: ' + friendlyErrorMessage(error.code));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const friendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'Không tìm thấy người dùng với email này. Vui lòng kiểm tra lại email hoặc đăng ký.';
      case 'auth/wrong-password':
        return 'Mật khẩu không đúng. Vui lòng thử lại.';
      case 'auth/invalid-email':
        return 'Định dạng email không hợp lệ. Vui lòng nhập một email hợp lệ.';
      default:
        return 'Có gì đó không ổn. Vui lòng thử lại sau.';
    }
  };

  const showModal = (message) => {
    setErrorMessage(message);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://ito.tdmu.edu.vn/img/ckeditor/images/Logothietke%201(7).jpg' }} 
        style={styles.image} 
      />

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.linkText}>Đăng Ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.linkText}>Quên Mật Khẩu?</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f6f8' },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: '#fff' },
  loginButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontSize: 16 },
  linkText: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: { fontSize: 18, marginBottom: 15 },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: { color: '#fff', fontSize: 16 },
});

export default LoginScreen;
