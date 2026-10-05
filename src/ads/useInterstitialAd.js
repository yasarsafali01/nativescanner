import { useCallback, useEffect, useRef } from "react";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";

import { INTERSTITIAL_AD_UNIT_ID } from "./ads";

// Loads an interstitial in the background and exposes a show() that only
// fires once an ad is actually ready; a new one is preloaded after each show.
// show() resolves once the ad has actually closed (or immediately if none was
// shown), so callers can safely display follow-up UI (e.g. a toast) only
// once the user is back looking at the app.
export function useInterstitialAd() {
  const adRef = useRef(null);
  const loadedRef = useRef(false);

  const load = useCallback(() => {
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
    loadedRef.current = false;
    adRef.current = ad;

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      ad.load();
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      loadedRef.current = false;
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, []);

  useEffect(() => load(), [load]);

  return useCallback(() => {
    return new Promise((resolve) => {
      const ad = adRef.current;
      if (!ad || !loadedRef.current) {
        resolve();
        return;
      }
      const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsubClosed();
        resolve();
      });
      try {
        ad.show();
      } catch {
        unsubClosed();
        resolve();
      }
    });
  }, []);
}
