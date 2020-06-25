import { NativeModules, NativeEventEmitter, } from 'react-native';

import { Deferred, } from './utils/deferred';

const { RNMoPubRewardedVideo, } = NativeModules;

export const RewardedVideo = {

  _rewardsOptionsMap: {},

  _loadingDeferredMap: {},

  _showDeferredMap: {},

  _rewardsToReceivingMap: {},

  _emitter: new NativeEventEmitter(RNMoPubRewardedVideo),

  _options: {},

  init(rewardsOptions, options = {}) {

    this._options = options;

    const adUnitsIds = rewardsOptions.map(({ adUnitId }) => adUnitId);
    rewardsOptions.forEach(({ adUnitId, rewards, }) => {
      rewards.forEach(({ alias, amount, currencyType, }) => {
        this._rewardsOptionsMap[alias] = {
          adUnitId, amount, currencyType,
        };
      });
    });

    this.addEventListener('rewardedVideoAdDidLoadForAdUnitId', this._handleLoad.bind(this));
    this.addEventListener('rewardedVideoAdDidFailToLoadForAdUnitId', this._handleLoadFail.bind(this));
    this.addEventListener('rewardedVideoAdDidAppearForAdUnitId', this._handleShow.bind(this));
    this.addEventListener('rewardedVideoAdDidFailToPlayForAdUnitId', this._handleShowFail.bind(this));
    this.addEventListener('rewardedVideoAdDidDisappearForAdUnitId', this._handleHide.bind(this));
    this.addEventListener('rewardedVideoAdShouldRewardForAdUnitId', this._handleReward.bind(this));
    this.addEventListener('rewardedVideoAdDidReceiveTapEventForAdUnitId', this._handleClick.bind(this));

    return Promise.all(
      adUnitsIds.map((adUnitId) => RNMoPubRewardedVideo.initializeSdkForRewardedVideoAd(adUnitId))
    )
      .then(() => {
        adUnitsIds.forEach((adUnitId) => {
          this._load(adUnitId);
        })
      })
  },

  show(rewardAlias) {
    if (this._rewardsOptionsMap[rewardAlias]) {
      const { adUnitId, amount, currencyType, } = this._rewardsOptionsMap[rewardAlias];
      return this._loadingDeferredMap[adUnitId].promise
        .then(() => {
          this._showDeferredMap[adUnitId] = new Deferred();
          RNMoPubRewardedVideo.presentRewardedVideoAdForAdUnitId(adUnitId, currencyType, amount, ({ success, message }) => {
            if (!success) this._showDeferredMap[adUnitId].reject(new Error(message));
          });
          return this._showDeferredMap[adUnitId].promise;
        });
    }
    return Promise.reject(new Error(`Unknown rewardAlias: ${rewardAlias}`));
  },

  hasAdAvailableForAdUnitId(adUnitId) {
    const deferred = new Deferred();
    RNMoPubRewardedVideo.hasAdAvailableForAdUnitId(adUnitId, deferred.resolve);
    return deferred.promise;
  },

  availableRewardsForAdUnitId(adUnitId) {
    const deferred = new Deferred();
    RNMoPubRewardedVideo.availableRewardsForAdUnitId(adUnitId, (...units) => deferred.resolve(units));
    return deferred.promise;
  },

  /**
   * 
   * @param {'rewardedVideoAdDidLoadForAdUnitId'|'rewardedVideoAdDidFailToLoadForAdUnitId'|'rewardedVideoAdDidAppearForAdUnitId'|'rewardedVideoAdDidFailToPlayForAdUnitId'|'rewardedVideoAdDidDisappearForAdUnitId'|'rewardedVideoAdShouldRewardForAdUnitId'|'rewardedVideoAdDidReceiveTapEventForAdUnitId'} eventType
   * @param {Function<Object>} listener 
   */
  addEventListener(eventType, listener) {
    this._emitter.addListener(eventType, listener);
  },

  /**
   * 
   * @param {'rewardedVideoAdDidLoadForAdUnitId'|'rewardedVideoAdDidFailToLoadForAdUnitId'|'rewardedVideoAdDidAppearForAdUnitId'|'rewardedVideoAdDidFailToPlayForAdUnitId'|'rewardedVideoAdDidDisappearForAdUnitId'|'rewardedVideoAdShouldRewardForAdUnitId'|'rewardedVideoAdDidReceiveTapEventForAdUnitId'} eventType
   */
  removeAllListeners(eventType) {
    this._emitter.removeAllListeners(eventType)
  },

  _load(adUnitId) {
    this._loadingDeferredMap[adUnitId] = new Deferred();
    RNMoPubRewardedVideo.loadRewardedVideoAdWithAdUnitId(adUnitId);
    return this._loadingDeferredMap[adUnitId].promise;
  },

  _handleLoad({ adUnitId, }) {
    this.hasAdAvailableForAdUnitId(adUnitId)
      .then(has => {
        if (has) this._loadingDeferredMap[adUnitId].resolve();
        else this._loadingDeferredMap[adUnitId].reject(new Error(`Doesn have revarded video ad for ${adUnitId}`));
      });

  },

  _handleLoadFail({ adUnitId, error }) {
    this._loadingDeferredMap[adUnitId].reject(new Error(error));
    setTimeout(() => this._load(adUnitId), this._options.loadingTimeout || 5000);
  },

  _handleShow() { },

  _handleShowFail({ adUnitId, error, }) {
    this._showDeferredMap[adUnitId].reject(new Error(error));
  },

  _handleHide({ adUnitId, }) {
    if (this._rewardsToReceivingMap[adUnitId]) {
      this._showDeferredMap[adUnitId].resolve(this._rewardsToReceivingMap[adUnitId]);
      delete this._rewardsToReceivingMap[adUnitId];
    }
    else {
      this._showDeferredMap[adUnitId].reject(new Error(`No rewards found for ad unit: ${adUnitId}`));
    }

    this._load(adUnitId);
  },

  _handleReward({ isSuccessful, adUnitId, currencyType, amount, }) {
    if (!isSuccessful) this._showDeferredMap[adUnitId].reject(new Error(`Error while reward receiving (${adUnitId}): ${currencyType} - ${amount}`));
    this._rewardsToReceivingMap[adUnitId] = { currencyType, amount };
  },

  _handleClick() { },

};
