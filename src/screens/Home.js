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
import { getSites } from '../controller/sites';
import Header from "../Sections/Header"
import { Ionicons } from '@expo/vector-icons';
const screenWidth = Dimensions.get ('window').width;
import logo from "../../assets/logo.png"
import mime from 'mime';
import { base_url } from '../api';

const Home = () => {
  const {logout} = useContext (AuthContext);
  const navigation = useNavigation ();
  const [cameraPermission, setCameraPermission] = useState (null);
  const [locationPermission, setLocationPermission] = useState (null);
  const [modalVisible, setModalVisible] = useState (false);
  const cameraRef = useRef (null);
  const [photo, setPhoto] = useState (null);
  const [location, setLocation] = useState (null);
  const [shiftData, setShiftData] = useState ({
    employeeCode: '',
    date: '',
    time: '',
    location: '',
    photo: null,
    siteId: '',
  });
  const [data, setData] = useState ({});
  const [attendance, setAttendace] = useState ({});
  const [siteDropdown, setSiteDropdown] = useState (false);
  const [sites,setSites] = useState([])
  useEffect (() => {
    (async () => {
      const res = await getProfile ();
      const sitesRes = await getSites()
      console.log(sitesRes)
      setSites(sitesRes.data)
      if (res.success) {
        setData (res.data);
        getAttendanceStatus (res.data._id);
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
      setLocation (
        `${locationData.coords.latitude} ${locationData.coords.longitude}`
      );
    }) ();
  }, []);
  const getAttendanceStatus = async userId => {
    console.log ('====================================');
    console.log (userId);
    console.log ('====================================');
    const res = await attendanceStatus (userId);
    console.log (res);
    setAttendace (res.data);
  };

  const handleOpenCamera = () => {
    setModalVisible (true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync ();
      setPhoto (photoData.uri);
      setModalVisible (false);

      // Capture Date & Time
      const now = new Date ();
      const date = now.toISOString ().split ('T')[0]; // YYYY-MM-DD format
      const time = now.toLocaleTimeString ();

      // Get Location

      // Save Data in State
      setShiftData ({
        ...shiftData,
        date,
        time,
        location: location,
        photo: photo,
      });
      console.log (attendance);
      const photoPath = await uploadPhoto(photoData.uri);
      console.log(photoPath)
      if (attendance.canCheckIn) {
        handleCheckIn ({
          userId: data._id,
          location: location,
          photo: photoPath,
          siteId:shiftData.siteId
        });
      }
      if (attendance.canCheckOut) {
        handleCheckout ({
          userId: data._id,
          location: location,
          photo: photoPath,
          siteId:shiftData.siteId
        });
      }
    }
  };

  const handleCheckIn = async data => {
    const res = await attendanceCheckIn (data);

    console.log (res);
    console.log ('Shift Data:', shiftData);
    alert ('Shift Started! Data saved.', shiftData);
  };
  const handleCheckout = async data => {
    const res = await attendanceCheckOut (data);
    console.log (res);
    console.log ('Shift Data:', shiftData);
    alert ('Shift Started! Data saved.', shiftData);
  };

  const uploadPhoto = async file => {
    
    const formData = new FormData ();
    // formData.append ('photos', {
    //   uri: file,
    //   name: 'photo.jpg',
    //   type: 'image/jpeg',
    // });
    const base64Uri = file; // This is a base64 string
        const fileType = mime.getType(base64Uri) || "image/jpeg";
    
        // Convert base64 to Blob
        const response = await fetch(base64Uri);
        const blob = await response.blob();
    
        formData.append("photos", {
          uri: base64Uri, // Use the file.uri, but converted to a blob
          name: `photo_${Date.now()}.${mime.getExtension(fileType) || "jpg"}`,
          type: fileType,
        }); 
    const res = await uploadPhotos(formData);
    return res.data.paths[0]
  };
  return (
    <>
    <View style={style.body}>
    
      
      <ScrollView>
        <Header
            title="Crystaloak Construction"
            rightComponent={
              <TouchableOpacity onPress={() => Alert.alert("Settings pressed")}>
               
              </TouchableOpacity>
            }
          />
        <View style={style.section}>

          <View style={style.upperSection}>
            <View style={style.header}>
              <View>
                <Text style={style.heading}>{data.name}</Text>
                <Text style={style.date}>{new Date ().toDateString ()}</Text>
                <Text style={style.address}>
                  {location ? location : 'Fetching location'}
                </Text>
              </View>
              <View style={style.imageContainer}>
                <Image
                  source={{uri:"data:image/jpeg;base64,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"}}
                  style={style.image}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          <View style={style.mainSection}>
            <View style={style.header}>
              <View>
              
                <DropDownPicker
                  open={siteDropdown}
                  value={shiftData.site}
                  items={sites.map(site => ({
                    label: site.name,
                    value: site._id
                  }))}
                  setOpen={setSiteDropdown}
                  setValue={callback =>
                    setShiftData (prev => ({
                      ...prev,
                      siteId: callback (prev.site),
                    }))}
                  // setItems={setItems}
                  placeholder="Select Site"
                  zIndex={10}
                  style={{marginTop: 10}}
                />
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
                          attendance.checkIn.location.coordinates}
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={attendance.checkIn&&({uri: base_url+"/"+attendance.checkIn.photo})}
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
                          attendance.checkOut.location.coordinates}
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={attendance.checkOut&&({uri: base_url+"/"+attendance.checkOut.photo})}
                        style={style.cardImage}
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>}

            </View>
          </View>
        </View>
      </ScrollView>
      {/* Camera Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <CameraView ref={cameraRef} style={style.camera} facing="front">
          <View style={style.cameraContainer}>
            <TouchableOpacity
              style={style.captureButton}
              onPress={handleTakePicture}
            >
              <Text style={style.buttonText}>📸 Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>
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
  imageContainer:{

    width: 100,
    height: 100,
    borderRadius: 50,
    overflow:"hidden"
  },
  image: {
    width: 50,
    height: 80,
    borderRadius: 50,
    overflow:"hidden"
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
    borderRadius:20,
    backgroundColor:"white",
    shadowColor:color.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    paddingVertical: 20,
    width: '100%',
    padding: 12,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOpacity: 0.5,
    borderRadius: 10,
    elevation: 5,
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
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius:10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
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
});
