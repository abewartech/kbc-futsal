import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Layout,
  Text,
  TopNavigation,
  Icon,
  Select,
  Button,
  TopNavigationAction,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import Endpoint from '../../utils/Endpoint';
import Color from '../../constants/Color';
import ActivityList from '../../components/ActivityList';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineVisible: true,
      selectedLine: null,
      activityList: [],
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Activity List',
      header: null,
    };
  };

  componentDidMount() {
    const {lineStore, credentialStore} = this.props.rootStore;
    lineStore.getLine(credentialStore.token);
  }

  setModalVisible = () => {
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  renderSelectElement = () => {
    const {allLine} = this.props.rootStore.lineStore;
    const lineItems = allLine.map(line => {
      return {text: 'Line - ' + line.name, id: line._id};
    });
    const dropdownIcon = style => (
      <Icon {...style} name="arrow-ios-downward" fill="#aaa" />
    );

    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Activity List"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout level="3" style={styles.containerLine}>
          <Select
            label="Select Line :"
            placeholder="Select Line"
            icon={dropdownIcon}
            data={lineItems}
            status="warning"
            selectedOption={this.state.selectedLine}
            onSelect={selectedLine => this.setState({selectedLine})}
            style={styles.selectLine}
          />
          <Button onPress={this.handleSubmit} style={styles.btnSubmit}>
            SUBMIT
          </Button>
        </Layout>
      </SafeAreaView>
    );
  };

  handleSubmit = () => {
    const {credentialStore, lineStore} = this.props.rootStore;
    const selectedLine = parseInt(this.state.selectedLine.text.split(' - ')[1]);
    fetch(
      `${Endpoint.prod}/getactbyline/${selectedLine}`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + credentialStore.token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          if (res.message.length) {
            this.setState({
              activityList: res.message,
              lineVisible: false,
            });
          } else {
            this.props.navigation.navigate('Input');
            lineStore.setSelectedLine(selectedLine);
          }
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
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

  handleCreateActivity = () => {
    const {activityList} = this.state;
    this.props.navigation.navigate('Input', {
      selectedType: activityList[0].type,
    });
  };

  render() {
    const {lineVisible, activityList, selectedLine} = this.state;

    return lineVisible && !activityList.length ? (
      this.renderSelectElement()
    ) : (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Activity List"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <View style={styles.row}>
            <ActivityList
              data={activityList}
              navigation={this.props.navigation}
            />
          </View>
          <View style={styles.row}>
            {activityList.length < 2 ? (
              <Button onPress={this.handleCreateActivity} size="large">
                Create New Activity
              </Button>
            ) : null}
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
});

Activity = inject('rootStore')(observer(Activity));
export default Activity;
