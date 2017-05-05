import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import FirstScreen from './components/FirstScreen';
import GameScreen from './components/GameScreen';


export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="main">
          <Scene key="FirstScreen" component={FirstScreen} hideNavBar={true}/>
          <Scene key="GameScreen" component={GameScreen} type="reset" hideNavBar={true}/>
        </Scene>
      </Router>
    );
  }
}
