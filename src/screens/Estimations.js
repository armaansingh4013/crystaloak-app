import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from '../styles/globals';
import Loader from '../Sections/Loader';

const Estimations = ({ navigation }) => {
  const [estimations, setEstimations] = useState([]);
  const [filteredEstimations, setFilteredEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEstimations();
  }, []);

  useEffect(() => {
    filterEstimations();
  }, [searchQuery, estimations]);

  const fetchEstimations = async () => {
    // TODO: Replace with actual API call
    // For now using the sample data
    setEstimations([
      {
        "_id": "681c7e543ab09d55758ff6c2",
        "name": "Komalpreet Kaur",
        "email": "komalpreet@icloud.com",
        "phone": "8427088417",
        "address": "kapurthala , Punjab , India",
        "estimations": [
          {
            "rates": {
              "high": 1800,
              "mid": 1500,
              "low": 1250
            },
            "name": "New Build",
            "vat": false,
            "hasDimensions": true,
            "selectedRate": "mid",
            "rows": [
              {
                "length": 1,
                "width": 1,
                "quantity": 1,
                "_id": "681c7e543ab09d55758ff6c4"
              }
            ],
            "_id": "681c7e543ab09d55758ff6c3"
          }
        ],
        "createdAt": "2025-05-08T09:50:12.861Z"
      }
    ]);
    setLoading(false);
    setRefreshing(false);
  };

  const filterEstimations = () => {
    if (!searchQuery.trim()) {
      setFilteredEstimations(estimations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = estimations.filter(est => 
      est.name.toLowerCase().includes(query) ||
      est.email.toLowerCase().includes(query) ||
      est.phone.includes(query) ||
      est.address.toLowerCase().includes(query)
    );
    setFilteredEstimations(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEstimations();
  };

  const renderEstimationCard = ({ item }) => {
    const totalAmount = item.estimations.reduce((sum, est) => {
      const rate = est.rates[est.selectedRate];
      const area = est.rows.reduce((total, row) => total + (row.length * row.width * row.quantity), 0);
      return sum + (rate * area);
    }, 0);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('EstimationDetails', { estimation: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color={color.primary} />
            <Text style={styles.infoText}>{item.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={color.primary} />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={color.primary} />
            <Text style={styles.infoText} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amount}>₹{totalAmount.toLocaleString()}</Text>
          <Text style={styles.items}>{item.estimations.length} items</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Estimations" />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search estimations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading && <Loader />}
      <FlatList
        data={filteredEstimations}
        renderItem={renderEstimationCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.primary,
  },
  items: {
    fontSize: 14,
    color: '#666',
  },
});

export default Estimations;