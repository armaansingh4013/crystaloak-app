import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Header from '../Sections/Header';
import color from '../styles/globals';
import { getPaySlipData, updatePaySlipData } from '../controller/payslip'; // You'll need to create these API calls

const PaySlipView = ({ route, navigation }) => {
  const { employeeId, payType, employeeData } = route.params;
  const [paySlipData, setPaySlipData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchPaySlipData();
  }, []);

  const fetchPaySlipData = async () => {
    try {
      const response = await getPaySlipData(employeeId, payType);
      setPaySlipData(response);
      setEditedData(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch pay slip data');
    }
  };

  const handleSave = async () => {
    try {
      await updatePaySlipData(employeeId, editedData);
      setPaySlipData(editedData);
      setShowEditModal(false);
      Alert.alert('Success', 'Pay slip updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update pay slip');
    }
  };

  if (!paySlipData) {
    return (
      <View style={styles.container}>
        <Header title="Pay Slip" />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Pay Slip" />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setShowEditModal(true)}
      >
        <Text style={styles.editButtonText}>Edit Pay Slip</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <View style={styles.paySlipContainer}>
          <Text style={styles.companyName}>Crystal Oak</Text>
          <Text style={styles.paySlipTitle}>PAY SLIP</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employee Information</Text>
            <Text style={styles.infoText}>Name: {employeeData.name}</Text>
            <Text style={styles.infoText}>ID: {employeeData.id}</Text>
            <Text style={styles.infoText}>Address: {employeeData.address}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Text style={styles.infoText}>
              Pay Type: {payType === 'hourly' ? 'Hourly Basis' : 'Daily Basis'}
            </Text>
            <Text style={styles.infoText}>
              Working Hours/Days: {paySlipData.workingHours}
            </Text>
            <Text style={styles.infoText}>
              Rate per {payType === 'hourly' ? 'Hour' : 'Day'}: ${paySlipData.rate}
            </Text>
            <Text style={styles.infoText}>
              Basic Pay: ${paySlipData.basicPay}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deductions</Text>
            <Text style={styles.infoText}>
              Tax: ${paySlipData.tax}
            </Text>
            <Text style={styles.infoText}>
              Other Deductions: ${paySlipData.otherDeductions}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Net Pay</Text>
            <Text style={styles.netPayText}>
              ${paySlipData.netPay}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Pay Slip</Text>
            
            <Text style={styles.inputLabel}>Working Hours/Days</Text>
            <TextInput
              style={styles.input}
              value={editedData.workingHours?.toString()}
              onChangeText={(text) => setEditedData({...editedData, workingHours: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Rate</Text>
            <TextInput
              style={styles.input}
              value={editedData.rate?.toString()}
              onChangeText={(text) => setEditedData({...editedData, rate: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Tax</Text>
            <TextInput
              style={styles.input}
              value={editedData.tax?.toString()}
              onChangeText={(text) => setEditedData({...editedData, tax: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Other Deductions</Text>
            <TextInput
              style={styles.input}
              value={editedData.otherDeductions?.toString()}
              onChangeText={(text) => setEditedData({...editedData, otherDeductions: text})}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: color.primary,
    padding: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  paySlipContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: color.primary,
    marginBottom: 10,
  },
  paySlipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  netPayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.primary,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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

export default PaySlipView; 