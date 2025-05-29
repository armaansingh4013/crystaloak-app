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
  Modal,
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
import * as FileSystem from 'expo-file-system';

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
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

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

  const generatePDFContent = async () => {
    const employee = people.find(p => p._id === selectedPerson);
    if (!employee || !data) return '';

    // Convert logo to base64
    const logoPath = require('../assets/DarkLogo.png');
    // const logoBase64 = await FileSystem.readAsStringAsync(logoPath, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });

    const formatTime = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    };

    const calculateHoursOfShift = (checkIn, checkOut) => {
      if (!checkIn || !checkOut) return '-';
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffMs = end - start;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHrs}h ${diffMins}m`;
    };

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .letterhead {
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .company-logo {
              width: 120px;
              height: auto;
            }
            .company-info {
              text-align: right;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 0;
            }
            .company-contact {
              font-size: 12px;
              color: #666;
              margin: 5px 0;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .subtitle { font-size: 18px; color: #666; }
            .info { margin: 20px 0; display: flex; justify-content: space-between; }
            .info-details { flex: 1; }
            .info-photo { width: 100px; margin-left: 20px; }
            .info-photo img { width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd; }
            .info-row { margin: 10px 0; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .summary-row { display: flex; justify-content: space-between; }
            .summary-item { flex: 1; text-align: center; padding: 10px; }
            .summary-title { font-weight: bold; margin-bottom: 10px; }
            .table-container { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .status-present { color: green; }
            .status-absent { color: red; }
            .status-holiday { color: blue; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <img src="data:image/png;base64,${logoPath}" alt="Crystal Oak Logo" class="company-logo" />
            <div class="company-info">
              <h1 class="company-name">Crystal Oak Constructions</h1>
              <p class="company-contact">
                +44 1895854444<br>
                +44 7970054444<br>
                crystaloakwork@outlook.com
              </p>
            </div>
          </div>

          <div class="header">
            <div class="title">Employee Report</div>
            <div class="subtitle">${startDate.toDateString()} to ${endDate.toDateString()}</div>
          </div>
          
          <div class="info">
            <div class="info-details">
              <div class="info-row"><strong>Employee Name:</strong> ${employee.name}</div>
              <div class="info-row"><strong>Employee Code:</strong> ${employee.employeeCode}</div>
              <div class="info-row"><strong>Department:</strong> ${employee.department}</div>
              <div class="info-row"><strong>Designation:</strong> ${employee.designation}</div>
            </div>
            <div class="info-photo">
              <img src="${employee.profileImage?.imageUrl || 'https://via.placeholder.com/150'}" alt="Employee Photo" />
            </div>
          </div>

          <div class="summary">
            <div class="summary-title">Summary</div>
            <div class="summary-row">
              <div class="summary-item">
                <strong>Total Days</strong><br>
                ${data.summary?.totalDays || 0}
              </div>
              <div class="summary-item">
                <strong>Present Days</strong><br>
                ${data.summary?.presentDays || 0}
              </div>
              <div class="summary-item">
                <strong>Absent Days</strong><br>
                ${data.summary?.absentDays || 0}
              </div>
              <div class="summary-item">
                <strong>Holidays</strong><br>
                ${data.summary?.holidayDays || 0}
              </div>
            </div>
          </div>

          <div class="table-container">
            <div class="summary-title">Daily Status Details</div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Remark</th>
                  <th>Hours of Shift</th>
                </tr>
              </thead>
              <tbody>
                ${data.dailyStatus?.map(day => `
                  <tr>
                    <td>${day.date}</td>
                    <td class="status-${day.status}">${day.status}</td>
                    <td>${formatTime(day.checkIn)}</td>
                    <td>${formatTime(day.checkOut)}</td>
                    <td>${day.holidayDescription || day.shift || '-'}</td>
                    <td>${calculateHoursOfShift(day.checkIn, day.checkOut)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
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
      const html = await generatePDFContent();
      
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

  const renderDatePickerModal = (isStart) => {
    if (Platform.OS !== 'ios') return null;

    return (
      <Modal
        visible={isStart ? showStartModal : showEndModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isStart ? 'Select Start Date' : 'Select End Date'}
              </Text>
            </View>
            <DateTimePicker
              value={isStart ? startDate : endDate}
              mode="date"
              display="spinner"
              onChange={(e, selectedDate) => {
                if (selectedDate) {
                  handleDateChange(isStart ? "start" : "end", selectedDate);
                }
              }}
              style={styles.iosDatePicker}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  if (isStart) {
                    setShowStartModal(false);
                    setShowStartPicker(false);
                  } else {
                    setShowEndModal(false);
                    setShowEndPicker(false);
                  }
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
          <View style={styles.dataBox}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setShowStartModal(true);
                } else {
                  setShowStartPicker(true);
                }
              }}
              style={styles.dateInput}
            >
              <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {Platform.OS === 'android' && showStartPicker && (
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
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setShowEndModal(true);
                } else {
                  setShowEndPicker(true);
                }
              }}
              style={styles.dateInput}
            >
              <Text>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            {Platform.OS === 'android' && showEndPicker && (
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
          <TouchableOpacity onPress={handleFetch} style={styles.dataButton}>
            <Text style={{ backgroundColor: color.primary, color: "white", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>GET</Text>
          </TouchableOpacity>
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
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'green' }]} />
            <Text style={styles.legendText}>Present</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'blue' }]} />
            <Text style={styles.legendText}>Holiday</Text>
          </View>
        </View>

        <View
          ref={targetRef}><Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            style={styles.calendar}
            current={data.dailyStatus ? data.dailyStatus[0].date : ""}

          /></View>
      </ScrollView>
      {renderDatePickerModal(true)}
      {renderDatePickerModal(false)}
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  iosButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  iosButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: color.primary,
    borderRadius: 8,
  },
  iosButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: color.primary,
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
