import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import color from "../styles/globals";
import { useNavigation, useRoute } from "@react-navigation/native";
import { base_url } from "../api";
import Header from "../Sections/Header";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height
const WorkImagesPreview = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const { items } = route.params;

  const renderImage = ({ item }) => (
    <Image
      source={{ uri: base_url + "/" + item }}
      style={styles.image}
      onError={(e) =>
        console.log("Image load error:", e.nativeEvent)
      }
    />
  );

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Image Grid */}
      <FlatList
        data={item.images}
        renderItem={renderImage}
        keyExtractor={(img, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.imageGrid}
        showsVerticalScrollIndicator={false}
      />

      {/* Message Section */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <>
    <Header onBackPress={()=>navigation.goBack()} title="Work Images"/>
    <View style={styles.body}>
    <FlatList
      data={items}
      renderItem={renderCard}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
    </View>
    </>
  );
};

export default WorkImagesPreview;

const styles = StyleSheet.create({
  body:{
    margin:15,
  },
  card: {
    width: "70%",
    height:screenHeight*0.8,
    margin:10,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: color.background,
    borderRadius:20,
    flex: 1,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow
    elevation: 5,
  },
  imageGrid: {
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  image: {
    width: screenWidth / 2 - 50,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  messageContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
