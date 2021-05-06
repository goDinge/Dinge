import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MapScreen from '../screens/map/MapScreen';
import DingScreen from '../screens/map/DingScreen';
import PublicScreen from '../screens/map/PublicScreen';
import UploadScreen from '../screens/camera/UploadScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import SocialScreen from '../screens/SocialScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import EventsScreen from '../screens/events/EventsScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';

import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'cereal-black',
    fontSize: 24,
  },
  headerBackTitleStyle: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
  },
  headerBackTitle: '',
  headerTintColor: 'white',
};

const defaultNavOptionsAuth = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTitleStyle: {
    fontFamily: 'cereal-bold',
    fontSize: 20,
  },
  headerBackTitleStyle: {
    fontFamily: 'cereal-medium',
    fontSize: 20,
  },
  headerBackTitle: '',
  headerTintColor: Colors.primary,
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptionsAuth}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerTitle: 'Login / Sign-up' }}
      />
      <AuthStackNavigator.Screen name="Profile" component={ProfileScreen} />
    </AuthStackNavigator.Navigator>
  );
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
      <MapStackNavigator.Screen
        name="Public"
        component={PublicScreen}
        options={{
          headerTitle: 'Public',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: Colors.primary,
        }}
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

const EventsStackNavigator = createStackNavigator();

export const EventsNavigator = () => {
  return (
    <EventsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <EventsStackNavigator.Screen
        name="Events"
        component={EventsScreen}
        options={{ headerTitle: 'Events Listing' }}
      />
      <EventsStackNavigator.Screen
        name="Event Details"
        component={EventDetailsScreen}
        options={{ headerTitle: 'Event Details' }}
      />
      <EventsStackNavigator.Screen
        name="Create Event"
        component={CreateEventScreen}
        options={{ headerTitle: 'Create Event' }}
      />
    </EventsStackNavigator.Navigator>
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
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptionsAuth}>
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
    } else if (route.name === 'Events') {
      iconName = focused ? 'calendar' : 'calendar-outline';
    } else if (route.name === 'Social') {
      iconName = focused ? 'account-group' : 'account-group-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'account' : 'account-outline';
    }

    return <MaterialCommunityIcons name={iconName} size={30} color={color} />;
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
            ? { paddingBottom: 3, paddingTop: 4, height: 48 }
            : { paddingTop: 6, height: 48 },
        tabStyle: {
          height: 42,
        },
      }}
    >
      <MapBottomTabNavigator.Screen name="Map" component={MapNavigator} />
      <MapBottomTabNavigator.Screen name="Events" component={EventsNavigator} />

      <MapBottomTabNavigator.Screen name="Social" component={SocialNavigator} />
      <MapBottomTabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </MapBottomTabNavigator.Navigator>
  );
};
