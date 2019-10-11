import React from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Color from '../../constants/Color';

const SearchDropdown = props => {
  return (
    <SearchableDropdown
      onItemSelect={selectedItem =>
        props.onSelectedValue(props.stateName, selectedItem.name)
      }
      containerStyle={{}}
      itemStyle={{
        padding: 20,
        backgroundColor: '#fafafa',
        borderLeftWidth: 5,
        borderLeftColor: Color.secondary,
        marginBottom: 10,
        elevation: 1,
      }}
      itemTextStyle={{color: '#000', fontSize: 18}}
      itemsContainerStyle={{height: hp(30)}}
      items={props.data}
      resetValue={false}
      textInputProps={{
        placeholder: props.placeholder,
        underlineColorAndroid: 'transparent',
        style: {
          padding: 20,
          backgroundColor: '#fafafa',
          fontSize: 18,
          elevation: 1,
          marginBottom: 10,
        },
      }}
      listProps={{
        nestedScrollEnabled: true,
      }}
    />
  );
};

export default SearchDropdown;
