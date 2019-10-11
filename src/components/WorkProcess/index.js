import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Layout, CheckBox} from 'react-native-ui-kitten';
import {inject, observer} from 'mobx-react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class WorkProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedListAll: [],
      ItemsChecked: false,
    };
  }

  selectItem = checked => {
    const {data} = this.props;
    const collection = [];

    if (checked) {
      for (const item of data) {
        collection.push(item);
      }
    }

    this.setState({
      checkedListAll: collection,
      ItemsChecked: checked,
    });
  };

  handleCheckboxClick = (checked, data) => {
    if (checked) {
      this.setState(prevState => ({
        checkedListAll: [...prevState.checkedListAll, data],
      }));
    } else {
      this.setState(prevState => ({
        checkedListAll: prevState.checkedListAll.filter(
          item => item.id != data.id,
        ),
      }));
    }
  };

  render() {
    const {ItemsChecked, checkedListAll} = this.state;
    const {data} = this.props;

    if (checkedListAll.length) {
      this.props.onSelectedProcess(checkedListAll);
    }

    return (
      <Layout style={styles.container}>
        <CheckBox
          text="Select All"
          status="info"
          textStyle={{fontSize: 18}}
          checked={ItemsChecked}
          onChange={this.selectItem}
          style={{marginBottom: 10}}
        />
        <ScrollView style={styles.listContainer}>
          <View style={styles.row}>
            {data.map((item, index) => {
              return (
                <View style={styles.rowData}>
                  <CheckBox
                    key={item.id}
                    status="success"
                    textStyle={{fontSize: 18}}
                    text={item.name}
                    style={styles.listItem}
                    onChange={e => this.handleCheckboxClick(e, item)}
                    checked={checkedListAll.includes(item)}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  listContainer: {
    padding: 10,
    borderRadius: 5,
    maxHeight: hp(40),
  },
  listItem: {
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowData: {
    width: wp(40),
  },
});

WorkProcess = inject('rootStore')(observer(WorkProcess));
export default WorkProcess;
