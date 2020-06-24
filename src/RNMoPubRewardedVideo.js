import {NativeModules, NativeEventEmitter} from 'react-native';
const { RNMoPubRewardedVideo } = NativeModules;


const emitter = new NativeEventEmitter(RNMoPubRewardedVideo);

module.exports = {
    initializeSdkForRewardedVideoAd: (adUnitId:string) => RNMoPubRewardedVideo.initializeSdkForRewardedVideoAd(adUnitId),
    loadRewardedVideoAdWithAdUnitId: (adUnitId: string) => RNMoPubRewardedVideo.loadRewardedVideoAdWithAdUnitId(adUnitId),
    presentRewardedVideoAdForAdUnitId: (adUnitId: string, currencyType:string, amount: number, promise:()=>{}) => RNMoPubRewardedVideo.presentRewardedVideoAdForAdUnitId(adUnitId, currencyType, amount, promise),
    availableRewardsForAdUnitId: (adUnitId:string, promise:()=>{}) => RNMoPubRewardedVideo.availableRewardsForAdUnitId(adUnitId,promise),
    hasAdAvailableForAdUnitId:(adUnitId:string, promise:()=>{}) =>RNMoPubRewardedVideo.hasAdAvailableForAdUnitId(adUnitId,promise) ,
    addEventListener: (eventType: string, listener: Function)  => emitter.addListener(eventType, listener),
    removeAllListeners: (eventType: string) => emitter.removeAllListeners(eventType)
};