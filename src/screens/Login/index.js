import React, {Component} from 'react';
import {StyleSheet, Image, Dimensions, View} from 'react-native';
import {Text} from 'react-native-ui-kitten';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoginForm from '../../components/LoginForm';
import Color from '../../constants/Color';
const logo = require('../../../assets/images/yamaha.png');
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Login extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Login',
      header: null,
    };
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text
              category={wp(100) > 600 ? 'h1' : 'h5'}
              appearance="alternative">
              Sign In To Your Account
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.form}>
              <LoginForm navigation={this.props.navigation} />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingTop: 30,
  },
  form: {
    width: wp(80),
    // height: hp(37),
  },
  logo: {
    width: wp(30),
    height: wp(30),
    marginBottom: 20,
  },
});

export default Login;
