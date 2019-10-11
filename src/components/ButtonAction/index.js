import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-ui-kitten';
import Color from '../../constants/Color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {inject, observer} from 'mobx-react';
import AsyncStorage from '@react-native-community/async-storage';

import Endpoint from '../../utils/Endpoint';

class ButtonAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      disableNext: false,
    };

    AsyncStorage.getItem('Project', (error, result) => {
      if (result) {
        const data = JSON.parse(result);
        this.setState({
          project: data,
        });
      }
    });
  }

  handleNext = () => {
    const {activityStore, credentialStore} = this.props.rootStore;
    const {project} = this.state;

    if (project.selectedProcess.length) {
      const process = project.selectedProcess.shift();
      const data = {
        counterId: activityStore.counterId,
        workProcess: process.name,
        stdTime: process.stdTime,
        // indicator,
        // rest,
        operator: credentialStore.id,
      };

      fetch(
        `${Endpoint.prod}/nextprocess`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + credentialStore.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        {timeout: Endpoint.timeout},
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            const {setCounter} = this.props.rootStore.activityStore;
            setCounter(0);
            AsyncStorage.setItem('Project', JSON.stringify(project));
          } else {
            console.log('Failed: ', res.message);
          }
        })
        .catch(error => {
          alert(error.toString().split('TypeError: ')[1]);
        });
    } else {
      this.setState({
        disableNext: true,
      });
    }
  };

  handleChangeOp = () => {
    let userKeys = ['username', 'role', 'token', 'Project'];
    const {credentialStore} = this.props.rootStore;
    AsyncStorage.multiRemove(userKeys, err => {
      if (err) {
        alert(err);
      } else {
        credentialStore.id = null;
        credentialStore.username = null;
        credentialStore.role = null;
        credentialStore.token = null;
        this.props.navigation.navigate('AuthStack');
      }
    });
  };

  render() {
    const {disableNext} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleNext}
            disabled={disableNext}>
            <View
              style={[
                styles.iconContainer,
                disableNext ? {backgroundColor: '#aaa'} : null,
              ]}>
              <Icon
                name="arrow-circle-right-outline"
                width={wp(12)}
                height={wp(12)}
                fill={Color.light}
              />
            </View>
            <Text style={styles.txtButton}>NEXT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => alert('test')}>
            <View
              style={[styles.iconContainer, {backgroundColor: Color.success}]}>
              <Icon
                name="checkmark-circle-outline"
                width={wp(12)}
                height={wp(12)}
                fill={Color.light}
              />
            </View>
            <Text style={styles.txtButton}>END</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <View
              style={[styles.iconContainer, {backgroundColor: Color.warning}]}>
              <Icon
                name="pause-circle-outline"
                width={wp(12)}
                height={wp(12)}
                fill={Color.light}
              />
            </View>
            <Text style={styles.txtButton}>REST</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleChangeOp}>
            <View
              style={[styles.iconContainer, {backgroundColor: Color.danger}]}>
              <Icon
                name="sync-outline"
                width={wp(12)}
                height={wp(12)}
                fill={Color.light}
              />
            </View>
            <Text style={styles.txtButton}>CHANGE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: wp(1),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#dedede',
    elevation: 1,
    width: wp(45),
    borderRadius: wp(2),
  },
  txtButton: {
    fontSize: wp(5),
    marginLeft: wp(2),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: Color.primary,
    borderTopLeftRadius: wp(2),
    borderBottomLeftRadius: wp(2),
    padding: wp(1),
    elevation: 1,
  },
});

ButtonAction = inject('rootStore')(observer(ButtonAction));
export default ButtonAction;
