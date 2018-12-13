import React, {Component} from 'react';
import { 
  Header,
  ListItem,
  Container,
  Left,
  Body,
  Right,
  Title,
  Content,
  Row,
  Col,
  CheckBox
 } from "native-base";
import {
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import axios from 'axios';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
      listan: [],
      id: '',
      submitButton: 'Submit',
      refreshStatus: true
    }
  }

  componentDidMount() {
    this.loadToDoList();
  }

  loadToDoList() {
    this.setState({
      refreshStatus: true
    })
    console.log('cek todolist');
    axios.get('https://powerful-brushlands-96374.herokuapp.com/api/todo')
      .then((res) => {
        console.log('data get')
        console.log(res)
        this.setState({
          listan: res.data.data,
          refreshStatus: false
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleClick = () => {
    if (this.state.submitButton === 'Submit') {
      this.postUpdate();
    } else if (this.state.submitButton === 'Update') {
      this.editItem(this.state.id);
    }
  }

  postUpdate = () => {
    axios.post('https://powerful-brushlands-96374.herokuapp.com/api/todo', {
        text: this.state.text
      })
      .then((res) => {
        console.log(res);
        console.log(this.state.text + ' berhasil dimasukkan');
        this.setState({
          text: ''
        });
        this.loadToDoList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editItem = (item) => {
    console.log(item);
    axios.put('https://powerful-brushlands-96374.herokuapp.com/api/todo/' + item, {
        text: this.state.text
      })
      .then((res) => {
        console.log(res);
        console.log('updated');
        this.loadToDoList();
        this.setState({
          text: '',
          id: '',
          submitButton: 'Submit'
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onEditItemClicked = (item) => {
    this.setState({
      submitButton: 'Update',
      text: item.text,
      id: item._id
    })
    console.log('id : ' + item._id);
  }

  deleteItem = (item) => {
    axios.delete('https://powerful-brushlands-96374.herokuapp.com/api/todo/' + item._id)
      .then((res) => {
        console.log(res);
        console.log('todo deleted');
        this.loadToDoList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'black'}} androidStatusBarColor='#222' >
          <Left/>
          <Body>
            <Title>TO-DO</Title>
          </Body>
          <Right/>
        </Header>

        <Content>
          <Row  style={style.inputan}>
            <Col size={3}>
              <TextInput
                value={this.state.text}
                ref={input => {this.textInputan = input}}
                style={style.textInput}
                placeholder='type here...'
                onChangeText={(text) => this.setState({text})}
                ></TextInput>
            </Col>
            <Col size={1}>
              <Button
                  title={this.state.submitButton}
                  color="black"
                  onPress={this.handleClick}
                  ></Button>
            </Col>
          </Row>

          <Row>
            <FlatList
              inverted
              refreshing={this.state.refreshStatus}
              data={this.state.listan}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => 
                <ListItem>
                  <CheckBox
                    checked={item.completed}
                    style={{marginRight: 16}}
                    color='black'
                  />
                  <Body>
                    <TouchableOpacity
                      onPress={() => this.onEditItemClicked(item)}
                      onLongPress={() => this.deleteItem(item)}
                      >
                      <Text>{item.text}</Text>
                    </TouchableOpacity>
                  </Body>
                </ListItem>
              }
            />
          </Row>
        </Content>

      </Container>
    );
  }
}

const style = StyleSheet.create({
  inputan: {
    padding: 16
  },
  textInput: {
    borderBottomColor: '#AAA',
    borderBottomWidth: 0.5,
    marginRight: 8
  }
})