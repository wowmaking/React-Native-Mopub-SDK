//
//  AdLibSDK.m
//  DoubleConversion
//
//  Created by Usama Azam on 29/03/2019.
//

#import "MoPub.h"
#import "MPMoPubConfiguration.h"
#import "RCTBridgeModule.h"
#import "AdLibSDK.h"


@implementation AdLibSDK

+ (void)initializeAdSDK:(NSString *)unitID consent:(BOOL)consent resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    MPMoPubConfiguration *sdkConfig = [[MPMoPubConfiguration alloc] initWithAdUnitIdForAppInitialization: unitID];
    sdkConfig.loggingLevel = MPBLogLevelDebug;
    sdkConfig.allowLegitimateInterest = consent;
    
    [[MoPub sharedInstance] initializeSdkWithConfiguration:sdkConfig completion:^{
        NSLog(@"SDK initialization complete");
        if (resolve != NULL) {
            resolve(NULL);
        }
    }];
}

@end
