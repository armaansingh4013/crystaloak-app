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
} from 'react-native';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import color from '../styles/globals';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createHoliday, fetchHoliday, updateHoliday, deleteHoliday } from '../controller/admin/holiday';

const HolidaysScreen = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    description: '',
    isRecurring: false,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      const res = await fetchHoliday();
      if (res.success) {
        setHolidays(res.data.data);
      }
      else {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async () => {
    try {
      const res = await createHoliday(newHoliday);
      if (res.success) {

        Alert.alert('Success', 'Holiday added successfully');
        setIsModalVisible(false);
        setNewHoliday({
        name: '',
        date: '',
        description: ''
      });
      loadHolidays();} 
      else {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add holiday');
    }
  };

  const handleUpdateHoliday = async () => {
    try {
      const res = await updateHoliday(selectedHoliday._id, newHoliday);
      if (res.success) {
        Alert.alert('Success', 'Holiday updated successfully');
        setIsModalVisible(false);
        setIsEditMode(false);
        setSelectedHoliday(null);
        setNewHoliday({
          name: '',
          date: '',
          description: ''
        });
        loadHolidays();
      } else {
        Alert.alert('Error', res.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update holiday');
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    Alert.alert(
      'Delete Holiday',
      'Are you sure you want to delete this holiday?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteHoliday(holidayId);
              if (res.success) {
                Alert.alert('Success', 'Holiday deleted successfully');
                loadHolidays();
              } else {
                Alert.alert('Error', res.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete holiday');
            }
          },
        },
      ]
    );
  };

  const handleEditHoliday = (holiday) => {
    setSelectedHoliday(holiday);
    setNewHoliday({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description
    });
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedHoliday(null);
    setNewHoliday({
      name: '',
      date: '',
      description: ''
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setNewHoliday({ ...newHoliday, date: formattedDate });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderHolidayItem = ({ item }) => (
    <View style={styles.holidayCard}>
      <View style={styles.topRow}>
        <Text style={styles.holidayDate}>{formatDate(item.date)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditHoliday(item)}
          >
            <Icon name="edit" size={20} color={color.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteHoliday(item._id)}
          >
            <Icon name="delete" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.holidayName}>{item.name}</Text>
      <Text style={styles.holidayDescription}>{item.description}</Text>
    </View>
  );

  const renderAddHolidayModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Holiday' : 'Add New Holiday'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Holiday Name"
              placeholderTextColor="#999"
              value={newHoliday.name}
              onChangeText={(text) => setNewHoliday({ ...newHoliday, name: text })}
            />
            
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {newHoliday.date ? formatDate(newHoliday.date) : 'Select Date'}
              </Text>
              <Icon name="event" size={24} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              value={newHoliday.description}
              onChangeText={(text) => setNewHoliday({ ...newHoliday, description: text })}
              multiline
            />
            {/* <TouchableOpacity
              style={[
                styles.checkbox,
                newHoliday.isRecurring && styles.checkboxSelected,
              ]}
              onPress={() =>
                setNewHoliday({ ...newHoliday, isRecurring: !newHoliday.isRecurring })
              }
            >
              <Text style={styles.checkboxText}>Recurring Holiday</Text>
            </TouchableOpacity> */}
          </ScrollView>

          <TouchableOpacity
            style={styles.addButton}
            onPress={isEditMode ? handleUpdateHoliday : handleAddHoliday}
          >
            <Text style={styles.addButtonText}>
              {isEditMode ? 'Update Holiday' : 'Add Holiday'}
            </Text>
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
        title="Holidays"
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
        data={holidays}
        renderItem={renderHolidayItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {renderAddHolidayModal()}
     
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
  holidayCard: {
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
  holidayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
    marginBottom: 4,
  },
  recurringBadge: {
    backgroundColor: color.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recurringText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
  },
  holidayDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  holidayDescription: {
    fontSize: 14,
    color: '#444',
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
    fontWeight: 600,
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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dateInputText: {
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
    fontWeight: 600,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default HolidaysScreen; 