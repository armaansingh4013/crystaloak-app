import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import uploadPhotos from '../controller/photos';
import mime from 'mime';
import {workImagesPost} from '../controller/attendance';
import Header from '../Sections/Header';
import Loader from '../Sections/Loader';
import LottieView from 'lottie-react-native';
import uploadImage from "../assets/uploadImage.json"
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const WorkImages = ({navigation}) => {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading,setLoading] = useState(false)
  useEffect(() => {
    (async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to camera and photos.'
        );
      }
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prevImages => [...prevImages, ...newImages]);
      setSelectedFiles(prevFiles => [...prevFiles, ...result.assets]);
    }

    setModalVisible(false);
  };

  const openCamera = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({quality: 1});

    if (!result.canceled) {
      setImages(prevImages => [...prevImages, result.assets[0].uri]);
      setSelectedFiles(prevFiles => [...prevFiles, result.assets[0]]);
    }

    setModalVisible(false);
  };

  const uploadPhoto = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert(
        'No image selected',
        'Please select an image before uploading.'
      );
      return;
    }
    setLoading(true)

    const formData = new FormData();

    for (const file of selectedFiles) {
      const base64Uri = file.uri;
      const fileType = mime.getType(base64Uri) || 'image/jpeg';

      formData.append('photos', {
        uri: base64Uri,
        name: `photo_${Date.now()}.${mime.getExtension(fileType) || 'jpg'}`,
        type: fileType,
      });
    }

    try {
      const res = await uploadPhotos(formData);
      const data = {images: res.data.paths, message: message};
      await workImagesPost(data);
      Alert.alert('Upload Successful', 'Your images have been uploaded.');
      setImages([]);
      setSelectedFiles([]);
      setMessage('');
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', 'Check console for details.');
    }
    setLoading(false)
  };

  const removeImage = indexToRemove => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const removeAllImages = () => {
    setImages([]);
    setSelectedFiles([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Work Images"
        rightComponent={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={removeAllImages} style={{marginRight: 15}}>
              <Ionicons name="trash-bin-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        }
      />
      {loading&&<Loader message="Uploading Images"/>}
      {/* Selected Images */}
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled
      >
        <View style={{flex: 1}}>
          <ScrollView 
            contentContainerStyle={[
              styles.imageScroll,
              Platform.OS === 'ios' && {flexGrow: 1}
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.imageContainer}>
              {!images||images.length==0&&<TouchableOpacity
              onPress={() => setModalVisible(true)}
                style={{
                  height: '100%',
                  width: '100%',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LottieView style={{height: 150, width: 150}} source={uploadImage} autoPlay loop/>
                <Text>Upload Images</Text>
              </TouchableOpacity>}
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{uri: img}} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={[
            styles.inputContainer,
            Platform.OS === 'ios' && {paddingBottom: 0}
          ]}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity onPress={uploadPhoto} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Modal for Image Selection */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.optionButton} onPress={pickImages}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Select from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  imageScroll: {
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 80 : 80,
  },
  imageContainer: {
    marginVertical: 20,
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  imagePreview: {
    width: screenWidth * 0.28,
    height: 80,
    borderRadius: 10,
  },
  removeIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    backgroundColor: '#FFF',
    height: 50,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    justifyContent: 'center',
  },
  optionText: {fontSize: 18, marginLeft: 10, color: '#007AFF'},
  cancelButton: {
    marginTop: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: 5,
  },
  cancelText: {fontSize: 16, color: '#555'},
});

export default WorkImages;
