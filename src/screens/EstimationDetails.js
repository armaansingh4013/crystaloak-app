import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import color from '../styles/globals';

const EstimationDetails = ({ route, navigation }) => {
  const { estimation } = route.params;

  const calculateTotal = (estimation) => {
    return estimation.estimations.reduce((sum, est) => {
      const rate = est.rates[est.selectedRate];
      const area = est.rows.reduce((total, row) => total + (row.length * row.width * row.quantity), 0);
      return sum + (rate * area);
    }, 0);
  };

  const renderEstimationTable = (estimation) => {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Item</Text>
          <Text style={styles.headerCell}>Rate</Text>
          <Text style={styles.headerCell}>Area</Text>
          <Text style={styles.headerCell}>Amount</Text>
        </View>

        {estimation.estimations.map((est, index) => {
          const rate = est.rates[est.selectedRate];
          const area = est.rows.reduce((total, row) => total + (row.length * row.width * row.quantity), 0);
          const amount = rate * area;

          return (
            <View key={est._id} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 2 }]}>{est.name}</Text>
              <Text style={styles.cell}>₹{rate}</Text>
              <Text style={styles.cell}>{area} sq.ft</Text>
              <Text style={styles.cell}>₹{amount}</Text>
            </View>
          );
        })}

        <View style={styles.tableFooter}>
          <Text style={[styles.footerCell, { flex: 2 }]}>Total</Text>
          <Text style={styles.footerCell}></Text>
          <Text style={styles.footerCell}></Text>
          <Text style={styles.footerCell}>₹{calculateTotal(estimation)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Estimation Details" 
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>{estimation.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color={color.primary} />
            <Text style={styles.infoText}>{estimation.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={color.primary} />
            <Text style={styles.infoText}>{estimation.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={color.primary} />
            <Text style={styles.infoText}>{estimation.address}</Text>
          </View>
        </View>

        {renderEstimationTable(estimation)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  tableFooter: {
    flexDirection: 'row',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.primary,
  },
});

export default EstimationDetails; 