package com.reactlibrary;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.mopub.common.MoPubReward;
import com.mopub.mobileads.MoPubErrorCode;
import com.mopub.mobileads.MoPubRewardedVideoListener;
import com.mopub.mobileads.MoPubRewardedVideos;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

/**
 * Created by usamaazam on 30/03/2019.
 */

public class RNMoPubRewardedVideo extends ReactContextBaseJavaModule implements LifecycleEventListener, MoPubRewardedVideoListener {

    ReactApplicationContext mReactContext;

    public RNMoPubRewardedVideo(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }
    

    public static final String ON_REWARDED_VIDEO_LOAD_SUCCESS = "rewardedVideoAdDidLoadForAdUnitId";
    public static final String ON_REWARDED_VIDEO_LOAD_FAILURE = "rewardedVideoAdDidFailToLoadForAdUnitId";
    public static final String ON_REWARDED_VIDEO_STARTED = "rewardedVideoAdDidAppearForAdUnitId";
    public static final String ON_REWARDED_VIDEO_PLAYBACK_ERROR = "rewardedVideoAdDidFailToPlayForAdUnitId";
    public static final String ON_REWARDED_VIDEO_CLOSED = "rewardedVideoAdDidDisappearForAdUnitId";
    public static final String ON_REWARDED_VIDEO_COMPLETED = "rewardedVideoAdShouldRewardForAdUnitId";
    public static final String ON_REWARDED_VIDEO_CLICKED = "rewardedVideoAdDidReceiveTapEventForAdUnitId";


    @Override
    public String getName() {
        return "RNMoPubRewardedVideo";
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }


    @ReactMethod
    public void initializeSdkForRewardedVideoAd(String adUnitId, Promise promise) {

        AdLibSDK.initializeAdSDK(null, adUnitId, mReactContext.getCurrentActivity(), promise);

    }

    @ReactMethod
    public void loadRewardedVideoAdWithAdUnitId(String adUnitId) {

        MoPubRewardedVideos.loadRewardedVideo(adUnitId);
        MoPubRewardedVideos.setRewardedVideoListener(this);

    }


    private void sendCallBackMessage(Callback callback, boolean success, String message) {
        WritableMap dictionary = new WritableNativeMap();
        dictionary.putBoolean("success", success);
        dictionary.putString("message", message);
        callback.invoke(dictionary);
    }

    private WritableMap createMapByAdUnitId(String adUnitId) {
         WritableMap map = new WritableNativeMap();
         map.putString("adUnitId", adUnitId);
         return map;
    }

    @ReactMethod
    public void presentRewardedVideoAdForAdUnitId(String unitId, String currencyType, Double amount, Callback callback) {


        Set<MoPubReward> rewards = MoPubRewardedVideos.getAvailableRewards(unitId);

        if (rewards.isEmpty()) {
            sendCallBackMessage(callback, false, "reward not found for this UnitId!");
        } else {
            MoPubReward selectedReward = null;
            for (MoPubReward reward : rewards) {
                if ((reward.getAmount() == amount.intValue() && reward.getLabel().equals(currencyType))) {
                    selectedReward = reward;
                }
            }
            if (selectedReward != null) {
                MoPubRewardedVideos.showRewardedVideo(unitId);
                sendCallBackMessage(callback, true, "video showing!");

            } else {
                sendCallBackMessage(callback, false, "reward not found! for these ingredients!");
            }
        }


    }

    @ReactMethod
    public void hasAdAvailableForAdUnitId(String adUnitId, Callback callback) {

        callback.invoke(MoPubRewardedVideos.hasRewardedVideo(adUnitId));

    }

    @ReactMethod
    public void availableRewardsForAdUnitId(String unitId, Callback callback) {
        Set<MoPubReward> rewards = MoPubRewardedVideos.getAvailableRewards(unitId);

        HashMap<String, Integer> hm = new HashMap<>();
        for (MoPubReward reward : rewards) {
            hm.put(reward.getLabel(), reward.getAmount());
        }
        WritableMap map = new WritableNativeMap();
        for (Map.Entry<String, Integer> entry : hm.entrySet()) {
            map.putInt(entry.getKey(), entry.getValue());
        }
        callback.invoke(map);

    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }


    @Override
    public void onRewardedVideoLoadSuccess(String adUnitId) {
        sendEvent(ON_REWARDED_VIDEO_LOAD_SUCCESS, createMapByAdUnitId(adUnitId));
    }

    @Override
    public void onRewardedVideoLoadFailure(String adUnitId, MoPubErrorCode errorCode) {

        WritableMap map = createMapByAdUnitId(adUnitId);
        map.putString("error", errorCode.toString());

        sendEvent(ON_REWARDED_VIDEO_LOAD_FAILURE, map);
    }

    @Override
    public void onRewardedVideoStarted(String adUnitId) {
        sendEvent(ON_REWARDED_VIDEO_STARTED, createMapByAdUnitId(adUnitId));
    }

    @Override
    public void onRewardedVideoPlaybackError(String adUnitId, MoPubErrorCode errorCode) {

        WritableMap map = createMapByAdUnitId(adUnitId);
        map.putString("error", errorCode.toString());

        sendEvent(ON_REWARDED_VIDEO_PLAYBACK_ERROR, map);
    }

    @Override
    public void onRewardedVideoClosed(String adUnitId) {
        sendEvent(ON_REWARDED_VIDEO_CLOSED, createMapByAdUnitId(adUnitId));
    }

    @Override
    public void onRewardedVideoCompleted(Set<String> adUnitIds, MoPubReward reward) {
        WritableMap map = createMapByAdUnitId(adUnitIds.iterator().next());
        map.putBoolean("isSuccessful", reward.isSuccessful());
        map.putInt("amount", reward.getAmount());
        map.putString("currencyType", reward.getLabel());

        sendEvent(ON_REWARDED_VIDEO_COMPLETED, map);
    }

    @Override
    public void onRewardedVideoClicked(@NonNull String adUnitId) {
        sendEvent(ON_REWARDED_VIDEO_CLICKED, createMapByAdUnitId(adUnitId));
    }
}
