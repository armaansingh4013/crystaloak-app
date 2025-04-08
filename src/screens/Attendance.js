// import React from 'react'

// const Attendence = () => {
//   return (
//     <View>
//       attendace
//     </View>
//   )
// }

// export default Attendence

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { userAttendance } from "../controller/attendance";
import { getUserData } from "../components/Storage";
import AttendanceCart from "../Sections/AttendanceCard";
import Header from "../Sections/Header";

const Attendance = () => {
  // const data = [
  //   { date: "12", day: "MON", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  //   { date: "13", day: "TUE", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  //   { date: "14", day: "WED", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  // ];
  const [data,setData] = useState([])
  useEffect(() => {
    const fetchAttendance = async ()=>{
      const user = await getUserData()
      const res = await userAttendance(user.id)
      console.log(res)
      setData(res.data)
    }
    fetchAttendance()
  
  }, [])
 
  return (
    <View style={styles.container}>
      <Header title="Attendance" />
      <View style={styles.preview}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
         <AttendanceCart item={item}/>
        )}
      />
     
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  preview:{
    padding:10
  }
 
 
});

export default Attendance;
