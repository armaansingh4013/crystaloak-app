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
import { getPaySlipData, updatePaySlipData } from '../controller/admin/payslip';

const PaySlipView = ({ route, navigation }) => {
  const { employeeId, payType, employeeData, startDate, endDate } = route.params;
  const [paySlipData, setPaySlipData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchPaySlipData();
  }, []);

  const fetchPaySlipData = async () => {
    try {
      const response = await getPaySlipData(employeeId, payType, startDate, endDate);
      console.log('====================================');
      console.log(response);
      console.log('====================================');
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
      <Header title="Pay Slip" onBackPress={() => navigation.goBack()}/>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setShowEditModal(true)}
      >
        <Text style={styles.editButtonText}>Edit Pay Slip</Text>
      </TouchableOpacity>
      <ScrollView style={styles.container}>
      {/* Header Row */}
      <View style={styles.rowHeader}>
        <Text style={styles.headerCell}>Works No</Text>
        <Text style={styles.headerCell}>Employee</Text>
        <Text style={styles.headerCell}>Department</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>National Insurance No.</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}>13</Text>
        <Text style={styles.cell}>{employeeData.name}</Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}>30 Apr 2025</Text>
        <Text style={styles.cell}>TJ170309B</Text>
      </View>

      {/* Payments and Deductions */}
      <View style={styles.subHeaderRow}>
        <Text style={styles.subHeader}>Payments</Text>
        <Text style={styles.subHeader}>Units</Text>
        <Text style={styles.subHeader}>Rate</Text>
        <Text style={styles.subHeader}>Amount</Text>
        <Text style={styles.subHeader}>Deductions</Text>
        <Text style={styles.subHeader}>Amount</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.cell}>Basic Pay</Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}>£900.00</Text>
        <Text style={styles.cell}>Income Tax</Text>
        <Text style={styles.cell}>£0.00</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}>National Insurance</Text>
        <Text style={styles.cell}>£0.00</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.boldCell}>Total Payments</Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.boldCell}>£900.00</Text>
        <Text style={styles.cell}>Employee Pension</Text>
        <Text style={styles.cell}>£0.00</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.cell}></Text>
        <Text style={styles.boldCell}>Total Deductions</Text>
        <Text style={styles.boldCell}>£0.00</Text>
      </View>

      {/* Totals Section */}
      <View style={styles.subHeaderRow}>
        <Text style={styles.subHeader}>Totals This Period</Text>
        <Text style={styles.subHeader}>Totals Year To Date</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <Text>Total Payments: £900.00</Text>
          <Text>Total Deductions: £0.00</Text>
        </View>
        <View style={styles.halfColumn}>
          <Text>Taxable Gross Pay: £900.00</Text>
          <Text>Income Tax: £0.00</Text>
          <Text>Employee NIC: £0.00</Text>
          <Text>Employer NIC: £72.45</Text>
          <Text>SMP/SPP: £0.00</Text>
          <Text>Employee Pension: £0.00</Text>
          <Text>Employer Pension: £0.00</Text>
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.subHeaderRow}>
        <Text style={styles.subHeader}>Comments</Text>
      </View>
      <View style={styles.commentBox}>
        <Text style={styles.bold}>Balwinder Kumar</Text>
        <Text>104 Windsor Avenue</Text>
        <Text>Uxbridge</Text>
        <Text>UB10 9BA</Text>
        <Text>Tax Code: 1257L  NI table: A  Tax Period: Apr 2025</Text>
        <Text>Payment Method: BACS</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <View style={styles.halfColumn}>
          <Text style={styles.bold}>Crystal Oak Constructions Ltd</Text>
          <Text style={styles.bold}>121 MIDHURST GARDENS, UXBRIDGE, UB10 9DP</Text>
          <Text style={styles.bold}>Ref 120/UA89721</Text>
        </View>
        <View style={styles.halfColumn}>
          <Text style={styles.netPay}>NET PAY £900.00</Text>
        </View>
      </View>
    </ScrollView>
      {/* <ScrollView style={styles.content}>
        <View style={styles.paySlipContainer}>
          <Text style={styles.companyName}>Crystal Oak</Text>
          <Text style={styles.paySlipTitle}>PAY SLIP</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employee Information</Text>
            <Text style={styles.infoText}>Name: {employeeData.name}</Text>
            <Text style={styles.infoText}>Address: {employeeData.address}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Period</Text>
            <Text style={styles.infoText}>From: {startDate}</Text>
            <Text style={styles.infoText}>To: {endDate}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Text style={styles.infoText}>
              Pay Type: {payType === 'hourly' ? 'Hourly Basis' : 'Daily Basis'}
            </Text>
            <Text style={styles.infoText}>
              Working Hours/Days: {payType === 'hourly' ?paySlipData.details.totalHours:paySlipData.details.totalDays}
            </Text>
            <Text style={styles.infoText}>
              Rate per {payType === 'hourly' ? 'Hour' : 'Day'}: ${payType === 'hourly' ?paySlipData.details.ratePerHour:paySlipData.details.ratePerDay}
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
              ${paySlipData.details.totalAmount}
            </Text>
          </View>
        </View>
      </ScrollView> */}

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

  container: { backgroundColor: '#fff' },
  rowHeader: { flexDirection: 'row', backgroundColor: '#0000cc', padding: 6 },
  headerCell: { flex: 1, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  subHeaderRow: { flexDirection: 'row', backgroundColor: '#0000cc', padding: 6 },
  subHeader: { flex: 1, color: '#fff', fontWeight: 'bold' },
  row: { flexDirection: 'row', paddingVertical: 4 },
  cell: { flex: 1, fontSize: 12 },
  boldCell: { flex: 1, fontWeight: 'bold', fontSize: 12 },
  halfColumn: { flex: 1, padding: 6 },
  commentBox: { padding: 8, borderWidth: 1, borderColor: '#ccc' },
  bold: { fontWeight: 'bold' },
  footer: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#000', marginTop: 10, paddingVertical: 10 },
  netPay: { fontWeight: 'bold', fontSize: 16, textAlign: 'right' }
});

export default PaySlipView; 