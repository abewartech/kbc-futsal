import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Calendar, List, ListItem, Layout} from 'react-native-ui-kitten';

const SAMPLE_DATA = {
  title: 'Nama Team',
  description: '09 Oct 2019 ~ 12:00 - 13:00',
};

const data = new Array(18).fill(SAMPLE_DATA);

class MyCalendar extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
    };
  }

  renderItem = ({item, index}) => (
    <ListItem
      title={`${item.title}`}
      description={`${item.description}`}
      accessory={this.renderItemAccessory}
    />
  );

  onSelect = date => {
    this.setState({date});
  };

  render() {
    return (
      <Layout>
        <Calendar date={this.state.date} onSelect={this.onSelect} />
        <List
          style={styles.container}
          data={data}
          renderItem={this.renderItem}
        />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
  },
});

export default MyCalendar;
