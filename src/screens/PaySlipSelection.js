import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import Header from '../Sections/Header';
import color from '../styles/globals';
import { getAllEmployees } from '../controller/admin/employees';
import { Ionicons } from '@expo/vector-icons';

const PaySlipSelection = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payType, setPayType] = useState('hourly');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayTypeModal, setShowPayTypeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch employees');
    }
  };

  const handleContinue = () => {
    if (!selectedEmployee) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }
    navigation.navigate('PaySlipDetails', {
      employeeId: selectedEmployee._id,
      payType: payType,
    });
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setSelectedEmployee(item);
        setShowEmployeeModal(false);
        setSearchQuery(''); // Reset search when employee is selected
      }}
    >
      <Text style={styles.dropdownItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPayTypeItem = (type) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setPayType(type);
        setShowPayTypeModal(false);
      }}
    >
      <Text style={styles.dropdownItemText}>
        {type === 'hourly' ? 'Hourly Basis' : 'Daily Basis'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Pay Slip Generation" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Select Employee</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowEmployeeModal(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedEmployee ? selectedEmployee.name : 'Select an employee'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pay Type</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowPayTypeModal(true)}
          >
            <Text style={styles.dropdownButtonText}>
              {payType === 'hourly' ? 'Hourly Basis' : 'Daily Basis'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Employee Selection Modal */}
      <Modal
        visible={showEmployeeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowEmployeeModal(false);
          setSearchQuery(''); // Reset search when modal is closed
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Employee</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowEmployeeModal(false);
                  setSearchQuery(''); // Reset search when modal is closed
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employees..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredEmployees}
              renderItem={renderEmployeeItem}
              keyExtractor={(item) => item._id}
              style={styles.dropdownList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No employees found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Pay Type Selection Modal */}
      <Modal
        visible={showPayTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPayTypeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pay Type</Text>
              <TouchableOpacity onPress={() => setShowPayTypeModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {renderPayTypeItem('hourly')}
            {renderPayTypeItem('daily')}
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: color.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
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
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PaySlipSelection; 