import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import ServiceItem from '../components/ServiceItem';

const HomeScreen = ({ navigation, route }) => {
  const isAdmin = route.params?.isAdmin; // Sử dụng optional chaining
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesList);
      setLoading(false);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu');
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dịch Vụ</Text>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <ServiceItem service={item} onEdit={isAdmin ? () => handleEdit(item.id) : null} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {isAdmin && ( // Chỉ hiển thị nút thêm nếu là admin
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddServiceScreen')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4CAF50',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
