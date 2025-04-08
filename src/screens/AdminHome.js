// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import color from "../styles/globals";

// const screenWidth = Dimensions.get("window").width;

// const AdminHome = () => {
//   const currentDate = new Date();

//   return (
//     <View style={style.body}>
//       <ScrollView>
//         <View style={style.section}>
//           {/* Header */}
//           <View style={style.upperSection}>
//             <View style={style.header}>
//               <Text style={style.date}>{currentDate.toDateString()}</Text>
//             </View>
//           </View>

//           {/* Total / Present / Absent */}
//           <View style={style.statsContainer}>
//             <Text style={style.statText}>Total Employee: 10</Text>
//             <Text style={style.statText}>Present: 8</Text>
//             <Text style={style.statText}>Absent: 2</Text>
//           </View>

//           {/* Site-wise Employee Count */}
//           <View style={style.siteEmployeeContainer}>
//             <View style={style.siteRow}>
//               <Text style={style.siteName}>Bhumiyab</Text>
//               <Text style={style.employeeCount}>5</Text>
//             </View>
//             <View style={style.siteRow}>
//               <Text style={style.siteName}>Sauthali</Text>
//               <Text style={style.employeeCount}>3</Text>
//             </View>
//           </View>

//           {/* Work Images Section */}
//           <View style={style.imageSection}>
//             <Text style={style.imageSectionTitle}>Work Images</Text>
//             {[1, 2, 3].map((_, index) => (
//               <View key={index} style={style.imageRow}>
//                 <TouchableOpacity style={style.circle} />
//                 <Text style={style.nameText}>Name</Text>
//                 <Text style={style.siteText}>Site Name</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default AdminHome;

// const style = StyleSheet.create({
//   body: {
//     backgroundColor: color.background,
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   section: {
//     backgroundColor: "white",
//     width: screenWidth > 500 ? 500 : screenWidth * 0.9,
//     minHeight: "100%",
//     shadowColor: "black",
//     shadowRadius: 5,
//     padding: 16,
//   },
//   upperSection: {
//     backgroundColor: "white",
//   },
//   header: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 10,
//   },
//   date: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   statsContainer: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 10,
//   },
//   statText: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   siteEmployeeContainer: {
//     marginTop: 16,
//     backgroundColor: "#e6f7ff",
//     padding: 10,
//     borderRadius: 10,
//   },
//   siteRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//   },
//   siteName: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   employeeCount: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   imageSection: {
//     marginTop: 20,
//   },
//   imageSectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   imageRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   circle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#000",
//     marginRight: 10,
//   },
//   nameText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   siteText: {
//     fontSize: 16,
//     flex: 1,
//   },
// });



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import color from "../styles/globals";
import Header from "../Sections/Header";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const AdminHome = () => {
  const currentDate = new Date();

  return (
    <>
    <Header title="Crystaloak Constructions"/>
    <View style={styles.body}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Blue background top */}
        {/* <View style={styles.topBlueBackground}>
         
        </View> */}

        {/* Card Container */}
        <View style={styles.cardContainer}>
          {/* Employee Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>10</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Present</Text>
              <Text style={styles.statValue}>8</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Absent</Text>
              <Text style={styles.statValue}>2</Text>
            </View>
          </View>

          {/* Site Wise Data */}
          <View style={styles.siteContainer}>
            <Text style={styles.siteTitle}>Sites</Text>
            <View style={styles.siteRow}>
              <Text >Site 1</Text>
              <Text >5</Text>
            </View>
            <View style={styles.siteRow}>
              <Text >Site 2</Text>
              <Text >3</Text>
            </View>
            <View style={styles.siteRow}>
              <Text >Site 3</Text>
              <Text >2</Text>
            </View>
          </View>
        </View>

        {/* Work Images Section */}
        <View style={styles.imageSection}>
          <Text style={styles.imageSectionTitle}>Work Images</Text>
          <View style={styles.imageRows}>
            {[1, 2,3,4,5,6,7].map((_, index) => (
            <View key={index} style={styles.imageRow}>
              <TouchableOpacity style={styles.circle} />
              <Text style={styles.nameText}>Employee Name</Text>
              <Text style={styles.siteText}>Site Name</Text>
              <TouchableOpacity style={styles.imageBtn}>
                <Text style={{ color: "#fff" }}>Work Image</Text>
              </TouchableOpacity>
            </View>
          ))}
          </View>
        </View>
      </ScrollView>
    </View></>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: color.primary,
  },

 
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: 80,
    borderRadius: 50,
    padding: 35,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    borderColor:"#000",
    backgroundColor:color.secondary,
    padding:10,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderRadius:10,
    width:"25%"
  },
  statLabel: {
    fontSize: 18,
    color: "#555",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  siteContainer: {
    marginTop: 10,
  },
  siteTitle: {
    fontSize: 24,
    textAlign:"center",
    fontWeight: "bold",
    marginBottom: 8,
  },
  siteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  imageSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  imageSectionTitle: {
    fontSize: 24,
    textAlign:"center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageRows:{
    backgroundColor:"#D3D3D3",
    borderRadius:20,

  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding:10,
    borderRadius:10
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
    fontWeight:"semiBold"
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
