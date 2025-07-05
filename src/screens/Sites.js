import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
  Switch,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import color from '../styles/globals';
import { addSites, getSites, updateSites } from '../controller/sites';
import Loader from '../Sections/Loader';

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [siteNameError, setSiteNameError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = async () => {
    const res = await getSites();
    if (res.success) {
      setSites(res.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleAddOrUpdate = async () => {
    // Validate site name
    if (!siteName.trim()) {
      setSiteNameError('Site is required');
      return;
    }
    
    // Clear error if validation passes
    setSiteNameError('');

    if (editingSite) {
      const updatedData = {
        name: siteName,
        enabled:isActive,
        siteId: editingSite._id,
      };
      const res = await updateSites(updatedData);
      if (res.success) {
        setSites((prev) =>
          prev.map((site) =>
            site._id === editingSite._id
              ? { ...site, name: siteName, isActive }
              : site
          )
        );
      }
    } else {
      const res = await addSites(siteName);
      if (res.success) {
        setSites((prev) => [...prev, res.data]);
      }
    }

    setModalVisible(false);
    setSiteName('');
    setIsActive(false);
    setEditingSite(null);
    setSiteNameError('');
  };

  const openAddModal = () => {
    setSiteName('');
    setIsActive(true);
    setEditingSite(null);
    setSiteNameError('');
    setModalVisible(true);
  };

  const openEditModal = (site) => {
    setSiteName(site.name);
    setIsActive(site.isActive);
    setEditingSite(site);
    setSiteNameError('');
    setModalVisible(true);
  };

  const handleSiteClick = (item) => {
    openEditModal(item);
  };

  const renderSite = ({ item }) => (
    <View key={item._id} style={styles.siteCard}>
      <Text style={styles.siteName}>{item.name}</Text>
      <Text style={styles.siteStatus}>
        {item.isActive ? 'Active' : 'Inactive'}
      </Text>
      <TouchableOpacity
        style={styles.editIcon}
        onPress={() => handleSiteClick(item)}
      >
        <Ionicons name="pencil" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading && <Loader />}
      <Header
        onBackPress={() => navigation.goBack()}
        title="Sites"
        rightComponent={
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Ionicons name="add-circle" size={30} color={color.secondary} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={sites}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderSite}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)} // handle back button
        >
          <TouchableWithoutFeedback
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editingSite ? 'Edit Site' : 'Add New Site'}
                  </Text>
                  <TextInput
                    value={siteName}
                    onChangeText={(text) => {
                      setSiteName(text);
                      if (text.trim()) {
                        setSiteNameError('');
                      }
                    }}
                    placeholder="Site Name"
                    style={[styles.input, siteNameError ? styles.inputError : null]}
                  />
                  {siteNameError ? (
                    <Text style={styles.errorText}>{siteNameError}</Text>
                  ) : null}
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Active:</Text>
                    <Switch
                      value={isActive}
                      onValueChange={(value) => setIsActive(value)}
                      trackColor={{ false: '#ccc', true: `#b8b3e1` }}
                      thumbColor={isActive ? `${color.primary}` : '#f4f3f4'}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleAddOrUpdate}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>
                      {editingSite ? 'Update Site' : 'Add Site'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  siteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  siteName: {
    fontSize: 18,
    fontWeight: 500,
    width: '40%',
    color:"black"

  },
  siteStatus: {
    fontSize: 16,
    color: '#555',
    width: '30%',
  },
  editIcon: {
    paddingLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
    color:"black"
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color:"Black"
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color:"black"
  },
  submitButton: {
    backgroundColor: color.secondary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 16,
  },
  addButton: {
    marginRight: 16,
  },
});

export default Sites;
