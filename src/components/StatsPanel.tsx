import { GameStats, PowerUp } from '../types';
import { Coins, Trophy, Flame, Play, HelpCircle, Zap, ShieldAlert, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsPanelProps {
  stats: GameStats;
  powerUps: PowerUp[];
  onBuyPowerUp: (powerUpId: string) => void;
  onUsePowerUp: (powerUpId: string) => void;
  isPowerUpActive: (powerUpId: string) => boolean;
  onRerollBingoCard: () => void;
  canReroll: boolean;
}

export default function StatsPanel({
  stats,
  powerUps,
  onBuyPowerUp,
  onUsePowerUp,
  isPowerUpActive,
  onRerollBingoCard,
  canReroll
}: StatsPanelProps) {
  return (
    <div className="bg-white border-4 border-vibrant-gray-light rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-6 h-full" id="stats-panel">
      
      {/* Primary Currencies & Level */}
      <div className="grid grid-cols-2 gap-3.5" id="currencies-grid">
        {/* Chips Card */}
        <motion.div 
          className="bg-[#FFE66D]/15 border-2 border-[#FFE66D] rounded-2xl p-4 flex flex-col justify-between"
          whileHover={{ translateY: -3 }}
        >
          <span className="text-[10px] text-vibrant-dark font-display tracking-widest flex items-center gap-1.5 font-extrabold uppercase">
            <Coins className="w-4 h-4 text-vibrant-ochre animate-pulse" />
            GOLD CHIPS
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-vibrant-dark font-display">{stats.chips}</span>
            <span className="text-xs text-slate-500 font-bold">chips</span>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div 
          className="bg-vibrant-red/15 border-2 border-vibrant-red rounded-2xl p-4 flex flex-col justify-between"
          whileHover={{ translateY: -3 }}
        >
          <span className="text-[10px] text-vibrant-dark font-display tracking-widest flex items-center gap-1.5 font-extrabold uppercase">
            <Flame className="w-4 h-4 text-vibrant-red animate-bounce" />
            STREAK
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-vibrant-dark font-display">{stats.currentStreak}</span>
            <span className="text-xs text-slate-500 font-bold">max {stats.maxStreak}</span>
          </div>
        </motion.div>
      </div>

      {/* Mini Stats List */}
      <div className="grid grid-cols-3 gap-2 bg-[#F1F2F6] p-4 rounded-2xl border-2 border-[#D1D8E0] text-center">
        <div>
          <div className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider">SOLVED</div>
          <div className="text-lg font-black text-vibrant-dark font-display mt-0.5">{stats.gamesWon}</div>
        </div>
        <div className="border-x-2 border-[#D1D8E0]">
          <div className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider">BINGOS</div>
          <div className="text-lg font-black text-vibrant-ochre font-display mt-0.5">{stats.bingosAchieved}</div>
        </div>
        <div>
          <div className="text-[10px] font-black text-vibrant-dark uppercase tracking-wider">BOARDS</div>
          <div className="text-lg font-black text-vibrant-teal font-display mt-0.5">{stats.boardsCleared}</div>
        </div>
      </div>

      {/* Power-Ups Shop / Inventory */}
      <div>
        <h3 className="text-xs font-black tracking-widest text-vibrant-dark uppercase mb-3 flex items-center gap-1.5 font-display">
          <span>⚡</span> BINGO POWER-UPS SHOP
        </h3>
        
        <div className="flex flex-col gap-3" id="powerups-list">
          {powerUps.map((pu) => {
            const canAfford = stats.chips >= pu.cost;
            const hasInventory = pu.count > 0;
            const isActive = isPowerUpActive(pu.id);

            return (
              <div 
                key={pu.id} 
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 ${
                  isActive 
                    ? 'bg-vibrant-teal/5 border-vibrant-teal shadow-md' 
                    : 'bg-white border-vibrant-gray-light hover:border-vibrant-border'
                }`}
                id={`powerup-item-${pu.id}`}
              >
                {/* Info Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold text-vibrant-dark font-display">{pu.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-vibrant-gray-light text-vibrant-dark rounded-full font-sans font-bold">
                        x{pu.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-normal font-sans font-medium">{pu.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-vibrant-dark font-display font-extrabold flex items-center gap-0.5 justify-end px-2 py-1 bg-vibrant-yellow rounded-xl shadow-sm border-b-2 border-black/10">
                      <Coins className="w-3.5 h-3.5 text-vibrant-dark" />
                      {pu.cost}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex gap-2.5 mt-1">
                  {/* Buy Button */}
                  <button
                    onClick={() => onBuyPowerUp(pu.id)}
                    disabled={!canAfford}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold font-display transition-all cursor-pointer ${
                      canAfford 
                        ? 'bg-[#FFE66D] hover:bg-[#FFE66D]/85 text-[#2D3436] border-b-4 border-black/15 shadow-sm' 
                        : 'bg-vibrant-gray-light text-slate-400 border-b-4 border-black/5 cursor-not-allowed'
                    }`}
                    id={`buy-powerup-${pu.id}`}
                  >
                    Buy (+1)
                  </button>

                  {/* Use Button */}
                  <button
                    onClick={() => onUsePowerUp(pu.id)}
                    disabled={!hasInventory || isActive}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold font-display transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-vibrant-teal text-white border-b-4 border-black/15 shadow-sm animate-pulse cursor-default'
                        : hasInventory
                        ? 'bg-white text-vibrant-teal border-2 border-vibrant-teal shadow-sm hover:bg-vibrant-teal/5'
                        : 'bg-vibrant-gray-light text-slate-400 border-b-4 border-black/5 cursor-not-allowed'
                    }`}
                    id={`use-powerup-${pu.id}`}
                  >
                    {isActive ? (
                      'ACTIVE'
                    ) : (
                      'USE POWER'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reroll/Fresh Board Action */}
      <div className="mt-auto border-t border-vibrant-gray-light pt-5" id="stats-footer">
        <button
          onClick={onRerollBingoCard}
          disabled={!canReroll}
          className={`w-full py-3 rounded-2xl text-xs font-extrabold font-display uppercase tracking-wider border-b-4 flex items-center justify-center gap-2 transition-all cursor-pointer ${
            canReroll
              ? 'bg-vibrant-dark hover:bg-vibrant-dark/95 text-white border-black/30'
              : 'bg-vibrant-gray-light text-slate-400 border-black/5 cursor-not-allowed'
          }`}
          id="reroll-board-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REROLL BINGO GRID
        </button>
        <p className="text-[10px] text-slate-500 mt-2 text-center leading-normal font-sans font-medium">
          Rerolling keeps your career stats but shuffles the 5x5 board. Allowed when grid is cleared, when you score a Bingo, or freely once per round!
        </p>
      </div>
    </div>
  );
}
