import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  List,
  Text,
  ListItem,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';

const SAMPLE_DATA = {
  title: 'Nama Team',
  description: '09 Oct 2019 ~ 12:00 - 13:00',
};

const data = new Array(28).fill(SAMPLE_DATA);

class History extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'History',
      header: null,
    };
  };

  renderItem = ({item, index}) => (
    <ListItem
      title={`${item.title}`}
      description={`${item.description}`}
      accessory={this.renderItemAccessory}
    />
  );

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

  renderItemAccessory = style => <Text style={style}>Rp 80.000</Text>;

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
          title="History"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <List style={styles.list} data={data} renderItem={this.renderItem} />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

History = inject('rootStore')(observer(History));
export default History;
