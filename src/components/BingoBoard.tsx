import { BingoCell } from '../types';
import { motion } from 'motion/react';
import { Check, Info, Sparkles, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface BingoBoardProps {
  board: BingoCell[];
  onCellClick: (cellId: string) => void;
  wildcardActive: boolean;
  completedLines: number[][]; // indexes of cells in completed lines
}

export default function BingoBoard({
  board,
  onCellClick,
  wildcardActive,
  completedLines
}: BingoBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Flatten completed lines into a single set of cell indices for quick lookup
  const completedCellIndices = new Set<number>();
  completedLines.forEach(line => {
    line.forEach(idx => completedCellIndices.add(idx));
  });

  return (
    <div className="bg-white border-4 border-vibrant-gray-light rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-4 h-full" id="bingo-board-container">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-vibrant-gray-light pb-4" id="bingo-header">
        <div>
          <h2 className="text-xl font-extrabold font-display text-vibrant-dark flex items-center gap-2">
            <span>🎯</span> BINGO BOARD
            {completedLines.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 bg-vibrant-red text-white rounded-full animate-bounce">
                {completedLines.length} BINGO{completedLines.length > 1 ? 'S' : ''}!
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
            {wildcardActive 
              ? '🎯 WILDCARD ACTIVE! Tap any unstamped cell!' 
              : 'Solve Wordle challenges to stamp board conditions'}
          </p>
        </div>

        {/* B I N G O Badges */}
        <div className="flex gap-1" id="bingo-letter-badges">
          <span className="w-7 h-7 rounded-lg bg-vibrant-green flex items-center justify-center text-white font-black text-xs shadow-sm">B</span>
          <span className="w-7 h-7 rounded-lg bg-vibrant-ochre flex items-center justify-center text-white font-black text-xs shadow-sm">I</span>
          <span className="w-7 h-7 rounded-lg bg-vibrant-gray-dark flex items-center justify-center text-white font-black text-xs shadow-sm">N</span>
          <span className="w-7 h-7 rounded-lg bg-vibrant-teal flex items-center justify-center text-white font-black text-xs shadow-sm">G</span>
          <span className="w-7 h-7 rounded-lg bg-vibrant-red flex items-center justify-center text-white font-black text-xs shadow-sm">O</span>
        </div>
      </div>

      {/* Bingo Grid */}
      <div 
        className={`grid grid-cols-5 gap-2.5 p-1 rounded-2xl ${
          wildcardActive ? 'ring-4 ring-vibrant-red/50 animate-pulse bg-vibrant-bg' : ''
        }`}
        id="bingo-grid"
      >
        {board.map((cell, idx) => {
          const isStamped = cell.stamped;
          const isFree = cell.isFree;
          const isPartOfBingo = completedCellIndices.has(idx);
          const isHovered = hoveredCell === cell.id;

          // Colors based on "Vibrant Palette" theme:
          let btnClass = '';
          if (isFree) {
            btnClass = 'bg-vibrant-teal text-white font-black border-b-4 border-black/10';
          } else if (isStamped) {
            if (isPartOfBingo) {
              btnClass = 'bg-vibrant-yellow text-vibrant-dark font-extrabold border-b-4 border-black/10 ring-4 ring-vibrant-red';
            } else {
              btnClass = 'bg-vibrant-green text-white font-bold border-b-4 border-black/10';
            }
          } else if (wildcardActive) {
            btnClass = 'bg-vibrant-yellow/20 hover:bg-vibrant-yellow/40 border-2 border-dashed border-vibrant-red text-vibrant-dark';
          } else {
            btnClass = 'bg-vibrant-gray-light text-vibrant-dark border-b-4 border-black/5 hover:bg-slate-200';
          }

          return (
            <div
              key={cell.id}
              className="relative aspect-square"
              onMouseEnter={() => setHoveredCell(cell.id)}
              onMouseLeave={() => setHoveredCell(null)}
              id={`bingo-cell-wrapper-${idx}`}
            >
              <motion.button
                onClick={() => {
                  if (wildcardActive || !isStamped) {
                    onCellClick(cell.id);
                  }
                }}
                disabled={isStamped && !wildcardActive}
                whileHover={{ scale: (isStamped && !wildcardActive) ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-full flex flex-col justify-between p-1.5 md:p-2.5 rounded-xl text-left transition-all relative overflow-hidden select-none cursor-pointer ${btnClass}`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: '500',
                  lineHeight: '1.2'
                }}
                id={`bingo-cell-${idx}`}
              >
                {/* Stamp Checkmark Indicator */}
                <div className="flex justify-between items-start w-full pointer-events-none">
                  {isFree ? (
                    <span className="text-[8px] uppercase tracking-wider text-teal-100 font-bold font-mono">FREE</span>
                  ) : (
                    <span className={`text-[8px] uppercase tracking-wider font-mono font-bold ${
                      isStamped ? 'text-white/70' : 'text-slate-400'
                    }`}>
                      {(cell.type.startsWith('SOLVE_') || cell.type.startsWith('GAME_')) ? 'GAME' : 'WORD'}
                    </span>
                  )}
                  
                  {isStamped && !isFree && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`rounded-full p-0.5 ${isPartOfBingo ? 'bg-vibrant-dark text-white' : 'bg-white text-vibrant-green'}`}
                    >
                      <Check className="w-2 h-2 stroke-[4]" />
                    </motion.div>
                  )}
                </div>

                {/* Cell Label */}
                <span 
                  className={`block mt-1 font-display text-[9px] md:text-xs leading-tight tracking-tight break-words font-bold ${
                    isFree 
                      ? 'text-white text-center w-full my-auto' 
                      : isPartOfBingo 
                      ? 'text-vibrant-dark font-black' 
                      : isStamped 
                      ? 'text-white' 
                      : 'text-slate-700'
                  }`}
                >
                  {isFree ? 'FREE SPACE' : cell.label}
                </span>

                {/* Free space sparkle */}
                {isFree && (
                  <div className="absolute right-1 bottom-1 text-teal-100 animate-spin" style={{ animationDuration: '8s' }}>
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </motion.button>
              
              {/* Overlay Hover Details Tooltip */}
              {isHovered && !isFree && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-vibrant-dark text-white text-[10px] p-2.5 rounded-xl shadow-2xl border-2 border-white z-30 w-44 pointer-events-none font-sans">
                  <span className="font-bold block mb-1 text-vibrant-yellow">{cell.label}</span>
                  {cell.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bingo Legend / Tip */}
      <div className="flex items-start gap-2 text-xs text-slate-600 bg-vibrant-bg p-3 rounded-2xl border border-[#FFE66D]/40 shadow-sm" id="bingo-legend">
        <Info className="w-4 h-4 text-[#D4AC0D] flex-shrink-0 mt-0.5" />
        <span className="font-sans font-medium text-slate-700 leading-normal">
          Hover grid cells to read special requirements. Line up 5 checked tiles horizontally, vertically, or diagonally to trigger big Gold Chip rewards!
        </span>
      </div>
    </div>
  );
}
