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
const screenHeight = Dimensions.get ('window').height;
const screenWidth = Dimensions.get ('window').width;

const WorkImages = ({navigation}) => {
  const [images, setImages] = useState ([])
  const [message, setMessage] = useState ('');
  const [modalVisible, setModalVisible] = useState (false);
  const [selectedFiles, setSelectedFiles] = useState ([]);

  // Request permissions on mount
  useEffect (() => {
    (async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync ();
      if (status !== 'granted') {
        Alert.alert (
          'Permission Required',
          'Please allow access to camera and photos.'
        );
      }
    }) ();
  }, []);

  // Open modal on screen focus
  useFocusEffect (
    React.useCallback (() => {
      setModalVisible (true);
    }, [])
  );

  // Pick images from gallery
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync ({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const newImages = result.assets.map (asset => asset.uri);
      setImages (prevImages => [...prevImages, ...newImages]);

      // Store selected images for uploading
      setSelectedFiles (prevFiles => [...prevFiles, ...result.assets]);
    }

    setModalVisible (false);
  };

  // Open camera
  const openCamera = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync ();
    if (cameraPermission.status !== 'granted') {
      Alert.alert ('Permission Required', 'Please allow access to the camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync ({
      quality: 1,
    });

    if (!result.canceled) {
      setImages (prevImages => [...prevImages, result.assets[0].uri]);

      // Store captured image for uploading
      setSelectedFiles (prevFiles => [...prevFiles, result.assets[0]]);
    }

    setModalVisible (false);
  };

  const uploadPhoto = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert (
        'No image selected',
        'Please select an image before uploading.'
      );
      return;
    }

    const formData = new FormData ();

    for (const file of selectedFiles) {
      const base64Uri = file.uri; // This is a base64 string
      const fileType = mime.getType (base64Uri) || 'image/jpeg';

      // Convert base64 to Blob
      const response = await fetch (base64Uri);
      const blob = await response.blob ();

      formData.append ('photos', {
        uri: base64Uri, // Use the file.uri, but converted to a blob
        name: `photo_${Date.now ()}.${mime.getExtension (fileType) || 'jpg'}`,
        type: fileType,
      });
    }

    console.log ('FormData before sending:', formData);

    console.log ('Uploading FormData:', formData);

    try {
      const res = await uploadPhotos (formData);
      const data = {images: res.data.paths, message: message};
      console.log ('Upload response:', res,data);
      const res2 = await workImagesPost({images: res.data.paths, message: message});
      Alert.alert ('Upload Successful', 'Your images have been uploaded.');
    } catch (error) {
      console.error ('Upload failed:', error);
      Alert.alert ('Upload failed', 'Check console for details.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Work Images"
        rightComponent={
          <TouchableOpacity onPress={() => setModalVisible (true)}>
            <Ionicons name="add-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        }
      />

      {/* Selected Images */}
      {/* <FlatList
        horizontal
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imagePreview} />
        )}
        style={styles.imageContainer}
      /> */}
     <ScrollView contentContainerStyle={styles.imageScroll}>
     <View style={styles.imageContainer}>
        {images.map ((img, index) => (
          <Image key={index} source={{uri: img}} style={styles.imagePreview} />
        ))}
      </View>
     </ScrollView>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10} // You can adjust this based on header height
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            {/* Message Input */}
            <View style={styles.inputContainer}>
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
        </TouchableWithoutFeedback>
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
              onPress={() => setModalVisible (false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create ({
  container: {flex: 1, backgroundColor: '#F5F5F5', height: screenHeight},
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 5,
    flex:1
  },
  imageScroll: {
    padding: 10,
    paddingBottom: 80,

  },
  
  imageContainer: {
    marginVertical:20,
    width: "100%",
    flex: 1,
    flexWrap: 'wrap',
    flexDirection:"row",
    justifyContent:"space-evenly",
  },
  imagePreview: {width: '30%', height: 80, margin: 5, borderRadius: 10},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
    position: 'absolute',
    bottom: 5,
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
