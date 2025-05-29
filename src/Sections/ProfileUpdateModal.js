import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { updatePassword, updateProfile } from '../controller/user/updateProfile';
import Toast from 'react-native-toast-message';
import color from "../styles/globals"
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenHeight = Dimensions.get('window').height;

const ProfileUpdateModal = ({ visible, data, onClose }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (data) {
      
      setContactInfo({
        name: data.name || '',
        email: data.email || '',
        phoneNumber: String(data.phoneNumber) || '',
      });
    }
  }, [data, visible]);

  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const validatePassword = () => {
    let isValid = true;
    const errors = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };

    // Validate old password
    if (!passwordInfo.oldPassword) {
      errors.oldPassword = 'Old password is required';
      isValid = false;
    }

    // Validate new password
    if (!passwordInfo.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordInfo.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/[A-Z]/.test(passwordInfo.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/[a-z]/.test(passwordInfo.newPassword)) {
      errors.newPassword = 'Password must contain at least one lowercase letter';
      isValid = false;
    } else if (!/[0-9]/.test(passwordInfo.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
      isValid = false;
    }

    // Validate confirm password
    if (!passwordInfo.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUPdateProfile = async () => {
    const res = await updateProfile(contactInfo);
    if (res.success) {
      Toast.show({
        type: 'success',
        text1: res.data.message,
        position: 'top',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: res.data.message,
        position: 'top',
      });
    }
    onClose();
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    const res = await updatePassword(passwordInfo);
    if (res.success) {
      Toast.show({
        type: 'success',
        text1: res.data.message,
        position: 'top',
      });
      // Clear password fields after successful update
      setPasswordInfo({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordErrors({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: res.data.message,
        position: 'top',
      });
    }
    onClose();
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <Pressable
        style={[styles.tabButton, activeTab === 'contact' && styles.activeTab]}
        onPress={() => setActiveTab('contact')}
      >
        <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
          Contact Info
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tabButton, activeTab === 'password' && styles.activeTab]}
        onPress={() => setActiveTab('password')}
      >
        <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>
          Password
        </Text>
      </Pressable>
    </View>
  );

  const renderContactForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Update Contact Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={contactInfo.name}
        onChangeText={(text) => setContactInfo({ ...contactInfo, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={contactInfo.email}
        onChangeText={(text) => setContactInfo({ ...contactInfo, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={contactInfo.phoneNumber}
        onChangeText={(text) => setContactInfo({ ...contactInfo, phoneNumber: text })}
      />
      <TouchableOpacity onPress={handleUPdateProfile} style={styles.primaryButton}>
        <Text style={styles.buttonText}>Update Info</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Change Password</Text>
      
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, passwordErrors.oldPassword ? styles.inputError : null]}
          placeholder="Old Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisibility.oldPassword}
          value={passwordInfo.oldPassword}
          onChangeText={(text) => {
            setPasswordInfo({ ...passwordInfo, oldPassword: text });
            setPasswordErrors({ ...passwordErrors, oldPassword: '' });
          }}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => togglePasswordVisibility('oldPassword')}
        >
          <Icon 
            name={passwordVisibility.oldPassword ? "visibility" : "visibility-off"} 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>
        {passwordErrors.oldPassword ? (
          <Text style={styles.errorText}>{passwordErrors.oldPassword}</Text>
        ) : null}
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, passwordErrors.newPassword ? styles.inputError : null]}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisibility.newPassword}
          value={passwordInfo.newPassword}
          onChangeText={(text) => {
            setPasswordInfo({ ...passwordInfo, newPassword: text });
            setPasswordErrors({ ...passwordErrors, newPassword: '' });
          }}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => togglePasswordVisibility('newPassword')}
        >
          <Icon 
            name={passwordVisibility.newPassword ? "visibility" : "visibility-off"} 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>
        {passwordErrors.newPassword ? (
          <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
        ) : null}
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, passwordErrors.confirmNewPassword ? styles.inputError : null]}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisibility.confirmNewPassword}
          value={passwordInfo.confirmNewPassword}
          onChangeText={(text) => {
            setPasswordInfo({ ...passwordInfo, confirmNewPassword: text });
            setPasswordErrors({ ...passwordErrors, confirmNewPassword: '' });
          }}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => togglePasswordVisibility('confirmNewPassword')}
        >
          <Icon 
            name={passwordVisibility.confirmNewPassword ? "visibility" : "visibility-off"} 
            size={24} 
            color="#666"
          />
        </TouchableOpacity>
        {passwordErrors.confirmNewPassword ? (
          <Text style={styles.errorText}>{passwordErrors.confirmNewPassword}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={handleUpdatePassword} style={styles.successButton}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={color.primary} />
            </TouchableOpacity>
          </View>

          {renderTabs()}

          <ScrollView>
            {activeTab === 'contact' ? renderContactForm() : renderPasswordForm()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    color: color.primary,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  formContainer: {
    padding: 16,
    flex:1,
    flexDirection:"col",
    gap:15
  
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  passwordInputContainer: {
    position: 'relative',
    // marginBottom: 12,
  },
  passwordInput: {
    paddingRight: 50,
    height: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 13,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    height: 50,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: color.secondary,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: color.secondary,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileUpdateModal;
