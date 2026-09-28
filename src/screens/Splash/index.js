import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@ui-kitten/components';
import {observer, inject} from 'mobx-react';
import Spinner from 'react-native-spinkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from '../../constants/Color';

class Splash extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'SplashScreen',
      header: null,
    };
  };

  componentDidMount() {
    this._timeouts = [];
    this._getData();
  }

  componentWillUnmount() {
    (this._timeouts || []).forEach((id) => clearTimeout(id));
  }

  _schedule = (fn, ms) => {
    this._timeouts.push(setTimeout(fn, ms));
  };

  _getData = () => {
    let user = ['username', 'role', 'token', 'id'];
    const {navigate} = this.props.navigation;
    const {credentialStore} = this.props.rootStore;
    AsyncStorage.multiGet(user, (err, result) => {
      if (err) {
        alert(err);
      } else {
        const username = result[0][1];
        const role = +result[1][1];
        const token = result[2][1];
        const id = result[3][1];

        if (token === null) {
          this._schedule(() => {
            navigate('AuthStack');
          }, 1500);
        } else {
          credentialStore.setUserCredentials(id, username, role, token);
          if (role === 1) {
            this._schedule(() => {
              navigate('Home');
            }, 2000);
          } else {
            this._schedule(() => {
              navigate('Admin');
            }, 2000);
          }
        }
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          isVisible={true}
          size={65}
          type="ChasingDots"
          color={Color.light}
        />
        <Text category="h3" appearance="alternative" style={styles.LoadingText}>
          KBC FUTSAL
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primary,
  },
  LoadingText: {
    color: Color.light,
    marginTop: 20,
  },
});

Splash = inject('rootStore')(observer(Splash));
export default Splash;
