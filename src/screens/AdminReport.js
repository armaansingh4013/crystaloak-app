import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from '@expo/vector-icons';
import Header from "../Sections/Header";
import color from "../styles/globals"
import { getEnabledEmployees, getReport } from "../controller/admin/report";
import Loader from "../Sections/Loader";
import Toast from "react-native-toast-message";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const AdminReport = () => {
  const [people, setPeople] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [dateError, setDateError] = useState("");
  const [peoples, setPeoples] = useState([])
  const [data, setData] = useState({})
  const [currentScrollDate, setCurrentScrollDate] = useState(null);
  const scrollViewRef = useRef(null);
  const targetRef = useRef(null);
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const res = await getEnabledEmployees()
      if (res.success) {
        setPeople(res.data)

      }
    }
    fetchData()
  }, [])

  const handleFetch = async () => {
    if(!selectedPerson){
      Toast.show ({
              type: 'error', 
              text1: 'Select an Employee First',
              position: 'top',
            });
      return
    }
    setLoading(true)
    const data = { employeeId: selectedPerson, startDate: startDate, endDate: endDate }
    const res = await getReport(data)
    if (res.success) {
      setData(res.data)
      const marks = {};
      res.data.dailyStatus.forEach((item) => {
        let color = "gray";
        if (item.status === "absent") color = "red";
        else if (item.status === "present") color = "green";
        else if (item.status === "holiday") color = "blue";

        marks[item.date] = {
          selected: true,
          selectedColor: color,
          marked: true
        };
      });
      setSelectedDates(marks);
      targetRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y, animated: true });
        },
        (error) => {
          console.error('measureLayout error:', error);
        }
      );
      if (res.data.dailyStatus) setCurrentScrollDate(res.data.dailyStatus[0].date);
    }
    setLoading(false)
  }

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

  const generatePDFContent = () => {
    const employee = people.find(p => p._id === selectedPerson);
    if (!employee || !data) return '';

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .subtitle { font-size: 18px; color: #666; }
            .info { margin: 20px 0; }
            .info-row { margin: 10px 0; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .summary-title { font-weight: bold; margin-bottom: 10px; }
            .summary-item { margin: 5px 0; }
            .calendar { margin-top: 20px; }
            .status-present { color: green; }
            .status-absent { color: red; }
            .status-holiday { color: blue; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Employee Report</div>
            <div class="subtitle">${startDate.toDateString()} to ${endDate.toDateString()}</div>
          </div>
          
          <div class="info">
            <div class="info-row"><strong>Employee Name:</strong> ${employee.name}</div>
            <div class="info-row"><strong>Employee Code:</strong> ${employee.employeeCode}</div>
            <div class="info-row"><strong>Department:</strong> ${employee.department}</div>
            <div class="info-row"><strong>Designation:</strong> ${employee.designation}</div>
          </div>

          <div class="summary">
            <div class="summary-title">Summary</div>
            <div class="summary-item">Total Days: ${data.summary?.totalDays || 0}</div>
            <div class="summary-item">Present Days: ${data.summary?.presentDays || 0}</div>
            <div class="summary-item">Absent Days: ${data.summary?.absentDays || 0}</div>
            <div class="summary-item">Holidays: ${data.summary?.holidayDays || 0}</div>
          </div>

          <div class="calendar">
            <div class="summary-title">Daily Status</div>
            ${data.dailyStatus?.map(day => `
              <div class="info-row">
                ${day.date}: 
                <span class="status-${day.status}">${day.status}</span>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    return html;
  };

  const handlePDFAction = async () => {
    if (!selectedPerson || !data.dailyStatus) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an employee and generate report first',
        position: 'top',
      });
      return;
    }

    try {
      // setLoading(true);
      const html = generatePDFContent();
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Report',
        UTI: 'public.pdf'
      });

    } catch (error) {
      console.error('PDF Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate or share PDF',
        position: 'top',
      });
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <Header 
        title="Report" 
        rightComponent={
          <TouchableOpacity 
            style={styles.pdfButton}
            onPress={handlePDFAction}
          >
            <Ionicons name="document-text" size={24} color="white" />
          </TouchableOpacity>
        }
      />
      {loading&&<Loader/>}
      <ScrollView ref={scrollViewRef} style={styles.container}>
        {/* <Text style={styles.h eading}>Report</Text> */}

        {/* Person Selector */}
        <Text style={styles.label}>Select Person</Text>
        <Dropdown
          data={people}
          search
          maxHeight={200}
          labelField="name"
          valueField="_id"
          placeholder="Select person"
          searchPlaceholder="Search..."
          value={selectedPerson}
          onChange={(item) => {
            setSelectedPerson(item._id);
          }}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
        />
        <View style={styles.dateRow}>

          {/* <View style={styles.dataBox}>
       <Text style={styles.label}>Start Date</Text>
     
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) handleDateChange("start", selectedDate);
          }}
        />
     
      </View>
<View style={styles.dataBox}>
      <Text style={styles.label}>End Date</Text>
     
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) handleDateChange("end", selectedDate);
          }}
        />
    
      </View> */}

          <View style={styles.dataBox}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateInput}
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
          </View>

          <View style={styles.dataBox}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.dateInput}
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
          </View>
          <TouchableOpacity onPress={handleFetch} style={styles.dataButton}><Text style={{ backgroundColor: color.primary, color: "white", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>GET</Text></TouchableOpacity>
        </View>
        {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

        {/* Info Boxes */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}><Text style={styles.text}>Total Days </Text> <Text style={styles.text}> {data.summary ? data.summary.totalDays : 0}</Text></View>
          <View style={styles.infoBox}><Text style={styles.text}>Absent Days </Text> <Text style={styles.text}> {data.summary ? data.summary.absentDays : 0}</Text></View>
          <View style={styles.infoBox}><Text style={styles.text}>Holiday </Text> <Text style={styles.text}>{data.summary ? data.summary.holidayDays : 0}</Text></View>
          <View style={styles.infoBox}><Text style={styles.text}>Present Days </Text> <Text style={styles.text}> {data.summary ? data.summary.presentDays : 0}</Text></View>
        </View>

        {/* Calendar */}
        <Text style={styles.subHeading}>Calendar - March 2025</Text>
        <View
          ref={targetRef}><Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            style={styles.calendar}
            current={data.dailyStatus ? data.dailyStatus[0].date : ""}

          /></View>
      </ScrollView>
    </>
  );
};

export default AdminReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 15
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  dateRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "evenly",
    width: "100%",

  },
  dataBox: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center"
  },
  dataButton: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",

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
    backgroundColor: color.secondary,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  text: {
    fontSize: 20,
    paddingVertical: 5,
    textAlign: "center",
  },
  subHeading: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  calendar: {
    marginVertical: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 5,
    borderColor: "#000",
    borderWidth: 1
  },
  pdfButton: {
    padding: 8,
    marginRight: 8,
  },
});
