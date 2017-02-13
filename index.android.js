/**
 * Sample Firebase & React Native App
 * https://github.com/davideast/firebase-react-native-sample
 */
'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
} = ReactNative;

var fireBaseconfig = {
  apiKey: "AIzaSyDLS25aMYsPCKojv15SbzOSz8JkkzleCO0",
  authDomain: "nproject-d91ef.firebaseio.com",
  databaseURL: "https://nproject-d91ef.firebaseio.com/",
  storageBucket: "gs://nproject-d91ef.appspot.com",
  messagingSenderId: "470504050326"
};
// firebase.initializeApp(fireBaseconfig);
const firebaseApp = firebase.initializeApp(fireBaseconfig)


export default class NProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Grocery List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add" />

      </View>
    )
  }

  _addItem() {
    var len = this.itemsRef;
    var str = "Thing " + len;
    this.itemsRef.push({ title: str })

    // Alert.prompt(
    //   'Add New Item',
    //   null,
    //   [
    //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {
    //       text: 'Add',
    //       onPress: (text) => {
    //         this.itemsRef.push({ title: "Thing" })
    //       }
    //     },
    //   ],
    //   'plain-text'
    // );
  }

  _renderItem(item) {

    const onPress = () => {
      Alert.alert(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
        ]
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

}
AppRegistry.registerComponent('NProject', () => NProject);
