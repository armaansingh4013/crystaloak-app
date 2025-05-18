import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { fetchShifts, createShift } from '../controller/admin/shift';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../styles/globals';
import DateTimePicker from '@react-native-community/datetimepicker';

const ShiftScreen = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: '',
    timeZone: 'Asia/Kolkata',
    description: '',
    isDefault: false,
  });
  const navigation = useNavigation();

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      setLoading(true);
      const response = await fetchShifts();
      if (response.success) {
        setShifts(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = async () => {
    try {
      const response = await createShift(newShift);
      if (response.success) {
        Alert.alert('Success', 'Shift added successfully');
        setIsModalVisible(false);
        setNewShift({
          name: '',
          startTime: '',
          endTime: '',
          timeZone: 'Asia/Kolkata',
          description: '',
          isDefault: false,
        });
        loadShifts();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add shift');
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setNewShift({ ...newShift, startTime: `${hours}:${minutes}` });
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setNewShift({ ...newShift, endTime: `${hours}:${minutes}` });
    }
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return '-'; // Handle null dates
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // "May"
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
  };
  
  const renderShiftItem = ({ item }) => (
    <View style={styles.shiftCard}>
      <View style={styles.shiftHeader}>
        <Text style={styles.shiftName}>{item.name}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      <Text style={styles.shiftTime}>
        {item.startTime} - {item.endTime}
      </Text>
      <Text style={styles.shiftDescription}>{item.description}</Text>
      <Text style={styles.shiftDescription}>{formatDate(item.startDate)} - {item.endDate?formatDate(item.endDate):"Till Date"}</Text>
      <Text style={styles.shiftTimezone}>Timezone: {item.timeZone}</Text>
    </View>
  );

  const renderAddShiftModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Shift</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Shift Name"
              placeholderTextColor="#999"
              value={newShift.name}
              onChangeText={(text) => setNewShift({ ...newShift, name: text })}
            />
            
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={styles.timeInputText}>
                {newShift.startTime || 'Select Start Time'}
              </Text>
              <Icon name="access-time" size={24} color="#666" />
            </TouchableOpacity>
            {showStartTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}
     
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={styles.timeInputText}>
                {newShift.endTime || 'Select End Time'}
              </Text>
              <Icon name="access-time" size={24} color="#666" />
            </TouchableOpacity>
 {showEndTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
        />
      )}
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              value={newShift.description}
              onChangeText={(text) => setNewShift({ ...newShift, description: text })}
              multiline
            />
            {/* <TouchableOpacity
              style={[
                styles.checkbox,
                newShift.isDefault && styles.checkboxSelected,
              ]}
              onPress={() =>
                setNewShift({ ...newShift, isDefault: !newShift.isDefault })
              }
            >
              <Text style={styles.checkboxText}>Set as Default Shift</Text>
            </TouchableOpacity> */}
          </ScrollView>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddShift}
          >
            <Text style={styles.addButtonText}>Add Shift</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Shift Management"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            style={styles.addIcon}
            onPress={() => setIsModalVisible(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={shifts}
        renderItem={renderShiftItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
      {renderAddShiftModal()}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  shiftCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: color.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  shiftTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  shiftDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  shiftTimezone: {
    fontSize: 12,
    color: '#888',
  },
  addIcon: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    maxHeight: '70%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  timeInputText: {
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  checkboxSelected: {
    backgroundColor: color.primary + '20',
    borderColor: color.primary,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: color.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShiftScreen; 