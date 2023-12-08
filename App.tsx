/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoresListScreen from './pages/StoresListScreen';
import auth from '@react-native-firebase/auth';
import StoreDetailsScrenn from './pages/StoreDetailsScrenn';
import CameraScreen from './pages/CameraScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function onAuthStateChanged(user: any) {
    setIsLoggedIn(!!user ? true : false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          {!isLoggedIn ?
            <Stack.Screen name="Login" component={LoginScreen} />
            :
            ( <>
              <Stack.Screen name="Stores" component={StoresListScreen} />
              <Stack.Screen name="StoreDetails" component={StoreDetailsScrenn} />
              <Stack.Screen name="Camera" component={CameraScreen} />
              </>
            )
            
          }

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;
