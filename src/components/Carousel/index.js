import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Images} from '../../components';
import {Text, Button} from 'react-native-ui-kitten';
import Color from '../../constants/Color';
const image = require('../../../assets/images/futsal.png');

class MyCarousel extends Component {
  constructor() {
    super();
    this.state = {
      entries: [{title: 'hello'}, {title: 'world'}, {title: 'world'}],
    };
  }

  _renderItem({item, index}) {
    return (
      <View style={styles.slide}>
        <Image style={styles.image} source={image}></Image>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        <ImageBackground style={styles.backgroundImage} source={image} />
        <View style={styles.infoContainer}>
          <View style={styles.detailsContainer}>
            <Text style={styles.titleLabel} category="h6">
              KBC Futsal
            </Text>
            <Text style={styles.rentLabel} appearance="hint" category="p2">
              Harga Booking
            </Text>
            <View style={styles.bookContainer}>
              <Text
                style={styles.priceLabel}
                valueStyle={styles.priceValueLabel}
                scaleStyle={styles.priceScaleLabel}
                scale="night">
                Rp 80.000 / Jam
              </Text>
              <Button style={styles.bookButton} onPress={this.onBookPress}>
                BOOK NOW
              </Button>
            </View>
          </View>
          <View style={styles.facilitiesContainer}>
            <Text style={styles.sectionLabel} category="s1">
              Fasilitas
            </Text>
            <View style={styles.viewFac}>
              <Text style={styles.primaryFacilityList}>WIFI</Text>
              <Text style={styles.primaryFacilityList}>River View</Text>
              <Text style={styles.primaryFacilityList}>Kamar Ganti</Text>
              <Text style={styles.primaryFacilityList}>Music</Text>
            </View>
          </View>
        </View>
        <View style={styles.aboutSection}>
          <Text category="s1">Detail Informasi</Text>
          <Text style={styles.aboutLabel} appearance="hint">
            KBC Futsal adalah lapangan futsal
          </Text>
        </View>
        <View style={styles.aboutSection}>
          <Text style={styles.sectionLabel} category="s1">
            Photos
          </Text>
          <Images style={styles.images} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    marginTop: 20,
    borderRadius: 5,
    padding: 10,
  },
  image: {
    height: 250,
  },
  images: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    minHeight: 280,
  },
  infoContainer: {
    marginTop: -80,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  bookContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  facilitiesContainer: {
    marginTop: -10,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  primaryFacilityList: {
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Color.primary,
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  aboutSection: {
    marginHorizontal: 24,
    marginVertical: 24,
  },
  rentLabel: {
    marginTop: 24,
  },
  bookButton: {},
  priceLabel: {
    marginTop: 8,
  },
  priceValueLabel: {
    fontFamily: 'opensans-bold',
    fontSize: 26,
    lineHeight: 32,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  viewFac: {
    flexDirection: 'row',
  },
});

export default MyCarousel;
