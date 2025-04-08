
import StackNavigator from './src/navigation/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';


export default function App() {
  return (
<AuthProvider>
  
    <StackNavigator/>
    </AuthProvider>
  );
}

