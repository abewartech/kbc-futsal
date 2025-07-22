import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
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
  Datepicker,
} from '@ui-kitten/components';
import {inject, observer} from 'mobx-react';
import {SafeAreaView} from 'react-navigation';
import Color from '../../constants/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Endpoint from '../../utils/Endpoint';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPrint from 'react-native-print';

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
      visibleToast: false,
      modalMenuVisible: false,
      date: null,
      dateTo: null,
      isCorrect: false,
      pesan: '',
      pesanDateTo: '',
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
      .then((res) => res.json())
      .then((booking) => {
        if (booking.success) {
          this.setState({bookingList: booking.message});
        } else {
          alert(booking.message);
        }
      })
      .catch((error) => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  refreshList = () => {
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
      .then((res) => res.json())
      .then((booking) => {
        if (booking.success) {
          this.setState({bookingList: booking.message});
          ToastAndroid.showWithGravityAndOffset(
            'Data telah dimuat ulang',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            wp(1),
            hp(15),
          );
        } else {
          alert(booking.message);
        }
      })
      .catch((error) => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  };

  renderItem = ({item, index}) => {
    const jam = moment(item.date).format('HH:mm');
    const until = moment(item.date).add(item.jam, 'hours').format('HH:mm');
    return (
      <ListItem
        title={`${item.namaTeam}`}
        description={`${moment(item.date).format(
          'DD MMM YYYY',
        )} ~ ${jam} - ${until}`}
        icon={this.renderItemIcon}
        accessory={this.renderItemAccessory}
        onPress={() => {
          this.acc(item.id);
        }}
        style={{marginVertical: 5}}
      />
    );
  };

  renderRightControl = (props) => {
    return (
      <View>
        <TopNavigationAction
          icon={this.renderLogoutIcon}
          onPress={this.logoutHandler}
        />
      </View>
    );
  };

  renderLeftControl = (props) => {
    return (
      <View>
        <TopNavigationAction icon={this.renderMenuIcon} onPress={this.menu} />
      </View>
    );
  };

  acc = (id) => {
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
        .then((res) => res.json())
        .then((booking) => {
          if (booking.success) {
            const {id, namaTeam, date, jam, image} = booking.message;
            this.setState({noTagihan: id, namaTeam, date, jam, image});
          } else {
            ToastAndroid.showWithGravityAndOffset(
              booking.message,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              wp(1),
              hp(15),
            );
          }
        })
        .catch((error) => {
          alert(error.toString().split('TypeError: ')[1]);
        });
    }
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  menu = () => {
    const modalMenuVisible = !this.state.modalMenuVisible;
    this.setState({modalMenuVisible});
  };

  setDate = (date) => {
    this.setState({date});
  };

  setDateTo = (dateTo) => {
    this.setState({dateTo});
  };

  renderItemAccessory = (style) => (
    <Avatar
      style={{width: 30, height: 25}}
      source={{
        uri:
          'https://akveo.github.io/eva-icons/outline/png/128/arrow-ios-forward-outline.png',
      }}
    />
  );

  renderItemIcon = (style) => <Icon {...style} name="people-outline" />;

  renderCalendarIcon = (style) => <Icon {...style} name="calendar" />;

  renderLogoutIcon = (style) => {
    return <Icon name="log-out" size={23} {...style} fill="#fff" />;
  };

  renderMenuIcon = (style) => {
    return (
      <Icon
        name="menu-outline"
        size={23}
        {...style}
        fill="#fff"
        animation="pulse"
      />
    );
  };

  logoutHandler = () => {
    let userKeys = ['username', 'role', 'token'];
    const {credentialStore} = this.props.rootStore;
    AsyncStorage.multiRemove(userKeys, (err) => {
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

  complateBooking = (id) => {
    const {token} = this.props.rootStore.credentialStore;
    fetch(
      `${Endpoint.prod}/completebooking/${id}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
      {timeout: Endpoint.timeout},
    )
      .then((res) => res.json())
      .then((booking) => {
        if (booking.success) {
          this.setState((prevState) => ({
            bookingList: prevState.bookingList.filter((item) => item.id !== id),
          }));
        } else {
          ToastAndroid.showWithGravityAndOffset(
            booking.message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            wp(1),
            hp(15),
          );
          this.setState((prevState) => ({
            bookingList: prevState.bookingList.filter((item) => item.id !== id),
          }));
        }
      })
      .catch((error) => {
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
              {moment(date).format('DD MMMM YYYY ~ HH:mm')}
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
                  uri: `https://v2.memo.web.id/images/${image}`,
                }
              : {
                  uri: `https://v2.memo.web.id/images/default.jpg`,
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

  reportPenyewaan = () => {
    const {date, dateTo} = this.state;
    const tanggal = moment(date).format('YYYY-MM-DD');
    const tanggalAkhir = moment(dateTo).format('YYYY-MM-DD');
    const {adminStore} = this.props.rootStore;
    if ((date === null) & (dateTo === null)) {
      this.setState({
        isCorrect: true,
        pesan: 'Silahkan pilih tanggal awal',
        pesanDateTo: 'Silahkan pilih tanggal akhir',
      });
    } else if (dateTo === null) {
      this.setState({
        isCorrect: true,
        pesanDateTo: 'Silahkan pilih tanggal akhir',
      });
    } else if (date === null) {
      this.setState({
        isCorrect: true,
        pesanDateTo: 'Silahkan pilih tanggal awal',
      });
    } else {
      this.setState({
        date: null,
        dateTo: null,
        isCorrect: false,
      });
      adminStore.report(tanggal, tanggalAkhir);
      setTimeout(() => {
        this.printHTML();
      }, 1000);
    }
  };

  reportPenyewaanMasuk = () => {
    const {date, dateTo} = this.state;
    const tanggal = moment(date).format('YYYY-MM-DD');
    const tanggalAkhir = moment(dateTo).format('YYYY-MM-DD');
    const {adminStore} = this.props.rootStore;
    if ((date === null) & (dateTo === null)) {
      this.setState({
        isCorrect: true,
        pesan: 'Silahkan pilih tanggal awal',
        pesanDateTo: 'Silahkan pilih tanggal akhir',
      });
    } else if (dateTo === null) {
      this.setState({
        isCorrect: true,
        pesanDateTo: 'Silahkan pilih tanggal akhir',
      });
    } else if (date === null) {
      this.setState({
        isCorrect: true,
        pesanDateTo: 'Silahkan pilih tanggal awal',
      });
    } else {
      this.setState({
        date: null,
        dateTo: null,
        isCorrect: false,
      });
      adminStore.reportpemasukan(tanggal, tanggalAkhir);
      setTimeout(() => {
        this.printPemasukan();
      }, 1000);
    }
  };

  async printHTML() {
    const {reportData, dateTo, date} = this.props.rootStore.adminStore;
    await RNPrint.print({
      html: `<html> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <style>body{font-family: calibri;}table, tr, td{border: 1px solid #30BCC9; border-collapse: collapse;}.page_break{page-break-before: always;}.badge{display: inline-block; padding: 0.25em 0.4em; font-size: 72%; font-weight: 300; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}.badge-pill{padding-right: 0.6em; padding-left: 0.6em; border-radius: 10rem;}.badge-info{color: #fff; background-color: #30BCC9;}.white{border-color: #fff !important;}</style> </head> <body> <div style="width: 100%; text-align: center;"> <h1 style="background-color: #30BCC9; color: #fff; padding: 20px;">KBC FUTSAL</h1> <h5 style="color: #30BCC9;">Jl. Kerja Bakti No.22, Pondok Cina, Kota Depok, Jawa Barat 16424</h5> <hr style="border-top: 2px solid #30BCC9;"> </div><h2 style="font-weight: bold;">Laporan Penyewaan <sup class="badge badge-pill badge-info" style="font-weight: 300 !important;"> ${moment(
        date,
      ).format('DD MMMM YYYY')}- ${moment(dateTo).format(
        'DD MMMM YYYY',
      )}</sup></h2> <table cellpadding="5" style="width: 100%"> <thead> <tr style="text-align: center; background-color: #30BCC9; color: #fff;"> <td class="white">ID</td><td class="white">Nama Team</td><td class="white">Tanggal</td><td class="white">Lama Main</td></tr></thead> <tbody> ${reportData}</tbody> </table> <div style="text-align: right; margin-top: 25px; margin-right: 40px;">Depok, ${moment().format(
        'DD MMMM YYYY',
      )}</div></body> </html>`,
    });
  }

  async printPemasukan() {
    const {reportDataPemasukan, dateTo, date} = this.props.rootStore.adminStore;
    await RNPrint.print({
      html: `<html> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <style>body{font-family: calibri;}table, tr, td{border: 1px solid #30BCC9; border-collapse: collapse;}.page_break{page-break-before: always;}.badge{display: inline-block; padding: 0.25em 0.4em; font-size: 72%; font-weight: 300; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25rem; transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}.badge-pill{padding-right: 0.6em; padding-left: 0.6em; border-radius: 10rem;}.badge-info{color: #fff; background-color: #30BCC9;}.white{border-color: #fff !important;}</style> </head> <body> <div style="width: 100%; text-align: center;"> <h1 style="background-color: #30BCC9; color: #fff; padding: 20px;">KBC FUTSAL</h1> <h5 style="color: #30BCC9;">Jl. Kerja Bakti No.22, Pondok Cina, Kota Depok, Jawa Barat 16424</h5> <hr style="border-top: 2px solid #30BCC9;"> </div><h2 style="font-weight: bold;">Laporan Pemasukan <sup class="badge badge-pill badge-info" style="font-weight: 300 !important;"> ${moment(
        date,
      ).format('DD MMMM YYYY')}- ${moment(dateTo).format(
        'DD MMMM YYYY',
      )}</sup></h2> <table cellpadding="5" style="width: 100%"> <thead> <tr style="text-align: center; background-color: #30BCC9; color: #fff;"> <td class="white">ID</td><td class="white">Tanggal</td><td class="white">Jumlah Pemasukan</td></tr></thead> <tbody> ${reportDataPemasukan}</tbody> </table> <div style="text-align: right; margin-top: 25px; margin-right: 40px;">Depok, ${moment().format(
        'DD MMMM YYYY',
      )}</div></body> </html>`,
    });
  }

  renderMenuModal = () => {
    const {isCorrect, pesan, pesanDateTo} = this.state;
    return (
      <Layout style={styles.modalReportContainer}>
        <View style={styles.mainSection}>
          <View style={styles.sectionReport}>
            <Text category="h1" appearance="default">
              Laporan
            </Text>
          </View>
          <View style={styles.sectionReport}>
            <Datepicker
              placeholder="Dari Tanggal"
              date={this.state.date}
              onSelect={this.setDate}
              style={styles.modalBtn}
              icon={this.renderCalendarIcon}
              caption={isCorrect ? pesan : null}
              status={isCorrect ? 'danger' : null}
            />
          </View>
          <View style={styles.sectionReport}>
            <Datepicker
              placeholder="Sampai Tanggal"
              date={this.state.dateTo}
              onSelect={this.setDateTo}
              style={styles.modalBtn}
              icon={this.renderCalendarIcon}
              caption={isCorrect ? pesanDateTo : null}
              status={isCorrect ? 'danger' : null}
            />
          </View>
          <View style={styles.sectionReport}>
            <Button
              style={styles.modalBtn}
              onPress={() => {
                this.reportPenyewaan();
              }}
              icon={this.renderCancelIcon}>
              Laporan Penyewaan
            </Button>
          </View>
          <View style={styles.sectionReport}>
            <Button
              style={styles.modalBtn}
              onPress={() => {
                this.reportPenyewaanMasuk();
              }}
              icon={this.renderCancelIcon}>
              Laporan Pemasukan
            </Button>
          </View>
        </View>
      </Layout>
    );
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
          title="Admin"
          titleStyle={{fontSize: wp(6), color: 'white', fontWeight: 'bold'}}
          style={{backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
          leftControl={this.renderLeftControl()}
        />
        <Layout style={styles.container}>
          <List
            contentContainerStyle={styles.containerList}
            data={this.state.bookingList}
            renderItem={this.renderItem}
            extraData={this.state}
            ListEmptyComponent={this.listEmpty}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                onRefresh={this.refreshList}
              />
            }
          />
          <Modal
            allowBackdrop={true}
            backdropStyle={{backgroundColor: 'black', opacity: 0.4}}
            onBackdropPress={this.acc}
            visible={this.state.modalVisible}>
            {this.renderAccModal()}
          </Modal>
          <Modal
            allowBackdrop={true}
            backdropStyle={{backgroundColor: 'black', opacity: 0.4}}
            onBackdropPress={this.menu}
            visible={this.state.modalMenuVisible}>
            {this.renderMenuModal()}
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
    width: wp(90),
    height: hp(63),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 8,
  },
  modalReportContainer: {
    width: wp(90),
    height: hp(63),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8,
    paddingTop: 15,
  },
  containerModalBtn: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalBtn: {
    width: wp(70),
    marginVertical: hp(1),
  },
  mainSection: {width: wp(80)},
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  sectionReport: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

Admin = inject('rootStore')(observer(Admin));
export default Admin;
