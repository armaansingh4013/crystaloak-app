import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Clipboard,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from "../styles/globals";
import { updateEmployee, resetEmployeePassword } from '../controller/admin/employees';
import Toast from 'react-native-toast-message';
import Loader from '../Sections/Loader';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import uploadPhotos from '../controller/photos';
import { updateProfile } from '../controller/user/updateProfile';

const AdminEditEmployee = ({ route, navigation }) => {
  const { employee } = route.params;
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageType, setCurrentImageType] = useState(null); // 'profile' or 'passport'
  const [isEnabled, setIsEnabled] = useState(employee.isEnabled);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: employee.name,
    phoneNumber: String(employee.phoneNumber),
    email: employee.email,
    department: employee.department,
    designation: employee.designation,
    hourSalary: employee.hourSalary,
    daySalary: employee.daySalary,
    address: employee.address || '',
    insuranceNumber: employee.insuranceNumber || '',
    passportNumber: employee.passportNumber || '',
    passportPhoto: employee.passportPhoto || '',
    profileImage: employee.profileImage || '',
    bankDetails: {
      accountName: employee.bankDetails?.accountName || '',
      accountNumber: employee.bankDetails?.accountNumber || '',
      sortCode: employee.bankDetails?.sortCode || ''
    }
  });
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    try {
      const res = await updateEmployee({
        id: employee._id,
        ...formData
      });

      if (res.success) {
        setIsEditing(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Employee details updated successfully',
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update employee details',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      const res = await updateEmployee({
        id: employee._id,
        isEnabled: !isEnabled
      });

      if (res.success) {
        setIsEnabled(!isEnabled);
        setShowStatusModal(false);
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Employee ${!isEnabled ? 'enabled' : 'disabled'} successfully`,
          position: 'top',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await resetEmployeePassword({
        id: employee._id
      });
      
      if (res.success) {
        setShowResetModal(false);
        Toast.show({
          type: 'success',
          text1: 'Password Reset',
          text2: 'Password has been reset successfully',
          position: 'top',
        });
        
        // Format phone number by removing all non-digit characters
        const formattedPhone = employee.phoneNumber;
        
        // Check if WhatsApp is installed
        const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=Your password has been reset. New password: ${res.data.newPassword}`;
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          // If WhatsApp is not installed, show a message with the password
          Alert.alert(
            'Password Reset',
            `Password has been reset. New password: ${res.data.newPassword}\n\nPlease share this password with the employee.`,
            [
              {
                text: 'Copy Password',
                onPress: () => {
                  Clipboard.setString(res.data.newPassword);
                  Toast.show({
                    type: 'success',
                    text1: 'Password Copied',
                    text2: 'Password has been copied to clipboard',
                    position: 'top',
                  });
                }
              },
              { text: 'OK' }
            ]
          );
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('WhatsApp Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open WhatsApp. Please share the password manually.',
        position: 'top',
      });
    }
    setLoading(false);
  };

  const handleEditDetails = () => {
    navigation.navigate('AdminAddEmployee', { 
      employee: {
        ...employee,
        isEditMode: true
      }
    });
  };

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleImageUpdate(type, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async (type) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        handleImageUpdate(type, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (uri, type) => {
    try {
      console.log('====================================');
      console.log(type);
      console.log('====================================');
      setLoading(true);
      const formData = new FormData();
      const fileType = mime.getType(uri) || 'image/jpeg';
  
      // Convert URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();
  
      formData.append('photos', {
        uri: uri,
        name: `photo_${Date.now()}.${mime.getExtension(fileType) || 'jpg'}`,
        type: fileType,
      });
  
        const res = await uploadPhotos(formData);
 
      if (res.success) {
        if(type === 'profile'){
                  const res2 = await updateProfile({ photo: res.data.paths[0] });

        }else{
// Update employee with new photo URL
        const updateResponse = await updateEmployee({
          id: employee._id,
          passportPhoto: res.data.paths[0].imageUrl
        });
        }
        

        if (updateResponse.success) {
          // Update local state
          setFormData(prev => ({
            ...prev,
            [type === 'profile' ? 'profileImage' : 'passportPhoto']: data.url
          }));

          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${type === 'profile' ? 'Profile' : 'Passport'} photo updated successfully`,
            position: 'top',
          });
        } else {
          throw new Error(updateResponse.message);
        }
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update photo',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (type, uri) => {
    try {

      // Upload the image

      await uploadImage(uri, type);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to process image',
        position: 'top',
      });
    }
  };

  const showImageOptions = (type) => {
    if (!isEditing) return;
    
    Alert.alert(
      'Update Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(type),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleImagePress = (type) => {
    setCurrentImageType(type);
    setShowImageModal(true);
  };

  const handleImageLongPress = (type) => {
    if (isEditing) {
      showImageOptions(type);
    }
  };

  return (
    <View style={styles.body}>
      {loading && <Loader message="Processing..."/>}
      <Header 
        title="Edit Employee" 
        rightComponent={
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.statusButton}
              onPress={() => setShowStatusModal(true)}
            >
              {/* <Ionicons 
                name={!isEnabled ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={!isEnabled ? "green" : "red"} 
              /> */}
                  <MaterialIcons name={isEnabled ?"disabled-visible": "visibility"}  color="white" size={24} />

            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "checkmark" : "pencil"} 
                size={24} 
                color={"white"} 
              />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.photoContainer}>
          <View style={styles.photoWrapperContainer}>
            <Pressable
              onPress={() => handleImagePress('profile')}
              style={({ pressed }) => [
                styles.photoWrapper,
                pressed && styles.photoPressed
              ]}
            >
              {formData.profileImage ? (
                <Image
                  source={{ uri: formData.profileImage.imageUrl }}
                  style={styles.profilePhoto}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <Ionicons name="person" size={50} color="#666" />
                  <Text style={styles.placeholderText}>No Photo</Text>
                </View>
              )}
            </Pressable>
            {isEditing && (
              <TouchableOpacity 
                style={styles.editIconContainer}
                onPress={() => showImageOptions('profile')}
              >
                <View style={styles.editIconBackground}>
                  <Ionicons name="pencil" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.photoLabel}>Profile Photo</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Enter name"
            />
          ) : (
            <Text style={styles.value}>{formData.name}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{formData.phoneNumber}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{formData.email}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Department</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.department}
              onChangeText={(text) => handleChange('department', text)}
              placeholder="Enter department"
            />
          ) : (
            <Text style={styles.value}>{formData.department}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Designation</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.designation}
              onChangeText={(text) => handleChange('designation', text)}
              placeholder="Enter designation"
            />
          ) : (
            <Text style={styles.value}>{formData.designation}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Hour Basis Salary</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={String(formData.hourSalary)}
              onChangeText={(text) => handleChange('hourSalary', text)}
              placeholder="Enter Hour Basis Salary"
            />
          ) : (
            <Text style={styles.value}>{formData.hourSalary}</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Day Basis Salary</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.daySalary}
              onChangeText={(text) => handleChange('daySalary', text)}
              placeholder="Enter Day Basis Salary"
            />
          ) : (
            <Text style={styles.value}>{formData.daySalary}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Enter address"
            />
          ) : (
            <Text style={styles.value}>{formData.address}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Insurance Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.insuranceNumber}
              onChangeText={(text) => handleChange('insuranceNumber', text)}
              placeholder="Enter insurance number"
            />
          ) : (
            <Text style={styles.value}>{formData.insuranceNumber}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Passport Number</Text>
          <View style={styles.passportContainer}>
            {isEditing ? (
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.passportNumber}
                onChangeText={(text) => handleChange('passportNumber', text)}
                placeholder="Enter passport number"
              />
            ) : (
              <Text style={[styles.value, { flex: 1 }]}>{formData.passportNumber}</Text>
            )}
            <View style={styles.passportPhotoWrapperContainer}>
              <Pressable
                onPress={() => handleImagePress('passport')}
                style={({ pressed }) => [
                  styles.passportPhotoWrapper,
                  pressed && styles.photoPressed
                ]}
              >
                {formData.passportPhoto ? (
                  <Image
                    source={{ uri: formData.passportPhoto }}
                    style={styles.passportPhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderPassportPhoto}>
                    <Ionicons name="document" size={24} color="#666" />
                  </View>
                )}
              </Pressable>
              {isEditing && (
                <TouchableOpacity 
                  style={styles.editIconContainer}
                  onPress={() => showImageOptions('passport')}
                >
                  <View style={styles.editIconBackground}>
                    <Ionicons name="pencil" size={12} color="#fff" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Bank Details</Text>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.input, { marginBottom: 10 }]}
                value={formData.bankDetails.accountName}
                onChangeText={(text) => handleChange('bankDetails', { ...formData.bankDetails, accountName: text })}
                placeholder="Account Name"
              />
              <TextInput
                style={[styles.input, { marginBottom: 10 }]}
                value={formData.bankDetails.accountNumber}
                onChangeText={(text) => handleChange('bankDetails', { ...formData.bankDetails, accountNumber: text })}
                placeholder="Account Number"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={formData.bankDetails.sortCode}
                onChangeText={(text) => handleChange('bankDetails', { ...formData.bankDetails, sortCode: text })}
                placeholder="Sort Code"
              />
            </>
          ) : (
            <View>
              <Text style={styles.value}>Account Name: {formData.bankDetails.accountName}</Text>
              <Text style={styles.value}>Account Number: {formData.bankDetails.accountNumber}</Text>
              <Text style={styles.value}>Sort Code: {formData.bankDetails.sortCode}</Text>
            </View>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveDetails}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setShowResetModal(true)}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEnabled ? 'Disable Employee' : 'Enable Employee'}
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to {isEnabled ? 'disable' : 'enable'} this employee?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleStatusUpdate}
              >
                <Text style={styles.modalButtonText}>
                  {isEnabled ? 'Disable' : 'Enable'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalText}>
              Are you sure you want to reset this employee's password?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.resetButton]}
                onPress={handleResetPassword}
              >
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity 
            style={styles.imageModalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          {currentImageType === 'profile' ? (
            formData.profileImage ? (
              <Image
                source={{ uri: formData.profileImage }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.fullScreenPlaceholder}>
                <Ionicons name="person" size={100} color="#666" />
                <Text style={styles.fullScreenPlaceholderText}>No Profile Photo Available</Text>
              </View>
            )
          ) : (
            formData.passportPhoto ? (
              <Image
                source={{ uri: formData.passportPhoto }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.fullScreenPlaceholder}>
                <Ionicons name="document" size={100} color="#666" />
                <Text style={styles.fullScreenPlaceholderText}>No Passport Photo Available</Text>
              </View>
            )
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  statusButton: {
    padding: 8,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    marginLeft: 10,
    padding: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: color.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center'
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoWrapperContainer: {
    position: 'relative',
  },
  photoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  photoPressed: {
    opacity: 0.8,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  passportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passportPhotoWrapperContainer: {
    position: 'relative',
  },
  passportPhotoWrapper: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  passportPhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderPassportPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    marginTop: 5,
    color: '#666',
    fontSize: 12,
  },
  photoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenPlaceholderText: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  editIconBackground: {
    backgroundColor: color.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AdminEditEmployee; 