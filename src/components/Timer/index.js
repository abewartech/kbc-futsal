import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Button, Layout} from 'react-native-ui-kitten';
import Endpoint from '../../utils/Endpoint';
import AsyncStorage from '@react-native-community/async-storage';
import {inject, observer} from 'mobx-react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import socket from '../../utils/SocketApi';
import Color from '../../constants/Color';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStart: true,
      data: [],
      project: {},
      disabled: false,
    };
    socket.on('count', this.callFunction);
    socket.on('resetCounter', this.resetFunction);

    AsyncStorage.getItem('Project', (error, result) => {
      if (result) {
        const data = JSON.parse(result);
        this.setState({
          project: data,
        });
      }
    });
  }

  handleStart = () => {
    const {credentialStore, activityStore} = this.props.rootStore;
    const {token, id} = credentialStore;
    const {project} = this.state;

    const data = {
      operator: id,
      activity: project._id,
      line: project.line,
      type: project.type,
      workProcess: project.selectedProcess[0].name,
      stdTime: project.selectedProcess[0].stdTime,
      // socketId: ,
    };

    fetch(
      `${Endpoint.prod}/startactivity`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            showStart: false,
            disabled: true,
          });
          activityStore.setCounterId(res.message._id);
        } else {
          console.log('Failed: ', res.message);
        }
      })
      .catch(error => {
        alert(error);
      });
  };

  callFunction = data => {
    const {counter, setCounter} = this.props.rootStore.activityStore;
    if (data) {
      setCounter(counter + 1);
    }
  };

  resetFunction = data => {
    if (data) {
      this.setState({
        counter: 0,
      });
    }
  };

  componentDidMount() {
    const {credentialStore, activityStore} = this.props.rootStore;
    const {token, id} = credentialStore;

    fetch(
      `${Endpoint.prod}/getcounterbyop/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          if (res.message.length) {
            this.setState({
              showStart: true,
            });
            activityStore.setCounter(res.message[0].time);
            activityStore.setCounterId(res.message[0]._id);
          } else {
            activityStore.setCounter(0);
          }
        } else {
          console.log('Failed: ', res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  render() {
    const {showStart, disabled} = this.state;
    const {counter} = this.props.rootStore.activityStore;
    const seconds = ('0' + (Math.floor(counter) % 60)).slice(-2);
    const minutes = ('0' + (Math.floor(counter / 60) % 60)).slice(-2);
    const hour = ('0' + (Math.floor(counter / 60 / 60) % 60)).slice(-2);

    return (
      <Layout style={styles.centeredItem}>
        <TouchableOpacity
          disabled={disabled}
          style={styles.timerContainer}
          onPress={this.handleStart}>
          {showStart && counter === 0 ? (
            <Text category="h1" style={{fontSize: wp(10), color: '#fff'}}>
              START
            </Text>
          ) : (
            <Text category="h1" style={{fontSize: wp(10), color: '#fff'}}>
              {hour}:{minutes}:{seconds}
            </Text>
          )}
        </TouchableOpacity>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  centeredItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.success,
    width: wp(50),
    height: wp(50),
    borderRadius: wp(50) / 2,
  },
});

Timer = inject('rootStore')(observer(Timer));
export default Timer;
