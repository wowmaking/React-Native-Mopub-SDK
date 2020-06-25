import React, { Component } from 'react';
import { requireNativeComponent, View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const BannerPropTypes = {
  adUnitId: PropTypes.string.isRequired,
  testing: PropTypes.bool,
  autoRefresh: PropTypes.bool,
  keywords: PropTypes.string,
  localExtras: PropTypes.object,
  onLoaded: PropTypes.func,
  onFailed: PropTypes.func,
  onClicked: PropTypes.func,
  onExpanded: PropTypes.func,
  onCollapsed: PropTypes.func,
  ...ViewPropTypes,
};

const RNMoPubBanner = requireNativeComponent('RNMoPubBanner', { name: 'Banner', propTypes: { ...BannerPropTypes } });

export class BannerView extends Component {

  static propTypes = {
    ...BannerPropTypes
  };

  render() {
    return (
      <View style={styles.bannerContainer}>
        <RNMoPubBanner
          adUnitId={this.props.adUnitId}
          testing={this.props.testing}
          autoRefresh={this.props.autoRefresh}
          keywords={this.props.keywords}
          localExtras={this.props.localExtras}
          onLoaded={this.props.onLoaded}
          onFailed={this.props.onFailed}
          onClicked={this.props.onClicked}
          onExpanded={this.props.onExpanded}
          onCollapsed={this.props.onCollapsed}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: 50,
    minWidth: 320,
  }
});