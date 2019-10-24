import React, {Component} from 'react';
import {Calendar} from 'react-native-ui-kitten';

class MyCalendar extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
    };
  }

  onSelect = date => {
    this.setState({date});
  };

  render() {
    return <Calendar date={this.state.date} onSelect={this.onSelect} />;
  }
}

export default MyCalendar;
