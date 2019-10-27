import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from 'react-native-ui-kitten';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Splash, Login, Home, History, Cek, Admin, Bayar} from '../screens';

export const BottomNavigationShowcase = props => {
  const onTabSelect = selectedIndex => {
    const routes = props.navigation.state.routes;
    const selectedRoute = routes[selectedIndex];
    props.navigation.navigate(selectedRoute.routeName);
  };

  const renderBookingIcon = () => <Icon name="checkmark-square-outline" />;
  const renderHistoryIcon = () => <Icon name="clock-outline" />;
  const renderCekIcon = () => <Icon name="calendar-outline" />;

  return (
    <BottomNavigation
      selectedIndex={props.navigation.state.index}
      onSelect={onTabSelect}>
      <BottomNavigationTab title="Booking" icon={renderBookingIcon} />
      <BottomNavigationTab title="History" icon={renderHistoryIcon} />
      <BottomNavigationTab title="Cek Jadwal" icon={renderCekIcon} />
    </BottomNavigation>
  );
};
export const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: Home,
    History: History,
    Cek: Cek,
  },
  {
    initialRouteName: 'Home',
    tabBarComponent: BottomNavigationShowcase,
  },
);

const MainNavigator = createSwitchNavigator({
  Splash: Splash,
  AuthStack: Login,
  Admin: Admin,
  Bayar: Bayar,
  Home: {
    screen: BottomTabNavigator,
  },
});

export default createAppContainer(MainNavigator);
