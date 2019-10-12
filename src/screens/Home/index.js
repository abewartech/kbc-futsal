import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Layout,
  TopNavigation,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Button,
  ButtonGroup,
  Modal,
  Text,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Color from '../../constants/Color';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      modalVisible: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Activity List',
      header: null,
    };
  };

  onTabSelect = selectedIndex => {
    this.setState({selectedIndex});
    if (selectedIndex === 3) this.setModalVisible();
  };

  setModalVisible = () => {
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  renderModalElement = () => {
    return (
      <Layout level="3" style={styles.modalContainer}>
        <Text>Anda yakin ingin logout ?</Text>
        <ButtonGroup>
          <Button onPress={this.logoutHandler}>Ya</Button>
          <Button onPress={this.setModalVisible}>Tidak</Button>
        </ButtonGroup>
      </Layout>
    );
  };

  logoutHandler = () => {
    let userKeys = ['username', 'role', 'token'];
    const {credentialStore} = this.props.rootStore;
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
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

  renderBookingIcon = () => <Icon name="checkmark-square-outline" />;
  renderHistoryIcon = () => <Icon name="clock-outline" />;
  renderCekIcon = () => <Icon name="calendar-outline" />;
  renderLogoutIcon = () => <Icon name="log-out-outline" />;
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Booking"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
        />
        <Layout style={styles.container}>
          <Modal
            allowBackdrop={true}
            backdropStyle={{backgroundColor: 'black', opacity: 0.5}}
            onBackdropPress={this.setModalVisible}
            visible={this.state.modalVisible}>
            {this.renderModalElement()}
          </Modal>
        </Layout>
        <BottomNavigation
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onTabSelect}>
          <BottomNavigationTab title="Booking" icon={this.renderBookingIcon} />
          <BottomNavigationTab title="History" icon={this.renderHistoryIcon} />
          <BottomNavigationTab title="Cek Jadwal" icon={this.renderCekIcon} />
          <BottomNavigationTab
            onSelect={this.logoutHandler}
            title="Logout"
            icon={this.renderLogoutIcon}
          />
        </BottomNavigation>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLine: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    padding: 20,
  },
  selectLine: {
    width: '70%',
  },
  btnSubmit: {
    width: '68%',
    marginTop: 20,
  },
  modalContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Activity = inject('rootStore')(observer(Activity));
export default Activity;
