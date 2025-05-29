import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from "../styles/globals"
import { useNavigation } from '@react-navigation/native';
import uploadPhotos from '../controller/photos';
import { addService, getService, updateService } from '../controller/website/services';
import mime from 'mime';
import { base_url } from '../api';
import { RefreshControl } from 'react-native-gesture-handler';

const ServiceManagerScreen = () => {
  const navigation = useNavigation()
  const [services, setServices] = useState([]);
  const [originalServerImages,setOriginalServerImages] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [refreshing,setRefreshing] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])
  const onRefresh = ()=>{
    setRefreshing(true)
    fetchData()
  }
  const fetchData = async ()=>{
    const res = await getService()
   if (res.success){
    setServices(res.data)
   }
   setRefreshing(false)
  }

  const openImagePicker = async () => {
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

  const handleAddOrUpdate = async () => {
    if (!name || images.length === 0) {
      Alert.alert('Error', 'Please enter a name and add at least one image.');
      return;
    }
    if (editingServiceId) {
      
      const addImages = images.filter(img => typeof img === 'object' && img.uri);
      const keepImages = images.filter(img => typeof img === 'string'); // URLs
      const removeImages = originalServerImages.filter(orig =>
        !keepImages.includes(orig)
      );
      
  
      // Upload only new images
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
          id: editingServiceId,
          name,
          addImages: uploaded.data.paths, // new image paths
          removeImages, // old paths to delete
        };
  
        // Here you should call updateService(updatePayload)
        const res = await updateService(updatePayload)
        Alert.alert('Service updated');
        fetchData(); // refetch after update
      } catch (err) {
        console.error("Update error: ", err);
        Alert.alert("Update failed");
      }
    } else {
    const formData = new FormData();

    for (const file of images) {
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
      
      ;
      
      const data = {images: res.data.paths, name: name};
      await addService(data);
      Alert.alert('Upload Successful', 'Your images have been uploaded.');
      setImages([]);
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', 'Check console for details.');
    }
      const newService = {
        id: Date.now().toString(),
        name,
        images,
      };
      setServices([...services, newService]);
    }
    fetchData()
    resetModal();
  };

  const resetModal = () => {
    setModalVisible(false);
    setName('');
    setImages([]);
    setEditingServiceId(null);
  };

  const deleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleEdit = (service) => {
    // setName(service.name);
    // setOriginalServerImages(service.images)
    // setImages(service.images);
    // setEditingServiceId(service._id);
    // setModalVisible(true);
    navigation.navigate('EditService', { service });
  };

  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleEdit(item)}>
      <Text style={styles.serviceTitle}>{item.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {item.images.map((img, index) => (
          <Image key={index} source={{ uri: img.imageUrl }} style={styles.thumbnail} />
        ))}
      </ScrollView>
    </TouchableOpacity>
  );

  return (
    <>
      <Header onBackPress={() => navigation.goBack()} title="Services" rightComponent={
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButtonMain}>
          <Ionicons name="add-circle" size={32} color={color.secondary} />
        </TouchableOpacity>
      }/>

      <View style={styles.container}>
        <FlatList
         refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={renderService}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={resetModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingServiceId ? 'Edit' : 'Add'} Service</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Service Name"
                value={name}
                onChangeText={setName}
              />

              <View style={{ height: 200, marginVertical: 10 }}>
                <ScrollView contentContainerStyle={styles.imageScrollContainer}>
                  {images.map((img, idx) => (
                    <View key={idx} style={{ position: 'relative' }}>
                      <Image source={{ uri: img.uri }} style={styles.thumbnail} />
                      <TouchableOpacity
                        style={styles.deleteImageButton}
                        onPress={() => deleteImage(idx)}
                      >
                        <Ionicons name="close-circle" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={openImagePicker} style={styles.modalButton}>
                  <Ionicons name="images-outline" size={20} color={color.primary} />
                  <Text style={styles.modalButtonText}>Select Images</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleAddOrUpdate} style={[styles.modalButton, { backgroundColor: color.secondary }]}>
                  {/* <Ionicons name="checkmark-circle" size={20} color={color.primary} /> */}
                  <Text style={styles.modalButtonText}>{editingServiceId ? 'Update' : 'Add'}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 12 },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap' },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  addButtonMain: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 6,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  modalButtonText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeButtonText: { color: '#ef4444', fontWeight: '600' },
  deleteImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default ServiceManagerScreen;
