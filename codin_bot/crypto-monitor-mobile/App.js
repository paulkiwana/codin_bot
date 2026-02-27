import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import DashboardScreen from './src/screens/DashboardScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { MonitoringProvider } from './src/context/MonitoringContext';

const Tab = createBottomTabNavigator();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00d4ff',
    secondary: '#ff006e',
    background: '#1a1a2e',
    surface: '#16213e',
    accent: '#0f3460',
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  return (
    <PaperProvider theme={theme}>
      <MonitoringProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                
                if (route.name === 'Dashboard') {
                  iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                } else if (route.name === 'Alerts') {
                  iconName = focused ? 'bell' : 'bell-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'cog' : 'cog-outline';
                }
                
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: '#8892b0',
              tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopColor: theme.colors.accent,
              },
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: '#fff',
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Alerts" component={AlertsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </MonitoringProvider>
    </PaperProvider>
  );
}
