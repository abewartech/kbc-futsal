import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Button,
} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import ImagePicker from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const bca = require('../../../assets/images/bca.png');

class Bayar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      bookingData: [],
      button: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Bayar',
      header: null,
    };
  };

  componentDidMount() {
    this.setState({
      bookingData: this.props.rootStore.bayarStore.bookingData,
    });
  }

  renderLeftControl = props => {
    return (
      <View>
        <TopNavigationAction
          icon={this.rendeBackIcon}
          onPress={this.backHandler}
        />
      </View>
    );
  };

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({photo: response});
      }
    });
  };

  handleUploadPhoto = () => {
    const {photo, bookingData} = this.state;
    this.props.rootStore.bayarStore.upload(photo, bookingData._id);
    this.setState({button: true});
  };

  rendeBackIcon = style => {
    return <Icon name="close-outline" size={23} {...style} fill="#fff" />;
  };

  backHandler = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const {photo, bookingData, button} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Detail Pembayaran"
          titleStyle={{fontSize: wp(7), color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: hp(1), backgroundColor: Color.primary}}
          alignment="center"
          leftControl={this.renderLeftControl()}
        />
        <ScrollView style={styles.view}>
          <Layout style={styles.container}>
            <View style={styles.section}>
              <Text category="s1" appearance="hint">
                No Tagihan
              </Text>
              <Text category="s1">{bookingData._id}</Text>
            </View>
            <View style={styles.section3}>
              <Text category="s1" appearance="hint">
                Batas Waktu Pembayaran
              </Text>
              <Text category="h5" style={{fontSize: wp(6)}}>
                Jumat, 18 Jan 2019, 20:46 WIB
              </Text>
            </View>
            <View style={styles.section3}>
              <Text category="s1" appearance="hint">
                Jumlah Tagihan
              </Text>
              <Text category="h1">Rp 50.000</Text>
              <Text category="s1">Bayar sesuai jumlah di atas</Text>
            </View>
            <View style={{marginHorizontal: 25, marginVertical: 10}}>
              <Text>
                Gunakan ATM / iBanking / mBangking/ setor tunai untuk transfer
                ke rekening KBC Futsal berikut ini :
              </Text>
            </View>
            <View style={styles.section2}>
              <ImageBackground source={bca} style={styles.bcaLogo} />
              <View style={{marginLeft: 10}}>
                <Text appearance="hint" style={{fontSize: wp(6)}}>
                  Bank BCA, Depok
                </Text>
                <Text category="h5">2367 777 777 555</Text>
                <Text category="s1" appearance="hint">
                  a/n KBC Futsal
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, marginVertical: 10}}>
              <Text>Silahkan upload bukti transfer</Text>
              <Button
                style={{
                  marginVertical: 5,
                }}
                onPress={this.handleChoosePhoto}
                disabled={button}>
                Pilih Gambar
              </Button>
              {photo && (
                <View style={{height: hp(25)}}>
                  <Image source={{uri: photo.uri}} style={styles.image} />
                  <Button
                    style={{
                      marginVertical: 10,
                    }}
                    onPress={this.handleUploadPhoto}
                    disabled={button}>
                    Upload Bukti Transfer
                  </Button>
                </View>
              )}
            </View>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf1',
  },
  section: {
    marginHorizontal: wp(6),
    marginVertical: hp(3),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  section2: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  section3: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf1',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  bcaLogo: {
    width: wp(33),
    height: hp(13),
  },
  image: {
    marginHorizontal: 100,
    height: '50%',
    resizeMode: 'center',
  },
});

Bayar = inject('rootStore')(observer(Bayar));
export default Bayar;
