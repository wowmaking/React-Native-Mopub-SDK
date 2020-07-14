# @wowmaking/react-native-mopub

## Getting started

`$ npm install @wowmaking/react-native-mopub --save`

### Mostly automatic installation

`$ react-native link @wowmaking/react-native-mopub`

## Usage
### Interstitial
```javascript
import { Interstitial, } from '@wowmaking/react-native-mopub';
```
### Interstitial Methods
| Mehod | Description | Return |
| --- | --- | --- |
| `init(adUnitId: string)` | Initialize Interstitial ad for the the given ad unit. | `Promise<void>` |
| `load()`  | Loads ad for the unit provided through initialization. | `Promise<void>` |
| `setKeywords(keywords: string)`  | Set keyword for the ad. | `void` |
|  `isReady()`  | Return a promise to check whether Interstitial is ready. | `Promise<boolean>` |
|  `show()`  | Shows Interstitial if loaded. | `Promise<void>` |
| `addEventListener(eventType: string, listener: Function)` |Adds listener to the events from Interstitial ad, possible event  names are `onLoaded`, `onFailed`, `onClicked`, `onShown` and `onDismissed`.| `void` |
| `removeAllListeners(eventType: string)` | Remove listeners for added for events from Interstitial ad. | `void` |

### Rewarded video
```javascript
import { RewardedVideo, } from '@wowmaking/react-native-mopub';
```
### RewardedVideo Methods
| Mehod | Description | Return |
| --- | --- | --- |
| `init(rewardsOptions: Object)` | Initialize rewarded video ad for the the given ad units and rewards. (`rewardsOptions` shape: `[{ adUnitId: string, rewards: [{ alias: string, currencyType: string, amount: number, }]}]`) | `Promise<void>` |
|  `show(rewardAlias: string)`  | Shows rewarded video for reward alias provided through initialization if loaded. | `Promise<{success: boolean, message: string}>` |
|  `hasAvailableAd(rewardAlias: string)`  | Return a promise to check whether ad is ready for reward alias. | `Promise<boolean>` |
|  `availableRewardsForAdUnitId(adUnitId: string)`  | Return array of available rewards for provided ad unit. | `Promise<Array<{[currencyType]: number}>>` |
| `addEventListener(eventType: string, listener: Function)` |Adds listener to the events from RewardedVideo ad, possible event  is described below.| `void` |
| `removeAllListeners(eventType: string)` | Remove listeners for added for events from RewardedVideo ad. | `void` |

### RewardedVideo events types
| Name | Event properties | Description |
| --- | --- | --- |
| `onLoad` | `rewardsAliases: Array<string>`, `adUnitId: string` | Ad was loaded for given ad unit id | 
| `onLoadFail` | `rewardsAliases: Array<string>`, `adUnitId: string`, `error: Error` | Ad was fail loaded for given ad unit id |
| `onShow` | `rewardsAliases: Array<string>`, `adUnitId: string` | Ad starts to showing for given ad unit id |
| `onShowFail` | `rewardsAliases: Array<string>`, `adUnitId: string`, `error: Error` | Ad showing failed with error for given ad unit id |
| `onHide` | `rewardsAliases: Array<string>`, `adUnitId: string` | Ad was closed for given ad unit id |
| `onReward` | `rewardsAliases: Array<string>`, `adUnitId: string`, `reward: { currencyType: string, amount: number }` | Ad was rewarded for given ad unit id |
| `onTap` | `rewardsAliases: Array<string>`, `adUnitId: string` | Tap event was received for given ad unit id |

### Banner
```javascript
import { BannerView, } from '@wowmaking/react-native-mopub';
```
### Banner Props
| Prop |Type| Description |
| --- | --- | --- |
|`adUnitId`| `string` |Banner ad unit id for which you want to show banner ad.|
|`autoRefresh`| `boolean` | Toggle auto-refresh enable or disable.|
|`keywords`| `string` |Pass the keywords from your app to MoPub as a comma-separated list in the ad view. Each keyword should be formatted as a key/value pair (e.g. m_age:24). Any characters can be used except & and =.|
|`onLoaded`|`Function`|Calls when the banner has successfully retrieved an ad.|
|`onFailed`|`Function`|Calls  when the banner has failed to retrieve an ad. You can get error message from the event object.|
|`onClicked`|`Function`|Calls when the user has tapped on the banner.|
|`onExpanded`|`Function`|Calls when the banner has just taken over the screen.|
|`onCollapsed`|`Function`|Calls when an expanded banner has collapsed back to its original size.|

