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
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { getFeedbacks, deleteFeedback } from '../controller/website/feedback';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FeedbackListScreen = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await getFeedbacks();
      if (res.success) {
        setFeedbacks(res.data.data);
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

  const handleDelete = async (feedbackId) => {
    Alert.alert(
      'Delete Feedback',
      'Are you sure you want to delete this feedback?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteFeedback(feedbackId);
              if (res.success) {
                setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
              }
            } catch (err) {
              console.error('Error deleting feedback:', err);
              Alert.alert('Error', 'Failed to delete feedback');
            }
          },
        },
      ]
    );
  };

  const handleMediaPress = (media, index, isVideoMedia = false) => {
    if (isVideoMedia) {
      // Open video in device's default video player
      Linking.openURL(media[index]);
    } else {
      setSelectedMedia(media);
      setSelectedIndex(index);
      setIsVideo(false);
      setIsModalVisible(true);
    }
  };

  const renderMediaPreview = () => (
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
            {selectedIndex + 1} / {selectedMedia?.length}
          </Text>
        </View>

        <FlatList
          data={selectedMedia}
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
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: item }}
                style={styles.previewMedia}
                resizeMode="contain"
              />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  const renderFeedback = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#f59e0b" />
          <Text style={styles.ratingText}>{item.rating || 'No rating'}</Text>
        </View>

        <Text style={styles.message}>{item.message}</Text>

        {item.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
            {item.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMediaPress(item.images.map(img => img.imageUrl), index)}
              >
                <Image source={{ uri: img.imageUrl }} style={styles.thumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {item.videos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
            {item.videos.map((video, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMediaPress(item.videos.map(v => v.url), index, true)}
              >
                <View style={styles.videoThumbnail}>
                  <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnail} />
                  <View style={styles.playButton}>
                    <Icon name="play-circle-filled" size={30} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

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
      {renderMediaPreview()}
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
    marginVertical: 30,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '600',
  },
  mediaRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  videoThumbnail: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  errorText: {
    marginTop: 10,
    color: '#ef4444',
    fontSize: 16,
  },
});

export default FeedbackListScreen;
