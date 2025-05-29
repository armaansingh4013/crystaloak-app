import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { updateService } from '../controller/website/services';
import uploadPhotos from '../controller/photos';
import mime from 'mime';
import { base_url } from '../api';
import Header from '../Sections/Header';
import color from "../styles/globals"
import ImageViewer from '../components/ImageViewer';

const EditServiceScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [name, setName] = useState(service.name);
  const [images, setImages] = useState(service.images);
  const [originalServerImages] = useState(service.images);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      setImages([...images, ...(result.assets || [])]);
    }
  };

  const deleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleUpdate = async () => {
    if (!name || images.length === 0) {
      Alert.alert('Error', 'Please enter a name and add at least one image.');
      return;
    }

    const addImages = images.filter(img => typeof img === 'object' && img.uri);
    const keepImages = images.filter(img => typeof img === 'object' && img.imageUrl);
    const removeImages = originalServerImages.filter(orig => !keepImages.includes(orig));

    const formData = new FormData();
    for (const file of addImages) {
      const fileType = mime.getType(file.uri) || 'image/jpeg';
      formData.append('photos', {
        uri: file.uri,
        name: `photo_${Date.now()}.${mime.getExtension(fileType) || 'jpg'}`,
        type: fileType,
      });
    }

    try {
      let uploaded = { data: { paths: [] } };
      if (addImages.length > 0) {
        uploaded = await uploadPhotos(formData);
      }
      
      const updatePayload = {
        id: service._id,
        name,
        addImages: uploaded.data.paths,
        removeImages,
      };

      await updateService(updatePayload);
      Alert.alert('Success', 'Service updated successfully');
      navigation.goBack();
    } catch (err) {
      console.error('Update failed:', err);
      Alert.alert('Error', 'Failed to update service');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header onBackPress={() => navigation.goBack()} title="Service" rightComponent={ <TouchableOpacity onPress={handleUpdate}>
          <Ionicons name="checkmark-circle" size={28} color={color.secondary} />
        </TouchableOpacity>}/>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity> */}
        <TextInput
          style={styles.titleInput}
          value={name}
          onChangeText={setName}
          placeholder="Service Name"
        />
       
      </View>

      {/* Image Grid */}
      <ScrollView contentContainerStyle={styles.imageGrid}>
        <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
          <Ionicons name="add" size={36} color="#888" />
        </TouchableOpacity>

        {images.map((img, idx) => (
          <View key={idx} style={styles.imageWrapper}>
            <TouchableOpacity
              onLongPress={() => {
                setSelectedImage(img.imageUrl ? img.imageUrl : img.uri);
                setImageViewerVisible(true);
              }}
              delayLongPress={500}
            >
              <Image
                source={{ uri: img.imageUrl ? img.imageUrl : img.uri }}
                style={styles.imageThumb}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageDeleteBtn}
              onPress={() => deleteImage(idx)}
            >
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageViewer
        visible={imageViewerVisible}
        imageUrl={selectedImage}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'center',
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    textAlign:"center"
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  addImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    margin: 6,
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imageDeleteBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default EditServiceScreen;
