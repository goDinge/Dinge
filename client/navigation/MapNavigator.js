import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MapScreen from '../screens/MapScreen';
import UploadScreen from '../screens/UploadScreen';
import CameraScreen from '../screens/CameraScreen';
import SocialScreen from '../screens/SocialScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DingScreen from '../screens/DingScreen';

import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'cereal-bold',
    fontSize: 30,
  },
  headerBackTitleStyle: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
  },
  headerBackTitle: '',
  headerTintColor: 'white',
};

const MapStackNavigator = createStackNavigator();

export const MapNavigator = () => {
  return (
    <MapStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <MapStackNavigator.Screen
        name="Map"
        component={MapScreen}
        options={{ headerTitle: 'Map' }}
      />
      <MapStackNavigator.Screen
        name="Ding"
        component={DingScreen}
        options={{ headerTitle: 'Ding' }}
      />
      <MapStackNavigator.Screen
        name="Upload"
        component={UploadScreen}
        options={{ headerTitle: 'Dinge!' }}
      />
      <MapStackNavigator.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerTitle: 'Camera' }}
      />
    </MapStackNavigator.Navigator>
  );
};

const CameraStackNavigator = createStackNavigator();

export const CameraNavigator = () => {
  return (
    <CameraStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <CameraStackNavigator.Screen
        name="Upload"
        component={UploadScreen}
        options={{ headerTitle: 'Dinge!' }}
      />
      <CameraStackNavigator.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerTitle: 'Camera' }}
      />
    </CameraStackNavigator.Navigator>
  );
};

const SocialStackNavigator = createStackNavigator();

export const SocialNavigator = () => {
  return (
    <SocialStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SocialStackNavigator.Screen
        name="Social"
        component={SocialScreen}
        options={{ headerTitle: 'Social' }}
      />
    </SocialStackNavigator.Navigator>
  );
};

const ProfileStackNavigator = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
    </ProfileStackNavigator.Navigator>
  );
};

const MapBottomTabNavigator = createBottomTabNavigator();

const bottomTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    let iconName;

    if (route.name === 'Map') {
      iconName = focused ? 'map-marker-radius' : 'map-marker-radius-outline';
    } else if (route.name === 'Camera') {
      iconName = focused ? 'camera' : 'camera-outline';
    } else if (route.name === 'Social') {
      iconName = focused ? 'account-group' : 'account-group-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'account' : 'account-outline';
    }

    return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
  },
});

export const BottomTabNavigator = () => {
  return (
    <MapBottomTabNavigator.Navigator
      screenOptions={bottomTabOptions}
      tabBarOptions={{
        activeTintColor: Colors.secondary,
        inactiveTintColor: Colors.grey,
        labelPosition: 'below-icon',
        style:
          Platform.OS === 'android'
            ? { paddingBottom: 4, paddingTop: 3 }
            : { paddingTop: 6 },
      }}
    >
      <MapBottomTabNavigator.Screen name="Map" component={MapNavigator} />
      <MapBottomTabNavigator.Screen name="Camera" component={CameraNavigator} />
      <MapBottomTabNavigator.Screen name="Social" component={SocialNavigator} />
      <MapBottomTabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </MapBottomTabNavigator.Navigator>
  );
};
