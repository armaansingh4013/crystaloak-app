import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AttendanceCard from "../Sections/AttendanceCard";

const AdminAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [totalPresent, setTotalPresent] = useState(0); // Placeholder value

  const data = [
    { date: "12", day: "MON", punchIn: "10:15 AM", punchOut: "07:18 AM" },
    { date: "13", day: "TUE", punchIn: "10:15 AM", punchOut: "07:18 AM" },
    { date: "14", day: "WED", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  ];

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text>Date:</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
            <Text>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <View style={styles.totalPresentContainer}>
          <Text>Total Present:</Text>
          <TextInput
            style={styles.totalPresentInput}
            value={String(totalPresent)}
            keyboardType="numeric"
            onChangeText={(text) => setTotalPresent(text)}
          />
        </View>
      </View>

      {/* Attendance List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => <AttendanceCard item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  header: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    backgroundColor: "#EAEAEA",
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  totalPresentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalPresentInput: {
    backgroundColor: "#EAEAEA",
    padding: 8,
    borderRadius: 5,
    width: 50,
    textAlign: "center",
    marginLeft: 5,
  },
});

export default AdminAttendance;
