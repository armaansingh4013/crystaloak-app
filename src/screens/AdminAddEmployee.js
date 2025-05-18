import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  PermissionsAndroid,
  Modal,
  Linking,
  FlatList,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from "../styles/globals"
import { addEmployee, updateEmployee } from '../controller/admin/addEmployee';
import Loader from "../Sections/Loader"
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';

const screenHeight = Dimensions.get("window").height;

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      {icon && <Ionicons name={icon} size={20} color="#666" style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#aaa"
      />
    </View>
  </View>
);

const AdminAddEmployee = ({ route, navigation }) => {
  const { employee } = route.params || {};
  const [form, setForm] = useState({
    name: employee?.name || '',
    phone: employee?.phone || '',
    email: employee?.email || '',
    designation: employee?.designation || '',
    department: employee?.department || ''
  });
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [sharePhone, setSharePhone] = useState(0);
  const [isEditMode, setIsEditMode] = useState(!!employee);

  useEffect(() => {
    if (employee) {
      navigation.setOptions({
        title: 'Edit Employee'
      });
    }
  }, [employee, navigation]);

  const loadContacts = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts to select employee details.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show({
            type: 'error',
            text1: 'Permission denied',
            text2: 'Please grant contact permission in Settings to use this feature',
            position: 'top',
          });
          return;
        }
      }

      // Add a small delay to ensure permissions are properly granted
      await new Promise(resolve => setTimeout(resolve, 500));

      const allContacts = await Contacts.getAll();
      
      if (!allContacts || allContacts.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No Contacts',
          text2: 'No contacts found on your device',
          position: 'top',
        });
        return;
      }

      // Sort contacts by name
      const sortedContacts = allContacts
        .filter(contact => contact.givenName || contact.familyName) // Filter out contacts without names
        .sort((a, b) => {
          const nameA = (a.givenName + ' ' + a.familyName).trim();
          const nameB = (b.givenName + ' ' + b.familyName).trim();
          return nameA.localeCompare(nameB);
        });

      if (sortedContacts.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No Valid Contacts',
          text2: 'No contacts with names found on your device',
          position: 'top',
        });
        return;
      }

      setContacts(sortedContacts);
      setShowContactModal(true);
    } catch (error) {
      console.error('Contact Loading Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error Loading Contacts',
        text2: 'Please check your permissions and try again',
        position: 'top',
      });
    }
  };

  const handleContactSelect = (contact) => {
    const updatedForm = { ...form };
    
    if (contact.givenName || contact.familyName) {
      updatedForm.name = `${contact.givenName || ''} ${contact.familyName || ''}`.trim();
    }
    
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      updatedForm.phone = contact.phoneNumbers[0].number;
    }
    
    if (contact.emailAddresses && contact.emailAddresses.length > 0) {
      updatedForm.email = contact.emailAddresses[0].email;
    }
    
    setForm(updatedForm);
    setShowContactModal(false);
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactSelect(item)}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>
          {`${item.givenName || ''} ${item.familyName || ''}`.trim() || 'No Name'}
        </Text>
        {item.phoneNumbers && item.phoneNumbers.length > 0 && (
          <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async() => {
    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await updateEmployee({
          id: employee.id,
          ...form
        });
      } else {
        res = await addEmployee(form);
      }
      
      if(res.success){
        setSharePhone(form.phone)
        setForm({
          name: '',
          phone: '',
          email: '',
          designation: '',
          department:''
        });
        setShowShareModal(true);
        Toast.show({
          type: 'success', 
          text1: isEditMode ? 'Employee Updated Successfully' : 'Employee Added Successfully',
          position: 'top',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error', 
          text1: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: isEditMode ? 'Failed to update employee' : 'Failed to add employee',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleWhatsAppShare = async () => {
    if (!sharePhone) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Phone number is required',
        position: 'top',
      });
      return;
    }

    try {
      // Clean the phone number - remove all non-digit characters
      const phoneNumber = sharePhone.replace(/\D/g, '');
      
      // Format the phone number for WhatsApp
      // Remove any leading zeros and add country code if not present
      let formattedNumber = phoneNumber;
      if (formattedNumber.startsWith('0')) {
        formattedNumber = formattedNumber.substring(1);
      }
      if (!formattedNumber.startsWith('91')) {
        formattedNumber = '91' + formattedNumber;
      }

      // Create the WhatsApp URL
      const whatsappUrl = `whatsapp://send?phone=${formattedNumber}`;
      
      // Try to open WhatsApp directly
      const supported = await Linking.canOpenURL(whatsappUrl);
      
      if (supported) {
        await Linking.openURL(whatsappUrl);
        setShowShareModal(false);
      } else {
        // Try alternative URL format
        const alternativeUrl = `https://wa.me/${formattedNumber}`;
        const alternativeSupported = await Linking.canOpenURL(alternativeUrl);
        
        if (alternativeSupported) {
          await Linking.openURL(alternativeUrl);
          setShowShareModal(false);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Could not open WhatsApp. Please make sure WhatsApp is installed.',
            position: 'top',
          });
        }
      }
    } catch (error) {
      console.error('WhatsApp Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not open WhatsApp. Please try again.',
        position: 'top',
      });
    }
  };

  const handleShare = async () => {
    try {
      const message = 'Join our team! Register Here: https://crystaloak.uk/app/register/xpowhuniohxmiwhfroi';
      const result = await Share.share({
        message: message,
        title: 'Join Crystal Oak',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          console.log('Shared with', result.activityType);
        } else {
          // Shared
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Share Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share link',
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.body}>
      {loading && <Loader message={isEditMode ? "Updating..." : "Submitting..."}/>}
      <Header 
        title={isEditMode ? "Edit Employee" : "Add Employee"} 
        rightComponent={
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.contactButton} 
          onPress={loadContacts}
        >
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Select from Contacts</Text>
        </TouchableOpacity>

        <InputField
          label="Name"
          icon="person-outline"
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
          placeholder="Enter full name"
        />
        <InputField
          label="Phone Number"
          icon="call-outline"
          value={form.phone}
          onChangeText={(val) => handleChange('phone', val)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
        <InputField
          label="Email"
          icon="mail-outline"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
          placeholder="Enter email"
          keyboardType="email-address"
        />
        <InputField
          label="Department"
          icon="briefcase-outline"
          value={form.department}
          onChangeText={(val) => handleChange('department', val)}
          placeholder="Enter department"
        />
        <InputField
          label="Designation"
          icon="briefcase-outline"
          value={form.designation}
          onChangeText={(val) => handleChange('designation', val)}
          placeholder="Enter designation"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isEditMode ? "Update" : "Submit"}</Text>
        </TouchableOpacity>

        <Modal
          visible={showContactModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowContactModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.contactModalContent}>
              <View style={styles.contactModalHeader}>
                <Text style={styles.contactModalTitle}>Select Contact</Text>
                <TouchableOpacity 
                  onPress={() => setShowContactModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={contacts}
                renderItem={renderContactItem}
                keyExtractor={(item) => item.recordID}
                style={styles.contactList}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showShareModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowShareModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Share on WhatsApp</Text>
              <Text style={styles.modalText}>
                Would you like to share this employee's details on WhatsApp?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setShowShareModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.whatsappButton]} 
                  onPress={handleWhatsAppShare}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                  <Text style={styles.modalButtonText}>Share on WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#d3d3d3',
    flexGrow: 1,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 5,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  button: {
    bottom:0,
    marginHorizontal:0,
    backgroundColor: color.secondary,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.secondary,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    height: '80%',
    overflow: 'hidden',
  },
  contactModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  contactList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
});

export default AdminAddEmployee;
