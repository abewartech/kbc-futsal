import React, {Component} from 'react';
import {Input, Icon, Button, Layout, Spinner} from 'react-native-ui-kitten';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {observer, inject} from 'mobx-react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Color from '../../constants/Color';

class SignupForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      conPassword: '',
      isemailEmpty: false,
      isnameEmpty: false,
      isPassEmpty: false,
      isConEmpty: false,
    };
    this.iconRef = React.createRef();
  }

  signupHandler = () => {
    const {
      name,
      email,
      password,
      conPassword,
      isConEmpty,
      isemailEmpty,
      isPassEmpty,
      isnameEmpty,
    } = this.state;
    const {authStore} = this.props.rootStore;

    if (name === '' && email === '' && password === '' && conPassword === '') {
      this.setState({
        isnameEmpty: !isnameEmpty,
        isemailEmpty: !isemailEmpty,
        isPassEmpty: !isPassEmpty,
        isConEmpty: !isConEmpty,
      });
    } else if (name === '') {
      this.setState({
        isnameEmpty: !isnameEmpty,
      });
    } else if (email === '') {
      this.setState({
        isemailEmpty: !isemailEmpty,
      });
    } else if (password === '') {
      this.setState({
        isPassEmpty: !isPassEmpty,
      });
    } else if (conPassword === '') {
      this.setState({
        isConEmpty: !isConEmpty,
      });
    } else {
      authStore.register(
        name,
        email,
        password,
        conPassword,
        this.props.navigation,
      );
    }
  };

  renderUserIcon = () => <Icon name="person" />;
  renderEmailIcon = () => <Icon name="at-outline" />;
  renderPassIcon = () => <Icon name="lock-outline" />;

  render() {
    const {authStore} = this.props.rootStore;
    const {
      name,
      email,
      password,
      conPassword,
      isConEmpty,
      isPassEmpty,
      isemailEmpty,
      isnameEmpty,
    } = this.state;
    return (
      <Layout style={styles.container}>
        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            icon={this.renderUserIcon}
            value={name}
            onChangeText={name => this.setState({name, isnameEmpty: false})}
            placeholder="Nama Team"
            style={styles.input}
            caption={isnameEmpty ? 'Isi Nama terlebih dahulu' : null}
            status={isnameEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
          <Input
            autoCapitalize="none"
            icon={this.renderEmailIcon}
            value={email}
            onChangeText={email => this.setState({email, isemailEmpty: false})}
            placeholder="Email"
            style={styles.input}
            caption={isemailEmpty ? 'Isi Email terlebih dahulu' : null}
            status={isemailEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
          <Input
            autoCapitalize="none"
            icon={this.renderPassIcon}
            value={password}
            onChangeText={password =>
              this.setState({password, isPassEmpty: false})
            }
            textContentType="password"
            secureTextEntry={!this.state.showPass}
            placeholder="Password"
            style={styles.input}
            caption={isPassEmpty ? 'Isi Password terlebih dahulu' : null}
            status={isPassEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
          <Input
            autoCapitalize="none"
            icon={this.renderPassIcon}
            value={conPassword}
            onChangeText={conPassword =>
              this.setState({conPassword, isConEmpty: false})
            }
            textContentType="password"
            secureTextEntry={!this.state.showPass}
            placeholder="Confirm Password"
            style={styles.input}
            caption={isConEmpty ? 'Isi Confirm Password terlebih dahulu' : null}
            status={isConEmpty ? 'danger' : null}
            textStyle={{fontSize: wp(3.5)}}
          />
        </View>
        {!authStore.isLoading ? (
          <Button
            style={styles.button}
            onPress={() => this.signupHandler()}
            appearance="ghost"
            size={wp(100) > 600 ? 'giant' : 'large'}
            textStyle={{color: '#fff', fontSize: wp(4), padding: 5}}>
            SIGN UP
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

SignupForm = inject('rootStore')(observer(SignupForm));
export default SignupForm;
