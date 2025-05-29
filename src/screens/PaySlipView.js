import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Pressable,
  Dimensions,
  Share,
  ActivityIndicator,
  Image,
} from 'react-native';
import Header from '../Sections/Header';
import color from '../styles/globals';
import { getPaySlipData, updatePaySlipData } from '../controller/admin/payslip';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const PaySlipView = ({ route, navigation }) => {
  const { employeeId, payType, employeeData, startDate, endDate, companyAddress } = route.params;
  const [paySlipData, setPaySlipData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState('screen');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [data,setData] = useState({basicPay:0.00,totalPayments:0.00,incomeTax:0.00,nationalInsurance:0.00,employeePension:0.00,taxableGrossPay:0.00,employeeNIC:0.00,emloyeerNIC:0.00,employerPension:0.00,smpSpp:0.00})

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const scale = Math.min(screenWidth / 842, (screenHeight - 200) / 1191); // A4 dimensions

  const formatTodayDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    fetchPaySlipData();
  }, []);

  const fetchPaySlipData = async () => {
    try {
      const response = await getPaySlipData(employeeId, payType, startDate, endDate);
      console.log('====================================');
      console.log(employeeData,response);
      console.log('====================================');
      setData({...data,basicPay:response.details.ratePerDay?response.details.ratePerDay:response.details.ratePerHour,totalPayments:response.details.totalAmount||0})
      setPaySlipData(response);
      setEditedData(response);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      Alert.alert('Error', 'Failed to fetch pay slip data');
    }
  };

  const handleSave = async () => {
    try {
      // await updatePaySlipData(employeeId, editedData);
      setPaySlipData(editedData);
      // Update the data state with new values
      setData({
        ...data,
        basicPay: editedData.details?.ratePerDay || editedData.details?.ratePerHour || 0.00,
        totalPayments: editedData.details?.totalAmount || 0.00,
        incomeTax: editedData.incomeTax || 0.00,
        nationalInsurance: editedData.nationalInsurance || 0.00,
        employeePension: editedData.employeePension || 0.00,
        taxableGrossPay: editedData.taxableGrossPay || 0.00,
        employeeNIC: editedData.employeeNIC || 0.00,
        emloyeerNIC: editedData.emloyeerNIC || 0.00,
        employerPension: editedData.employerPension || 0.00,
        smpSpp: editedData.smpSpp || 0.00
      });
      setShowEditModal(false);
      Alert.alert('Success', 'Pay slip updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update pay slip');
    }
  };

  const handleExportPDF = async () => {
    try {
      // TODO: Implement PDF export functionality
      Alert.alert(
        'Export PDF',
        'PDF export functionality will be implemented here',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  const handleSharePDF = async () => {
    try {
      // TODO: Implement PDF generation and sharing
      const result = await Share.share({
        message: 'Pay Slip PDF will be shared here',
        title: 'Pay Slip',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share PDF');
    }
  };

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                width: 842px;
                height: 1191px;
                border: 2px solid #0000cc;
              }
              .header-row {
                background-color: #0000cc;
                color: white;
                padding: 12px;
                margin-bottom: 2px;
                display: flex;
              }
              .header-cell {
                flex: 1;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
              }
              .right-aligned-cell {
                flex: 1;
                text-align: right;
                font-size: 14px;
                padding: 0 8px;
              }
              .right-aligned-bold-cell {
                flex: 1;
                text-align: right;
                font-weight: bold;
                font-size: 14px;
                padding: 0 8px;
              }
              .right-aligned-header {
                flex: 1;
                text-align: right;
                font-weight: bold;
                font-size: 14px;
              }
              .row {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
              }
              .cell {
                flex: 1;
                font-size: 14px;
                padding: 0 8px;
              }
              .bold-cell {
                flex: 1;
                font-weight: bold;
                font-size: 14px;
                padding: 0 8px;
              }
              .sub-header {
                background-color: #0000cc;
                color: white;
                padding: 12px;
                margin-top: 15px;
                margin-bottom: 2px;
                display: flex;
              }
              .sub-header-cell {
                flex: 1;
                font-weight: bold;
                font-size: 14px;
              }
              .half-column {
                flex: 1;
                padding: 12px;
              }
              .comment-box {
                padding: 15px;
                border: 1px solid #ccc;
                margin-top: 15px;
                background-color: #f9f9f9;
              }
              .footer {
                display: flex;
                border-top: 1px solid #000;
                margin-top: 30px;
                padding: 15px 0;
              }
              .net-pay {
                font-weight: bold;
                font-size: 18px;
                text-align: right;
              }
              .first-column {
                width: 20%;
                font-size: 14px;
                padding: 0 8px;
              }
              .second-column {
                width: 10%;
                font-size: 14px;
                padding: 0 8px;
              }
              .third-column {
                width: 10%;
                font-size: 14px;
                padding: 0 8px;
              }
              .fourth-column {
                width: 10%;
                font-size: 14px;
                padding: 0 8px;
              }
              .fifth-column {
                width: 20%;
                font-size: 14px;
                padding: 0 8px;
              }
              .sixth-column {
                width: 20%;
                font-size: 14px;
                padding: 0 8px;
                text-align: right;
              }
            </style>
          </head>
          <body>
            <div class="header-row">
              <div class="header-cell">Works No</div>
              <div class="header-cell">Employee</div>
              <div class="header-cell">Department</div>
              <div class="header-cell">Date</div>
              <div class="header-cell">National Insurance No.</div>
            </div>
            <div class="row">
              <div class="cell">${employeeData.employeeCode}</div>
              <div class="cell">${employeeData.name}</div>
              <div class="cell"></div>
              <div class="cell">${formatTodayDate()}</div>
              <div class="cell">${employeeData.insuranceNumber || ""}</div>
            </div>

            <div class="sub-header">
              <div class="sub-header-cell">Payments</div>
              <div class="sub-header-cell">Units</div>
              <div class="sub-header-cell">Rate</div>
              <div class="sub-header-cell">Amount</div>
              <div class="sub-header-cell">Deductions</div>
              <div class="right-aligned-header">Amount</div>
            </div>

            <div class="row">
              <div class="first-column">Basic Pay</div>
              <div class="second-column"></div>
              <div class="third-column"></div>
              <div class="fourth-column">£${data.basicPay}</div>
              <div class="fifth-column">Income Tax</div>
              <div class="sixth-column">£${data.incomeTax}</div>
            </div>
            <div class="row">
              <div class="first-column" style="font-weight: bold;">Total Payments</div>
              <div class="second-column"></div>
              <div class="third-column"></div>
              <div class="fourth-column" style="font-weight: bold;">£${data.totalPayments}</div>
              <div class="fifth-column">National Insurance</div>
              <div class="sixth-column">£${data.nationalInsurance}</div>
            </div>
            <div class="row">
              <div class="first-column"></div>
              <div class="second-column"></div>
              <div class="third-column"></div>
              <div class="fourth-column"></div>
              <div class="fifth-column">Employee Pension</div>
              <div class="sixth-column">£${data.employeePension}</div>
            </div>
            <div class="row">
              <div class="first-column"></div>
              <div class="second-column"></div>
              <div class="third-column"></div>
              <div class="fourth-column"></div>
              <div class="fifth-column" style="font-weight: bold;">Total Deductions</div>
              <div class="sixth-column" style="font-weight: bold;">£${data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension}</div>
            </div>

            <div class="sub-header">
              <div class="sub-header-cell">Totals This Period</div>
              <div class="sub-header-cell"></div>
              <div class="sub-header-cell"></div>
              <div class="sub-header-cell"></div>
              <div class="sub-header-cell">Totals Year To Date</div>
              <div class="right-aligned-header">Amount</div>
            </div>
            <div class="row">
              <View style={styles.halfColumn}>
                <Text>Total Payments: £{data.totalPayments}</Text>
                <Text>Total Deductions: £{data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension}</Text>
              </View>
              <View style={[styles.halfColumn, {flex: 2}]}>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Taxable Gross Pay:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.taxableGrossPay}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Income Tax:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.incomeTax}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Employee NIC:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.employeeNIC}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Employer NIC:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.emloyeerNIC}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>SMP/SPP:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.smpSpp}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Employee Pension:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.employeePension}</Text>
                </View>
                <View style={styles.yearToDateRow}>
                  <Text style={styles.yearToDateLabel}>Employer Pension:</Text>
                  <Text style={styles.rightAlignedCell}>£{data.employerPension}</Text>
                </View>
              </View>
            </div>

            <div class="sub-header">
              <div class="sub-header-cell">Comments</div>
            </div>
            <div class="comment-box">
              <div style="font-weight: bold;">${employeeData.name}</div>
              <div>${employeeData.address}</div>
              <div>Payment Method: BACS</div>
            </div>

            <div class="footer">
              <div class="half-column">
                <div style="font-weight: bold;">Crystal Oak Constructions Ltd</div>
                <div style="font-weight: bold;">${companyAddress}</div>
                <div style="font-weight: bold;">Tel: +44 1895854444 | Mobile: +44 7970054444</div>
                <div style="font-weight: bold;">Email: crystaloakwork@outlook.com</div>
              </div>
              <div class="half-column">
                <div class="net-pay">NET PAY £${data.totalPayments-(data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension)}</div>
              </div>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 842, // A4 width in points
        height: 1191, // A4 height in points
      });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Pay Slip',
        UTI: 'com.adobe.pdf'
      });

      // Clean up the temporary file
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <Pressable
        style={[styles.tabButton, activeTab === 'screen' && styles.activeTab]}
        onPress={() => setActiveTab('screen')}
      >
        <Text style={[styles.tabText, activeTab === 'screen' && styles.activeTabText]}>
          Screen View
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tabButton, activeTab === 'print' && styles.activeTab]}
        onPress={() => setActiveTab('print')}
      >
        <Text style={[styles.tabText, activeTab === 'print' && styles.activeTabText]}>
          Print View
        </Text>
      </Pressable>
    </View>
  );

  const renderPaySlipContent = () => (
    <View style={[
      styles.paySlipContent,
      activeTab === 'screen' && styles.screenPaySlipContent,
      activeTab === 'print' && {
        transform: [{ scale }],
        width: 842,
        height: 1191,
        margin: 0,
        padding: 20,
      }
    ]}>
      <View style={styles.paySlipInnerContent}>
        {/* Letterhead */}
        <View style={styles.letterhead}>
          <Image 
            source={require('../assets/DarkLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.companyInfo}>
            <Text style={[styles.companyName,{fontWeight:"bold"}]}>Crystal Oak Constructions Ltd</Text>
            <Text style={styles.companyAddress}>{companyAddress}</Text>
            <Text style={styles.companyContact}>Tel: +44 1895854444 | Mobile: +44 7970054444</Text>
            <Text style={styles.companyContact}>Email: crystaloakwork@outlook.com</Text>
          </View>
        </View>

        {/* Header Row */}
        <View style={styles.rowHeader}>
          <Text style={[styles.headerCell, {width: '12%'}]}>Works No</Text>
          <Text style={[styles.headerCell, {width: '20%'}]}>Employee</Text>
          <Text style={[styles.headerCell, {width: '20%'}]}>Department</Text>
          <Text style={[styles.headerCell, {width: '18%'}]}>Date</Text>
          <Text style={[styles.headerCell, {width: '30%',paddingHorizontal: 2}]}>National Insurance No.</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.cell, {textAlign: 'center', fontWeight: 'bold',width: '20%'}]}>{employeeData.employeeCode}</Text>
          <Text style={[styles.cell, {textAlign: 'center', fontWeight: 'bold',width: '20%'}]}>{employeeData.name}</Text>
          <Text style={[styles.cell, {textAlign: 'center', fontWeight: 'bold',width: '20%'}]}>{employeeData.department}</Text>
          <Text style={[styles.cell, {textAlign: 'center', fontWeight: 'bold',width: '20%'}]}>{formatTodayDate()}</Text>
          <Text style={[styles.cell, {textAlign: 'center', fontWeight: 'bold',width: '20%'}]}>{employeeData.insuranceNumber || ""}</Text>
        </View>

        {/* Payments and Deductions */}
        <View style={styles.sectionContainer}>
          <View style={styles.leftSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.headerText, {color: 'white'}]}>Payments</Text>
              <Text style={[styles.headerText, {color: 'white'}]}>Units</Text>
              <Text style={[styles.headerText, {color: 'white'}]}>Rate</Text>
              <Text style={[styles.headerText, {color: 'white'}]}>Amount</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Basic Pay</Text>
              <Text style={styles.paymentUnit}></Text>
              <Text style={styles.paymentRate}></Text>
              <Text style={styles.paymentAmount}>£{data.basicPay}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, styles.bold]}>Total Payments</Text>
              <Text style={styles.paymentUnit}></Text>
              <Text style={styles.paymentRate}></Text>
              <Text style={[styles.paymentAmount, styles.bold]}>£{data.totalPayments}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.headerText, {color: 'white'}]}>Deductions</Text>
              <Text style={[styles.headerText, {color: 'white'}]}>Amount</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Income Tax</Text>
              <Text style={styles.deductionAmount}>£{data.incomeTax}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>National Insurance</Text>
              <Text style={styles.deductionAmount}>£{data.nationalInsurance}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={styles.deductionLabel}>Employee Pension</Text>
              <Text style={styles.deductionAmount}>£{data.employeePension}</Text>
            </View>
            <View style={styles.deductionRow}>
              <Text style={[styles.deductionLabel, styles.bold]}>Total Deductions</Text>
              <Text style={[styles.deductionAmount, styles.bold]}>£{data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension}</Text>
            </View>
          </View>
        </View>

        {/* Totals and Year to Date Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.leftSection}>
            {/* Totals Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.headerText, {color: 'white'}]}>Totals This Period</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Total Payments:</Text>
              <Text style={styles.totalAmount}>£{data.totalPayments}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Total Deductions:</Text>
              <Text style={styles.totalAmount}>£{data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension}</Text>
            </View>

            {/* Comments Section */}
            <View style={styles.commentSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.headerText, {color: 'white'}]}>Comments</Text>
              </View>
              <View style={styles.commentBox}>
                <Text style={styles.bold}>heres the comment came </Text>
             
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.addressSection}>
              
            <Text style={styles.bold}>{employeeData.name}</Text>
          <Text>{employeeData.address}</Text>
          <Text>Payment Method: BACS</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.headerText, {color: 'white'}]}> Totals Year To Date</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Taxable Gross Pay:</Text>
              <Text style={styles.yearToDateAmount}>£{data.taxableGrossPay}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Income Tax:</Text>
              <Text style={styles.yearToDateAmount}>£{data.incomeTax}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Employee NIC:</Text>
              <Text style={styles.yearToDateAmount}>£{data.employeeNIC}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Employer NIC:</Text>
              <Text style={styles.yearToDateAmount}>£{data.emloyeerNIC}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>SMP/SPP:</Text>
              <Text style={styles.yearToDateAmount}>£{data.smpSpp}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Employee Pension:</Text>
              <Text style={styles.yearToDateAmount}>£{data.employeePension}</Text>
            </View>
            <View style={styles.yearToDateRow}>
              <Text style={styles.yearToDateLabel}>Employer Pension:</Text>
              <Text style={styles.yearToDateAmount}>£{data.employerPension}</Text>
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.leftHalfColumn}>
            <Text style={styles.bold}>Crystal Oak Constructions Ltd</Text>
            <Text style={styles.bold}>{companyAddress}</Text>
            <Text style={styles.bold}>Tel: +44 1895854444 | Mobile: +44 7970054444</Text>
            <Text style={styles.bold}>Email: crystaloakwork@outlook.com</Text>
          </View>
          <View style={styles.rightHalfColumn}>
            <Text style={styles.netPay}>NET PAY £{data.totalPayments-(data.incomeTax+data.employeeNIC+data.nationalInsurance+data.employeePension)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity
        style={[styles.headerButton]}
        onPress={generatePDF}
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons name="share-outline" size={24} color="#fff" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.headerButton, styles.editButton]}
        onPress={() => setShowEditModal(true)}
      >
        <Text style={styles.editButtonText}><Ionicons name="pencil" size={24} color="#fff" /></Text>
      </TouchableOpacity>
    </View>
  );

  if (!paySlipData) {
    return (
      <View style={styles.container}>
        <Header title="Pay Slip" />
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Pay Slip" 
        onBackPress={() => navigation.goBack()} 
        rightComponent={renderHeaderRight()}
      />
      
      {renderTabs()}

      {activeTab === 'screen' ? (
        <ScrollView 
          style={styles.screenView}
          contentContainerStyle={styles.screenViewContent}
        >
          {renderPaySlipContent()}
        </ScrollView>
      ) : (
        <View style={styles.printView}>
          <View style={styles.printContentContainer}>
            {renderPaySlipContent()}
          </View>
        </View>
      )}

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Pay Slip</Text>
            
            <Text style={styles.inputLabel}>Basic Pay</Text>
            <TextInput
              style={styles.input}
              value={editedData.details?.ratePerDay?.toString() || editedData.details?.ratePerHour?.toString()}
              onChangeText={(text) => setEditedData({
                ...editedData,
                details: {
                  ...editedData.details,
                  [payType === 'hourly' ? 'ratePerHour' : 'ratePerDay']: text
                }
              })}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Total Payments</Text>
            <TextInput
              style={styles.input}
              value={editedData.details?.totalAmount?.toString()}
              onChangeText={(text) => setEditedData({
                ...editedData,
                details: {
                  ...editedData.details,
                  totalAmount: text
                }
              })}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Income Tax</Text>
            <TextInput
              style={styles.input}
              value={editedData.incomeTax?.toString()}
              onChangeText={(text) => setEditedData({...editedData, incomeTax: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>National Insurance</Text>
            <TextInput
              style={styles.input}
              value={editedData.nationalInsurance?.toString()}
              onChangeText={(text) => setEditedData({...editedData, nationalInsurance: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Employee Pension</Text>
            <TextInput
              style={styles.input}
              value={editedData.employeePension?.toString()}
              onChangeText={(text) => setEditedData({...editedData, employeePension: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Taxable Gross Pay</Text>
            <TextInput
              style={styles.input}
              value={editedData.taxableGrossPay?.toString()}
              onChangeText={(text) => setEditedData({...editedData, taxableGrossPay: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Employee NIC</Text>
            <TextInput
              style={styles.input}
              value={editedData.employeeNIC?.toString()}
              onChangeText={(text) => setEditedData({...editedData, employeeNIC: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Employer NIC</Text>
            <TextInput
              style={styles.input}
              value={editedData.emloyeerNIC?.toString()}
              onChangeText={(text) => setEditedData({...editedData, emloyeerNIC: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Employer Pension</Text>
            <TextInput
              style={styles.input}
              value={editedData.employerPension?.toString()}
              onChangeText={(text) => setEditedData({...editedData, employerPension: text})}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>SMP/SPP</Text>
            <TextInput
              style={styles.input}
              value={editedData.smpSpp?.toString()}
              onChangeText={(text) => setEditedData({...editedData, smpSpp: text})}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerScrollView: {
    flex: 1,
  },
  innerScrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  printContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paySlipContent: {
    width: 842, // A4 width in points (72 DPI)
    minHeight: 1191, // A4 height in points (72 DPI)
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paySlipInnerContent: {
    flex: 1,
    borderWidth: 2,
    borderColor: color.primary,
  },
  screenView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenViewContent: {
    padding: 10,
  },
  screenPaySlipContent: {
    width: '100%',
    padding: 10,
    margin: 0,
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: color.primary,
    padding: 1,
    marginBottom: 2,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    borderRightWidth: 2,
    borderRightColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  firstColumn: {
    width: '20%',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  secondColumn: {
    width: '13%',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  thirdColumn: {
    width: '12%',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  fourthColumn: {
    width: '15%',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  fifthColumn: {
    width: '20%',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sixthColumn: {
    width: '20%',
    fontSize: 14,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  yearToDateCell: {
    flex: 1.5,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  rightAlignedCell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  boldCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  rightAlignedBoldCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  subHeaderRow: {
    backgroundColor: '#0000cc',
    paddingVertical: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  paymentLabel: {
    fontSize: 14,
    width: '35%',
  },
  paymentUnit: {
    fontSize: 14,
    width: '10%',
    textAlign: 'center',
  },
  paymentRate: {
    fontSize: 14,
    width: '10%',
    textAlign: 'center',
  },
  paymentAmount: {
    fontSize: 14,
    width: '25%',
    textAlign: 'right',
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  deductionLabel: {
    fontSize: 14,
    width: '65%',
  },
  deductionAmount: {
    fontSize: 14,
    width: '35%',
    textAlign: 'right',
  },
  subHeader: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rightAlignedSubHeader: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'right',
  },
  rightHalfColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: color.primary,
  },
  leftHalfColumn: {
    width: '60%',
    padding: 12,
    borderRightWidth: 1,
  },
  commentBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.primary,
  },
  netPay: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: color.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: color.primary,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: color.primary,
  },
  activeTabText: {
    color: color.primary,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerButton: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
 
  yearToDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  yearToDateLabel: {
    fontSize: 14,
    width: '65%',
  },
  yearToDateAmount: {
    fontSize: 14,
    width: '35%',
    textAlign: 'right',
  },
  sectionContainer: {
    flexDirection: 'row',
  },
  leftSection: {
    width: '60%',
  },
  rightSection: {
    width: '40%',
    borderLeftWidth: 1,
    borderLeftColor: color.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: color.primary,
    padding: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  paymentLabel: {
    fontSize: 14,
    width: '40%',
  },
  paymentAmount: {
    fontSize: 14,
    textAlign: 'right',
    width: '30%',
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  deductionLabel: {
    fontSize: 14,
    width: '70%',
  },
  deductionAmount: {
    fontSize: 14,
    textAlign: 'right',
    width: '30%',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  totalLabel: {
    fontSize: 14,
    width: '65%',
  },
  totalAmount: {
    fontSize: 14,
    width: '35%',
    textAlign: 'right',
  },
  commentSection: {
    borderBottomWidth: 1,
    borderBottomColor: color.primary,
  },
  addressSection: {
    padding: 15,
  },
  letterhead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.primary,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginStart: 60,

  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 5,
    textAlign: "center"
  },
  companyAddress: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textAlign: "center"
  },
  companyContact: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    textAlign: "center"
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    multiline: true,
    numberOfLines: 4,
  },
});

export default PaySlipView; 