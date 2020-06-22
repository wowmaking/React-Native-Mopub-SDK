//
//  AdLibSDK.h
//  DoubleConversion
//
//  Created by Usama Azam on 29/03/2019.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AdLibSDK : NSObject
+ (void) initializeAdSDK: (NSString *) unitID consent: (BOOL) consent;
@end

NS_ASSUME_NONNULL_END
