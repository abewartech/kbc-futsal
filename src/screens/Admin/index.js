import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  List,
  ListItem,
  Button,
  Modal,
  Avatar,
  Text,
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

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
      modalVisible: false,
      noTagihan: '',
      namaTeam: '',
      date: '',
      jam: '',
      image: '',
      refresh: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Admin',
      header: null,
    };
  };

  componentDidMount() {
    const {token} = this.props.rootStore.credentialStore;
    fetch(
      `${Endpoint.prod}/getallbooking`,
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
          alert(booking.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  renderItem = ({item, index}) => {
    const jam = moment(item.date).format('hh:mm');
    const until = moment(item.date)
      .add(item.jam, 'hours')
      .format('hh:mm');
    return (
      <ListItem
        title={`${item.namaTeam}`}
        description={`${moment(item.date).format(
          'DD MMM YYYY',
        )} ~ ${jam} - ${until}`}
        icon={this.renderItemIcon}
        accessory={this.renderItemAccessory}
        onPress={() => {
          this.acc(item._id);
        }}
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

  acc = id => {
    if (id) {
      const {token} = this.props.rootStore.credentialStore;
      fetch(
        `${Endpoint.prod}/getbooking/${id}`,
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
            const {_id, namaTeam, date, jam, image} = booking.message;
            this.setState({noTagihan: _id, namaTeam, date, jam, image});
          } else {
            alert(booking.message);
          }
        })
        .catch(error => {
          alert(error.toString().split('TypeError: ')[1]);
        });
    }
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  renderItemAccessory = style => (
    <Avatar
      style={{width: 30, height: 25}}
      source={{
        uri:
          'https://akveo.github.io/eva-icons/outline/png/128/arrow-ios-forward-outline.png',
      }}
    />
  );

  renderItemIcon = style => <Icon {...style} name="people-outline" />;

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

  complateBooking = id => {
    const {token} = this.props.rootStore.credentialStore;
    fetch(
      `${Endpoint.prod}/completebooking/${id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(booking => {
        if (booking.success) {
          let bookingList = this.state.bookingList.filter(value => {
            value._id !== booking.message._id;
          });
          this.setState({bookingList});
        } else {
          alert(booking.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  renderAccModal = () => {
    const {noTagihan, namaTeam, date, jam, image} = this.state;
    return (
      <Layout style={styles.modalContainer}>
        <View style={styles.mainSection}>
          <View style={styles.section}>
            <Text category="s1" appearance="hint">
              No Tagihan
            </Text>
            <Text category="s1">{noTagihan}</Text>
          </View>
          <View style={styles.section}>
            <Text category="s1" appearance="hint">
              Nama Team
            </Text>
            <Text category="s1">{namaTeam}</Text>
          </View>
          <View style={styles.section}>
            <Text category="s1" appearance="hint">
              Tanggal
            </Text>
            <Text category="s1">
              {moment(date).format('DD MMMM YYYY ~ hh:mm')}
            </Text>
          </View>
          <View style={styles.section}>
            <Text category="s1" appearance="hint">
              Lama Main
            </Text>
            <Text category="s1">{jam} Jam</Text>
          </View>
        </View>
        <Image
          style={{
            width: '80%',
            height: hp(25),
            marginTop: 10,
            resizeMode: 'center',
          }}
          source={
            image
              ? {
                  uri: `http://192.168.1.8:8001/images/uploads/${image}`,
                }
              : {
                  uri: `http://192.168.1.8:8001/images/uploads/default.jpg`,
                }
          }></Image>
        <Text appearance="hint">Bukti Transfer</Text>
        <Button
          style={styles.modalBtn}
          onPress={() => {
            this.complateBooking(noTagihan);
          }}
          icon={this.renderCancelIcon}>
          Accept
        </Button>
      </Layout>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Admin"
          titleStyle={{fontSize: wp(7), color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: hp(1), backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <Layout style={styles.container}>
          <List
            contentContainerStyle={styles.containerList}
            data={this.state.bookingList}
            renderItem={this.renderItem}
            extraData={this.state.bookingList}
          />
          <Modal
            allowBackdrop={true}
            backdropStyle={{backgroundColor: 'black', opacity: 0.4}}
            onBackdropPress={this.acc}
            visible={this.state.modalVisible}>
            {this.renderAccModal()}
          </Modal>
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
  modalContainer: {
    width: wp('90%'),
    height: hp('63%'),
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
  },
  containerModalBtn: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalBtn: {
    width: wp('70%'),
    marginVertical: hp(1),
  },
  mainSection: {width: wp('80%')},
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
});

Admin = inject('rootStore')(observer(Admin));
export default Admin;
