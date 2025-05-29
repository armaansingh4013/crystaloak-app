import React, {useState, useEffect, useRef, useContext} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import color from '../styles/globals';
import {CameraView, CameraType, Camera} from 'expo-camera';
import * as Location from 'expo-location';
import {getUserData, removeToken} from '../components/Storage';
import getProfile from '../controller/profile';
import {
  attendanceStatus,
  attendanceCheckIn,
  attendanceCheckOut,
} from '../controller/attendance';
import uploadPhotos from '../controller/photos';
import {AuthContext} from '../components/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import { getEnabledSites, getSites } from '../controller/sites';
import Header from "../Sections/Header"
import { Ionicons } from '@expo/vector-icons';
const screenWidth = Dimensions.get ('window').width;
import logo from "../../assets/logo.png"
import mime from 'mime';
import { base_url } from '../api';
import { Dropdown } from 'react-native-element-dropdown';
import Loader from '../Sections/Loader';
import { RefreshControl } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import holiday from "../assets/holiday.json"
import Toast from 'react-native-toast-message';
const Home = () => {
  const {logout} = useContext (AuthContext);
  const navigation = useNavigation ();
  const [cameraPermission, setCameraPermission] = useState (null);
  const [locationPermission, setLocationPermission] = useState (null);
  const [modalVisible, setModalVisible] = useState (false);
  const cameraRef = useRef (null);
  const [photo, setPhoto] = useState (null);
  const [location, setLocation] = useState (null);
  const [address, setAddress] = useState(null);
  const [shiftData, setShiftData] = useState ({
    employeeCode: '',
    date: '',
    time: '',
    location: '',
    photo: null,
    siteId: '',
  });
  const [data, setData] = useState ({});
  const [attendance, setAttendace] = useState ({canCheckIn:false,canCheckOut:false});
  const [siteDropdown, setSiteDropdown] = useState (false);
  const [sites,setSites] = useState([])
  const [selectedSite,setSelectedSite] = useState()
  const [loading,setLoading] = useState(true)
  const [cameraType,setCameraType] = useState("front")
  const [refreshing,setRefreshing] = useState(false)
  const [checkInAddress, setCheckInAddress] = useState(null);
  const [checkOutAddress, setCheckOutAddress] = useState(null);
  const [checkInSite, setCheckInSite] = useState(null);

  useEffect (() => {
    fetchData();
  }, []);
  const fetchData = async()=>{
    try {
      setLoading(true);
      const res = await getProfile ();
      const sitesRes = await getEnabledSites()
      setSites(sitesRes.data)
      if (res.success) {
        setData (res.data);
        await getAttendanceStatus(res.data._id);
      } else {
        // await logout()
        // navigation.replace("Landing")
      }
      const {
        status: cameraStatus,
      } = await Camera.requestCameraPermissionsAsync ();
      setCameraPermission (cameraStatus === 'granted');

      const {
        status: locationStatus,
      } = await Location.requestForegroundPermissionsAsync ();
      setLocationPermission (locationStatus === 'granted');
      let locationData = await Location.getCurrentPositionAsync ({});
      
      const locationString = `${locationData.coords.latitude} ${locationData.coords.longitude}`;
      setLocation(locationString);
      
      // Get address string
      const addressString = await getAddressString(locationString);
      setAddress(addressString);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load data',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const onRefresh = ()=>{
    setRefreshing(true)
    fetchData()
  }

  const getAddressString = async (coordinates)=>{
    const cords = coordinates.split(" ")
    try {
      let addressResponse = await Location.reverseGeocodeAsync({
      latitude:Number(cords[0]),
      longitude:Number(cords[1]),
    });

    if (addressResponse.length > 0) {
      const addressObj = addressResponse[0];
      const formattedAddress = `${addressObj.name}, ${addressObj.city}, ${addressObj.region}, ${addressObj.postalCode}, ${addressObj.country}`;
      
    return formattedAddress
    } 
    } catch (error) {
      return ""
    }
    
  }

  const getAttendanceStatus = async (userId) => {
    try {
      const res = await attendanceStatus(userId);
      if (res.success) {
        setAttendace(res.data);
        // Get addresses for check-in and check-out
        if (res.data.checkIn) {
          const checkInAddressString = await getAddressString(`${res.data.checkIn.location.coordinates[0]} ${res.data.checkIn.location.coordinates[1]}`);
          setCheckInAddress(checkInAddressString);
          // setCheckInSite(res.data.checkIn.siteId);
          // If canCheckOut is true, set the selected site to the check-in site
          if (res.data.canCheckOut) {
            setSelectedSite(res.data.siteId);
          }
        }
        if (res.data.checkOut) {
          const checkOutAddressString = await getAddressString(`${res.data.checkOut.location.coordinates[0]} ${res.data.checkOut.location.coordinates[1]}`);
          setCheckOutAddress(checkOutAddressString);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch attendance status',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch attendance status',
        position: 'top',
      });
    }
  };

  const handleOpenCamera = () => {
    if(!selectedSite){
      Alert.alert(
        "Site Selection Required",
        "Please select a site before checking in/out",
        [{ text: "OK" }]
      );
      return;
    }
    setModalVisible(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photoData = await cameraRef.current.takePictureAsync();
        setPhoto(photoData.uri);
        setModalVisible(false);

        // Upload photo first
        const photoPath = await uploadPhoto(photoData.uri);
        if (!photoPath) {
          Toast.show({
            type: 'error',
            text1: 'Failed to upload photo',
            text2: 'Please try again',
            position: 'center',
          });
          return;
        }

        // Prepare check-in/check-out data
        const actionData = {
          userId: data._id,
          location: location,
          photo: photoPath,
          siteId: selectedSite
        };

        // Perform check-in or check-out based on current status
        if (attendance.canCheckIn) {
          await handleCheckIn(actionData);
        } else if (attendance.canCheckOut) {
          await handleCheckout(actionData);
        }

        // Refresh attendance status
        await getAttendanceStatus(data._id);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to process photo and attendance',
          text2: 'Please try again',
          position: 'center',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCheckIn = async (data) => {
    try {
      const res = await attendanceCheckIn(data);
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Check-in Successful!',
          text2: 'You have been checked in successfully',
          position: 'center',
        });
        // Refresh attendance status
        await getAttendanceStatus(data.userId);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Check-in Failed',
          text2: res.message || 'Please try again',
          position: 'center',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Check-in Failed',
        text2: 'Please try again',
        position: 'center',
      });
    }
  };

  const handleCheckout = async (data) => {
    try {
      const res = await attendanceCheckOut(data);
      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Check-out Successful!',
          text2: 'You have been checked out successfully',
          position: 'center',
        });
        // Refresh attendance status
        await getAttendanceStatus(data.userId);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Check-out Failed',
          text2: res.message || 'Please try again',
          position: 'center',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Check-out Failed',
        text2: 'Please try again',
        position: 'center',
      });
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      const fileType = mime.getType(file) || "image/jpeg";
      
      formData.append("photos", {
        uri: file,
        name: `photo_${Date.now()}.${mime.getExtension(fileType) || "jpg"}`,
        type: fileType,
      });

      const res = await uploadPhotos(formData);
      if (res.success && res.data.paths && res.data.paths[0]) {
        return res.data.paths[0].imageUrl;
      } else {
        throw new Error('Failed to upload photo');
      }
    } catch (error) {
      
      return null;
    }
  };
  return (
    <>
    <View style={style.body}>
    
      {loading&&<Loader message="Completing Action ..."/>}
      <ScrollView  refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
        <Header
            title="Crystaloak Construction"
          
          />
        <View style={style.section}>

          <View style={style.upperSection}>
            <View style={style.header}>
              <View>
                <Text style={style.heading}>{data.name}</Text>
                <Text style={style.date}>{new Date ().toDateString ()}</Text>
                <Text style={style.address}>
                  {address ? address : 'Fetching location'}
                </Text>
              </View>
              <View style={style.imageContainer}>
                <Image
                  source={{uri:data.profileImage?data.profileImage.imageUrl:""}}
                  style={style.image}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
          {attendance.isHoliday?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            
          <LottieView style={{height: 150, width: 150}} source={holiday} autoPlay loop/>
<Text style={{fontSize:20,fontWeight:"bold"}}>Today is Holiday</Text>
          </View>:
          <View style={style.mainSection}>
            <View style={style.header}>
              <View>
             { !attendance.canCheckIn &&
                  !attendance.canCheckOut ?<></>:<Dropdown
                data={sites}
                search
                maxHeight={200}
                labelField="name"
                valueField="_id"
                placeholder="Select site"
                searchPlaceholder="Search..."
                value={selectedSite}
                onChange={(item) => {
                  if (!attendance.canCheckOut) {
                    setSelectedSite(item._id);
                  }
                }}
                disabled={attendance.canCheckOut}
                style={{marginTop: 10,width:screenWidth*0.9 , backgroundColor:"#D3D3D3" , padding:15, borderRadius:10}}
              />}
                {/* <DropDownPicker
                  open={siteDropdown}
                  value={shiftData.site}
                  items={sites.map(site => ({
                    label: site.name,
                    value: site._id
                  }))}
                  setOpen={setSiteDropdown}
                  // setValue={value =>{
                  // }}
                  // setItems={setItems}
                  placeholder="Select Site"
                  zIndex={10}
                  style={{marginTop: 10}}
                /> */}
              </View>
            </View>
            <View>
              <View>
                {attendance.canCheckIn &&
                  <TouchableOpacity
                    onPress={handleOpenCamera}
                    style={style.button}
                  >
                    <Text style={style.buttonText}>Check In</Text>
                  </TouchableOpacity>}
                {attendance.canCheckOut &&
                  <TouchableOpacity
                    onPress={handleOpenCamera}
                    style={style.button}
                  >
                    <Text style={style.buttonText}>Check Out</Text>
                  </TouchableOpacity>}
                {!attendance.canCheckIn &&
                  !attendance.canCheckOut &&
                  
                    <Text style={style.message}>{attendance.message}</Text>
                }
              </View>
            </View>
            <View style={style.container}>
              {(attendance.canCheckOut ||
                (!attendance.canCheckIn && !attendance.canCheckOut)) &&
                <View style={style.card}>
                  <Text style={style.cardHeading}>Shift Started At</Text>
                  <View style={style.cardBody}>
                    <View>
                      <Text style={style.cardDateTime}>
                        {attendance &&
                          attendance.checkIn &&
                          new Date (
                            attendance.checkIn.time
                          ).toLocaleString ('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                      </Text>
                      <Text style={style.cardAddress}>
                        {attendance.checkIn &&
                          checkInAddress}
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={attendance.checkIn&&({uri: attendance.checkIn.photo})}
                        style={style.cardImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>}
              {!attendance.canCheckIn &&
                !attendance.canCheckOut &&
                <View style={{...style.card,borderTopWidth:2,borderColor:"#D3D3D3"}}>
                  <Text style={style.cardHeading}>Shift Ended At</Text>
                  <View style={style.cardBody}>
                    <View>
                      <Text style={style.cardDateTime}>
                        {attendance &&
                          attendance.checkOut &&
                          new Date (
                            attendance.checkOut.time
                          ).toLocaleString ('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}

                      </Text>
                      <Text style={style.cardAddress}>
                      {attendance.checkOut &&
                          checkOutAddress}
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={attendance.checkOut&&({uri:attendance.checkOut.photo})}
                        style={style.cardImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>}

            </View>
          </View>}
        </View>
      </ScrollView>
      {/* Camera Modal */}
      {modalVisible&&<Modal visible={modalVisible} animationType="slide">
      <TouchableOpacity onPress={() => setCameraType(
  cameraType === "back" ? "front" : "back"
)} style={style.cameraSwitchButton}>
  <Ionicons name="camera-reverse-outline" size={30} color="white" />
</TouchableOpacity>

      <TouchableOpacity 
        onPress={() => setModalVisible(false)} 
        style={style.closeButton}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

        <CameraView ref={cameraRef} style={style.camera} facing={cameraType}>
          <View style={style.cameraContainer}>
            <TouchableOpacity
              style={style.captureButton}
              onPress={handleTakePicture}
            >
              <Text style={style.buttonText}>📸 Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>}
    </View></>
  );
};

export default Home;

const style = StyleSheet.create ({
  body: {
    backgroundColor: color.background,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: color.background,
    width: screenWidth > 500 ? 500 : screenWidth ,
    height: '100%',
    shadowColor: 'black',
    shadowRadius: 5,
  },
  upperSection: {
    backgroundColor: 'white',
    borderRadius:20,
    margin:10,
    shadowColor:color.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical:20
  },
  picker: {height: 50, width: 150, color: 'black', zIndex: 10, elevation: 10},
  designation: {
    fontSize: 17,
    color: 'gray',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: color.primary,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  mainSection: {
    paddingVertical: 20,
    width: '100%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 15,
    color: 'gray',
    maxWidth: screenWidth * 0.5,
    marginBottom:20
  },
  button: {
    backgroundColor: color.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    backgroundColor: color.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 20,
    flex: 1,
    fontWeight:800,
    textAlign:"center",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  container: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: color.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    paddingVertical: 20,
    width: '100%',
    padding: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: 22,
    textAlign: 'start',
    fontWeight: 'bold',
  },
  cardDateTime: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
  cardAddress: {
    fontSize: 15,
    color: 'gray',
    padding: 3,
    maxWidth: "80%"
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius:10
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  cameraSwitchButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
});
