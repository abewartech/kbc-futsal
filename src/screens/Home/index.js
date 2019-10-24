import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import {Carousel} from '../../components';

class Home extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Home',
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Booking"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <View style={styles.view}>
            <Carousel></Carousel>
          </View>
          <View style={styles.detail}>
            <Text>Informasi Detail</Text>
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
  view: {
    flex: 1,
  },
  detail: {
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
});

Home = inject('rootStore')(observer(Home));
export default Home;
