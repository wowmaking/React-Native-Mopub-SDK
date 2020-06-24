//
//  RNMoPubRewardedVideo.m
//  react-native-ad-lib
//
//  Created by Usama Azam on 28/03/2019.
//

#import "RNMoPubRewardedVideo.h"
// #import <AdColonyGlobalMediationSettings.h>
// #import <MPGoogleGlobalMediationSettings.h>
// #import <TapjoyGlobalMediationSettings.h>
// #import <VungleInstanceMediationSettings.h>
#import "MPRewardedVideo.h"
#import "AdLibSDK.h"
@implementation RNMoPubRewardedVideo

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[
             @"rewardedVideoAdDidLoadForAdUnitId",
             @"rewardedVideoAdDidFailToLoadForAdUnitId",
             @"rewardedVideoAdDidFailToPlayForAdUnitId",
             @"rewardedVideoAdWillAppearForAdUnitId",
             @"rewardedVideoAdDidAppearForAdUnitId",
             @"rewardedVideoAdWillDisappearForAdUnitId",
             @"rewardedVideoAdDidDisappearForAdUnitId",
             @"rewardedVideoAdShouldRewardForAdUnitId",
             @"rewardedVideoAdDidExpireForAdUnitId",
             @"rewardedVideoAdDidReceiveTapEventForAdUnitId",
             @"rewardedVideoAdWillLeaveApplicationForAdUnitId"
             ];
}


RCT_EXPORT_METHOD(loadRewardedVideoAdWithAdUnitId:(NSString *)unitId)
{
    
    [MPRewardedVideo loadRewardedVideoAdWithAdUnitID:unitId withMediationSettings:@[]];
    [MPRewardedVideo setDelegate:self forAdUnitId:unitId];
    
}

RCT_EXPORT_METHOD(initializeSdkForRewardedVideoAd:(NSString *)unitId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [AdLibSDK initializeAdSDK:unitId consent:YES resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(presentRewardedVideoAdForAdUnitId:(NSString *) unitId currencyType:(NSString*)currencyType amount:(nonnull NSNumber*) amount callback:(RCTResponseSenderBlock)callback)
{
    
    if ([MPRewardedVideo hasAdAvailableForAdUnitID:unitId]) {
        NSPredicate *rewardPredicate = [NSPredicate predicateWithFormat:@"(SELF.currencyType == %@ AND SELF.amount == %@)", currencyType, amount];
        
        MPRewardedVideoReward *selectedReward = [[MPRewardedVideo availableRewardsForAdUnitID:unitId] filteredArrayUsingPredicate:rewardPredicate].firstObject;
        
        if (selectedReward) {
             UIViewController *vc = [UIApplication sharedApplication].delegate.window.rootViewController;
            [MPRewardedVideo presentRewardedVideoAdForAdUnitID:unitId fromViewController:vc withReward:selectedReward];
             callback(@[@{@"message":@"video showing!"}]);
        } else {
            callback(@[@{@"message":@"reward not found! for these ingredients!"}]);
        }
    } else {
        callback(@[@{@"message":@"ad not found for this UnitId!"}]);
    }
    
}

RCT_EXPORT_METHOD(hasAdAvailableForAdUnitId:(NSString* ) unitId callback: (RCTResponseSenderBlock)callback) {
    BOOL hasAd = [MPRewardedVideo hasAdAvailableForAdUnitID:unitId];
    callback(@[@{@"Has ad": @(hasAd)}]);
}

RCT_EXPORT_METHOD(availableRewardsForAdUnitId: (NSString *)unitId callback: (RCTResponseSenderBlock)callback) {
    
    NSArray *rewards = [MPRewardedVideo availableRewardsForAdUnitID: unitId];
    
    NSMutableArray *rewardDictonaries = [NSMutableArray array];
    for (MPRewardedVideoReward* reward in rewards)
    {
        NSDictionary *rewardDict = @{ reward.currencyType : [NSString stringWithFormat:@"%@",reward.amount]};
        [rewardDictonaries addObject:rewardDict];
    }

    callback(rewardDictonaries);

}


- (void)rewardedVideoAdDidLoadForAdUnitID:(NSString *)adUnitId
{
    
    NSLog(@"video loaded successfully");
    [self sendEventWithName:@"rewardedVideoAdDidLoadForAdUnitId" body:@{@"adUnitId": adUnitId}];
    
}


- (void)rewardedVideoAdDidFailToLoadForAdUnitID:(NSString *)adUnitId error:(NSError *)error
{
    [self sendEventWithName:@"rewardedVideoAdDidFailToLoadForAdUnitId" body:@{@"adUnitId": adUnitId, @"error":error}];
    
}

- (void)rewardedVideoAdDidFailToPlayForAdUnitID:(NSString *)adUnitId error:(NSError *)error
{
    [self sendEventWithName:@"rewardedVideoAdDidFailToPlayForAdUnitId" body:@{@"adUnitId": adUnitId, @"error":error}];
}

- (void)rewardedVideoAdWillAppearForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdWillAppearForAdUnitId" body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdDidAppearForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdDidAppearForAdUnitId"  body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdWillDisappearForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdWillDisappearForAdUnitId"  body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdDidDisappearForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdDidDisappearForAdUnitId"  body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdShouldRewardForAdUnitID:(NSString *)adUnitId reward:(MPRewardedVideoReward *)reward {
    [self sendEventWithName:@"rewardedVideoAdShouldRewardForAdUnitId" body:@{
        @"adUnitId": adUnitId,
        @"isSuccessful": @TRUE,
        @"currencyType": reward.currencyType,
        @"amount": reward.amount
    }];
}

- (void)rewardedVideoAdDidExpireForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdDidExpireForAdUnitId"  body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdDidReceiveTapEventForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdDidReceiveTapEventForAdUnitId" body:@{@"adUnitId": adUnitId}];
}

- (void)rewardedVideoAdWillLeaveApplicationForAdUnitID:(NSString *)adUnitId {
     [self sendEventWithName:@"rewardedVideoAdWillLeaveApplicationForAdUnitId" body:@{@"adUnitId": adUnitId}];
}


- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}


@end
