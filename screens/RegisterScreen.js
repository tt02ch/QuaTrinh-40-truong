import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const db = getFirestore(); // Khởi tạo Firestore

  const handleRegister = async () => {
    if (!email || !password || !username) {
      showModal('Please enter all fields: username, email, and password.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        isAdmin: false // Hoặc true nếu bạn muốn tạo tài khoản admin
      });

      alert('Registration Successful');
      navigation.replace('LoginScreen');
    } catch (error) {
      showModal('Registration Failed: ' + friendlyErrorMessage(error.code));
    }
  };

  const friendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please use another email.';
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
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
        <Icon name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
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
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.linkText}>Back to Login</Text>
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
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: { color: '#fff', fontSize: 16 },
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

export default RegisterScreen;
