import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Splash, Login, Home} from '../screens';

const MainNavigator = createSwitchNavigator({
  Splash: Splash,
  AuthStack: Login,
  Home: Home,
});

export default createAppContainer(MainNavigator);
