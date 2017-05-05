import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import { Container, Content, Form, Item, Input,InputGroup, Icon, Card, CardItem, Button,List } from 'native-base';


export default class GameScreen extends Component {
  state = {scene:0, answer:"", question:"", firstRound: true};
  componentWillMount(){
    this.setState({socket: this.props.socket});

    var socket = this.props.socket;
    socket.on('question generated', (question)=> {
      this.setState({scene:1});
      this.setState({question});
    });
    socket.on('answers collected', (answerArr)=> {
      this.setState({answerArr});
      this.setState({status:""});
      this.setState({scene: 2});
    });
    socket.on('fooled by', (fooledBy)=> {
      this.setState({fooledBy});
    });
    socket.on('update users',(scoreByUser)=> {
      this.setState({scoreByUser});
      this.setState({scores:this.renderScores(true)});
      if (!this.state.firstRound){
        this.setState({scene: 3,status:""});
      }

    });
  }

  startGame() {
    this.state.socket.emit('generate question');
    this.setState({firstRound:false});

  }

  submitAnswer(){
    var socket = this.state.socket;
    socket.emit('submit answer', this.state.answer);
    this.setState({status:"Waiting for other players..."});
  }

  pickAnswer(answer){
    this.setState({status:"Waiting for other players..."});
    console.log(this.state.status);
    var socket = this.state.socket;
    socket.emit('pick answer', answer);
  }

  renderScores(showScores){
    var scoreByUser = this.state.scoreByUser;
    var list = '';
    var sortedKeys = Object.keys(scoreByUser).sort(function(a,b){return list[a]-list[b]});
    var scores = [];
    if (showScores){
      for (var user in scoreByUser) {
        // console.log(user+ " : "+scoreByUser[user]);
        console.log(user)
        scores.push(
          <Text>{user}  :  {scoreByUser[user]}</Text>
        );
      }
    } else {
      for (var user in scoreByUser) {
        // console.log(user+ " : "+scoreByUser[user]);
        scores.push(
          <Text>{user}</Text>
        );
      }
    }

    return scores;
  }

  renderFooled(){
    var fooledBy = this.state.fooledBy;
    if (fooledBy === "___root"){
      return (
        <View>
          <Text style={{fontSize:80, color:"green"}}>Correct!</Text>
        </View>
      );
    } else if (fooledBy === null) {
      return (
        <View>
          <Text style={{fontSize:30, color:"red"}}>You fooled yourself: -1</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={{fontSize:30, color:"red"}}>Fooled by: {fooledBy}</Text>
        </View>
      );
    }
  }

  renderContent(){
    if (this.state.scene == 0){
      var scores = this.state.scoreByUser !== undefined ? this.renderScores(false) : [];

      return (
        <View style={{flexDirection:'column',justifyContent: "center", alignItems:'center', flex:1 }}>
          <View style={{marginTop:30,width: 300, height: 400}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 40, marginBottom: 20,color:"white"}}>Players</Text>
            <List dataArray={scores}
            renderRow={(player) =>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1, alignItems: 'flex-end'}}>
                  <Image style={{width: 50, height: 50, marginTop:10, marginRight: 20}} source={require('./img/smiley.png')}/>
                </View>
                <View style={{flex:1, alignItems: 'flex-start'}}>
                  <Text style={{marginTop:20, fontSize: 25, marginLeft: 20,color:"white" }}>{player}</Text>
                </View>
              </View>
            }
            />
          </View>
          <View style={{flexDirection:'row',justifyContent: "center", alignItems:'center', marginTop: 20}}>
            <Button style={{justifyContent:"center",backgroundColor:"#1B0303",borderWidth:1.8, borderColor: 'white'}} onPress={this.startGame.bind(this)}><Text style={{color:"white",fontSize:30}}>Start</Text></Button>
          </View>

        </View>
      );
    } else if (this.state.scene == 1){
      return (
        <View style={{flexDirection:'column',justifyContent: "center",marginTop: 80, alignItems:'center', backgroundColor:"#1B0303"}}>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:0.7, alignItems:'center'}}>
              <Text style={{fontSize: 30, marginTop: 10, color:"white"}}> {this.state.question.substring(0,1).toUpperCase() + this.state.question.substring(1)  }</Text>
            </View>
            <View style={{flex:0.3, justifyContent:'center', padding: 10, flexDirection:'row'}}>
              <Icon name={'ios-clock'} size={27} style={{color:"white"}}/>
              <Text style={{fontSize:20, marginTop: 3, marginLeft: 10, color:"white"}}>1:00</Text>
            </View>

          </View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20, marginLeft: 30, marginRight:30, borderRadius: 30, height: 200, padding: 20, color:"white",fontSize:18}}
            multiline={true}
            autoCapitalize="none"
            onChangeText={answer => this.setState({ answer })}
          />
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", flex:1,marginTop: 20}}>
            <Button style={{justifyContent:"center",backgroundColor:"#1B0303",borderWidth:1.8, borderColor: 'white'}} onPress={this.submitAnswer.bind(this)}><Text style={{color:"white", fontSize:25}}>Submit</Text></Button>
          </View>
          <View style={{marginTop: 20}}>
            <Text>{this.state.status}</Text>
          </View>
        </View>
      );
    } else if (this.state.scene == 2){
      return (

        <View style={{flexDirection:'column',justifyContent: "center",marginTop: 80, alignItems:'center', backgroundColor:"#1B0303"}}>
          <Text style={{fontSize: 30, color:"white"}}> {this.state.question.substring(0,1).toUpperCase() + this.state.question.substring(1)}</Text>

          <List dataArray={this.state.answerArr}
          renderRow={(answer) => <Button style={{margin: 10, width: 270,height: 60,backgroundColor:"#1B0303", borderColor:"white", borderWidth:1.5}} onPress={this.pickAnswer.bind(this, answer)}><Text style={{color:"white"}}>{answer}</Text></Button>}
          />
          <View style={{marginTop: 20}}>
            <Text>{this.state.status}</Text>
          </View>
        </View>
      );
    } else {
      var scores = this.state.scores;
      return (
        <View style={{flexDirection:'column',justifyContent: "center",marginTop: 80, alignItems:'center', backgroundColor:"#1B0303"}}>
          {this.renderFooled()}
          <View>
            <Text style={{fontSize: 30, fontWeight:'bold', marginTop: 40, color:"white"}}>Leaderboard</Text>
          </View>
          <List style={{ width: 300, height:200,  marginBottom: 40}} dataArray={scores}
          renderRow={(player) =>
            <View style={{flexDirection:'row',justifyContent: "center"}}>
              <View style={{flex: 0.4,alignItems:'flex-end'}}>
                <Image style={{width: 50, height: 50, marginTop:10}} source={require('./img/smiley.png')}/>
              </View>
              <View style={{flex: 0.6, alignItems:'flex-start'}}>
                <Text style={{margin: 5, marginLeft: 20, fontSize: 22, marginTop: 20, color: "white"}} >{player}</Text>
              </View>

            </View>
          }
        />

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", flex:1}}>
            <Button style={{justifyContent:"center",backgroundColor:"#1B0303",borderWidth:1.8, borderColor: 'white'}} onPress={this.startGame.bind(this)}><Text style={{color:"white", fontSize:25}}>Next Question</Text></Button>

          </View>


        </View>
      )

    }
  }
//
  render() {
    return (
      <Container style={{backgroundColor:"#1B0303"}}>
        <Content>
          {this.renderContent()}
        </Content>
      </Container>
    );


  }
}
