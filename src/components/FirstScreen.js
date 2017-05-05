import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput
} from 'react-native';
import { Container, Content, Form, Item, Input,InputGroup, Icon, Card, CardItem, Button,Footer } from 'native-base';
import { Router, Scene, Actions } from 'react-native-router-flux';


// SocketIO
const io = require('socket.io-client');

window.navigator.userAgent = 'ReactNative';
// localhost:5000
const socket = io('redsheets.herokuapp.com', {transports: ['websocket'] });

socket.on('connect', () => {
  console.log('connected!');
});


export default class FirstScreen extends Component {
  state = {  socket: socket,status:""};
  createGame(){
    var nickname = this.state.name ;
    // var roomcode = this.generateCode();
    var roomcode = this.state.roomcode;
    if (this.isNameValid(nickname)){
      socket.emit('create game',nickname,roomcode);
      Actions.GameScreen({socket: this.state.socket});
    }
  }

  joinGame() {
    var nickname = this.state.name;
    var roomcode = this.state.roomcode;
    if (roomcode.length !== 5){
      this.setState({status:"Invalid room code"});
    }
    if (this.isNameValid(nickname)){
      socket.emit('join game', nickname, roomcode);
      Actions.GameScreen({socket: this.state.socket});
    }
  }

  generateCode(){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for( var i=0; i < 5; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text.toLowerCase();
  }

  isNameValid(nickname){
    if (nickname === ''){
      this.setState({status:"Please enter a nickname"});
      return false;
    } else if (nickname === '___root') { // reserved name
      this.setState({status:"Sorry, this name is invalid"});
      return false;
    }
    return true;
  }
// BEFORE
// <Container>
//   <Content>
//     <View style={{marginTop: 80, flexDirection: 'row', justifyContent: 'center'}}>
//       <Image source={require('./img/logo.png')}/>
//     </View>
//     <Card style={{margin: 50}}>
//       <CardItem >
//         <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", flex:1, paddingTop: 10}}>
//           <View style={{flex: 0.4, flexDirection: "column"}}>
//             <Text style={{flex: 1, paddingTop: 20}}>Name: </Text>
//             <Text style={{flex: 1, paddingTop: 20}}>Room Code: </Text>
//           </View>
//           <View style={{flex: 0.6, flexDirection:"column"}}>
//             <InputGroup style={{flex: 1}}>
//                 <Input  label='Name' value={this.state.name} onChangeText={name => this.setState({ name })}/>
//             </InputGroup>
//             <InputGroup style={{flex: 1}}>
//                 <Input  label='Name' value={this.state.roomcode}  onChangeText={roomcode => this.setState({ roomcode })}/>
//             </InputGroup>
//           </View>
//         </View>
//       </CardItem>
//       <CardItem >
//         <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", flex:1, paddingTop: 10}}>
//           <Button warning style={{flex: 0.5, padding: 0, margin: 10,justifyContent:"center"}} onPress={this.joinGame.bind(this)}><Text>Join</Text></Button>
//           <Button warning style={{flex: 0.5, padding: 0, margin: 10,justifyContent:"center"}} onPress={this.createGame.bind(this)}><Text>Create</Text></Button>
//         </View>
//       </CardItem>
//       <CardItem>
//         <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', flex:1}}>
//           <Text style={{color:"red"}}>{this.state.status}</Text>
//         </View>
//       </CardItem>
//     </Card>
//   </Content>
// </Container>


  render() {


    return (
      <View style={{backgroundColor: "#1B0303", alignSelf:'stretch', flex:1}}>
          <View style={{marginTop: 80, flexDirection: 'row', justifyContent: 'center'}}>
            <Image source={require('./img/logo_new.png')} style={{width: 100, height: 100}}/>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{margin: 50,  height: 200, width: 300}}>
                <View style={{flexDirection:"row", justifyContent:'center', marginBottom: 10}}>
                  <TextInput  placeholder="Username" placeholderTextColor="gray" label='Name' value={this.state.name} onChangeText={name => this.setState({ name })} style={{height: 40, borderColor: 'white', borderWidth: 1.5, width: 180, paddingLeft: 20, fontSize: 14, color: "white",borderRadius: 4}} />
                </View>
                <View style={{flexDirection:"row", justifyContent:'center'}}>
                  <TextInput  placeholder="Roomcode" placeholderTextColor="gray" label='Name' value={this.state.roomcode}  onChangeText={roomcode => this.setState({ roomcode })} style={{height: 40, borderColor: 'white', borderWidth: 1.5, width: 180, paddingLeft: 20, color: "white",fontSize: 14,borderRadius: 4}}/>
                </View>
                <View >
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", flex:1, marginTop: 50}}>
                    <Button style={{flex: 0.5, padding: 0, margin: 10,justifyContent:"center",backgroundColor:"#1B0303",borderWidth:1.5, borderColor: 'white' }} onPress={this.joinGame.bind(this)}><Text style={{color:"white",fontSize:25}}>Join</Text></Button>
                    <Button style={{flex: 0.5, padding: 0, margin: 10,justifyContent:"center",backgroundColor:"#1B0303",borderColor: 'white',borderWidth:1.5}} onPress={this.createGame.bind(this)}><Text style={{color:"white",fontSize:25}}>Create</Text></Button>
                  </View>
                </View>
                <View>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', flex:1}}>
                    <Text style={{color:"red"}}>{this.state.status}</Text>
                  </View>
                </View>
            </View>
          </View>

      </View>


    );
  }
}
