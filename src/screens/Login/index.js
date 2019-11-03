import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {TabView, Tab, Icon} from 'react-native-ui-kitten';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoginForm from '../../components/LoginForm';
import SignupForm from '../../components/SignupForm';
import Color from '../../constants/Color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Login extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Login',
      header: null,
      tabBarVisible: false,
    };
  };

  state = {
    selectedIndex: 0,
  };

  onSelect = selectedIndex => {
    this.setState({selectedIndex});
  };

  renderLoginIcon = () => <Icon name="person-outline" />;
  renderSignupIcon = () => <Icon name="person-add-outline" />;

  render() {
    return (
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid>
        <TabView
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onSelect}
          indicatorStyle={styles.indicatorStyle}
          tabBarStyle={styles.tabBarStyle}
          style={styles.tabView}>
          <Tab title="Login" icon={this.renderLoginIcon}>
            <View style={styles.container}>
              <View style={styles.body}>
                <View style={styles.form}>
                  <LoginForm navigation={this.props.navigation} />
                </View>
              </View>
            </View>
          </Tab>
          <Tab title="Sign Up" icon={this.renderSignupIcon}>
            <View style={styles.container}>
              <View style={styles.body}>
                <View style={styles.form}>
                  <SignupForm navigation={this.props.navigation} />
                </View>
              </View>
            </View>
          </Tab>
        </TabView>
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
  body: {
    paddingVertical: wp('5%'),
  },
  form: {
    marginTop: 10,
    width: wp(80),
  },
  tabView: {
    backgroundColor: Color.primary,
  },
  indicatorStyle: {
    backgroundColor: '#40AAB9',
  },
  tabBarStyle: {
    backgroundColor: 'white',
  },
});

export default Login;
