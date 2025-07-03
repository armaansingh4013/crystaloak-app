import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './src/components/AuthContext';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';
import { LogBox } from 'react-native';
import Loader from './src/components/Loader';
import * as SplashScreen from 'expo-splash-screen';
import StackNavigator from './src/controller/navigation/StackNavigator';
import Login from './src/screens/Login';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings if they're not relevant to your issue
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  // 'Text strings must be rendered within a <Text> component',
]);

// Add error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ color: 'red' }}>{this.state.error?.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const toastConfig = {
  success: (props) => (
    <View style={{ 
      // height: 60,
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
      <Text style={{ color: 'green', fontSize: 16, fontWeight: 700 }}>{props.text1}</Text>
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
      <Text style={{ color: 'red', fontSize: 16, fontWeight: 700 }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'gray', fontSize: 14 }}>{props.text2}</Text>}
    </View>
  ),
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // <- move here
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
  
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Preparing App...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          {/* <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'black', fontSize: 24 }}>App Loaded</Text>
    </View> */}
         <StackNavigator/> 
          {/* <Login/> */}
          <Toast config={toastConfig} />
         </View>
       </AuthProvider>
     </ErrorBoundary>
  );
}

