/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Components/Home'
import Offline from './Components/Offline'

const Tab = createBottomTabNavigator();
//import Navigation from './Navigation/Navigation'

export default class App extends React.Component {
  render() {
    return (
      <>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mode en ligne') {
              iconName = focused
                ? 'access-point'
                : 'access-point';
            } else if (route.name === 'Mode hors ligne') {
              iconName = focused ? 'access-point-network-off' : 'access-point-network-off';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'rgba(25, 252, 210, 1)',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: '#404040',
          },
          labelStyle: {
            fontSize: 16,
          },
        }}
      >
          <Tab.Screen name="Mode en ligne" component={Home} />
          <Tab.Screen name="Mode hors ligne" component={Offline} />
        </Tab.Navigator>
      </NavigationContainer>
      </>
    );
  }
}
