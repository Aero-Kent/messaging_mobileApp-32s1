import { Constants } from 'expo-constants';
import { View, Platform, StyleSheet, StatusBar, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';

export default class Status extends React.Component {
  state = {
    info: null,
  };
  
  componentDidMount() {
    NetInfo.fetch().then(state => {
      this.setState({ info: state.type });
    });

    this.unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection Type:', state.type);
      console.log('Is connected?', state.isConnected);
      this.setState({ info: state.type });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { info } = this.state;
    const isConnected = info !== "none" && info !== null;
    const backgroundColor = isConnected ? "white" : "red";

    const statusBar = (
      <StatusBar 
        backgroundColor={backgroundColor} 
        barStyle={isConnected ? "dark-content" : "light-content"} 
        animated={false} 
      />
    );

    const messageContainer = ( 
      <View style={styles.messageContainer} pointerEvents={"none"}> 
        {statusBar}
        {!isConnected && ( 
          <View style={styles.bubble}> 
            <Text style={styles.text}>No network connection</Text> 
          </View> 
        )} 
      </View> 
    ); 

    return (
      <View style={[styles.status, {backgroundColor}]}>
        {statusBar}
        {messageContainer}
      </View>
    );
  }
}

const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight)

const styles = StyleSheet.create({
  "androidStatusBar": { 
    "barStyle": "dark-content", 
    "backgroundColor": "#FFFFFF",
  },
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});