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
  const [currentUser, setCurrentUser] = useState(null);
  const flatListRef = useRef(null);

  // Function to mark messages as read
  const markMessagesAsRead = async () => {
    try {
      if (!currentUser || !socket) return;

      const unreadMessages = messages.filter(
        message => 
          message.sender._id !== currentUser.id && 
          !message.isRead
      );

      if (unreadMessages.length > 0) {
        // Emit markAsRead for each unread message
        unreadMessages.forEach(message => {
          socket.emit('markAsRead',  message._id);
        });

        // Update local state to mark messages as read
        setMessages(prevMessages => 
          prevMessages.map(message => 
            message.sender._id !== currentUser.id && !message.isRead
              ? { ...message, isRead: true }
              : message
          )
        );
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Function to mark messages as read when scrolling
  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;
    
    if (isNearBottom) {
      markMessagesAsRead();
    }
  };

  // Function to mark messages as read when content size changes (new messages loaded)
  const handleContentSizeChange = () => {
    setTimeout(() => {
      markMessagesAsRead();
      scrollToBottom();
    }, 100);
  };

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
          setCurrentUser(currUser);
          
          // Authenticate the user after connection
          newSocket.emit('authenticate', currUser.id);
        });

        // Listen for new messages
        newSocket.on('newMessage', (message) => {
          console.log(message);
          console.log("=============================================================")
          console.log(role, message.sender._id == user._id);
          
          if (message.sender._id == user._id  ||  message.receiver._id == user._id) {
            setMessages(prevMessages => [...prevMessages, {
              id: message._id,
              _id: message._id,
              content: message.content,
              sender: message.sender,
              receiver: message.receiver,
              createdAt: message.createdAt,
              isRead: false // New messages start as unread
            }]);
            setTimeout(scrollToBottom, 100);
          }
        });

        
        // Listen for markAsRead events from server
        newSocket.on('messageRead', (messageId) => {
          // console.log('Message marked as read by server:', messageId);
          // console.log('Current messages before update:', messages);
          
          setMessages(prevMessages => {
            // console.log('Previous messages in setState:', prevMessages);
            
            // Check if any message matches the messageId
            const matchingMessage = prevMessages.find(message => message._id === messageId);
            // console.log('Matching message found:', matchingMessage);
            // console.log('MessageId type:', typeof messageId);
            // console.log('Message _id type:', matchingMessage ? typeof matchingMessage._id : 'N/A');
            
            const updatedMessages = prevMessages.map(message => {
              const isMatch = message._id === messageId;
              // console.log(`Comparing: ${message._id} === ${messageId} = ${isMatch}`);
              return isMatch 
                ? { ...message, isRead: true }
                : message;
            });
            
            // console.log('Updated messages:', updatedMessages);
            return updatedMessages;
          });
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
      // console.log(data);
      
      // Add isRead property to existing messages if not present
      const messagesWithReadStatus = (data || []).map(message => ({
        ...message,
        isRead: message.isRead !== undefined ? message.isRead : false
      }));
      
      setMessages(messagesWithReadStatus);
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

  // Mark messages as read when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Small delay to ensure messages are loaded
      setTimeout(() => {
        markMessagesAsRead();
      }, 500);
    });

    return unsubscribe;
  }, [navigation, messages, socket, currentUser]);

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
    console.log('====================================');
    console.log(newMessage);
    console.log('====================================');
    if (newMessage.trim() === '') return;

    try {
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
        createdAt: new Date().toISOString(),
        isRead: false // Sent messages start as unread
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
      fetchChatHistory()
      console.log('====================================');
      console.log("success");
      console.log('====================================');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Error sending message:', error);
      // Remove the optimistic message if it failed
      setMessages(prevMessages => prevMessages.filter(m => m._id !== message._id));
    }
  };

  // Function to mark a specific message as read
  const markMessageAsRead = (messageId) => {
    if (!currentUser || !socket) return;

    const message = messages.find(m => m._id === messageId);
    if (message && !message.isRead && message.sender._id !== currentUser.id) {
      socket.emit('markAsRead', messageId
       );

      setMessages(prevMessages => 
        prevMessages.map(message => 
          message._id === messageId 
            ? { ...message, isRead: true }
            : message
        )
      );
    }
  };

  // Function to handle message tap
  const handleMessageTap = (messageId) => {
    markMessageAsRead(messageId);
  };

  // Function to render message status ticks
  const renderMessageStatus = (message) => {
    // Check if this message was sent by the current user
    const isSentByCurrentUser = message.sender._id === currentUser?.id;

    if (isSentByCurrentUser) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons 
            name={message.isRead ? "checkmark-done" : "checkmark"} 
            size={16} 
            color={message.isRead ? "#007AFF" : "#8E8E93"} 
          />
        </View>
      );
    }
    return null;
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
    let hasAddedNewMessagesDivider = false;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      // Add "New Messages" divider before the first unread message
      if (!hasAddedNewMessagesDivider && !message.isRead && message.sender._id !== currentUser?.id) {
        groupedMessages.push({
          type: 'newMessages',
          id: 'new-messages-divider'
        });
        hasAddedNewMessagesDivider = true;
      }
      
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

    if (item.type === 'newMessages') {
      return (
        <View style={styles.newMessagesDivider}>
          <View style={styles.newMessagesDividerLine} />
          <Text style={styles.newMessagesDividerText}>New Messages</Text>
          <View style={styles.newMessagesDividerLine} />
        </View>
      );
    }

    const isSentByCurrentUser = item.sender._id === currentUser?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.messageBubble,
            isSentByCurrentUser ? styles.sentBubble : styles.receivedBubble,
            !item.isRead && !isSentByCurrentUser && styles.unreadMessageBubble,
          ]}
          onPress={() => handleMessageTap(item._id)}
          activeOpacity={0.8}
        >
          <Text style={styles.messageText}>{item.content}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isSentByCurrentUser && renderMessageStatus(item)}
          </View>
        </TouchableOpacity>
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
                onContentSizeChange={handleContentSizeChange}
                onLayout={scrollToBottom}
                onScroll={handleScroll}
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
    fontWeight: 500,
  },
  statusContainer: {
    marginLeft: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  newMessagesDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  newMessagesDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#007AFF',
  },
  newMessagesDividerText: {
    fontSize: 14,
    color: '#007AFF',
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  unreadMessageBubble: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});

export default ChatScreen; 