import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Alert,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import color from '../styles/globals';
import {
  getAllEmployees,
  resetEmployeePassword,
  updateEmployee,
} from '../controller/admin/employees';
import { base_url } from '../api';
import profile from '../assets/profile.png';
import Loader from '../Sections/Loader';
import ImageViewer from '../components/ImageViewer';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchQuery, employees]);

  const fetchEmployees = async () => {
    const res = await getAllEmployees();
    if (res.success) {
      setEmployees(res.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const filterEmployees = () => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(emp => 
      (emp.name && emp.name.toLowerCase().includes(query)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(query)) ||
      (emp.department && emp.department.toLowerCase().includes(query)) ||
      (emp.designation && emp.designation.toLowerCase().includes(query))
    );
    setFilteredEmployees(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  const openEditModal = (employee) => {
    navigation.navigate('AdminEditEmployee', { employee });
  };

  const handleStatusUpdate = async () => {
    const res = await updateEmployee({
      id: selectedEmployee._id,
      isEnabled: isEnabled,
    });

    if (res.success) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === selectedEmployee._id ? { ...emp, isEnabled } : emp
        )
      );
      setModalVisible(false);
      setSelectedEmployee(null);
    }
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'Are you sure you want to reset this employee\'s password?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const res = await resetEmployeePassword({id: selectedEmployee._id});
            if (res.success) {
              Alert.alert('Success', 'Password reset successfully.');
            } else {
              Alert.alert('Error', 'Failed to reset password.');
            }
          },
        },
      ]
    );
    setModalVisible(false);
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = (phoneNumber) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <TouchableOpacity
        onLongPress={() => {
          if (item.profileImage) {
            setSelectedImage(`${item.profileImage.imageUrl}`);
            setImageViewerVisible(true);
          }
        }}
        delayLongPress={500}
      >
        <Image
          style={styles.circle}
          source={
            item.profileImage
              ? { uri: item.profileImage.imageUrl }
              : profile
          }
        />
      </TouchableOpacity>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <View style={styles.empDetail}>
          <Text style={styles.employeeStatus}>{item.employeeCode}</Text>
          <Text style={styles.employeeStatus}>
            {item.isEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(item.phoneNumber)}
        >
          <Ionicons name="call" size={20} color={color.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleMessage(item.phoneNumber)}
        >
          <Ionicons name="chatbubble" size={20} color={color.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading && <Loader />}
      <Header onBackPress={() => navigation.goBack()} title="Employees" />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredEmployees}
          keyExtractor={(item) => item._id}
          renderItem={renderEmployee}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
            style={styles.modalOverlay}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Employee Details</Text>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>
                  {selectedEmployee?.name}
                </Text>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Enabled:</Text>
                  <Switch
                    value={isEnabled}
                    onValueChange={(val) => setIsEnabled(val)}
                    trackColor={{ false: '#ccc', true: `#b8b3e1` }}
                    thumbColor={isEnabled ? `${color.primary}` : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleStatusUpdate}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleResetPassword}
                  style={[
                    styles.submitButton,
                    { backgroundColor: color.primary, marginTop: 10 },
                  ]}
                >
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
      <ImageViewer
        visible={imageViewerVisible}
        imageUrl={selectedImage}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '500',
  },
  employeeStatus: {
    fontSize: 14,
    color: '#555',
  },
  empDetail: {
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: "center"
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: color.secondary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Employees;
