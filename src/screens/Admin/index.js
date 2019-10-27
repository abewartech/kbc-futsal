import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  List,
  Text,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';

const SAMPLE_DATA = {
  title: 'Nama Team',
  description: '09 Oct 2019 ~ 12:00 - 13:00',
};

const data = new Array(8).fill(SAMPLE_DATA);

class Admin extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Admin',
      header: null,
    };
  };

  renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={this.onDetails}
      style={styles.listFut}>
      <View style={styles.containerLis}>
        <View style={[styles.subContainer, styles.leftSection]}></View>
        <View style={[styles.subContainer, styles.rightSection]}>
          <Text style={styles.titleLabel} category="h5">
            Exercise
          </Text>
          <View style={styles.controlsContainer}>
            <View style={styles.containerA}></View>
            {this.renderLogoutIcon()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
          title="Admin"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <List
            contentContainerStyle={styles.containerList}
            data={data}
            renderItem={this.renderItem}
          />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  containerList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#e8ecf1',
  },
  containerA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  containerLis: {
    flexDirection: 'row',
    borderRadius: 12,
    minHeight: 144,
    overflow: 'hidden',
  },
  subContainer: {
    flex: 1,
  },
  rightSection: {
    padding: 16,
    justifyContent: 'space-between',
  },
  leftSection: {
    padding: 16,
  },
  titleLabel: {
    color: 'black',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chips: {
    width: 80,
  },
  chipsText: {
    color: 'black',
    width: 13,
    height: 13,
    tintColor: 'black',
  },
  detailsIcon: {
    width: 22,
    height: 22,
  },
  listFut: {
    marginVertical: 8,
  },
});

Admin = inject('rootStore')(observer(Admin));
export default Admin;
