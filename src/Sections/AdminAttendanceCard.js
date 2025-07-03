import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import ImageViewer from '../components/ImageViewer';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../styles/globals';

const AdminAttendanceCard = ({item}) => {
  const navigation = useNavigation();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [wasModalOpen, setWasModalOpen] = useState(false);

  function formatLocalTime(isoString) {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  const handleImages = async () => {
    if (item.workImages && item.workImages.length > 0)
      navigation.navigate('WorkImagesPreview', {
        items: item.workImages,
      });
  };

  const hasWorkImages = item.workImages && item.workImages.length > 0;

  // Handler for check-in/out click
  const handleCheckInOutPress = () => {
    const images = [];
    if (item.checkInData && item.checkInData.photo) {
      images.push({label: 'Check In', uri: item.checkInData.photo});
    }
    if (item.checkOutData && item.checkOutData.photo) {
      images.push({label: 'Check Out', uri: item.checkOutData.photo});
    }
    if (images.length > 0) {
      setSelectedImages(images);
      setImageViewerVisible(true);
    } else {
      Alert.alert('No Images', 'No check-in or check-out images available.');
    }
  };

  // Handler for tapping an image in the modal
  const handleImagePress = (uri) => {
    setFullScreenImage(uri);
    setWasModalOpen(true);
    setImageViewerVisible(false);
  };

  // Handler for closing the full screen viewer
  const handleFullScreenClose = () => {
    setFullScreenImage(null);
    if (wasModalOpen) {
      setImageViewerVisible(true);
      setWasModalOpen(false);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{uri: item.profileImage ? item.profileImage.imageUrl : ''}}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.employeeName}</Text>
        <Text style={styles.siteName}>{item.siteName}</Text>
      </View>
      <TouchableOpacity
        style={styles.timeContainer}
        onPress={handleCheckInOutPress}
        activeOpacity={0.7}
      >
        <Text style={styles.checkInOutLabel}>Check In - Out</Text>
        <Text style={styles.time}>{formatLocalTime(item.checkIn)}</Text>
        <Text style={styles.time}>{formatLocalTime(item.checkOut)}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageActionContainer}
        onPress={handleImages}
        disabled={!hasWorkImages}>
        {hasWorkImages ? (
          <>
            <Icon name="photo" size={30} color={color.secondary} />
            <Text style={[styles.imageActionText, {color: color.secondary}]}>View Images</Text>
          </>
        ) : (
          <>
            <Icon name="camera" size={30} color="#888" />
            <Text style={styles.imageActionText}>No Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ImageViewer for check-in/check-out images */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
              {selectedImages.map((img, idx) => (
                <View key={idx} style={{marginBottom: 20, alignItems: 'center'}}>
                  <Text style={styles.modalLabel}>{img.label}</Text>
                  <TouchableOpacity onPress={() => handleImagePress(img.uri)} activeOpacity={0.8}>
                    <Image
                      source={{uri: img.uri}}
                      style={styles.modalImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setImageViewerVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Full screen image viewer */}
      <ImageViewer
        visible={!!fullScreenImage}
        imageUrl={fullScreenImage}
        onClose={handleFullScreenClose}
      />
    </View>
  );
};

export default AdminAttendanceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    // Platform-specific shadow/elevation
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 5,
    justifyContent: 'center',
    minWidth: 0, // allow text to shrink
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  },
  siteName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timeContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 70,
  },
  checkInOutLabel: {
    fontSize: 12,
    color: '#888',
  },
  time: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    marginTop: 4,
  },
  imageActionContainer: {
    alignItems: 'center',
    width: 60,
  },
  imageActionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 300,
    maxHeight: 500,
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
    color: '#333',
  },
  modalImage: {
    width: 220,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: color.secondary,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
  },
});
