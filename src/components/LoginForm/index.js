import React, {Component} from 'react';
import {Input, Icon, Button, Layout, Spinner} from 'react-native-ui-kitten';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Color from '../../constants/Color';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      token: '',
      showPass: false,
      isemailEmpty: false,
      isPassEmpty: false,
    };
    this.iconRef = React.createRef();
  }

  loginHandler = () => {
    const {email, password, isemailEmpty, isPassEmpty} = this.state;
    const {authStore} = this.props.rootStore;

    if (email === '' && password === '') {
      this.setState({
        isemailEmpty: !isemailEmpty,
        isPassEmpty: !isPassEmpty,
      });
    } else if (email === '') {
      this.setState({
        isemailEmpty: !isemailEmpty,
      });
    } else if (password === '') {
      this.setState({
        isPassEmpty: !isPassEmpty,
      });
    } else {
      authStore.login(email, password, this.props.navigation);
    }
  };

  renderPasswordIcon = () => (
    <Icon
      name={!this.state.showPass ? 'eye' : 'eye-off'}
      animation="pulse"
      ref={this.iconRef}
    />
  );

  renderUserIcon = () => <Icon name="at-outline" />;

  onPasswordIconPress = () => {
    const showPass = !this.state.showPass;
    this.setState({showPass});
    this.iconRef.current.startAnimation();
  };

  render() {
    const {authStore} = this.props.rootStore;
    const {email, password, isPassEmpty, isemailEmpty} = this.state;
    return (
      <Layout style={styles.container}>
        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            icon={this.renderUserIcon}
            value={email}
            onChangeText={email => this.setState({email, isemailEmpty: false})}
            placeholder="Email"
            style={styles.input}
            caption={isemailEmpty ? 'Please Input Your Email' : null}
            status={isemailEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
          <Input
            autoCapitalize="none"
            icon={this.renderPasswordIcon}
            onIconPress={this.onPasswordIconPress}
            value={password}
            onChangeText={password =>
              this.setState({password, isPassEmpty: false})
            }
            textContentType="password"
            secureTextEntry={!this.state.showPass}
            placeholder="Password"
            style={styles.input}
            caption={isPassEmpty ? 'Please Input Your Password' : null}
            status={isPassEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
        </View>
        {!authStore.isLoading ? (
          <Button
            style={styles.button}
            onPress={() => this.loginHandler()}
            appearance="ghost"
            size={wp(100) > 600 ? 'giant' : 'large'}
            textStyle={{color: '#fff', fontSize: wp(3.5), padding: 5}}>
            LOGIN
          </Button>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ccc',
              },
            ]}>
            <Spinner size="medium" status="info" />
          </TouchableOpacity>
        )}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee',
    elevation: 5,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  form: {
    //
  },
  button: {
    backgroundColor: Color.secondary,
    padding: 10,
    borderRadius: 10,
  },
  input: {
    marginVertical: 5,
    borderRadius: 10,
  },
});

LoginForm = inject('rootStore')(observer(LoginForm));
export default LoginForm;
