import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {AuthContext} from '../components/AuthContext';
import loginUser from '../controller/auth';
import {storeUserData} from '../components/Storage';
import {MaterialIcons, Entypo} from '@expo/vector-icons';
import logo from '../assets/logo.png';
import color from '../styles/globals';
import Loader from "../Sections/Loader"

const Login = () => {
  const navigation = useNavigation ();
  const [employeeCode, setEmployeeCode] = useState ('');
  const [password, setPassword] = useState ('');
  const {login} = useContext (AuthContext);
  const [showPassword, setShowPassword] = useState (false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(''); // Clear any previous error message
    const res = await loginUser (employeeCode, password);
    if (res.success) {
      await login (res.data.token);
      storeUserData (res.data.user);
      if (res.data.user.role ==="user") {
        if(res.data.user.documents){
          navigation.replace ('TabNavigator');
        } else {
          navigation.replace ('DocumentUpload');
        }
      } else {
        navigation.replace ('AdminNavigator');
      }
    } else {
      setErrorMessage('Invalid Employee code or Password');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {loading && <Loader/>}
          {/* Top Purple Header */}
          <View style={styles.header}>
            <Image source={logo} style={{width: 100, height: 100}} />
            <Text style={styles.logoText}>
              Crystaloak {'\n'}<Text>Construction</Text>
            </Text>
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
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword (!showPassword)}>
                <Entypo
                  name={showPassword ? 'eye-with-line' : 'eye'}
                  size={20}
                  color="#A9A9A9"
                />
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Entypo name="arrow-long-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create ({
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
    marginTop: Platform.OS == 'ios' ? -50 : -30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
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
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});
