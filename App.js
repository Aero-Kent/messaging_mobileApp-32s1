import { StyleSheet, Text, View, Image, TouchableHighlight, BackHandler, Alert } from 'react-native';
import Status from './components/Status'; 
import MessageList from './components/MessageList';
import Toolbar from "./components/Toolbar"; 
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import React from 'react';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullScreenImageId: null,
    isInputFocused: false, 
  };

  handlePressToolbarCamera = () => { 
    // ... 
  }; 
  
  handlePressToolbarLocation = () => { 
    // ... 
  }; 
  
  handleChangeFocus = (isFocused) => { 
    this.setState({ isInputFocused: isFocused }); 
  }; 
  
  handleSubmit = (text) => { 
    const { messages } = this.state; 
    this.setState({ 
      messages: [createTextMessage(text), ...messages], 
    }); 
  }; 
  
  renderToolbar() { 
    const { isInputFocused } = this.state; 
    return ( 
      <View style={styles.toolbar}> 
        <Toolbar 
          isFocused={isInputFocused} 
          onSubmit={this.handleSubmit} 
          onChangeFocus={this.handleChangeFocus} 
          onPressCamera={this.handlePressToolbarCamera} 
          onPressLocation={this.handlePressToolbarLocation} 
        />
      </View> 
    ); 
  }
  // ... 

  dismissFullScreenImage = () => {
    this.setState({ fullScreenImageId: null });
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id !== id),
                });
              },
            },
          ],
        );
        break;
      case 'image':
        this.setState({ fullScreenImageId: id,
                        isInputFocused: false,
         });
        break
      default:
        break;
    }
  };

  renderFullscreenImage = () => {
    const { messages, fullScreenImageId } = this.state;
    if (!fullScreenImageId) return null;
    const image = messages.find(message => message.id === fullScreenImageId);
    if (!image) return null;
    const { uri } = image;
    return (
      <TouchableHighlight style={styles.fullscreenOverlay}
        onPress={this.dismissFullScreenImage}>
          <Image style={styles.fullscreenImage} source={{ uri }}/>
      </TouchableHighlight>
    );
  };

  componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullScreenImageId } = this.state;
      if (fullScreenImageId) {
        this.dismissFullScreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        
        <Status/>
        {this.renderMessageList()}
        {this.renderToolbar()}
        {/* wasn't provided in given so I manually inserted instead
        {this.renderInputMethodEditor()} */}        
        <View style={styles.inputMethodEditor}>
          <Text>This is the IME</Text>
        </View>
        {/* <View style={styles.toolbar}>
          <Text>This is the toolbar</Text>
        </View> */}
        {this.renderFullscreenImage()}      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  
  // idk the use of this but I added since the procedure says to add if using android
  "androidStatusBar": {
    "barStyle": "dark-content", 
    "backgroundColor": "#FFFFFF",
  },

  fullscreenOverlay: {
    backgroundColor: 'black',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});