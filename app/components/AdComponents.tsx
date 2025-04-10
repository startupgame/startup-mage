import React from "react";
import { Platform, View } from "react-native";
import { isNative, safeRequire } from "../utils/platform";

// This component will conditionally render ad components only on mobile platforms
// and provide empty placeholder components for web

interface BannerAdProps {
  unitId?: string;
  size?: string;
  requestOptions?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

export const SafeBannerAd: React.FC<BannerAdProps> = (props) => {
  // Only import and use real ad components on mobile platforms
  const [AdComponent, setAdComponent] =
    React.useState<React.ComponentType<any> | null>(null);
  const [AdSizes, setAdSizes] = React.useState<any>(null);

  React.useEffect(() => {
    // Only attempt to load the ad module on mobile platforms
    if (isNative) {
      const adsModule = safeRequire("react-native-google-mobile-ads");
      if (adsModule) {
        setAdComponent(() => adsModule.BannerAd);
        setAdSizes(adsModule.BannerAdSize);
      }
    }
  }, []);

  // If we're on web or the component hasn't loaded yet, return an empty view
  if (!isNative || !AdComponent || !AdSizes) {
    return <View style={{ height: 50 }} />;
  }

  // On mobile, render the actual ad component
  return <AdComponent {...props} size={props.size || AdSizes.BANNER} />;
};

// Helper function to safely show rewarded ads
export const safeShowRewardedAd = (
  onRewarded: (amount: number) => void,
  onError: () => void,
) => {
  if (!isNative) {
    // On web, simulate a reward after a short delay
    console.log("Simulating rewarded ad on web");
    setTimeout(() => onRewarded(50000), 1000);
    return;
  }

  // On mobile, use the actual implementation
  try {
    const adsModule = safeRequire("../utils/ads");
    if (adsModule) {
      adsModule.showRewardedAd(onRewarded, onError);
    } else {
      // Fallback to simulation if module can't be loaded
      console.log("Fallback: Simulating rewarded ad");
      setTimeout(() => onRewarded(50000), 1000);
    }
  } catch (err) {
    console.error("Failed to load ads module:", err);
    onError();
  }
};

// Helper function to safely show interstitial ads
export const safeShowInterstitialAd = (
  onClosed: () => void,
  onError: () => void,
) => {
  if (!isNative) {
    // On web, simulate ad closed after a short delay
    console.log("Simulating interstitial ad on web");
    setTimeout(onClosed, 1000);
    return;
  }

  // On mobile, use the actual implementation
  try {
    const adsModule = safeRequire("../utils/ads");
    if (adsModule) {
      adsModule.showInterstitialAd(onClosed, onError);
    } else {
      // Fallback to simulation if module can't be loaded
      console.log("Fallback: Simulating interstitial ad");
      setTimeout(onClosed, 1000);
    }
  } catch (err) {
    console.error("Failed to load ads module:", err);
    onError();
  }
};
