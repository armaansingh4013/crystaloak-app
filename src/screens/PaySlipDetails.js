import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Header from '../Sections/Header';
import color from '../styles/globals';

const PaySlipDetails = ({ route, navigation }) => {
  const { selectedEmployee, payType ,startDate,endDate} = route.params;
  const [editedAddress, setEditedAddress] = useState(selectedEmployee.address);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveAddress = () => {
    setShowEditModal(false);
    Alert.alert('Success', 'Address updated for pay slip');
  };

  const handleGeneratePaySlip = () => {
    navigation.navigate('PaySlipView', {
      employeeId: selectedEmployee._id,
      payType,
      startDate,
      endDate,
      employeeData: {
        ...selectedEmployee,
        address: editedAddress, // Use the edited address
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Employee Details" onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Employee Information</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Name: {selectedEmployee.name}</Text>
            <Text style={styles.infoText}>ID: {selectedEmployee._id}</Text>
            <Text style={styles.infoText}>Email: {selectedEmployee.email}</Text>
            <Text style={styles.infoText}>Phone: {selectedEmployee.phone}</Text>
            <Text style={styles.infoText}>Address: {editedAddress}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>Edit Address for Pay Slip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGeneratePaySlip}
        >
          <Text style={styles.generateButtonText}>Generate Pay Slip</Text>
        </TouchableOpacity>

        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Address for Pay Slip</Text>
              <TextInput
                style={styles.addressInput}
                value={editedAddress}
                onChangeText={setEditedAddress}
                multiline
                numberOfLines={4}
                placeholder="Enter address for pay slip"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setEditedAddress(selectedEmployee.address); // Reset to original address
                    setShowEditModal(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveAddress}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  editButton: {
    backgroundColor: color.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: color.primary,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaySlipDetails; 