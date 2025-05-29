import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Switch,
  StyleSheet, Alert, Modal, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Header from '../Sections/Header';
import color from '../styles/globals';
import {
  addSiteHoliday, deleteSiteHoliday, getSiteHoliday,
  updateSiteHoliday, updateSites
} from '../controller/sites';

const SiteHolidayScreen = ({ route }) => {
  const navigation = useNavigation();
  const { siteId, name, isActive } = route.params;

  const [siteName, setSiteName] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [holidays, setHolidays] = useState([]);
  const [newHolidayDesc, setNewHolidayDesc] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editDatePicker, setEditDatePicker] = useState(false);

  const fetchData = async () => {
    const res = await getSiteHoliday(siteId);
    if (res.success) {
      setHolidays(res.data || []);
    }
  };

  useEffect(() => {
    setSiteName(name);
    setIsEnabled(isActive);
    fetchData();
  }, []);

  const handleSiteUpdate = async () => {
    const res = await updateSites({siteId,  name: siteName, enabled: isEnabled });
    if (res.success) {
      Alert.alert('Updated', 'Site info updated successfully');
    }
  };

  const handleAddHoliday = async () => {
    if (!newHolidayDesc.trim()) return;
    const res = await addSiteHoliday( {
        id:siteId,
      description: newHolidayDesc,
      date: newHolidayDate.toISOString()
    });
    if (res.success) {
      setNewHolidayDesc('');
      setNewHolidayDate(new Date());
      fetchData();
    }
  };

  const handleUpdateHoliday = async () => {
    if (!selectedHoliday?.description.trim()) return;
    const res = await updateSiteHoliday( {
        id:siteId,
      description: selectedHoliday.description,
      date: selectedHoliday.date
    });
    if (res.success) {
      setModalVisible(false);
      fetchData();
    }
  };

  const handleDeleteHoliday = async (date) => {
    Alert.alert('Delete Holiday', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await deleteSiteHoliday({id:siteId, date:date});
          if (res.success) fetchData();
        },
      },
    ]);
  };

  const renderHoliday = ({ item }) => (
    <View style={styles.holidayCard}>
      <View>
        <Text style={styles.holidayText}>{item.description}</Text>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => {
          setSelectedHoliday({ ...item });
          setModalVisible(true);
        }}>
          <Ionicons name="create-outline" size={20} color={color.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteHoliday(item.date)}>
          <Ionicons name="trash-outline" size={20} color="red" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Header title="Site Holidays" onBackPress={() => navigation.goBack()} />

      <View style={styles.container}>
        <Text style={styles.label}>Site Name</Text>
        <TextInput
          value={siteName}
          onChangeText={setSiteName}
          style={styles.input}
        />
        <View style={styles.switchRow}>
          <Text style={styles.label}>Enabled</Text>
          <Switch value={isEnabled} onValueChange={setIsEnabled} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSiteUpdate}>
          <Text style={styles.saveText}>Update Site</Text>
        </TouchableOpacity>

        {/* <Text style={[styles.label, { marginTop: 20 }]}>Add Holiday</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>📅 {newHolidayDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={newHolidayDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setNewHolidayDate(selectedDate);
            }}
          />
        )} */}
        {/* <View style={styles.addRow}>
          <TextInput
            placeholder="Holiday description"
            value={newHolidayDesc}
            onChangeText={setNewHolidayDesc}
            style={[styles.input, { flex: 1 }]}
          />
          <TouchableOpacity onPress={handleAddHoliday} style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View> */}

        {/* <FlatList
          data={holidays}
          keyExtractor={(item) => item._id}
          renderItem={renderHoliday}
          contentContainerStyle={{ paddingBottom: 100 }}
        /> */}
      </View>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Holiday</Text>
            <TouchableOpacity onPress={() => setEditDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>📅 {new Date(selectedHoliday?.date).toDateString()}</Text>
            </TouchableOpacity>
            {editDatePicker && (
              <DateTimePicker
                value={new Date(selectedHoliday?.date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(e, date) => {
                  setEditDatePicker(false);
                  if (date) setSelectedHoliday({ ...selectedHoliday, date });
                }}
              />
            )}
            <TextInput
              value={selectedHoliday?.description}
              onChangeText={(text) => setSelectedHoliday({ ...selectedHoliday, description: text })}
              style={styles.input}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateHoliday}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: color.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  addBtn: {
    marginLeft: 8,
    backgroundColor: color.secondary,
    padding: 10,
    borderRadius: 10,
  },
  holidayCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  holidayText: { fontSize: 16 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: 'red', fontWeight: '500' },
  dateButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    color: '#374151',
  },
});

export default SiteHolidayScreen;
