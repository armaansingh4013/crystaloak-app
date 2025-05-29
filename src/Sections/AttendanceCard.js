import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, FlatList, StyleSheet } from "react-native";

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
        navigation.navigate("workimagespreview",{
          items:item.workImages
        })
    }
  return (
   <View key={item._id} style={styles.card}>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>{formatLocalDate(item.date)}</Text>
                <Text style={styles.day}>{getWeekdayShort(item.date)}</Text>
              <View style={styles.details}>
                <Text style={styles.time}>{item.siteId&&item.siteId.name}</Text>
              </View>
              </View>
              <View style={styles.details}>
                <Text style={styles.label}>{"Check \n In - Out"}</Text>
                <Text style={styles.time}>{item.checkIn&&formatLocalTime(item.checkIn.time)}</Text>

                <Text style={styles.time}>{item.checkOut&&formatLocalTime(item.checkOut.time)}</Text>
              </View>
              <View style={styles.details}>
                <Text onPress={handleImages} style={styles.imageTitle}>{item.workImages&&item.workImages.length>0?"Images":"No \n Images"}</Text>
              </View>
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
    },
   imageTitle:{
    textAlign:"center",
      fontSize: 16,
      fontWeight:"bold"
   }
  });