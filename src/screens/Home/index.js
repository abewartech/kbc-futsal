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

const image = require('../../../assets/images/futsal.png');
const CalendarIcon = style => <Icon {...style} name="calendar" />;

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
    };
  }

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
    const {jam, isCorrect} = this.state;

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
      alert('Booking success');
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
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        <ScrollView style={styles.view}>
          <ImageBackground style={styles.backgroundImage} source={image} />
          <View style={styles.infoContainer}>
            <View style={styles.detailsContainer}>
              <Text style={styles.titleLabel} category="h6">
                KBC Futsal
              </Text>
              <Text style={styles.rentLabel} appearance="hint" category="p2">
                Harga Booking
              </Text>
              <View style={styles.bookContainer}>
                <Text
                  style={styles.priceLabel}
                  valueStyle={styles.priceValueLabel}
                  scaleStyle={styles.priceScaleLabel}
                  scale="night">
                  Rp 80.000 / Jam
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
              KBC Futsal adalah lapangan futsal
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
    minHeight: hp('35%'),
  },
  infoContainer: {
    marginTop: -80,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  bookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  facilitiesContainer: {
    marginTop: -10,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  primaryFacilityList: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Color.primary,
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  aboutSection: {
    marginHorizontal: 24,
    marginVertical: 24,
  },
  rentLabel: {
    marginTop: 24,
  },
  bookButton: {borderRadius: 20},
  priceLabel: {
    marginTop: 8,
  },
  priceValueLabel: {
    fontFamily: 'opensans-bold',
    fontSize: 26,
    lineHeight: 32,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  viewFac: {
    flexDirection: 'row',
  },
  modalContainer: {
    width: wp('90%'),
    height: hp('30%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  modalTglContainer: {
    width: wp('90%'),
    height: hp('20%'),
    backgroundColor: 'white',
    justifyContent: 'center',
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
  datepicker: {
    padding: 50,
  },
  timePick: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  input: {
    width: wp('75%'),
  },
});

Home = inject('rootStore')(observer(Home));
export default Home;
