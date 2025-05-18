import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { getFeedbacks } from '../controller/website/feedback';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FeedbackListScreen = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await getFeedbacks();
      if (res.success) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  const handleImagePress = (images, index) => {
    setSelectedImages(images);
    setSelectedIndex(index);
    setIsModalVisible(true);
  };

  const renderImagePreview = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.counter}>
            {selectedIndex + 1} / {selectedImages?.length}
          </Text>
        </View>

        <FlatList
          data={selectedImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={selectedIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setSelectedIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  const renderFeedback = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {item.images.map((img, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(item.images.map(img => img.imageUrl), index)}
          >
            <Image source={{ uri: img.imageUrl }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {item.videos.map((img, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(item.videos.map(video => video.url), index)}
          >
            <Image source={{ uri: img.url }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10, color: '#555' }}>Loading feedbacks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} title="Website Feedbacks" />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={feedbacks}
        keyExtractor={(item) => item._id}
        renderItem={renderFeedback}
        contentContainerStyle={styles.listContent}
      />
      {renderImagePreview()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    backgroundColor: '#eef2ff',
    color: '#4f46e5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: "justify"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeButton: {
    padding: 8,
  },
  counter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});

export default FeedbackListScreen;
