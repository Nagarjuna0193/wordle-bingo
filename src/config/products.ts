// Product IDs must exactly match what you create in Google Play Console
// under Monetization > Products > In-app products

export interface CoinPack {
  id: string;
  label: string;
  coins: number;
  price: string;      // display price (shown before real price loads from store)
  bonus?: string;     // optional badge text
  popular?: boolean;
}

export const COIN_PACKS: CoinPack[] = [
  {
    id: 'coins_100',
    label: 'Starter Pack',
    coins: 100,
    price: '$0.99',
  },
  {
    id: 'coins_350',
    label: 'Value Pack',
    coins: 350,
    price: '$2.99',
    bonus: 'Best Value',
    popular: true,
  },
  {
    id: 'coins_1000',
    label: 'Mega Pack',
    coins: 1000,
    price: '$6.99',
    bonus: 'Most Chips!',
  },
];

export const REMOVE_ADS_PRODUCT_ID = 'remove_ads';
export const REMOVE_ADS_PRICE = '$1.99';

// AdMob IDs — replace with your real IDs from AdMob console (admob.google.com)
// Test IDs below are safe to use during development
export const ADMOB_CONFIG = {
  // Replace with your real AdMob App ID from AndroidManifest.xml
  appId: 'ca-app-pub-3940256099942544~3347511713', // TEST app ID

  // Banner shown at top of game screen
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // TEST banner ID

  // Interstitial shown between rounds
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // TEST interstitial ID
};
