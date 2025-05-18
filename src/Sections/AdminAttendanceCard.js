import {useNavigation} from '@react-navigation/native';
import React, { useState } from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {base_url} from '../api';
import ImageViewer from '../components/ImageViewer';

const AdminAttendanceCard = ({item}) => {
  const navigation = useNavigation ();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  function formatLocalDate (isoString) {
    const date = new Date (isoString);
    return date.toLocaleDateString ([], {
      day: 'numeric',
      month: 'short',
    });
  }

  function formatLocalTime (isoString) {
    const date = new Date (isoString);
    return date.toLocaleTimeString ([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  function getWeekdayShort (isoString) {
    const date = new Date (isoString);
    return date.toLocaleDateString ('en-US', {weekday: 'short'}); // 'short' gives Mon, Tue, etc.
  }

  const handleImages = async () => {
    if (item.workImages && item.workImages.length > 0)
      navigation.navigate ('workimagespreview', {
        items: item.workImages,
      });
  };
  const details = async () => {
    if (item)
      navigation.navigate ('AttendanceDetails', {
        attendance: item,
      });
  };
  return (
    <View key={item._id} style={styles.card}>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          onLongPress={() => setImageViewerVisible(true)}
          delayLongPress={500}
        >
          <Image
            style={styles.image}
            source={{uri: item.profileImage?item.profileImage.imageUrl:""}}
          />
        </TouchableOpacity>
        <View style={styles.headerDetails}>
          <Text style={styles.name}>{item.employeeName}</Text>
          <Text style={styles.time}>{item.siteName}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View>
          <Text onPress={details} style={styles.label}>{'Check \n In - Out'}</Text>
          <Text
            style={{
              ...styles.time,
              borderBottomColor:"#d9d9d9",
              borderBottomWidth:1,
              paddingBottom:2
            }}
          >
            {item.checkIn && formatLocalTime (item.checkIn)}
          </Text><Text style={styles.time}>
            {item.checkOut ? formatLocalTime (item.checkOut):"--:--"}
          </Text>
          </View>
        {/* <View style={styles.details}> */}
          <Text onPress={handleImages} style={styles.imageTitle}>
            {item.workImages && item.workImages.length > 0
              ? 'Images'
              : 'No \n Images'}
          </Text>
        {/* </View> */}
      </View>

      <ImageViewer
        visible={imageViewerVisible}
        imageUrl={item.profileImage ? item.profileImage.imageUrl : ""}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

export default AdminAttendanceCard;

const styles = StyleSheet.create ({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateContainer: {
    alignItems: 'center',
    borderRadius: 10,
    width: '10%',
    flex: 1,
    flexDirection: 'col',
    justifyContent:"space-evenly",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 14,
    color: '#666',
    width: '100%',
    textAlign: 'center',
  },
  headerDetails:{
    alignItems: 'center',
    width: '100%',
  },
  details: {
    alignItems: 'center',
    width: '60%',
    flex: 1,
    flexDirection: 'row',
    justifyContent:"space-evenly"
  },
  label: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  imageTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
