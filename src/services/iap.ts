import { Capacitor } from '@capacitor/core';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';
import { COIN_PACKS, REMOVE_ADS_PRODUCT_ID } from '../config/products';

const isNative = Capacitor.isNativePlatform();

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  error?: string;
}

export async function initIAP(): Promise<void> {
  if (!isNative) return;
  // Plugin is ready to use once the app loads; no additional init required.
}

export async function fetchProducts(): Promise<Record<string, string>> {
  if (!isNative) {
    // Web fallback: return display prices from config
    const prices: Record<string, string> = {};
    COIN_PACKS.forEach(p => { prices[p.id] = p.price; });
    prices[REMOVE_ADS_PRODUCT_ID] = '$1.99';
    return prices;
  }

  try {
    const allIds = [...COIN_PACKS.map(p => p.id), REMOVE_ADS_PRODUCT_ID];
    const { products } = await NativePurchases.getProducts({
      productIdentifiers: allIds,
      productType: PURCHASE_TYPE.INAPP,
    });

    const prices: Record<string, string> = {};
    products.forEach(p => { prices[p.identifier] = p.priceString; });
    return prices;
  } catch {
    return {};
  }
}

export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  if (!isNative) {
    // Web dev mode: simulate a successful purchase
    console.warn('[IAP] Web mode: simulating purchase of', productId);
    return { success: true, productId };
  }

  try {
    const transaction = await NativePurchases.purchaseProduct({
      productIdentifier: productId,
      productType: PURCHASE_TYPE.INAPP,
      isConsumable: productId !== REMOVE_ADS_PRODUCT_ID,
    });

    return { success: true, productId: transaction.productIdentifier };
  } catch (err: any) {
    if (err?.code === 'E_USER_CANCELLED' || err?.message?.includes('cancel')) {
      return { success: false, error: 'cancelled' };
    }
    return { success: false, error: err?.message ?? 'Purchase failed' };
  }
}

export async function restorePurchases(
  onRestored: (productId: string) => void
): Promise<void> {
  if (!isNative) return;

  // Listen for transactions that come in during restore
  const handle = await NativePurchases.addListener('transactionUpdated', (transaction) => {
    if (transaction?.productIdentifier) {
      onRestored(transaction.productIdentifier);
    }
  });

  try {
    await NativePurchases.restorePurchases();
  } finally {
    handle.remove();
  }
}
