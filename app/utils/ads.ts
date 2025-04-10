import { Platform } from "react-native";
import { safeRequire, isNative } from "./platform";

// Test ad units for development
const TEST_BANNER_ID = Platform.select({
  ios: "ca-app-pub-3940256099942544/2934735716",
  android: "ca-app-pub-3940256099942544/6300978111",
});

const TEST_INTERSTITIAL_ID = Platform.select({
  ios: "ca-app-pub-3940256099942544/4411468910",
  android: "ca-app-pub-3940256099942544/1033173712",
});

const TEST_REWARDED_ID = Platform.select({
  ios: "ca-app-pub-3940256099942544/1712485313",
  android: "ca-app-pub-3940256099942544/5224354917",
});

// Initialize mobile ads - only called on mobile platforms
export const initializeAds = () => {
  if (!isNative) {
    console.log("Mobile ads not available on web");
    return Promise.resolve(false);
  }

  try {
    // Only require the actual module on mobile platforms
    const mobileAds = safeRequire("react-native-google-mobile-ads")?.default;
    if (!mobileAds) return Promise.resolve(false);

    return mobileAds()
      .initialize()
      .then(() => {
        console.log("Mobile ads initialized successfully");
        return true;
      })
      .catch((error) => {
        console.error("Failed to initialize mobile ads:", error);
        return false;
      });
  } catch (error) {
    console.error("Failed to load mobile ads module:", error);
    return Promise.resolve(false);
  }
};

// Load and show a rewarded ad - only called on mobile platforms
export const showRewardedAd = (
  onRewarded: (amount: number) => void,
  onError: () => void,
) => {
  if (!isNative) {
    console.error("This function should not be called directly on web");
    onError();
    return;
  }

  if (!TEST_REWARDED_ID) {
    console.error("Rewarded ad unit ID not available for this platform");
    onError();
    return;
  }

  // Use conditional require to avoid loading the module on web
  const loadRewardedAd = () => {
    try {
      const adsModule = safeRequire("react-native-google-mobile-ads");
      if (!adsModule) {
        onError();
        return;
      }

      const { RewardedAd, RewardedAdEventType, AdEventType } = adsModule;
      const rewardedAd = RewardedAd.createForAdRequest(TEST_REWARDED_ID);

      const unsubscribeLoaded = rewardedAd.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          console.log("Rewarded ad loaded");
          rewardedAd.show();
        },
      );

      const unsubscribeEarned = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log("User earned reward:", reward);
          onRewarded(reward.amount || 50000); // Default to 50000 if no amount specified
          cleanup();
        },
      );

      const unsubscribeClosed = rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log("Rewarded ad closed");
          cleanup();
        },
      );

      const unsubscribeError = rewardedAd.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.error("Rewarded ad error:", error);
          onError();
          cleanup();
        },
      );

      const cleanup = () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
      };

      // Load the ad
      rewardedAd.load();
    } catch (error) {
      console.error("Error loading rewarded ad module:", error);
      onError();
    }
  };

  loadRewardedAd();
};

// Load and show an interstitial ad - only called on mobile platforms
export const showInterstitialAd = (
  onClosed: () => void,
  onError: () => void,
) => {
  if (!isNative) {
    console.error("This function should not be called directly on web");
    onError();
    return;
  }

  if (!TEST_INTERSTITIAL_ID) {
    console.error("Interstitial ad unit ID not available for this platform");
    onError();
    return;
  }

  // Use conditional require to avoid loading the module on web
  const loadInterstitialAd = () => {
    try {
      const adsModule = safeRequire("react-native-google-mobile-ads");
      if (!adsModule) {
        onError();
        return;
      }

      const { InterstitialAd, AdEventType } = adsModule;
      const interstitialAd =
        InterstitialAd.createForAdRequest(TEST_INTERSTITIAL_ID);

      const unsubscribeLoaded = interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log("Interstitial ad loaded");
          interstitialAd.show();
        },
      );

      const unsubscribeClosed = interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log("Interstitial ad closed");
          onClosed();
          cleanup();
        },
      );

      const unsubscribeError = interstitialAd.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.error("Interstitial ad error:", error);
          onError();
          cleanup();
        },
      );

      const cleanup = () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
      };

      // Load the ad
      interstitialAd.load();
    } catch (error) {
      console.error("Error loading interstitial ad module:", error);
      onError();
    }
  };

  loadInterstitialAd();
};

// Export test IDs for use in mobile-only contexts
export { TEST_BANNER_ID, TEST_INTERSTITIAL_ID, TEST_REWARDED_ID };
