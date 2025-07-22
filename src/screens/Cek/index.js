import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  List,
  ListItem,
  Text,
  Avatar,
} from '@ui-kitten/components';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import Endpoint from '../../utils/Endpoint';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Cek extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
      bookingList: [],
      bookingFilter: [],
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Cek Jadwal',
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
          let selectedMonth = moment(this.state.date).format('YYYY-MM-DD');
          let data = booking.message.filter(
            data => moment(data.date).format('YYYY-MM-DD') === selectedMonth,
          );
          this.setState({bookingFilter: data, bookingList: booking.message});
        } else {
          alert(booking.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

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
        style={{marginVertical: 5}}
      />
    );
  };

  onDateChange = date => {
    let selectedMonth = moment(date).format('YYYY-MM-DD');
    let data = this.state.bookingList.filter(
      data => moment(data.date).format('YYYY-MM-DD') === selectedMonth,
    );
    this.setState({bookingFilter: data, date});
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
          title="Cek Jadwal"
          titleStyle={{fontSize: wp(6), color: 'white', fontWeight: 'bold'}}
          style={{backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout>
          <DatePicker
            date={this.state.date}
            onDateChange={date => this.onDateChange(date)}
            locale={'id'}
            mode={'date'}
            style={{width: wp(100), height: hp(30)}}
          />
          <List
            contentContainerStyle={styles.containerList}
            data={this.state.bookingFilter}
            extraData={this.state.bookingFilter}
            renderItem={this.renderItem}
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
  },
  containerList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

Cek = inject('rootStore')(observer(Cek));
export default Cek;
