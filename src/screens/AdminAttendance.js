import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AttendanceCard from '../Sections/AttendanceCard';
import AdminAttendanceCard from '../Sections/AdminAttendanceCard';
import Header from '../Sections/Header';
import {getDateAttendance} from '../controller/admin/dateAttendance';
import noAttendance from '../assets/noAttendance.json';
import LottieView from 'lottie-react-native';
import color from "../styles/globals"
import Loader from '../Sections/Loader';
import holiday from "../assets/holiday.json"
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalPresent, setTotalPresent] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getDateAttendance(date);
    
    if (res.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      if (selectedDate) {
        setDate(selectedDate);
      }
    } else {
      setShowPicker(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    }
    // Automatically fetch data when date is changed from modal 'Done' button
    if (event.type === 'set' && Platform.OS === 'ios') {
      // This is a proxy for the 'Done' button on iOS, as there's no direct way to capture it.
      // The fetch will happen when the user dismisses the picker.
    }
  };

  const handleIosPickerDone = () => {
    setShowModal(false);
    setShowPicker(false);
    fetchData(); // Fetch data when 'Done' is pressed
  };

  const renderDatePickerModal = () => {
    if (Platform.OS !== 'ios') return null;

    return (
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
            </View>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              style={styles.iosDatePicker}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleIosPickerDone}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Attendance" />
      {loading&&<Loader/>}
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={24} color="#555" />
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setShowModal(true);
                } else {
                  setShowPicker(true);
                }
              }}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>{date.toDateString().substring(4)}</Text>
            </TouchableOpacity>
            {Platform.OS === 'android' && showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          <TouchableOpacity onPress={fetchData}>
            <MaterialCommunityIcons name="refresh" size={30} color={color.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.headerRow}>
          <View style={styles.totalPresentContainer}>
            <MaterialCommunityIcons name="check-circle" size={24} color="green" />
            <Text style={styles.presentText}>
              {data.attendance ? data.attendance.length : 0} Present
            </Text>
          </View>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderDatePickerModal()}

      {data.isHoliday ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <LottieView style={{height: 150, width: 150}} source={holiday} autoPlay loop/>
          <Text style={{fontSize: 20, fontWeight: "bold"}}>There was holiday on this day</Text>
        </View>
      ) : (
        <FlatList
          data={data.attendance}
          keyExtractor={item => item.employeeCode}
          renderItem={({item}) => <AdminAttendanceCard item={item} />}
          ListEmptyComponent={() => (
            !loading && (
              <View style={styles.emptyContainer}>
                <LottieView style={{height: 150, width: 150}} source={noAttendance} autoPlay loop/>
                <Text>No attendance for the day</Text>
              </View>
            )
          )}
          contentContainerStyle={data.attendance?.length > 0 ? {} : {flex: 1}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC', // A lighter grey background
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    marginLeft: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  totalPresentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presentText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  refreshText: {
    fontSize: 16,
    fontWeight: 600,
    color: color.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
  },
  modalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  modalButton: {
    backgroundColor: color.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
  },
  iosDatePicker: {
    height: 200,
    width: '100%',
  },
});

export default AdminAttendance;
