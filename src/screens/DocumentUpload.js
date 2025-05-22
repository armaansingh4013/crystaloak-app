import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import color from '../styles/globals';
import { updateProfile } from '../controller/user/updateProfile';
import Toast from 'react-native-toast-message';
import mime from 'mime';
import uploadPhotos from '../controller/photos';
import Header from '../Sections/Header';

const DocumentUpload = ({ navigation }) => {
  const [documents, setDocuments] = useState({
    passportNumber: '',
    passportPhoto: null,
    insuranceNumber: '',
    address: '',
    bankDetails: {
      accountNumber: '',
      sortCode: '',
      accountName: '',
    },
  });
  const [selectedPhoto,setSelectedPhoto] = useState("")

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDocuments(prev => ({
        ...prev,
        passportPhoto: result.assets[0].uri
      }));
    }
  };

  const uploadDocument = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!documents.passportNumber ||  !documents.insuranceNumber || 
          !documents.address || !documents.bankDetails.accountNumber || 
          !documents.bankDetails.sortCode || !documents.bankDetails.accountName) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      const formData = new FormData();
    const fileType = mime.getType(selectedPhoto) || 'image/jpeg';
    // Convert URI to Blob
    const response = await fetch(selectedPhoto);
    const blob = await response.blob();
    formData.append('photos', {
      uri: selectedPhoto,
      name: `photo_${Date.now()}.${mime.getExtension(fileType) || 'jpg'}`,
      type: fileType,
    });
      const res = await uploadPhotos(formData);

      // Update profile with document information
      const updateData = {
        documents: {
          passportNumber: documents.passportNumber,
          passportPhoto: res.data.paths[0].imageUrl,
          insuranceNumber: documents.insuranceNumber,
          address: documents.address,
          bankDetails: documents.bankDetails,
          documents: true,
        }
      };

      const updateRes = await updateProfile(updateData);
      if (updateRes.success) {
        Toast.show({
          type: 'success',
          text1: 'Documents uploaded successfully',
          position: 'top',
        });
        navigation.replace('TabNavigator');
      } else {
        throw new Error(updateRes.message || 'Failed to update profile');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message || 'Failed to upload documents',
        position: 'top',
      });
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.IMAGE,
      quality: 0.5, // Lower the quality to reduce size
      base64: false, // Don't use base64 to avoid large payloads
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5, // Lower the quality to reduce size
      base64: false, // Avoid base64 for faster uploads
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0].uri);
    }
  };

  const handleImageSelect = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhotoWithCamera },
      { text: 'Choose from Gallery', onPress: pickImageFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

      <Header title="Document Upload" />
        {/* <Text style={styles.title}>Document Upload</Text> */}
        <Text style={styles.subtitle}>Please provide the following documents to complete your profile</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Passport Number *</Text>
        <TextInput
          style={styles.input}
          value={documents.passportNumber}
          onChangeText={(text) => setDocuments(prev => ({ ...prev, passportNumber: text }))}
          placeholder="Enter passport number"
        />

        <Text style={styles.label}>Passport Photo *</Text>
        <TouchableOpacity style={styles.photoButton} onPress={handleImageSelect}>
          {selectedPhoto ? (
            <Image source={{ uri: selectedPhoto }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoButtonText}>Upload Passport Photo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Insurance Number *</Text>
        <TextInput
          style={styles.input}
          value={documents.insuranceNumber}
          onChangeText={(text) => setDocuments(prev => ({ ...prev, insuranceNumber: text }))}
          placeholder="Enter insurance number"
        />

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={documents.address}
          onChangeText={(text) => setDocuments(prev => ({ ...prev, address: text }))}
          placeholder="Enter your address"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Bank Details</Text>
        
        <Text style={styles.label}>Account Number *</Text>
        <TextInput
          style={styles.input}
          value={documents.bankDetails.accountNumber}
          onChangeText={(text) => setDocuments(prev => ({
            ...prev,
            bankDetails: { ...prev.bankDetails, accountNumber: text }
          }))}
          placeholder="Enter account number"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Sort Code *</Text>
        <TextInput
          style={styles.input}
          value={documents.bankDetails.sortCode}
          onChangeText={(text) => setDocuments(prev => ({
            ...prev,
            bankDetails: { ...prev.bankDetails, sortCode: text }
          }))}
          placeholder="Enter sort code (e.g., 12-34-56)"
        />

        <Text style={styles.label}>Account Name *</Text>
        <TextInput
          style={styles.input}
          value={documents.bankDetails.accountName}
          onChangeText={(text) => setDocuments(prev => ({
            ...prev,
            bankDetails: { ...prev.bankDetails, accountName: text }
          }))}
          placeholder="Enter account holder name"
        />

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={uploadDocument}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Uploading...' : 'Submit Documents'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: color.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#333',
  },
  photoButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  photoButtonText: {
    color: color.primary,
    fontSize: 16,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: color.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DocumentUpload; 