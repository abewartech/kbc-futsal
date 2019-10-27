import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
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

const bca = require('../../../assets/images/bca.png');

class Bayar extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Bayar',
      header: null,
    };
  };

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

  rendeBackIcon = style => {
    return <Icon name="close-outline" size={23} {...style} fill="#fff" />;
  };

  backHandler = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TopNavigation
          title="Detail Pembayaran"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          leftControl={this.renderLeftControl()}
        />
        <Layout style={styles.container}>
          <View style={styles.section}>
            <Text category="s1" appearance="hint">
              No Tagihan
            </Text>
            <Text category="s1" style={styles.label}>
              2423h423gg4g34h
            </Text>
          </View>
          <View style={styles.section3}>
            <Text category="s1" appearance="hint">
              Batas Waktu Pembayaran
            </Text>
            <Text category="h5">Jumat, 18 Jan 2019, 20:46 WIB</Text>
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
              Gunakan ATM / iBanking / mBangking/ setor tunai untuk transfer ke
              rekening KBC Futsal berikut ini :
            </Text>
          </View>
          <View style={styles.section2}>
            <ImageBackground source={bca} style={styles.bcaLogo} />
            <View>
              <Text appearance="hint" style={{fontSize: 18}}>
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
            <Button style={{marginVertical: 20}}>Upload Bukti Transfer</Button>
          </View>
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
  section: {
    marginHorizontal: 25,
    marginVertical: 20,
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
    width: 130,
    height: 70,
  },
});

Bayar = inject('rootStore')(observer(Bayar));
export default Bayar;
