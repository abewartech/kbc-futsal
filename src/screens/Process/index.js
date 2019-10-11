import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
} from 'react-native-ui-kitten';
import Timer from '../../components/Timer';
import ButtonAction from '../../components/ButtonAction';
import {inject, observer} from 'mobx-react';
import Color from '../../constants/Color';
import {SafeAreaView} from 'react-navigation';
import Endpoint from '../../utils/Endpoint';
import AsyncStorage from '@react-native-community/async-storage';

class Process extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Process Activity',
      header: null,
    };
  };

  renderRightControl = props => {
    return (
      <View>
        <TopNavigationAction
          icon={this.renderLogoutIcon}
          onPress={this.logoutHandler}
        />
      </View>
    );
  };

  renderLogoutIcon = style => {
    return <Icon name="log-out" size={23} {...style} fill="#fff" />;
  };

  logoutHandler = () => {
    let userKeys = ['username', 'role', 'token'];
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

  nextProcess = () => {
    const {credentialStore} = this.props.rootStore;
    const {token, id} = credentialStore;
    AsyncStorage.getItem('Project', (error, result) => {
      console.log('res', result);
      if (result) {
        const res = JSON.parse(result);
        const data = {
          operator: id,
          activity: res._id,
          line: res.line,
          type: res.type,
          // socketId: ,
        };

        console.log('data click: ', data);

        fetch(
          `${Endpoint.prod}/nextprocess`,
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
              console.log('message ', res.message);
            } else {
              console.log('Failed: ', res.message);
            }
          })
          .catch(error => {
            alert(error.toString().split('TypeError: ')[1]);
          });
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Timer Activity"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <View style={styles.containerTimer}>
            <Timer />
          </View>
          <View style={styles.containerBtn}>
            <ButtonAction navigation={this.props.navigation} />
          </View>
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTimer: {
    flex: 2,
    // backgroundColor: Color.primary,
  },
  containerBtn: {
    flex: 1,
    // backgroundColor: Color.secondary,
  },
});

Process = inject('rootStore')(observer(Process));
export default Process;
