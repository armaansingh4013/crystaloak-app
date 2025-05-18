import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import mime from 'mime';
import color from '../styles/globals';
import getProfile from '../controller/profile';
import { getUserData } from '../components/Storage';
import * as ImagePicker from 'expo-image-picker';
import uploadPhotos from '../controller/photos';
import { updateProfile } from '../controller/user/updateProfile';
import { base_url } from '../api';
import ProfileUpdateModal from '../Sections/ProfileUpdateModal';
import profile from "../assets/profile.png"
import ImageViewer from '../components/ImageViewer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Profile = () => {
  const [data, setData] = useState(getUserData());
  const [selectedImage, setSelectedImage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.IMAGE,
      quality: 0.5, // Lower the quality to reduce size
      base64: false, // Don't use base64 to avoid large payloads
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      uploadPhoto(result.assets[0].uri);
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
      setSelectedImage(result.assets[0].uri);
      uploadPhoto(result.assets[0].uri);
    }
  };

  const handleImageSelect = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhotoWithCamera },
      { text: 'Choose from Gallery', onPress: pickImageFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const uploadPhoto = async (uri) => {
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

    try {
      const res = await uploadPhotos(formData);
      
      const res2 = await updateProfile({ photo: res.data.paths[0] });
      setRefresh(!refresh);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', 'Check console for details.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true)
    fetchProfile()
  }

  const fetchProfile = async () => {
    const res = await getProfile();
    if (res.success) {
      setData(res.data);
    }
    setRefreshing(false)
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.body}
      >
        <View style={styles.headerSection}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onLongPress={() => {
                if (data.profileImage) {
                  setSelectedImage(data.profileImage.imageUrl);
                  setImageViewerVisible(true);
                }
              }}
              delayLongPress={500}
            >
              <Image
                source={data.profileImage ? {
                  uri: data.profileImage.imageUrl,
                } : profile}
                style={styles.profileImage}
                resizeMode='cover'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.plusIconContainer}
              onPress={handleImageSelect}
            >
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.card}>
          {/* Name and Designation */}
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.designation}>{data.designation}</Text>

          {/* Info Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Info</Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Employee Code:</Text> {data.employeeCode}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Full Name:</Text> {data.name}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Department:</Text> {data.department}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Designation:</Text> {data.designation}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Shift Timings:</Text> {data.shift}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Phone:</Text> {data.phoneNumber}
            </Text>
            <Text style={styles.info}>
              <Text style={styles.label}>Email:</Text> {data.email}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setProfileUpdate(true)} style={styles.edit}>
            <Text style={styles.editText}>Edit ✏️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ProfileUpdateModal visible={profileUpdate} data={data} onClose={() => setProfileUpdate(false)} />
      <ImageViewer
        visible={imageViewerVisible}
        imageUrl={selectedImage}
        onClose={() => setImageViewerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    backgroundColor: color.primary,
    alignItems: 'center',
    padding: 20,
  },
  headerSection: {
    height: screenHeight * 0.20,
    position: 'relative',
    width: screenWidth > 500 ? 450 : screenWidth * 0.95,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    width: screenWidth > 500 ? 450 : screenWidth * 0.95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    height: screenHeight * 0.65,
  },
  edit: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: color.primary,
    padding: 10,
    borderRadius: 10
  },
  editText: {
    color: "white"
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center',
    zIndex: 99,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 50,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: color.secondary || '#007bff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 5,
  },
  designation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  section: {
    width: '100%',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6c47ff',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#374151',
    marginVertical: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default Profile;
