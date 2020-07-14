package net.wowmaking.mopub;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;

import com.mopub.common.MoPub;
import com.mopub.common.SdkConfiguration;
import com.mopub.common.SdkInitializationListener;
import com.mopub.common.logging.MoPubLog;

import com.facebook.react.bridge.Promise;

/**
 * Created by usamaazam on 29/03/2019.
 */

public class AdLibSDK {

    static void initializeAdSDK(final RNMoPubBanner banner, final String adUnitId, final Activity context, final Promise promise) {

        Handler mainHandler = new Handler(context.getMainLooper());

        Runnable myRunnable = new Runnable() {
            @Override
            public void run() {

                SdkConfiguration sdkConfiguration = new SdkConfiguration.Builder(adUnitId)
                        .withLogLevel(MoPubLog.LogLevel.DEBUG)
                        .withLegitimateInterestAllowed(true)
                        .build();

                MoPub.initializeSdk(context, sdkConfiguration, initSdkListener());

            }

            private SdkInitializationListener initSdkListener() {
                return new SdkInitializationListener() {
                    @Override
                    public void onInitializationFinished() {
                        if (banner != null) {
                            banner.setAdUnitId(adUnitId);
                            banner.loadAd();
                        }
                        if (promise != null) {
                            promise.resolve(null);
                        }
                    }
                };
            }
        };
        mainHandler.post(myRunnable);

    }
}
