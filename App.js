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
import * as RNLocalize from "react-native-localize";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Components/Home'
import Offline from './Components/Offline'

const Tab = createBottomTabNavigator();
//import Navigation from './Navigation/Navigation'

const langs = RNLocalize.getLocales();
const avail_langs = new Array('fr', 'en', 'jp');
let current_lang = 'en';

for (let i = 0; i < langs.length; i++) {

  var lang = langs[i];

  if (avail_langs.indexOf(lang.languageCode) != -1) {

    current_lang = lang.languageCode;
    break;
    
  }

}

/* LANG STRINGS ARRAY */
var translate = {
  'fr': {
    'TAB_ONLINE': 'Mode en ligne',
    'TAB_OFFLINE': 'Mode hors ligne'
  },
  'en': {
    'TAB_ONLINE': 'Online mode',
    'TAB_OFFLINE': 'Offline mode'
  },
  'jp': {
    'TAB_ONLINE': 'オンラインモード',
    'TAB_OFFLINE': 'オフラインモード'
  }
};

export default class App extends React.Component {

  render() {
    return (
      <>
      <NavigationContainer headerMode="none">
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mode en ligne' || route.name === 'Online mode' || route.name === 'オンラインモード') {
              iconName = focused
                ? 'access-point'
                : 'access-point';
            } else if (route.name === 'Mode hors ligne' || route.name === 'Offline mode' || route.name === 'オフラインモード') {
              iconName = focused ? 'access-point-network-off' : 'access-point-network-off';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
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
          <Tab.Screen 
          name={translate[current_lang]['TAB_ONLINE']} 
          component={Home}
          options={{headerShown: false}}
          />
          <Tab.Screen 
          name={translate[current_lang]['TAB_OFFLINE']} 
          component={Offline}
          options={{headerShown: false}}
           />
        </Tab.Navigator>
      </NavigationContainer>
      </>
    );
  }
}
