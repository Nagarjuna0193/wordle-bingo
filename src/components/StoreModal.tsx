import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, ShoppingBag, EyeOff, RotateCcw, CheckCircle, Loader } from 'lucide-react';
import { COIN_PACKS, REMOVE_ADS_PRODUCT_ID, REMOVE_ADS_PRICE, CoinPack } from '../config/products';
import { fetchProducts, purchaseProduct, restorePurchases } from '../services/iap';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  chips: number;
  adsRemoved: boolean;
  onPurchaseCoins: (amount: number) => void;
  onRemoveAds: () => void;
}

export default function StoreModal({
  isOpen,
  onClose,
  chips,
  adsRemoved,
  onPurchaseCoins,
  onRemoveAds,
}: StoreModalProps) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null); // productId being purchased
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchProducts().then(setPrices);
  }, [isOpen]);

  const showToast = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBuy = async (pack: CoinPack) => {
    setLoading(pack.id);
    const result = await purchaseProduct(pack.id);
    setLoading(null);

    if (result.success) {
      onPurchaseCoins(pack.coins);
      showToast(`+${pack.coins} Gold Chips added!`, true);
    } else if (result.error !== 'cancelled') {
      showToast(result.error ?? 'Purchase failed. Try again.', false);
    }
  };

  const handleRemoveAds = async () => {
    if (adsRemoved) return;
    setLoading(REMOVE_ADS_PRODUCT_ID);
    const result = await purchaseProduct(REMOVE_ADS_PRODUCT_ID);
    setLoading(null);

    if (result.success) {
      onRemoveAds();
      showToast('Ads removed! Enjoy ad-free gameplay.', true);
    } else if (result.error !== 'cancelled') {
      showToast(result.error ?? 'Purchase failed. Try again.', false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    let found = false;
    await restorePurchases((productId) => {
      found = true;
        if (productId === REMOVE_ADS_PRODUCT_ID) onRemoveAds();
    });
    setRestoring(false);
    showToast(found ? 'Purchases restored!' : 'No previous purchases found.', found);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full sm:max-w-md bg-[#FFF9F2] border-t-4 sm:border-4 border-vibrant-dark rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            id="store-modal"
          >
            {/* Header */}
            <div className="bg-vibrant-dark px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFE66D] rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-vibrant-dark" />
                </div>
                <div>
                  <h2 className="text-lg font-black font-display text-white uppercase tracking-tight">Gold Chip Store</h2>
                  <p className="text-[10px] text-white/60 font-mono uppercase tracking-widest">Buy chips · Remove ads</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#FFE66D] px-3 py-1.5 rounded-xl">
                  <Coins className="w-4 h-4 text-vibrant-dark" />
                  <span className="text-sm font-black text-vibrant-dark font-display">{chips}</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  id="store-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* Coin Packs */}
              <section>
                <h3 className="text-xs font-black font-display uppercase tracking-widest text-vibrant-red mb-3 flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5" /> Gold Chip Packs
                </h3>
                <div className="space-y-2.5">
                  {COIN_PACKS.map(pack => {
                    const isLoading = loading === pack.id;
                    const displayPrice = prices[pack.id] ?? pack.price;

                    return (
                      <motion.button
                        key={pack.id}
                        onClick={() => handleBuy(pack)}
                        disabled={!!loading}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                          pack.popular
                            ? 'border-vibrant-teal bg-vibrant-teal/5 hover:bg-vibrant-teal/10'
                            : 'border-vibrant-gray-light bg-white hover:bg-vibrant-bg'
                        } ${loading ? 'opacity-60' : ''}`}
                        id={`store-pack-${pack.id}`}
                      >
                        {pack.popular && (
                          <span className="absolute top-0 right-0 bg-vibrant-teal text-white text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded-bl-lg tracking-widest">
                            {pack.bonus}
                          </span>
                        )}
                        {!pack.popular && pack.bonus && (
                          <span className="absolute top-0 right-0 bg-vibrant-red text-white text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded-bl-lg tracking-widest">
                            {pack.bonus}
                          </span>
                        )}

                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border-2 ${
                            pack.popular ? 'bg-vibrant-teal/15 border-vibrant-teal/30' : 'bg-[#FFE66D]/30 border-[#FFE66D]/60'
                          }`}>
                            {pack.coins >= 1000 ? '💎' : pack.coins >= 300 ? '🪙' : '✨'}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-black font-display text-vibrant-dark">{pack.label}</p>
                            <p className="text-xs text-slate-500 font-sans font-medium">{pack.coins} Gold Chips</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isLoading ? (
                            <Loader className="w-5 h-5 text-vibrant-teal animate-spin" />
                          ) : (
                            <span className={`text-base font-black font-display ${
                              pack.popular ? 'text-vibrant-teal' : 'text-vibrant-dark'
                            }`}>
                              {displayPrice}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              {/* Divider */}
              <div className="border-t-2 border-dashed border-vibrant-gray-light" />

              {/* Remove Ads */}
              <section>
                <h3 className="text-xs font-black font-display uppercase tracking-widest text-vibrant-red mb-3 flex items-center gap-2">
                  <EyeOff className="w-3.5 h-3.5" /> Remove Ads
                </h3>

                <motion.button
                  onClick={handleRemoveAds}
                  disabled={!!loading || adsRemoved}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    adsRemoved
                      ? 'border-vibrant-green bg-vibrant-green/5 cursor-default'
                      : 'border-vibrant-red/40 bg-white hover:bg-vibrant-red/5 cursor-pointer'
                  } ${loading && !adsRemoved ? 'opacity-60' : ''}`}
                  id="store-remove-ads-btn"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg border-2 ${
                      adsRemoved ? 'bg-vibrant-green/15 border-vibrant-green/30' : 'bg-vibrant-red/10 border-vibrant-red/20'
                    }`}>
                      {adsRemoved ? '✅' : '🚫'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black font-display text-vibrant-dark">
                        {adsRemoved ? 'Ads Removed' : 'Remove All Ads'}
                      </p>
                      <p className="text-xs text-slate-500 font-sans font-medium">
                        {adsRemoved ? 'Enjoying ad-free gameplay!' : 'One-time purchase · Forever ad-free'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {adsRemoved ? (
                      <CheckCircle className="w-6 h-6 text-vibrant-green" />
                    ) : loading === REMOVE_ADS_PRODUCT_ID ? (
                      <Loader className="w-5 h-5 text-vibrant-red animate-spin" />
                    ) : (
                      <span className="text-base font-black font-display text-vibrant-red">
                        {prices[REMOVE_ADS_PRODUCT_ID] ?? REMOVE_ADS_PRICE}
                      </span>
                    )}
                  </div>
                </motion.button>
              </section>

              {/* Restore Purchases */}
              <div className="text-center pb-1">
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="text-xs text-slate-400 hover:text-vibrant-dark font-sans font-semibold underline decoration-dotted underline-offset-2 transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
                  id="store-restore-btn"
                >
                  {restoring
                    ? <><Loader className="w-3 h-3 animate-spin" /> Restoring…</>
                    : <><RotateCcw className="w-3 h-3" /> Restore previous purchases</>
                  }
                </button>
              </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mx-5 mb-4 px-4 py-3 rounded-2xl text-sm font-bold font-display text-center border-2 ${
                    toast.ok
                      ? 'bg-vibrant-green/10 border-vibrant-green text-vibrant-green'
                      : 'bg-vibrant-red/10 border-vibrant-red text-vibrant-red'
                  }`}
                >
                  {toast.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
