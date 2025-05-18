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
import { View, Text, FlatList, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { userAttendance } from "../controller/attendance";
import { getUserData } from "../components/Storage";
import AttendanceCart from "../Sections/AttendanceCard";
import Header from "../Sections/Header";
import Loader from "../Sections/Loader";

const Attendance = () => {
  // const data = [
  //   { date: "12", day: "MON", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  //   { date: "13", day: "TUE", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  //   { date: "14", day: "WED", punchIn: "10:15 AM", punchOut: "07:18 AM" },
  // ];
  const [data,setData] = useState([])
  const[loading,setLoading] = useState(true)
  const [refreshing,setRefreshing] = useState(false)
  useEffect(() => {
   
    fetchAttendance()
  
  }, [])
  const onRefresh=()=>{
    setRefreshing(true)
    fetchAttendance()
  }
  const fetchAttendance = async ()=>{
      const user = await getUserData()
      const res = await userAttendance(user.id)
      
      setData(res.data)
      setLoading(false)
      setRefreshing(false)
    }
  return (
    <View style={styles.container}>
{loading&&<Loader message="Loading Past Attendance"/>}
      <Header title="Attendance" />
      {data.length <=0?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Text style={{fontSize:20,fontWeight:"bold"}}>Not Attendance Marked Yet</Text>
      </View>
      :<View style={styles.preview}>
      <FlatList
       refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        data={data}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
         <AttendanceCart item={item}/>
        )}
      />
     
      </View>}
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
