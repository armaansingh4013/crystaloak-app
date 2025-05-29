import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Header from '../Sections/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AttendanceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { attendance } = route.params;
  const [checkInAddress, setCheckInAddress] = useState('');
  const [checkOutAddress, setCheckOutAddress] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  const getAddressString = async (coordinates) => {
    const cords = coordinates.split(" ");
    try {
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: Number(cords[0]),
        longitude: Number(cords[1]),
      });

      if (addressResponse.length > 0) {
        const addressObj = addressResponse[0];
        const formattedAddress = `${addressObj.name}, ${addressObj.city}, ${addressObj.region}, ${addressObj.postalCode}, ${addressObj.country}`;
        return formattedAddress;
      }
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (attendance.checkIn) {
        const address = await getAddressString(
          `${attendance.checkInData.location.coordinates[0]} ${attendance.checkInData.location.coordinates[1]}`
        );
        setCheckInAddress(address);
      }
      if (attendance.checkOut) {
        const address = await getAddressString(
          `${attendance.checkOutData.location.coordinates[0]} ${attendance.checkOutData.location.coordinates[1]}`
        );
        setCheckOutAddress(address);
      }
    };
    fetchAddresses();
  }, [attendance]);

  const handleImagePress = (image) => {
    const allImages = [];
    if (attendance.checkInData?.photo) {
      allImages.push(attendance.checkInData.photo);
    }
    if (attendance.checkOutData?.photo) {
      allImages.push(attendance.checkOutData.photo);
    }
    setImages(allImages);
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const renderImage = ({ item }) => (
    <View style={styles.modalImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.modalImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Attendance Details"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        {/* Check-in Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in</Text>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => handleImagePress(attendance.checkInData?.photo)}
          >
            <Image
              source={{ uri: attendance.checkInData?.photo }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.detailsContainer}>
            <Text style={styles.time}>
              {attendance.checkIn &&
                new Date(attendance.checkIn).toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
            </Text>
            <Text style={styles.address}>{checkInAddress}</Text>
          </View>
        </View>

        {/* Check-out Section */}
        {attendance.checkOut ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Check-out</Text>
            <TouchableOpacity 
              style={styles.imageContainer}
              onPress={() => handleImagePress(attendance.checkOutData?.photo)}
            >
              <Image
                source={{ uri: attendance.checkOutData?.photo }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={styles.time}>
                {attendance.checkOut &&
                  new Date(attendance.checkOut).toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
              </Text>
              <Text style={styles.address}>{checkOutAddress}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.notCheckedOut}>Not Checked Out Yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={images.indexOf(selectedImage)}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />
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
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notCheckedOut: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
});

export default AttendanceDetails; 