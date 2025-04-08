// import { useNavigation } from '@react-navigation/native';
// import React, { useContext, useState } from 'react'
// import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import loginUser from '../controller/auth';
// import { AuthContext } from '../components/AuthContext';
// import { storeUserData } from '../components/Storage';

// const Login = () => {
//     const navigation = useNavigation();
//     const [employeeCode, setEmployeeCode] = useState();
//     const [password, setPassword] = useState();
//     const { login } = useContext(AuthContext);

//   const handleLogin = async()=>{
//     const res = await loginUser(employeeCode,password)
//     if(res.success){
//        // Store the token securely
//     await login(res.data.token);
//     storeUserData(res.data.user)
//       navigation.replace("Main")
//     }else{
//       // throw ("wrong credentials")
//     }
//   console.log("login data",{employeeCode,password})
// }
//   return (
//    <View style={style.body}>
//     <Text style={style.heading}>Log In</Text>

//     <TextInput
//         style={style.input}
//         placeholder="employeeCode/Email"
//         keyboardType="email-address"
//         value = {employeeCode}
//         onChangeText={setEmployeeCode}
//       />
//       <TextInput style={style.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
//       <TouchableOpacity style={style.button} onPress={handleLogin} >
//         <Text style={style.buttonText}>Log In</Text>
//       </TouchableOpacity>
//       <Text
//         onPress={() => {
//           navigation.navigate ('Register');
//         }}
//         style={style.link}
//       >
//         Don't have account. Register here
//       </Text>
//    </View>
//   )
// }

// export default Login


// const style = StyleSheet.create ({
//   body: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     width: "450",
//     margin:"auto"
//   },
//     container: {
//       width: '40%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100%',
//       margin: 'auto',
//     },
//     heading: {
//       fontWeight: 'bold',
//       fontSize: 30,
//       marginBottom: 20,
//     },
//     input: {
//       width: '100%',
//       padding: 10,
//       marginBottom: 15,
//       borderWidth: 1,
//       borderColor: '#000000',
//       borderRadius: 8,
//     },
//     button: {
//       borderColor: 'gray',
//       width: '100%',
//       borderWidth: 2,
//       padding: 12,
//       alignItems: 'center',
//       borderRadius: 8,
//       backgroundColor: 'skyblue',
//     },
//     buttonText: {
//       fontWeight: 'bold',
//       fontSize: 18,
//     },
//     link: {
//       color: 'red',
//       margin: 20,
//       fontSize: 15,
//     },
//   });
  

import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import loginUser from '../controller/auth';
import { storeUserData } from '../components/Storage';
import { MaterialIcons, Entypo } from '@expo/vector-icons'; // Icons
import logo from "../../assets/logo.png"
import color from '../styles/globals';

const Login = () => {
  const navigation = useNavigation();
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const res = await loginUser(employeeCode, password);
    if (res.success) {
      await login(res.data.token);
      storeUserData(res.data.user);
      navigation.replace("Main");
    } else {
      console.log("Wrong credentials");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Purple Header */}
      <View style={styles.header}>
      <Image
  source={logo} // path relative to the current file
  style={{ width: 100, height: 100 }}
/>
        <Text style={styles.logoText}>Crystaloak {"\n"}<Text style={styles.logoText}>Construction</Text></Text>
        {/* You can replace this with an Image for skyline graphic */}
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <Text style={styles.loginText}>Login</Text>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#A9A9A9" />
          <TextInput
            placeholder="Employee Id"
            value={employeeCode}
            onChangeText={setEmployeeCode}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Entypo name="lock" size={20} color="#A9A9A9" />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

       

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Entypo name="arrow-long-right" size={24} color="white" />
        </TouchableOpacity>
      </View>

      
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    backgroundColor: color.primary,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 16,
    padding: 25,
    marginTop: -50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 10,
  },
  loginText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
 
  loginBtn: {
    backgroundColor: color.secondary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#FF0066',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  }
});
