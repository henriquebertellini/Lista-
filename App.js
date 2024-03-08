import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={ {headerShown: false, }}>
      <Stack.Screen name="Home" component={Home} />
      {/* Outras telas... */}
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;