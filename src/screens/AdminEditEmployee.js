import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Clipboard,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from "../styles/globals";
import { updateEmployee, resetEmployeePassword } from '../controller/admin/employees';
import Toast from 'react-native-toast-message';
import Loader from '../Sections/Loader';

const AdminEditEmployee = ({ route, navigation }) => {
  const { employee } = route.params;
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isEnabled, setIsEnabled] = useState(employee.isEnabled);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    phoneNumber: String(employee.phoneNumber),
    email: employee.email,
    department: employee.department,
    designation: employee.designation
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    try {
      const res = await updateEmployee({
        id: employee._id,
        ...formData
      });

      if (res.success) {
        setIsEditing(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Employee details updated successfully',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update employee details',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateEmployee({
        id: employee._id,
        isEnabled: !isEnabled
      });

      if (res.success) {
        setIsEnabled(!isEnabled);
        setShowStatusModal(false);
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Employee ${!isEnabled ? 'enabled' : 'disabled'} successfully`,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await resetEmployeePassword({
        id: employee._id
      });
      console.log(res.data.newPassword);
      
      if (res.success) {
        setShowResetModal(false);
        Toast.show({
          type: 'success',
          text1: 'Password Reset',
          text2: 'Password has been reset successfully',
          position: 'top',
        });
        
        // Format phone number by removing all non-digit characters
        const formattedPhone = employee.phoneNumber;
        
        // Check if WhatsApp is installed
        const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=Your password has been reset. New password: ${res.data.newPassword}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          // If WhatsApp is not installed, show a message with the password
          Alert.alert(
            'Password Reset',
            `Password has been reset. New password: ${res.data.newPassword}\n\nPlease share this password with the employee.`,
            [
              {
                text: 'Copy Password',
                onPress: () => {
                  Clipboard.setString(res.data.newPassword);
                  Toast.show({
                    type: 'success',
                    text1: 'Password Copied',
                    text2: 'Password has been copied to clipboard',
                    position: 'top',
                  });
                }
              },
              { text: 'OK' }
            ]
          );
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('WhatsApp Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open WhatsApp. Please share the password manually.',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleEditDetails = () => {
    navigation.navigate('AdminAddEmployee', { 
      employee: {
        ...employee,
        isEditMode: true
      }
    });
  };

  return (
    <View style={styles.body}>
      {loading && <Loader message="Processing..."/>}
      <Header 
        title="Edit Employee" 
        rightComponent={
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.statusButton}
              onPress={() => setShowStatusModal(true)}
            >
              <Ionicons 
                name={!isEnabled ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={!isEnabled ? "green" : "red"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "checkmark" : "pencil"} 
                size={24} 
                color={"white"} 
              />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter name"
            />
          ) : (
            <Text style={styles.value}>{formData.name}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{formData.phoneNumber}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{formData.email}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Department</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.department}
              onChangeText={(text) => handleChange('department', text)}
              placeholder="Enter department"
            />
          ) : (
            <Text style={styles.value}>{formData.department}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Designation</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.designation}
              onChangeText={(text) => handleChange('designation', text)}
              placeholder="Enter designation"
            />
          ) : (
            <Text style={styles.value}>{formData.designation}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Hour Basis Salary</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.hourSalary}
              onChangeText={(text) => handleChange('hourSalary', text)}
              placeholder="Enter Hour Basis Salary"
            />
          ) : (
            <Text style={styles.value}>{formData.hourSalary}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Day Basis Salary</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.daySalary}
              onChangeText={(text) => handleChange('daySalary', text)}
              placeholder="Enter Day Basis Salary"
            />
          ) : (
            <Text style={styles.value}>{formData.daySalary}</Text>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveDetails}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setShowResetModal(true)}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEnabled ? 'Disable Employee' : 'Enable Employee'}
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to {isEnabled ? 'disable' : 'enable'} this employee?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleStatusUpdate}
              >
                <Text style={styles.modalButtonText}>
                  {isEnabled ? 'Disable' : 'Enable'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalText}>
              Are you sure you want to reset this employee's password?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.resetButton]}
                onPress={handleResetPassword}
              >
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  statusButton: {
    padding: 8,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    marginLeft: 10,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: color.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center'
  },
});

export default AdminEditEmployee; 