import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Splash, Input, Login, Process, Activity} from '../screens';

const MainNavigator = createSwitchNavigator({
  Splash: Splash,
  AuthStack: Login,
  Activity: Activity,
  Input: Input,
  ProcessStack: Process,
});

export default createAppContainer(MainNavigator);
