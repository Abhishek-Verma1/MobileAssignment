import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {colors} from '../theme';

import GameScreen from '../screens/Game/Game';
import HomeScreen from '../screens/Home/Home';
import LoginScreen from '../screens/Login/Login';
import RegisterScreen from '../screens/Register/Register';
import StatsScreen from '../screens/Stats/Stats';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: any;
          if (route.name === 'Game') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Game"
        component={GameScreen}
        options={{tabBarLabel: 'PlayGame'}}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{tabBarLabel: 'Stats'}}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={isAuthenticated ? 'MainTabs' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
