import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  Button,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Modal,
} from 'react-native-ui-kitten';
import {SafeAreaView} from 'react-navigation';
import {inject, observer} from 'mobx-react';
import AsyncStorage from '@react-native-community/async-storage';
import fetch from 'react-native-fetch-polyfill';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SearchDropdown from '../../components/SearchDropdown';
import WorkProcess from '../../components/WorkProcess';
import Endpoint from '../../utils/Endpoint';
import Color from '../../constants/Color';

class InputScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: '',
      selectedCavity: '',
      type: '',
      disable: false,
      showCheckbox: false,
      modalVisible: false,
      selectedProcess: [],
      optionProcess: [],
    };
  }

  // Start: Navigation
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Input Process Activity',
      header: null,
    };
  };

  componentDidMount() {
    const {
      modelStore,
      cavityStore,
      credentialStore,
      projectStore,
    } = this.props.rootStore;
    modelStore.getModel(credentialStore.token);
    cavityStore.getCavity(credentialStore.token);
    projectStore.getProject(credentialStore.token);
  }

  componentDidUpdate(prevProps, prevState) {
    const {selectedCavity, selectedModel} = this.state;
    const {credentialStore} = this.props.rootStore;

    if (
      prevState.selectedModel !== selectedModel ||
      prevState.selectedCavity !== selectedCavity
    ) {
      if (selectedCavity !== '' && selectedModel !== '') {
        this.props.rootStore.projectStore.getProjectByModelCavity(
          credentialStore.token,
          `${selectedModel}&${selectedCavity}`,
        );
      }
    }
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

  // End: Navigation

  resetHandler = () => {
    this.setState({
      disable: false,
      showCheckbox: false,
      selectedProcess: [],
    });
  };

  submitActivityHandler = () => {
    const {credentialStore, projectStore, lineStore} = this.props.rootStore;
    const {selectedCavity, selectedModel, selectedProcess, type} = this.state;

    const data = {
      line: lineStore.selectedLine,
      type: type,
      operator: credentialStore.id,
      selectedProcess: selectedProcess,
      project: projectStore.selectedProject[0]._id,
      mouldModel: selectedModel,
      cavity: selectedCavity,
    };

    // Fetch To Submit
    const {token} = credentialStore;
    fetch(
      `${Endpoint.prod}/addactivity`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          AsyncStorage.setItem('Project', JSON.stringify(res.message));
          this.props.navigation.navigate('ProcessStack');
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });

    this.setState({
      modalVisible: !this.state.modalVisible,
      disable: false,
      showCheckbox: false,
      selectedProcess: [],
    });
  };

  handleSelectedProcess = selectedProcess => {
    this.setState({selectedProcess});
  };

  setModalVisible = () => {
    const modalVisible = !this.state.modalVisible;
    this.setState({modalVisible});
  };

  renderModalElement = () => {
    return (
      <Layout level="3" style={styles.modalContainer}>
        <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
          Are you sure want to create this activity ?
        </Text>
        <View style={styles.containerModalBtn}>
          <Button
            style={styles.modalBtn}
            onPress={this.submitActivityHandler}
            status="info"
            icon={this.renderOkIcon}>
            Yes
          </Button>
          <Button
            style={styles.modalBtn}
            onPress={this.setModalVisible}
            status="warning"
            icon={this.renderCancelIcon}>
            No
          </Button>
        </View>
      </Layout>
    );
  };

  // Render Icon
  renderOkIcon = style => (
    <Icon name="checkmark-circle-2" size={23} {...style} fill="#fff" />
  );
  renderCancelIcon = style => (
    <Icon name="close-circle" size={23} {...style} fill="#fff" />
  );

  handleDropdown = (state, value) => {
    this.setState({[state]: value});
  };

  fixProcessHandler = () => {
    const {projectStore} = this.props.rootStore;
    // Data Dalam Array Hanya 1 Lengthnya
    if (projectStore.selectedProject.length) {
      const data = projectStore.selectedProject[0].fixProcess.map(item => {
        return {name: item.workProcess, id: item.id, stdTime: item.stdTime};
      });
      this.setState({
        optionProcess: data,
        showCheckbox: true,
        disable: true,
        type: 'fixProcess',
      });
    }
    this.setState({
      showCheckbox: true,
      disable: true,
    });
  };

  moveProcessHandler = () => {
    const {projectStore} = this.props.rootStore;
    if (projectStore.selectedProject.length) {
      const data = projectStore.selectedProject[0].moveProcess.map(item => {
        return {name: item.workProcess, id: item.id, stdTime: item.stdTime};
      });
      this.setState({
        optionProcess: data,
        showCheckbox: true,
        disable: true,
        type: 'moveProcess',
      });
    }
    this.setState({
      showCheckbox: true,
      disable: true,
    });
  };

  render() {
    const {
      modelStore,
      cavityStore,
      projectStore,
      lineStore,
    } = this.props.rootStore;
    const {showCheckbox, optionProcess} = this.state;

    // Select Option Data
    const modelItems = modelStore.allModel.map(model => {
      return {name: model.name, id: model._id};
    });
    const cavityItems = cavityStore.allCavity.map(cavity => {
      return {name: cavity.name, id: cavity._id};
    });

    // Render Icon
    const ResetIcon = style => <Icon {...style} name="repeat" />;

    return (
      <SafeAreaView style={{flex: 1}}>
        <TopNavigation
          title="Input Process"
          titleStyle={{fontSize: 24, color: 'white', fontWeight: 'bold'}}
          subtitle="Activity"
          subtitleStyle={{fontSize: 16, color: 'white'}}
          style={{paddingVertical: 20, backgroundColor: Color.primary}}
          alignment="center"
          rightControls={this.renderRightControl()}
        />
        {/* <ScrollView
          style={{padding: 20}}
          contentContainerStyle={styles.container}> */}
        <View style={{padding: 20, flex: 1}}>
          <View style={styles.selectContainer}>
            <SearchDropdown
              stateName="selectedModel"
              data={modelItems}
              placeholder="Select Model"
              onSelectedValue={this.handleDropdown}
            />
          </View>
          <View style={styles.selectContainer}>
            <SearchDropdown
              stateName="selectedCavity"
              data={cavityItems}
              placeholder="Select Cavity"
              onSelectedValue={this.handleDropdown}
            />
          </View>
          <View style={styles.containerBtn}>
            <Button
              size="medium"
              style={styles.button}
              onPress={this.fixProcessHandler}
              disabled={
                this.state.disable ||
                this.props.navigation.getParam('selectedType') === 'fixProcess'
                  ? true
                  : false
              }>
              FIX
            </Button>
            <Button
              size="medium"
              style={styles.button}
              onPress={this.moveProcessHandler}
              disabled={
                this.state.disable ||
                this.props.navigation.getParam('selectedType') === 'moveProcess'
                  ? true
                  : false
              }>
              MOVE
            </Button>
            <Button
              size="medium"
              disabled={!this.state.disable}
              status="warning"
              onPress={this.resetHandler}
              icon={ResetIcon}
              style={styles.resetBtn}
            />
          </View>
          <View style={styles.workProcess}>
            {showCheckbox ? (
              projectStore.selectedProject.length ? (
                <ScrollView style={{maxHeight: hp(100) > 600 ? wp(70) : 50}}>
                  <Text category="h6" style={{marginBottom: 5}}>
                    Select Work Process :
                  </Text>
                  <WorkProcess
                    onSelectedProcess={this.handleSelectedProcess}
                    data={optionProcess}
                  />
                </ScrollView>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    paddingVertical: 20,
                  }}>
                  No data available according to cavity and model selected.
                </Text>
              )
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  paddingVertical: 20,
                }}>
                Please select cavity and model.
              </Text>
            )}
          </View>
          <Button
            size="giant"
            disabled={
              !this.state.disable || !projectStore.selectedProject.length
            }
            status="info"
            style={{marginBottom: 40}}
            onPress={this.setModalVisible}>
            SUBMIT
          </Button>
          <Modal
            allowBackdrop={true}
            backdropStyle={{backgroundColor: 'black', opacity: 0.5}}
            onBackdropPress={this.setModalVisible}
            visible={this.state.modalVisible}>
            {this.renderModalElement()}
          </Modal>
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  workProcess: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 20,
  },
  containerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  button: {
    width: '42%',
  },
  resetBtn: {
    width: '10%',
  },
  modalContainer: {
    width: 400,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  containerModalBtn: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalBtn: {
    margin: 5,
  },
  selectContainer: {
    // padding: 10,
  },
});

InputScreen = inject('rootStore')(observer(InputScreen));
export default InputScreen;
