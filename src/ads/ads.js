import mobileAds from "react-native-google-mobile-ads";

export const BANNER_AD_UNIT_ID = "ca-app-pub-9814184784546758/1405769327";
export const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-9814184784546758/8223448790";

let initPromise = null;

export function initAds() {
  if (!initPromise) initPromise = mobileAds().initialize();
  return initPromise;
}
