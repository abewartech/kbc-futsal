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
  Avatar,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../../utils/Endpoint';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'History',
      header: null,
    };
  };

  componentDidMount() {
    const {token} = this.props.rootStore.credentialStore;
    fetch(
      `${Endpoint.prod}/getallcompletebooking`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(booking => {
        if (booking.success) {
          this.setState({bookingList: booking.message});
        } else {
          console.log(booking.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  renderItem = ({item, index}) => {
    const jam = moment(item.date).format('HH:mm');
    const until = moment(item.date)
      .add(item.jam, 'hours')
      .format('HH:mm');
    return (
      <ListItem
        title={`${item.namaTeam}`}
        description={`${moment(item.date).format(
          'DD MMM YYYY',
        )} ~ ${jam} - ${until}`}
        accessory={this.renderItemAccessory}
        style={{marginVertical: 5}}
      />
    );
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

  renderItemAccessory = style => <Text style={style}>Rp 50.000</Text>;

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

  listEmpty = () => (
    <View
      style={{
        height: hp(50),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Avatar
        style={styles.item}
        shape="square"
        size="giant"
        source={{
          uri:
            'https://akveo.github.io/eva-icons/outline/png/128/slash-outline.png',
        }}
      />
      <Text>No Data</Text>
      <Text>Nothing to Show</Text>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="History"
          titleStyle={{fontSize: wp(6), color: 'white', fontWeight: 'bold'}}
          style={{backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <List
            contentContainerStyle={styles.containerList}
            data={this.state.bookingList}
            renderItem={this.renderItem}
            extraData={this.state.bookingList}
            ListEmptyComponent={this.listEmpty}
          />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf1',
  },
  containerList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

History = inject('rootStore')(observer(History));
export default History;
