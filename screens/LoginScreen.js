import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig'; // Đảm bảo db được import để kiểm tra thông tin admin
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showModal('Please enter both email and password.');
      return;
    }

    try {
      // Đăng nhập người dùng
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kiểm tra nếu người dùng là admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        alert('Welcome, Admin!');
        navigation.replace('AdminHomeScreen'); // Chuyển hướng đến màn hình admin
      } else {
        alert('Login Successful');
        navigation.replace('HomeScreen'); // Chuyển hướng đến màn hình chính
      }
    } catch (error) {
      showModal('Login Failed: ' + friendlyErrorMessage(error.code));
    }
  };

  const friendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your email or register.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  };

  const showModal = (message) => {
    setErrorMessage(message);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
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
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.linkText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Modal for error messages */}
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  loginButton: {
    backgroundColor: '#4CAF50',
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
