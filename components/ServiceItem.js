// components/ServiceItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ServiceItem = ({ service, onEdit }) => {
  return (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{service.name}</Text>
      <Text style={styles.servicePrice}>{service.price}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Icon name="pencil" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  serviceName: { fontSize: 18 },
  servicePrice: { fontSize: 16, color: '#666' },
});

export default ServiceItem;
