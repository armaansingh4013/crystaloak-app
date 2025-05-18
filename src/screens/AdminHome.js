import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import color from "../styles/globals";
import Header from "../Sections/Header";
import { dashboard } from "../controller/admin/dashboard";
import { base_url } from "../api";
import { useNavigation } from "@react-navigation/native";
import NoWorkImage from "../assets/NoWorkImage.png"
import ImageViewer from '../components/ImageViewer';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const AdminHome = () => {
  const currentDate = new Date();
  const [data, setData] = useState({});
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const fetchData = async () => {
    const res = await dashboard();
    if (res.success) {
      setData(res.data);
    }
    setRefreshing(false);
  };

  const handleImages = async (items) => {
    navigation.navigate("workimagespreview", {
      items: items
    });
  };

  return (
    <><Header title="Crystaloak Constructions"/>
      <View style={styles.body}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Blue background top */}
          {/* <View style={styles.topBlueBackground}>
           
          </View> */}

          {/* Card Container */}
          <View style={styles.cardContainer}>
            {/* Employee Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{data.totalEnabledUsers ? data.totalEnabledUsers : 0}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Present</Text>
                <Text style={styles.statValue}>{data.presentUsers ? data.presentUsers : 0}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Absent</Text>
                <Text style={styles.statValue}>{data.absentUsers ? data.absentUsers : 0}</Text>
              </View>
            </View>

            {/* Site Wise Data */}
            <View style={styles.siteContainer}>
              <Text style={styles.siteTitle}>Sites</Text>
              {!data.siteWiseAttendance || data.siteWiseAttendance.length == 0 && <Text style={{ textAlign: "center" }}>Sites with employees present will be shown here !</Text>}
              {data.siteWiseAttendance && data.siteWiseAttendance.map((row, index) => (
                <View key={index} style={styles.siteRow}>
                  <Text style={styles.siteContent}>{row.siteName}</Text>
                  <Text style={styles.siteContent} >{row.presentCount}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Work Images Section */}
          <View style={styles.imageSection}>
            <Text style={styles.imageSectionTitle}>Work Images</Text>
            <View style={styles.imageRows}>
              {!data.workImagesData || data.workImagesData.length == 0 && <View style={{ height: 200, width: "100%", flex: 1, alignItems: "center", justifyContent: "center" }}><Image style={{ height: 150, borderRadius: 10, width: 150 }} source={NoWorkImage}></Image></View>}
              {data.workImagesData && data.workImagesData.map((row, index) => (
                <View key={index} style={styles.imageRow}>
                  <TouchableOpacity
                    onLongPress={() => {
                      if (row.employeeImage) {
                        setSelectedImage(row.employeeImage.imageUrl);
                        setImageViewerVisible(true);
                      }
                    }}
                    delayLongPress={500}
                  >
                    <Image source={{ uri: row.employeeImage ? row.employeeImage.imageUrl : "" }} style={styles.circle} />
                  </TouchableOpacity>
                  <Text style={styles.nameText}>{row.employeeName}</Text>
                  <Text style={styles.siteText}>{row.siteName}</Text>
                  <TouchableOpacity onPress={() => handleImages([data.workImagesData[index]])} style={styles.imageBtn}>
                    <Text style={{ color: "#fff" }}>Work Image</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Image Viewer Modal */}
        <ImageViewer
          visible={imageViewerVisible}
          imageUrl={selectedImage}
          onClose={() => setImageViewerVisible(false)}
        />
      </View>
    </>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: -1,
    backgroundColor: "white",
  },

  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 50,
    padding: 35,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    borderColor: "#000",
    backgroundColor: color.secondary,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    width: "29%"
  },
  statLabel: {
    fontSize: 20,
    color: "#555",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  siteContainer: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  siteTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  siteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: "bold"
  },
  siteContent: {
    fontWeight: "bold",
    fontSize: 15
  },
  imageSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  imageSectionTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageRows: {
    borderRadius: 20,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 8,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "semiBold"
  },
  siteText: {
    flex: 1,
    fontSize: 16,
  },
  imageBtn: {
    backgroundColor: color.secondary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
