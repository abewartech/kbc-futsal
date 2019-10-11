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

const DashboardIcon = style => <Icon {...style} name="layout" />;

class Login extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Login',
      header: null,
    };
  };

  state = {
    selectedIndex: 0,
  };

  onSelect = selectedIndex => {
    this.setState({selectedIndex});
  };

  shouldLoadTabContent = index => {
    return index === this.state.selectedIndex;
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.contentContainer}
        enableOnAndroid>
        <TabView
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onSelect}
          shouldLoadComponent={this.shouldLoadTabContent}>
          <Tab title="Login" icon={DashboardIcon}>
            <View style={styles.container}>
              <View style={styles.body}>
                <View style={styles.form}>
                  <LoginForm navigation={this.props.navigation} />
                </View>
              </View>
            </View>
          </Tab>
          <Tab title="Sign Up" icon={DashboardIcon}>
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
    paddingTop: 30,
  },
  form: {
    marginTop: 10,
    width: wp(80),
  },
});

export default Login;
