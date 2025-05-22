import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
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
  const [date, setDate] = useState (new Date ());
  const [showPicker, setShowPicker] = useState (false);
  const [totalPresent, setTotalPresent] = useState (0); // Placeholder value
  const [data, setData] = useState ([]);
  const [loading,setLoading] = useState(false)
  useEffect (() => {
    fetchData ();
  }, []);
  const fetchData = async () => {
    setLoading(true)
    const res = await getDateAttendance (date);
    
    if (res.success) {
      setData (res.data);
    }
    setLoading(false)
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker (false);
    if (selectedDate) {
      setDate (selectedDate);
    }
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
            onPress={() => setShowPicker (true)}
            style={styles.dateInput}
          >
            <Text>{date.toDateString ()}</Text>
          </TouchableOpacity>
          {showPicker &&
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />}
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
      {data.isHoliday?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            
          <LottieView style={{height: 150, width: 150}} source={holiday} autoPlay loop/>
<Text style={{fontSize:20,fontWeight:"bold"}}>There was holiday on this day</Text>
          </View>:<>
      {!data.attendance ||
        (data.attendance.length == 0 &&
          <View
            style={{
              height: '100%',
              width: '100%',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LottieView style={{height: 150, width: 150}} source={noAttendance} autoPlay loop/>
            <Text>No attendance for the day</Text>
          </View>)}
      {/* Attendance List */}
      {data.attendance &&
        <FlatList
          data={data.attendance}
          keyExtractor={item => item.employeeCode}
          renderItem={({item}) => <AdminAttendanceCard item={item} />}
        />}</>}
    </View>
  );
};

const styles = StyleSheet.create ({
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
});

export default AdminAttendance;
