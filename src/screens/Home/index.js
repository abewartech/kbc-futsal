import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, ImageBackground} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Button,
  Modal,
  Layout,
  Input,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-date-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Images} from '../../components';
import moment from 'moment';

const image = require('../../../assets/images/futsal.png');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTgl: false,
      date: new Date(),
      jam: '',
      isCorrect: false,
      pesan: '',
      userId: '',
      namaTeam: '',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Home',
      header: null,
    };
  };

  componentDidMount() {
    let user = ['id', 'name'];
    AsyncStorage.multiGet(user, (err, result) => {
      if (err) {
        alert(err);
      } else {
        const userId = result[0][1];
        const name = result[1][1];
        this.setState({
          userId,
          namaTeam: name,
        });
      }
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

  onBookPress = () => {
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  onTglPress = () => {
    const modalTgl = !this.state.modalTgl;
    this.setState({modalTgl, modalVisible: false});
  };

  onChangeText = jam => {
    this.setState({jam});
  };

  bookHandler = () => {
    const {jam, date, userId, namaTeam} = this.state;
    const {bayarStore} = this.props.rootStore;
    const endDate = moment(date).add(jam, 'hours');
    const tanggal = moment(date).format('YYYY-MM-DD');

    if (jam === '') {
      this.setState({
        isCorrect: true,
        pesan: 'Jam sewa tidak boleh kosong',
      });
    } else if (Number.parseInt(jam, 10) > 10) {
      this.setState({
        isCorrect: true,
        pesan: 'Maksimal 10 jam sewa',
      });
    } else {
      this.setState({
        modalTgl: !this.state.modalTgl,
        jam: '',
        isCorrect: false,
      });
      bayarStore.bayar(
        userId,
        namaTeam,
        date,
        jam,
        endDate,
        tanggal,
        this.props.navigation,
      );
    }
  };

  renderBookModal = () => {
    return (
      <Layout level="3" style={styles.modalContainer}>
        <DatePicker
          date={this.state.date}
          onDateChange={date => this.setState({date})}
          locale={'id'}
          minimumDate={new Date(Date.now())}
          minuteInterval={5}
          style={{width: wp(90)}}
        />
        <View style={styles.containerModalBtn}>
          <Button
            style={styles.modalBtn}
            onPress={this.onBookPress}
            status="warning"
            icon={this.renderCancelIcon}>
            Batal
          </Button>
          <Button
            style={styles.modalBtn}
            onPress={this.onTglPress}
            status="info"
            icon={this.renderOkIcon}>
            Lanjut
          </Button>
        </View>
      </Layout>
    );
  };

  renderTglModal = () => {
    const {isCorrect, pesan} = this.state;
    return (
      <Layout level="3" style={styles.modalTglContainer}>
        <Input
          style={styles.input}
          value={this.state.jam}
          onChangeText={this.onChangeText}
          placeholder="Lama Sewa / jam"
          maxLength={2}
          keyboardType="numeric"
          caption={isCorrect ? pesan : null}
          status={isCorrect ? 'danger' : null}
        />
        <View style={styles.containerModalBtn}>
          <Button
            style={styles.modalBtn}
            onPress={this.onTglPress}
            status="warning"
            icon={this.renderCancelIcon}>
            Batal
          </Button>
          <Button
            style={styles.modalBtn}
            onPress={this.bookHandler}
            status="info"
            icon={this.renderOkIcon}>
            Booking
          </Button>
        </View>
      </Layout>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Booking"
          titleStyle={{fontSize: wp(6), color: 'white', fontWeight: 'bold'}}
          style={{backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <ScrollView style={styles.view}>
          <ImageBackground style={styles.backgroundImage} source={image} />
          <View style={styles.infoContainer}>
            <View style={styles.detailsContainer}>
              <Text category="h6">KBC Futsal</Text>
              <Text style={styles.rentLabel} appearance="hint" category="p2">
                Harga Booking
              </Text>
              <View style={styles.bookContainer}>
                <Text
                  style={styles.priceLabel}
                  valueStyle={styles.priceValueLabel}
                  scaleStyle={styles.priceScaleLabel}
                  scale="night">
                  Rp 50.000
                </Text>
                <Button style={styles.bookButton} onPress={this.onBookPress}>
                  BOOK NOW
                </Button>
              </View>
            </View>
            <View style={styles.facilitiesContainer}>
              <Text style={styles.sectionLabel} category="s1">
                Fasilitas
              </Text>
              <View style={styles.viewFac}>
                <Text style={styles.primaryFacilityList}>WIFI</Text>
                <Text style={styles.primaryFacilityList}>River View</Text>
                <Text style={styles.primaryFacilityList}>Kamar Ganti</Text>
                <Text style={styles.primaryFacilityList}>Music</Text>
              </View>
            </View>
          </View>
          <View style={styles.aboutSection}>
            <Text category="s1">Detail Informasi</Text>
            <Text style={styles.aboutLabel} appearance="hint">
              Harga Lapangan jam 07.00 - 15.00 = Rp 80.000 / Jam
            </Text>
            <Text style={styles.aboutLabel} appearance="hint">
              Harga Lapangan jam 15.00 - 23.00 = Rp 100.000 / Jam
            </Text>
          </View>
          <View style={styles.aboutSection}>
            <Text style={styles.sectionLabel} category="s1">
              Photos
            </Text>
            <Images style={styles.images} />
          </View>
        </ScrollView>
        <Modal
          allowBackdrop={true}
          backdropStyle={{backgroundColor: 'black', opacity: 0.5}}
          onBackdropPress={this.onBookPress}
          visible={this.state.modalVisible}>
          {this.renderBookModal()}
        </Modal>
        <Modal
          allowBackdrop={true}
          backdropStyle={{backgroundColor: 'black', opacity: 0.5}}
          onBackdropPress={this.onTglPress}
          visible={this.state.modalTgl}>
          {this.renderTglModal()}
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf1',
  },
  view: {
    flex: 1,
  },
  images: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    minHeight: hp(35),
  },
  infoContainer: {
    marginTop: -80,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  bookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  facilitiesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  primaryFacilityList: {
    marginHorizontal: wp(2),
    marginVertical: wp(1),
    borderWidth: 1,
    borderColor: Color.primary,
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  aboutSection: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  aboutLabel: {
    marginTop: 2,
  },
  rentLabel: {
    marginTop: 20,
  },
  bookButton: {marginTop: -15, borderRadius: 20},
  priceLabel: {
    marginTop: 8,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  viewFac: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalContainer: {
    width: wp(90),
    height: hp(50),
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 8,
  },
  modalTglContainer: {
    width: wp(90),
    height: hp(30),
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
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
    margin: 5,
  },
  input: {
    width: wp(75),
  },
});

Home = inject('rootStore')(observer(Home));
export default Home;
