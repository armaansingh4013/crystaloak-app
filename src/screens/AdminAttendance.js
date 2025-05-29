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
                onPress={() => {
                  setShowModal(false);
                  setShowPicker(false);
                }}
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
        <View style={styles.dateContainer}>
          <Text>Date:</Text>
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
            <Text>{date.toDateString()}</Text>
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

        <View style={styles.totalPresentContainer}>
          <Text>
            Total Present: {data.attendance ? data.attendance.length : 0}
          </Text>
        </View>

        <TouchableOpacity
          onPress={fetchData}
          style={{
            ...styles.totalPresentContainer,
            backgroundColor: color.secondary,
            padding: 8,
            borderRadius: 10,
          }}
        >
          <Text>GET</Text>
        </TouchableOpacity>
      </View>

      {renderDatePickerModal()}

      {data.isHoliday ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <LottieView style={{height: 150, width: 150}} source={holiday} autoPlay loop/>
          <Text style={{fontSize: 20, fontWeight: "bold"}}>There was holiday on this day</Text>
        </View>
      ) : (
        <>
          {!data.attendance || data.attendance.length == 0 ? (
            <View style={{
              height: '100%',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <LottieView style={{height: 150, width: 150}} source={noAttendance} autoPlay loop/>
              <Text>No attendance for the day</Text>
            </View>
          ) : (
            <FlatList
              data={data.attendance}
              keyExtractor={item => item.employeeCode}
              renderItem={({item}) => <AdminAttendanceCard item={item} />}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    backgroundColor: '#EAEAEA',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  totalPresentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalPresentInput: {
    backgroundColor: '#EAEAEA',
    padding: 8,
    borderRadius: 5,
    width: 50,
    textAlign: 'center',
    marginLeft: 5,
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
    fontWeight: '600',
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
    fontWeight: '600',
  },
  iosDatePicker: {
    height: 200,
    width: '100%',
  },
});

export default AdminAttendance;
