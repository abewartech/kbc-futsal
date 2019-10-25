import React, {Component} from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {List} from 'react-native-ui-kitten';

const image2 = require('../../../assets/images/futsal2.jpg');
const image3 = require('../../../assets/images/futsal3.jpg');
const image4 = require('../../../assets/images/futsal4.jpg');

const data = [
  {
    image: image2,
  },
  {
    image: image3,
  },
  {
    image: image4,
  },
];

class MyImages extends Component {
  renderItem = ({item, index}) => (
    <ImageBackground source={data[index].image} style={styles.listItem} />
  );

  render() {
    return (
      <List
        horizontal={true}
        style={styles.list}
        data={data}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    height: 135,
    backgroundColor: '#e8ecf1',
  },
  listItem: {
    width: 200,
    height: 120,
    marginHorizontal: 8,
    backgroundColor: '#e8ecf1',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default MyImages;
