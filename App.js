import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';
import { LogBox } from 'react-native';

// Ignore specific warnings if they're not relevant to your issue
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
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
  console.log('App component rendering'); // Add logging
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StackNavigator/>
        <Toast config={toastConfig} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

