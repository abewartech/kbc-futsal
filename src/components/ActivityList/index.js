import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {List, ListItem, Icon} from 'react-native-ui-kitten';
import Color from '../../constants/Color';

const ActivityList = props => {
  const data = props.data;

  const onItemPress = index => {
    props.navigation.navigate('ProcessStack');
  };

  const icon = style => <Icon {...style} name="layers" fill="#fff" />;

  const renderItem = ({item, index}) => (
    <ListItem
      title={item.type}
      description="Description"
      onPress={onItemPress}
      icon={icon}
      style={styles.listItem}
      titleStyle={{color: '#fff', fontSize: 26}}
      descriptionStyle={{color: '#fff', fontSize: 18}}
    />
  );

  return <List data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: Color.primary,
    height: 60,
    marginBottom: 20,
  },
});

export default ActivityList;
