import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../styles/globals';

const AttendanceCard = ({item}) => {
  const navigation = useNavigation()

     
  function formatLocalDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString([], {
        day: 'numeric',
        month: 'short'
    });
}
    
    function formatLocalTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      });
  }
    
    function getWeekdayShort(isoString) {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { weekday: 'short' }); // 'short' gives Mon, Tue, etc.
    }

    const handleImages = async ()=>{
      if(item.workImages&&item.workImages.length>0)
        navigation.navigate("WorkImagesPreview",{
          items:item.workImages
        })
    }

    const hasWorkImages = item.workImages && item.workImages.length > 0;

  return (
   <View key={item._id} style={styles.card}>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>{formatLocalDate(item.date)}</Text>
                <Text style={styles.day}>{getWeekdayShort(item.date)}</Text>
              <View style={styles.details}>
                <Text style={styles.time} numberOfLines={1} ellipsizeMode="tail">{item.siteId&&item.siteId.name}</Text>
              </View>
              </View>
              <View style={styles.details}>
                <Text style={styles.label}>{"Check \n In - Out"}</Text>
                <Text style={styles.time}>{item.checkIn&&formatLocalTime(item.checkIn.time)}</Text>

                <Text style={styles.time}>{item.checkOut&&formatLocalTime(item.checkOut.time)}</Text>
              </View>
              <TouchableOpacity
                style={styles.imageActionContainer}
                onPress={handleImages}
                disabled={!hasWorkImages}>
                {hasWorkImages ? (
                  <>
                    <Icon name="photo" size={30} color={color.secondary} />
                    <Text style={[styles.imageActionText, {color: color.secondary}]}>View Images</Text>
                  </>
                ) : (
                  <>
                    <Icon name="camera" size={30} color="#888" />
                    <Text style={styles.imageActionText}>No Image</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
  )
}

export default AttendanceCard

const styles = StyleSheet.create({
    
    card: {
      backgroundColor: "#FFF",
      borderRadius: 10,
      padding: 10,
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5

    },
    dateContainer: {
      alignItems: "center",
      backgroundColor:"#f0f0f0",
      borderRadius:10,
      padding:10
    },
    date: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
    },
    day: {
      fontSize: 14,
      color: "#666",
    },
    details: {
      alignItems: "center",
      width: 100,
    },
    label: {
      fontSize: 14,
      color: "#888",
      textAlign:"center"
    },
    time: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
      // width: '100%',
    },
    imageActionContainer: {
      alignItems: 'center',
      width: 60,
    },
    imageActionText: {
      marginTop: 5,
      fontSize: 12,
      color: '#888',
      textAlign: 'center',
    }
  });