import { NativeModules, NativeEventEmitter, } from 'react-native';
import { EventEmitter, } from 'events';

import { Deferred, } from './utils/deferred';

const { RNMoPubRewardedVideo, } = NativeModules;

export const RewardedVideo = {

  _rewardsOptionsMap: {},

  _adUnitsToAliasMap: {},

  _loadingDeferredMap: {},

  _showDeferredMap: {},

  _rewardsToReceivingMap: {},

  _emitter: new EventEmitter(),

  _nativeEmitter: new NativeEventEmitter(RNMoPubRewardedVideo),

  _options: {},

  /**
   * 
   * @param {Object} rewardsOptions 
   * @param {Object} [options]
   * @returns {Promise<void>}
   */
  init(rewardsOptions, options = {}) {
    this._options = options;

    const adUnitsIds = rewardsOptions.map(({ adUnitId }) => adUnitId);
    rewardsOptions.forEach(({ adUnitId, rewards, }) => {
      this._adUnitsToAliasMap[adUnitId] = rewards.map(r => r.alias);
      rewards.forEach(({ alias, amount, currencyType, }) => {
        this._rewardsOptionsMap[alias] = {
          adUnitId, amount, currencyType,
        };
      });
    });

    this._addEventListener('rewardedVideoAdDidLoadForAdUnitId', this._handleLoad.bind(this));
    this._addEventListener('rewardedVideoAdDidFailToLoadForAdUnitId', this._handleLoadFail.bind(this));
    this._addEventListener('rewardedVideoAdDidAppearForAdUnitId', this._handleShow.bind(this));
    this._addEventListener('rewardedVideoAdDidFailToPlayForAdUnitId', this._handleShowFail.bind(this));
    this._addEventListener('rewardedVideoAdDidDisappearForAdUnitId', this._handleHide.bind(this));
    this._addEventListener('rewardedVideoAdShouldRewardForAdUnitId', this._handleReward.bind(this));
    this._addEventListener('rewardedVideoAdDidReceiveTapEventForAdUnitId', this._handleTap.bind(this));

    return Promise.all(
      adUnitsIds.map((adUnitId) => RNMoPubRewardedVideo.initializeSdkForRewardedVideoAd(adUnitId))
    )
      .then(() => {
        adUnitsIds.forEach((adUnitId) => {
          this._load(adUnitId);
        })
      })
  },

  /**
   * 
   * @param {string} rewardAlias 
   * @returns {Promise<Object>}
   */
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

  /**
   * 
   * @param {string} adUnitId 
   * @returns {Promise<boolean>}
   */
  hasAvailableAdForAdUnitId(adUnitId) {
    const deferred = new Deferred();
    RNMoPubRewardedVideo.hasAdAvailableForAdUnitId(adUnitId, deferred.resolve);
    return deferred.promise;
  },

  /**
   * 
   * @param {string} rewardAlias 
   * @returns {Promise<boolean>}
   */
  hasAvailableAdForAlias(rewardAlias) {
    const { adUnitId, } = this._rewardsOptionsMap[rewardAlias];
    return this.hasAvailableAdForAdUnitId(adUnitId)
  },

  /**
   * 
   * @param {string} adUnitId 
   * @returns {Promise<Array<Object>>}
   */
  availableRewardsForAdUnitId(adUnitId) {
    const deferred = new Deferred();
    RNMoPubRewardedVideo.availableRewardsForAdUnitId(adUnitId, (...units) => {
      const unitsArray = units.reduce((data, unit) => ([
        ...data,
        ...Object.entries(unit).map(([currencyType, amount]) => ({ currencyType, amount })),
      ]), []);
      deferred.resolve(unitsArray);
    });
    return deferred.promise;
  },

  /**
   * 
   * @param {'onLoad'|'onLoadFail'|'onShow'|'onShowFail'|'onHide'|'onReward'|'onTap'} eventType 
   * @param {Function<Object>} listener 
   */
  addEventListener(eventType, listener) {
    this._emitter.on(eventType, listener);
  },

  /**
   * 
   * @param {'onLoad'|'onLoadFail'|'onShow'|'onShowFail'|'onHide'|'onReward'|'onTap'} eventType 
   */
  removeAllListeners(eventType) {
    this._emitter.removeAllListeners(eventType);
  },

  /**
   * 
   * @private
   * @param {string} adUnitId 
   */
  _load(adUnitId) {
    this._loadingDeferredMap[adUnitId] = new Deferred();
    RNMoPubRewardedVideo.loadRewardedVideoAdWithAdUnitId(adUnitId);
    return this._loadingDeferredMap[adUnitId].promise;
  },

  /**
   * 
   * @private
   * @param {'rewardedVideoAdDidLoadForAdUnitId'|'rewardedVideoAdDidFailToLoadForAdUnitId'|'rewardedVideoAdDidAppearForAdUnitId'|'rewardedVideoAdDidFailToPlayForAdUnitId'|'rewardedVideoAdDidDisappearForAdUnitId'|'rewardedVideoAdShouldRewardForAdUnitId'|'rewardedVideoAdDidReceiveTapEventForAdUnitId'} eventType
   * @param {Function<Object>} listener 
   */
  _addEventListener(eventType, listener) {
    this._nativeEmitter.addListener(eventType, listener);
  },

  /**
   * 
   * @private
   * @param {'rewardedVideoAdDidLoadForAdUnitId'|'rewardedVideoAdDidFailToLoadForAdUnitId'|'rewardedVideoAdDidAppearForAdUnitId'|'rewardedVideoAdDidFailToPlayForAdUnitId'|'rewardedVideoAdDidDisappearForAdUnitId'|'rewardedVideoAdShouldRewardForAdUnitId'|'rewardedVideoAdDidReceiveTapEventForAdUnitId'} eventType
   */
  _removeAllListeners(eventType) {
    this._nativeEmitter.removeAllListeners(eventType)
  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   */
  _handleLoad({ adUnitId, }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];
    this.hasAvailableAdForAdUnitId(adUnitId)
      .then(has => {
        if (has) {
          this._loadingDeferredMap[adUnitId].resolve();
          this._emitter.emit('onLoad', { rewardsAliases, adUnitId, });
        } else {
          const error = new Error(`Doesn't have rewarded video ad for ${adUnitId}`);
          this._loadingDeferredMap[adUnitId].reject(error);
          this._emitter.emit('onLoadFail', { rewardsAliases, adUnitId, error, });
        }
      });

  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   * @param {string} params.error
   */
  _handleLoadFail({ adUnitId, error: errorMessage }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];
    const error = new Error(`Reward load fail: ${errorMessage}`);
    this._loadingDeferredMap[adUnitId].reject(error);
    this._emitter.emit('onLoadFail', { rewardsAliases, adUnitId, error, });
    setTimeout(() => this._load(adUnitId), this._options.loadingTimeout || 5000);
  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   */
  _handleShow({ adUnitId, }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];
    this._emitter.emit('onShow', { rewardsAliases, adUnitId, });
  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   * @param {string} params.error
   */
  _handleShowFail({ adUnitId, error: errorMessage, }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];
    const error = new Error(`Reward show fail: ${errorMessage}`);
    this._showDeferredMap[adUnitId].reject(error);
    this._emitter.emit('onShow', { rewardsAliases, adUnitId, error, });
  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   */
  _handleHide({ adUnitId, }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];

    if (this._rewardsToReceivingMap[adUnitId]) {
      this._showDeferredMap[adUnitId].resolve(this._rewardsToReceivingMap[adUnitId]);
      delete this._rewardsToReceivingMap[adUnitId];
      this._emitter.emit('onHide', { rewardsAliases, adUnitId, });

    }
    else {
      const error = new Error(`No rewards found for ad unit: ${adUnitId}`);
      this._showDeferredMap[adUnitId].reject(error);
      this._emitter.emit('onShowFail', { rewardsAliases, adUnitId, error, });
    }

    this._load(adUnitId);
  },

  /**
   * 
   * @private
   * @param {Object} params
   * @param {string} params.adUnitId
   * @param {boolean} params.isSuccessful
   * @param {string} params.currencyType
   * @param {number} params.amount
   */
  _handleReward({ isSuccessful, adUnitId, currencyType, amount, }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];

    if (!isSuccessful) {
      const error = new Error(`Error while reward receiving (${adUnitId}): ${currencyType} - ${amount}`);
      this._showDeferredMap[adUnitId].reject(error);
      this._emitter.emit('onShowFail', { rewardsAliases, adUnitId, error, });
    }
    else {
      const reward = { currencyType, amount, };
      this._rewardsToReceivingMap[adUnitId] = reward;
      this._emitter.emit('onReward', { rewardsAliases, adUnitId, reward, });
    }
  },

  /**
   * 
   * @private
   * @param {Object} options
   * @param {string} options.adUnitId
   */
  _handleTap({ adUnitId }) {
    const rewardsAliases = this._adUnitsToAliasMap[adUnitId];
    this._emitter.emit('onTap', { rewardsAliases, adUnitId, });
  },

};
