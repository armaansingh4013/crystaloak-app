import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import { getInquiries } from '../controller/website/inquiry';
import Loader from '../Sections/Loader';

const QueryListScreen = () => {
    const [enquiries,setEnquiries] = useState([])
      const navigation = useNavigation()
      const [refreshing,setRefreshing] = useState(false)
      const [loading,setLoading] = useState(true)
useEffect(() => {
  fetchData()
}, [])
const onRefresh=()=>{
    setRefreshing(true)
fetchData()
}
const fetchData = async ()=>{
    const res = await getInquiries()
    if(res.success){
        setEnquiries(res.data)
    }
    setLoading(false)
    setRefreshing(false)
}

  const renderEnquiry = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.row}><Text style={styles.label}>Email: </Text><Text style={styles.value}>{item.email}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Phone: </Text><Text style={styles.value}>{item.phone}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Postcode: </Text><Text style={styles.value}>{item.postcode}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Visit/Call: </Text><Text style={styles.value}>{item.visitOrCall}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Budget: </Text><Text style={styles.value}>{item.approximateBudget}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Date: </Text><Text style={styles.value}>{item.date}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Time: </Text><Text style={styles.value}>{item.time}</Text></View>
     <View style={styles.row}><Text style={styles.label}>Address: </Text><Text style={styles.value}>{item.address}</Text></View>
     <View style={styles.row}><Text style={styles.label}>Spcial Requirements: </Text><Text style={styles.value}>{item.message}</Text></View>

    </View>
  );

  return (
    <View
    
      style={styles.container}>
        <Header  onBackPress={() => navigation.goBack()} title="Customer Enquiries"/>
            {loading&&<Loader/>}
      <FlatList
       refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
        data={enquiries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderEnquiry}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#6366f1',
    color: 'white',
    textAlign: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap:"wrap",
    maxWidth:"90%"
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});

export default QueryListScreen;
