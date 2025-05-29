import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import color from "../styles/globals";
import { useNavigation, useRoute } from "@react-navigation/native";
import { base_url } from "../api";
import Header from "../Sections/Header";
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const WorkImagesPreview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { items } = route.params;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allImages, setAllImages] = useState([]);

  const handleImagePress = (image) => {
    // Collect all images from all items
    const images = items.reduce((acc, item) => {
      if (item.images && item.images.length > 0) {
        return [...acc, ...item.images.map(img => img.imageUrl)];
      }
      return acc;
    }, []);
    setAllImages(images);
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleImagePress(item.imageUrl)}
      style={styles.imageContainer}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
    </TouchableOpacity>
  );

  const renderModalImage = ({ item }) => (
    <View style={styles.modalImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.modalImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Image Grid */}
      <FlatList
        data={item.images}
        renderItem={renderImage}
        keyExtractor={(img, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.imageGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Message Section */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Header onBackPress={() => navigation.goBack()} title="Work Images" />
      <View style={styles.body}>
        <FlatList
          data={items}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>

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
            data={allImages}
            renderItem={renderModalImage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={allImages.indexOf(selectedImage)}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    margin: 15,
  },
  card: {
    width: "70%",
    height: screenHeight * 0.8,
    margin: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: color.background,
    borderRadius: 20,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageGrid: {
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  imageContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: screenWidth / 2 - 50,
    height: 100,
    borderRadius: 10,
  },
  messageContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
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

export default WorkImagesPreview;
