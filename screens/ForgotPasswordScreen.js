import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      showModal('Please enter your email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      showModal('Failed to send email: ' + friendlyErrorMessage(error.code));
    }
  };

  const friendlyErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please check your email.';
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
      {/* Image at the top of the screen */}
      <Image
        source={{ uri: 'https://ito.tdmu.edu.vn/img/ckeditor/images/Logothietke%201(7).jpg' }} // Replace with your image URL
        style={styles.logo}
        resizeMode="contain" // Ensures the image maintains its aspect ratio
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
      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
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
  logo: {
    width: '80%', // Set to a percentage to adapt to screen width
    height: undefined, // Let the height be determined by the aspect ratio
    aspectRatio: 1, // Adjust this ratio to fit the image's original aspect ratio
    alignSelf: 'center', // Center the image
    marginBottom: 20, // Space below the image
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  resetButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: { color: '#fff', fontSize: 16 },
  linkText: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: { fontSize: 18, marginBottom: 15 },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: { color: '#fff', fontSize: 16 },
});

export default ForgotPasswordScreen;
