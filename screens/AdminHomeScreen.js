import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal, Button } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminHomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesList);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (serviceId) => {
    navigation.navigate('EditServiceScreen', {
      serviceId,
      onUpdate: fetchServices,
    });
  };

  const handleAddService = () => {
    navigation.navigate('AddServiceScreen', { refreshServices: fetchServices });
  };

  const handleDeleteService = async () => {
    if (selectedService) {
      try {
        await deleteDoc(doc(db, 'services', selectedService.id));
        fetchServices(); // Refresh the list after deleting
        setModalVisible(false);
      } catch (error) {
        alert('Lỗi khi xóa dịch vụ');
      }
    }
  };

  const confirmDeleteService = (service) => {
    setSelectedService(service);
    setModalVisible(true); // Show confirmation modal
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://ito.tdmu.edu.vn/img/ckeditor/images/Logothietke%201(7).jpg' }}
          style={styles.headerImage}
        />
        <Text style={styles.header}>Dịch vụ của chúng tôi</Text>
      </View>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.serviceRow}>
                <Icon name="work" size={20} color="#007BFF" />
                <Text style={styles.serviceName}>{item.name}</Text>
              </View>
              <View style={styles.priceRow}>
                <Icon name="attach-money" size={20} color="#007BFF" />
                <Text style={styles.servicePrice}>{item.price} VNĐ</Text>
              </View>
              <Text style={styles.serviceDescription}>{item.description}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
                <Icon name="edit" size={24} color="#007BFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteService(item)}>
                <Icon name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal for confirming delete */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn xóa dịch vụ này không?</Text>
            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={() => setModalVisible(false)} />
              <Button title="Xóa" onPress={handleDeleteService} color="#FF0000" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f7',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007BFF',
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginLeft: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AdminHomeScreen;
