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
  Modal,
  Linking,
  FlatList,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import Header from '../Sections/Header';
import color from "../styles/globals"
import { addEmployee, updateEmployee } from '../controller/admin/addEmployee';
import Loader from "../Sections/Loader"
import Toast from 'react-native-toast-message';

const screenHeight = Dimensions.get("window").height;

const InputField = ({ value, onChangeText, placeholder, icon, keyboardType = 'default', editable = true, required = false, label }) => (
  <View style={styles.inputContainer}>
    {label && (
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.requiredAsterisk}>*</Text>}
      </Text>
    )}
    <View style={styles.inputWrapper}>
      {icon && <Ionicons name={icon} size={20} color="#666" style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#aaa"
        editable={editable}
      />
    </View>
  </View>
);

const AdminAddEmployee = ({ route, navigation }) => {
  const { employee } = route.params || {};
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    designation: '',
    department: ''
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
      // Set form data for edit mode
      setForm({
        name: employee.name || '',
        phone: employee.phone || '',
        email: employee.email || '',
        designation: employee.designation || '',
        department: employee.department || ''
      });
    } else {
      // Reset form for add mode
      setForm({
        name: '',
        phone: '',
        email: '',
        designation: '',
        department: ''
      });
    }
  }, [employee, navigation]);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission denied',
          text2: 'Please grant contact permission in Settings to use this feature',
          position: 'top',
        });
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
      });

      if (!data || data.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No Contacts',
          text2: 'No contacts found on your device',
          position: 'top',
        });
        return;
      }

      // Sort contacts by name
      const sortedContacts = data
        .filter(contact => contact.name) // Filter out contacts without names
        .sort((a, b) => {
          const nameA = (a.name || '').trim();
          const nameB = (b.name || '').trim();
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
    
    if (contact.name) {
      updatedForm.name = contact.name;
    }
    
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const phone = contact.phoneNumbers[0].number;
      if (phone) {
        updatedForm.phone = phone.replace(/[\s-]/g, '');
      }
    }
    
    if (contact.emails && contact.emails.length > 0) {
      updatedForm.email = contact.emails[0].email;
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
          {item.name || 'No Name'}
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
    // Validation
    const requiredFields = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim()
    };

    const missingFields = [];
    
    if (!requiredFields.name) {
      missingFields.push('Name');
    }
    
    if (!requiredFields.phone) {
      missingFields.push('Phone');
    }
    
    if (!requiredFields.email) {
      missingFields.push('Email');
    }

    if (missingFields.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Required Fields Missing',
        text2: `Please fill all required fields: ${missingFields.join(', ')}`,
        position: 'top',
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requiredFields.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
      });
      return;
    }

    // Phone number validation (basic check for at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    const cleanPhone = requiredFields.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please enter a valid phone number (at least 10 digits)',
        position: 'top',
      });
      return;
    }

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
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
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
        onBackPress={() => navigation.goBack()}
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

        <Text style={styles.sectionTitle}>Contact Info</Text>
        <InputField
          label="Full Name"
          placeholder="Enter full name"
          icon="person-outline"
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
          required={true}
        />
        <InputField
          label="Phone Number"
          placeholder="Enter phone number"
          icon="call-outline"
          value={form.phone}
          onChangeText={(val) => handleChange('phone', val)}
          keyboardType="phone-pad"
          required={true}
        />
        <InputField
          label="Email Address"
          placeholder="Enter email"
          icon="mail-outline"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
          keyboardType="email-address"
          required={true}
        />

        <Text style={styles.sectionTitle}>Job Details</Text>
        <InputField
          label="Department"
          placeholder="Enter department"
          icon="business-outline"
          value={form.department}
          onChangeText={(val) => handleChange('department', val)}
        />
        {/* <InputField
          label="Designation"
          placeholder="Designation"
          icon="id-card-outline"
          value={form.designation}
          onChangeText={(val) => handleChange('designation', val)}
        /> */}

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
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#333',
    marginVertical: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: color.secondary,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 600,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.secondary,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  contactButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 600,
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
    fontWeight: 600,
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
    fontWeight: 600,
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
    fontWeight: 500,
    color: '#333',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    padding: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  requiredAsterisk: {
    color: 'red',
  },
});

export default AdminAddEmployee;
