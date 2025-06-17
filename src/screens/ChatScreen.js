import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import { chatController } from '../controller/admin/chat';
import { io } from 'socket.io-client';
import { getToken, getUserData } from '../components/Storage';
import API, { base_url } from '../api';
import color from "../styles/globals"

const ChatScreen = ({ route, navigation }) => {
  const { user,role } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const initializeSocket = async () => {
      try {
        const token = await getToken();
        const newSocket = io(base_url, {
          transports: ['websocket', 'polling'],
          path: '/socket.io/',
          forceNew: false
        });
    
        newSocket.on('connect', () => {
          console.log('✅ Connected to server:', newSocket.id);
        });
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

        newSocket.on('connect', async () => {
          console.log('Connected to WebSocket server');
          const currUser = await  getUserData()
          console.log(currUser);
          
          // Authenticate the user after connection
          newSocket.emit('authenticate', currUser.id);
        });

        // Listen for new messages
        newSocket.on('newMessage', (message) => {
          console.log(message);
          console.log(role, message.sender._id == user._id);
          
          if (message.sender._id == user._id  ||  message.receiver._id == user._id) {
            setMessages(prevMessages => [...prevMessages, {
              id: message._id,
              content: message.content,
              sender: message.sender,
              createdAt: message.createdAt
            }]);
            setTimeout(scrollToBottom, 100);
          }
        });

        // Handle connection errors
        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          Alert.alert('Connection Error', 'Failed to connect to chat server. Please try again.');
        });

        setSocket(newSocket);

      } catch (error) {
        console.error('Error initializing socket:', error);
        Alert.alert('Error', 'Failed to initialize chat connection');
      }
    };

    initializeSocket();

    // Cleanup socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user._id]);

  const fetchChatHistory = async () => {
    try {
      const data = await chatController.getChatHistory(user._id);
      console.log(data);
      
      setMessages(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chat history. Please try again.');
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [user]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: user.name,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, user.name]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const currentUser = await getUserData();
      const message = {
        _id: Date.now().toString(),
        content: newMessage.trim(),
        sender: {
          _id: currentUser.id,
          name: currentUser.name
        },
        receiver: {
          _id: user._id,
          name: user.name
        },
        createdAt: new Date().toISOString()
      };

      // Add message to messages array immediately
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');

      if (socket) {
        socket.emit('sendMessage', {
          receiverId: user._id,
          content: newMessage.trim()
        });
      }
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
      // Remove the optimistic message if it failed
      setMessages(prevMessages => prevMessages.filter(m => m._id !== message._id));
    }
  };

  // Add this function to format date for the divider
  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add this function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groupedMessages.push({
          type: 'date',
          date: message.createdAt,
          id: `date-${messageDate}`
        });
      }
      
      groupedMessages.push({
        ...message,
        type: 'message'
      });
    });

    return groupedMessages;
  };

  // Modify the renderMessage function to handle both messages and date dividers
  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateDivider}>
          <View style={styles.dateDividerLine} />
          <Text style={styles.dateDividerText}>{formatDate(item.date)}</Text>
          <View style={styles.dateDividerLine} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          role === "employee" ? item.sender._id === user._id ? styles.sentMessage : styles.receivedMessage : item.sender._id != user._id ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            role === "employee" ? item.sender._id === user._id ? styles.sentBubble : styles.receivedBubble : item.sender._id != user._id ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} title={user.name} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        enabled
      >
        <View style={styles.mainContainer}>
          <View style={styles.messagesContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={groupMessagesByDate(messages)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id || item._id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={newMessage.trim() === ''}
            >
              <Ionicons
                name="send"
                size={24}
                color={newMessage.trim() === '' ? '#ccc' : color.background}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  messagesContainer: {
    height: '80%',
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: color.primary,
  },
  receivedBubble: {
    backgroundColor: color.secondary,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#DDD',
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
    backgroundColor: color.primary,
    padding: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dateDividerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 8,
    fontWeight: '500',
  },
});

export default ChatScreen; 