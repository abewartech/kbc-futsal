import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
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
      <View>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={400}
          itemWidth={300}
        />
        <Pagination
          dotsLength={3}
          activeDotIndex={this.state.carouselIndex}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(0, 0, 0, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={'black'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._carousel}
          tappableDots={!!this._carousel}
        />
      </View>
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
});

export default MyCarousel;
