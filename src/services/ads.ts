import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from '@capacitor-community/admob';
import { ADMOB_CONFIG } from '../config/products';

const isNative = Capacitor.isNativePlatform();

export async function initAds(): Promise<void> {
  if (!isNative) return;
  await AdMob.initialize({ testingDevices: [], initializeForTesting: false });
}

export async function showBannerAd(): Promise<void> {
  if (!isNative) return;
  const options: BannerAdOptions = {
    adId: ADMOB_CONFIG.bannerAdUnitId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    margin: 0,
  };
  await AdMob.showBanner(options);
}

export async function hideBannerAd(): Promise<void> {
  if (!isNative) return;
  await AdMob.removeBanner();
}

let interstitialReady = false;

export async function loadInterstitialAd(): Promise<void> {
  if (!isNative) return;
  const options: AdOptions = { adId: ADMOB_CONFIG.interstitialAdUnitId };
  await AdMob.prepareInterstitial(options);
  interstitialReady = true;
}

export async function showInterstitialAd(): Promise<void> {
  if (!isNative || !interstitialReady) return;
  interstitialReady = false;
  await AdMob.showInterstitial();
  // Pre-load next one
  loadInterstitialAd();
}
