import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";

const AdminReport = () => {
  const people = [
    { label: "John Doe", value: "john" },
    { label: "Armaan", value: "armaan" },
    { label: "Jane Smith", value: "jane" },
    { label: "Max", value: "max" },
    { label: "Charlie", value: "charlie" },
  ];

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [dateError, setDateError] = useState("");

  const handleDayPress = (day) => {
    setSelectedDates((prev) => ({
      ...prev,
      [day.dateString]: {
        selected: true,
        marked: true,
        selectedColor: "#2196F3",
      },
    }));
  };

  const handleDateChange = (type, selectedDate) => {
    if (!selectedDate) return;

    if (type === "start") {
      if (selectedDate > endDate) {
        setDateError("Start date cannot be after end date");
        return;
      }
      setDateError("");
      setStartDate(selectedDate);
    } else {
      if (selectedDate < startDate) {
        setDateError("End date cannot be before start date");
        return;
      }
      setDateError("");
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report</Text>

      {/* Person Selector */}
      <Text style={styles.label}>Select Person</Text>
      <Dropdown
        data={people}
        search
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder="Select person"
        searchPlaceholder="Search..."
        value={selectedPerson}
        onChange={(item) => {
          setSelectedPerson(item.value);
        }}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />

      {/* Date Pickers */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowStartPicker(true)}
      >
        <Text>{startDate.toDateString()}</Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) handleDateChange("start", selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setShowEndPicker(true)}
      >
        <Text>{endDate.toDateString()}</Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) handleDateChange("end", selectedDate);
          }}
        />
      )}

      {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

      {/* Info Boxes */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}><Text>Total Days: 25</Text></View>
        <View style={styles.infoBox}><Text>Absent Days: 2</Text></View>
        <View style={styles.infoBox}><Text>Holiday: 3</Text></View>
        <View style={styles.infoBox}><Text>Total Work: 152h</Text></View>
      </View>

      {/* Calendar */}
      <Text style={styles.subHeading}>Calendar - March 2025</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        style={styles.calendar}
      />
    </View>
  );
};

export default AdminReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
    color: "#333",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  subHeading: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  calendar: {
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
});
