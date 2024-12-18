import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App(): import('D:/Health/node_modules/@types/react/jsx-runtime').JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>{/* 添加路由配置 */}</Stack.Navigator>
    </NavigationContainer>
  );
}
