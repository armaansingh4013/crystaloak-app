import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';

const toastConfig = {
  success: (props) => (
    <View style={{ 
      height: 60,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'green', fontSize: 16, fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'gray', fontSize: 14 }}>{props.text2}</Text>}
    </View>
  ),
  error: (props) => (
    <View style={{ 
      height: 60,
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'gray', fontSize: 14 }}>{props.text2}</Text>}
    </View>
  ),
};

export default function App() {
  return (
    <AuthProvider>
      <StackNavigator/>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

