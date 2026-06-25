import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Sparkles, HelpCircle, Flame, ArrowRight, Check } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-[#FFF9F2] border-4 border-vibrant-dark text-vibrant-dark rounded-3xl shadow-2xl p-6"
            id="instructions-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-vibrant-dark hover:bg-vibrant-gray-light rounded-full transition-colors border-2 border-vibrant-dark cursor-pointer"
              aria-label="Close instructions"
              id="close-instructions-btn"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6" id="instructions-header">
              <div className="p-3 bg-[#FFE66D] text-vibrant-dark rounded-2xl border-2 border-vibrant-dark shadow-sm">
                <Trophy className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-2xl font-black font-display tracking-tight text-vibrant-dark">
                  WORDLE BINGO RULES
                </h2>
                <p className="text-[10px] text-vibrant-red font-bold font-display uppercase tracking-widest">A STRIKING WORDPLAY CHALLENGE</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 text-sm leading-relaxed text-slate-800" id="instructions-content">
              {/* Introduction */}
              <p className="font-medium font-sans">
                Welcome to <strong className="text-vibrant-red font-bold">Wordle Bingo</strong>, the ultimate fusion of word puzzle solving and classic grid alignment! Your goal is to solve Wordle rounds and use your achievements to stamp a 5x5 Bingo board.
              </p>

              {/* Step 1 */}
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl border-2 border-vibrant-gray-light shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-black font-display text-sm bg-[#FF6B6B] text-white border-2 border-vibrant-dark rounded-xl shadow-sm">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-vibrant-dark mb-1">Play Standard Wordle</h3>
                  <p className="text-slate-600 text-xs font-sans leading-normal font-medium">
                    Guess the hidden 5-letter word in 6 tries. Letters flip to show color codes:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 font-display text-[10px] font-bold">
                    <span className="px-2 py-1 bg-vibrant-green text-white rounded-lg">GREEN: Correct spot</span>
                    <span className="px-2 py-1 bg-vibrant-ochre text-white rounded-lg">YELLOW: Present elsewhere</span>
                    <span className="px-2 py-1 bg-vibrant-gray-dark text-white rounded-lg">GRAY: Not in word</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl border-2 border-vibrant-gray-light shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-black font-display text-sm bg-[#FFE66D] text-vibrant-dark border-2 border-vibrant-dark rounded-xl shadow-sm">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-vibrant-dark mb-1">Qualify Bingo Cells</h3>
                  <p className="text-slate-600 text-xs font-sans leading-normal font-medium">
                    Each cell in your 5x5 Bingo grid has a unique condition (e.g. <em>"Contains A"</em>, <em>"Ends in Y"</em>, or <em>"Solve in &lt;= 3 Tries"</em>). When you successfully solve a Wordle, your word and game results will automatically stamp any matching conditions!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl border-2 border-vibrant-gray-light shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-black font-display text-sm bg-vibrant-teal text-white border-2 border-vibrant-dark rounded-xl shadow-sm">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-vibrant-dark mb-1">Get BINGOs & Spend Chips</h3>
                  <p className="text-slate-600 text-xs font-sans leading-normal font-medium">
                    Align 5 stamped cells horizontally, vertically, or diagonally to trigger a <strong className="text-vibrant-ochre font-extrabold">BINGO!</strong> Each Bingo awards you <strong className="text-vibrant-ochre font-extrabold">Gold Chips</strong> that can be spent on powerful aids:
                  </p>
                  <ul className="mt-2.5 space-y-2 text-xs text-slate-600 list-none font-sans font-medium">
                    <li className="flex items-center gap-1.5"><span className="text-vibrant-teal font-black">★</span> <strong className="text-vibrant-dark">Letter Blast (2 Chips)</strong> - Knocks out 3 incorrect keyboard letters.</li>
                    <li className="flex items-center gap-1.5"><span className="text-vibrant-teal font-black">★</span> <strong className="text-vibrant-dark">Reveal Letter Clue (4 Chips)</strong> - Places a correct letter in the Wordle grid.</li>
                    <li className="flex items-center gap-1.5"><span className="text-vibrant-teal font-black">★</span> <strong className="text-vibrant-dark">Wildcard Stamp (6 Chips)</strong> - Instantly stamps any cell of your choice on the Bingo card!</li>
                  </ul>
                </div>
              </div>

              {/* Victory Conditions */}
              <div className="p-4 bg-vibrant-yellow/15 text-vibrant-dark rounded-2xl border-2 border-[#FFE66D]/60 flex items-start gap-3 shadow-sm">
                <Sparkles className="w-5 h-5 flex-shrink-0 text-[#C9B458] mt-0.5" />
                <div>
                  <h4 className="font-extrabold font-display text-sm text-vibrant-dark mb-1">Aim for a Full House!</h4>
                  <p className="text-xs leading-normal font-sans font-medium text-slate-700">
                    Get as many lines as possible, or complete the entire board (Full House) to earn massive prestige, bonus coins, and level up your status. Happy puzzling!
                  </p>
                </div>
              </div>
            </div>

            {/* Let's Go Button */}
            <div className="mt-6 flex justify-end" id="instructions-footer">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-vibrant-teal hover:opacity-95 text-white font-black font-display rounded-2xl flex items-center gap-2 border-b-4 border-black/15 shadow-sm transition-all cursor-pointer"
                id="start-playing-btn"
              >
                Let's Play!
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
