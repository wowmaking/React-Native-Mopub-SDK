import { NativeModules, NativeEventEmitter } from 'react-native';
import { Deferred, } from './utils/deferred';

const { RNMoPubInterstitial } = NativeModules;

export const Interstitial = {

  _adUnitId: null,

  _loadDeferred: null,

  _showDeferred: null,

  _emitter: new NativeEventEmitter(RNMoPubInterstitial),

  /**
   * 
   * @param {string} adUnitId
   * @returns {Promise<void>} 
   */
  init(adUnitId) {
    this._adUnitId = adUnitId;

    this.addEventListener('onLoaded', this._handleLoad.bind(this));
    this.addEventListener('onFailed', this._handleFail.bind(this));
    this.addEventListener('onClicked', this._handleClick.bind(this));
    this.addEventListener('onShown', this._handleShow.bind(this));
    this.addEventListener('onDismissed', this._handleDismiss.bind(this));

    return RNMoPubInterstitial.initializeInterstitialAd(this._adUnitId);
  },

  /**
   * 
   * @returns {Promies<void>}
   */
  load() {
    this._loadDeferred = new Deferred();
    RNMoPubInterstitial.loadAd();
    return this._loadDeferred.promise;
  },

  /**
   * 
   * @returns {Promies<void>}
   */
  show() {
    this._showDeferred = new Deferred();
    RNMoPubInterstitial.show();
    return this._showDeferred.promise;
  },

  /**
   * 
   * @returns {Promies<boolean>}
   */
  isReady() {
    return RNMoPubInterstitial.isReady();
  },

  setKeywords(keywords) {
    RNMoPubInterstitial.setKeywords(keywords);
  },

  /**
   * 
   * @param {'onLoaded'|'onFailed'|'onClicked'|'onShown'|'onDismissed'} eventType
   * @param {Function<Object>} listener 
   */
  addEventListener(eventType, listener) {
    this._emitter.addListener(eventType, listener);
  },

  /**
   * 
   * @param {'onLoaded'|'onFailed'|'onClicked'|'onShown'|'onDismissed'} eventType 
   */
  removeAllListeners(eventType) {
    this._emitter.removeAllListeners(eventType)
  },

  _handleLoad() {
    this._loadDeferred.resolve();
  },

  _handleFail({ message, }) {
    this._loadDeferred.reject(new Error(message));
  },

  _handleClick() { },

  _handleShow() { },

  _handleDismiss() {
    this._showDeferred.resolve();
  },

};
