import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Sparkles, HelpCircle, RefreshCw, Zap, Flame, 
  Coins, Info, ArrowRight, AlertTriangle, AlertCircle, X, CheckSquare
} from 'lucide-react';

import { BingoCell, GameStats, PowerUp } from './types';
import { WORDS, generateBingoBoard, evaluateCondition } from './data/words';

import BingoBoard from './components/BingoBoard';
import WordleGame from './components/WordleGame';
import StatsPanel from './components/StatsPanel';
import InstructionsModal from './components/InstructionsModal';

// List of winning combinations for the 5x5 Bingo board
const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

// Helper to select a random word from dictionary
const getRandomWord = (): string => {
  const index = Math.floor(Math.random() * WORDS.length);
  return WORDS[index].toUpperCase();
};

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalGuesses: 0,
  bingosAchieved: 0,
  boardsCleared: 0,
  currentStreak: 0,
  maxStreak: 0,
  chips: 6 // start with 6 free gold chips to try out powerups!
};

const INITIAL_POWERUPS: PowerUp[] = [
  {
    id: 'blast',
    name: 'Letter Blast',
    description: 'Eliminates 3 incorrect keyboard letters.',
    cost: 2,
    icon: 'Zap',
    count: 2 // Start with some free powerups!
  },
  {
    id: 'clue',
    name: 'Reveal Clue',
    description: 'Places a correct letter hint in the grid.',
    cost: 4,
    icon: 'Eye',
    count: 1
  },
  {
    id: 'wildcard',
    name: 'Wildcard Stamp',
    description: 'Instantly stamp ANY cell on the board.',
    cost: 6,
    icon: 'Sparkles',
    count: 0
  }
];

export default function App() {
  // Game States
  const [secretWord, setSecretWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  
  // Bingo States
  const [bingoBoard, setBingoBoard] = useState<BingoCell[]>([]);
  const [completedLines, setCompletedLines] = useState<number[][]>([]);
  
  // Powerup & Clue States
  const [blastedLetters, setBlastedLetters] = useState<Set<string>>(new Set());
  const [revealedLetters, setRevealedLetters] = useState<{ [index: number]: string }>({});
  const [activePowerUp, setActivePowerUp] = useState<'wildcard' | null>(null);

  // Stats & Inventory
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(INITIAL_POWERUPS);

  // UI States
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [invalidWordShake, setInvalidWordShake] = useState<boolean>(false);
  const [roundEarnedStamps, setRoundEarnedStamps] = useState<string[]>([]);
  const [showEarnedStampsModal, setShowEarnedStampsModal] = useState<boolean>(false);

  // Load Initial Game State
  useEffect(() => {
    // 1. Visit Check for instructions
    const visited = localStorage.getItem('wordle_bingo_visited');
    if (!visited) {
      setIsInstructionsOpen(true);
      localStorage.setItem('wordle_bingo_visited', 'true');
    }

    // 2. Load Stats
    const savedStats = localStorage.getItem('wordle_bingo_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        setStats(INITIAL_STATS);
      }
    }

    // 3. Load Powerups Inventory
    const savedPowerups = localStorage.getItem('wordle_bingo_powerups');
    if (savedPowerups) {
      try {
        setPowerUps(JSON.parse(savedPowerups));
      } catch (e) {
        setPowerUps(INITIAL_POWERUPS);
      }
    }

    // 4. Load Bingo Board
    const savedBoard = localStorage.getItem('wordle_bingo_board');
    if (savedBoard) {
      try {
        const parsedBoard = JSON.parse(savedBoard);
        setBingoBoard(parsedBoard);
        recalculateCompletedLines(parsedBoard, false); // check existing completed lines without triggering bonuses
      } catch (e) {
        const newBoard = generateBingoBoard();
        setBingoBoard(newBoard);
        localStorage.setItem('wordle_bingo_board', JSON.stringify(newBoard));
      }
    } else {
      const newBoard = generateBingoBoard();
      setBingoBoard(newBoard);
      localStorage.setItem('wordle_bingo_board', JSON.stringify(newBoard));
    }

    // 5. Load or Start Round
    const savedSecret = localStorage.getItem('wordle_bingo_secret_word');
    const savedGuesses = localStorage.getItem('wordle_bingo_guesses');
    const savedStatus = localStorage.getItem('wordle_bingo_game_status');
    const savedRevealed = localStorage.getItem('wordle_bingo_revealed');
    const savedBlasted = localStorage.getItem('wordle_bingo_blasted');

    if (savedSecret && savedGuesses && savedStatus) {
      try {
        setSecretWord(savedSecret);
        setGuesses(JSON.parse(savedGuesses));
        setGameStatus(savedStatus as any);
        if (savedRevealed) setRevealedLetters(JSON.parse(savedRevealed));
        if (savedBlasted) setBlastedLetters(new Set(JSON.parse(savedBlasted)));
      } catch (e) {
        startFreshRound();
      }
    } else {
      startFreshRound();
    }
  }, []);

  // Helper to trigger toast notifications
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    // Auto clear after 4 seconds
    const timer = setTimeout(() => {
      setToastMessage(current => current?.text === text ? null : current);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Helper to start a fresh Wordle round
  const startFreshRound = () => {
    const newWord = getRandomWord();
    setSecretWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setBlastedLetters(new Set());
    setRevealedLetters({});
    setActivePowerUp(null);
    setRoundEarnedStamps([]);

    // Save states
    localStorage.setItem('wordle_bingo_secret_word', newWord);
    localStorage.setItem('wordle_bingo_guesses', JSON.stringify([]));
    localStorage.setItem('wordle_bingo_game_status', 'playing');
    localStorage.setItem('wordle_bingo_revealed', JSON.stringify({}));
    localStorage.setItem('wordle_bingo_blasted', JSON.stringify([]));
  };

  // Check if a line is complete on the board, update state and trigger rewards
  const recalculateCompletedLines = (board: BingoCell[], awardBonuses: boolean = true) => {
    const currentCompleted: number[][] = [];

    WINNING_LINES.forEach(line => {
      const isComplete = line.every(idx => board[idx].stamped);
      if (isComplete) {
        currentCompleted.push(line);
      }
    });

    setCompletedLines(currentCompleted);

    // If award bonuses is true, compare to find NEW lines completed
    if (awardBonuses) {
      const previouslyCompletedCount = completedLines.length;
      const newlyCompletedLinesCount = currentCompleted.length - previouslyCompletedCount;

      if (newlyCompletedLinesCount > 0) {
        // Trigger celebration confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Award +5 Gold Chips per new line!
        const chipPayout = newlyCompletedLinesCount * 5;
        showToast(`🎉 BINGO! Completed ${newlyCompletedLinesCount} new line(s)! Earned +${chipPayout} Gold Chips!`, 'success');

        // Check for full house (Full board clear)
        const isFullHouse = board.every(cell => cell.stamped);
        let fullHousePayout = 0;
        let finalStats = { ...stats };

        if (isFullHouse) {
          fullHousePayout = 20; // Massive full house bonus
          showToast(`🏆 FULL HOUSE ACHIEVED! Stamped the entire card! Bonus +${fullHousePayout} Gold Chips!`, 'success');
          
          finalStats.boardsCleared += 1;
        }

        const updatedStats: GameStats = {
          ...finalStats,
          bingosAchieved: finalStats.bingosAchieved + newlyCompletedLinesCount,
          chips: finalStats.chips + chipPayout + fullHousePayout
        };

        setStats(updatedStats);
        localStorage.setItem('wordle_bingo_stats', JSON.stringify(updatedStats));
      }
    }
  };

  // Handle cell click (only works during active Wildcard Power-Up mode!)
  const handleBingoCellClick = (cellId: string) => {
    if (activePowerUp !== 'wildcard') return;

    const cellIdx = bingoBoard.findIndex(c => c.id === cellId);
    if (cellIdx === -1 || bingoBoard[cellIdx].stamped) {
      showToast('Select an unstamped cell!', 'error');
      return;
    }

    // Stamp the cell
    const updatedBoard = [...bingoBoard];
    updatedBoard[cellIdx].stamped = true;
    setBingoBoard(updatedBoard);
    localStorage.setItem('wordle_bingo_board', JSON.stringify(updatedBoard));

    // Deduct wildcard inventory & reset powerup mode
    const updatedPowerups = powerUps.map(pu => {
      if (pu.id === 'wildcard') {
        return { ...pu, count: Math.max(0, pu.count - 1) };
      }
      return pu;
    });
    setPowerUps(updatedPowerups);
    localStorage.setItem('wordle_bingo_powerups', JSON.stringify(updatedPowerups));

    setActivePowerUp(null);
    showToast(`🎯 Wildcard stamp applied to "${bingoBoard[cellIdx].label}"!`, 'success');

    // Recheck lines
    recalculateCompletedLines(updatedBoard, true);
  };

  // Evaluate Bingo stamps when the user wins a Wordle round
  const processBingoStampsOnWin = (solvedGuesses: string[]) => {
    const updatedBoard = [...bingoBoard];
    const earnedLabels: string[] = [];

    // Calculate guess color states to pass down
    const guessColorsHistory = solvedGuesses.map(g => {
      const secretLetters = secretWord.toUpperCase().split('');
      const guessLetters = g.toUpperCase().split('');
      const grades: ('correct' | 'present' | 'absent')[] = Array(5).fill('absent');
      const secretCounts: { [key: string]: number } = {};
      
      secretLetters.forEach(char => {
        secretCounts[char] = (secretCounts[char] || 0) + 1;
      });

      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === secretLetters[i]) {
          grades[i] = 'correct';
          secretCounts[guessLetters[i]]--;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (grades[i] !== 'correct') {
          const char = guessLetters[i];
          if (secretCounts[char] && secretCounts[char] > 0) {
            grades[i] = 'present';
            secretCounts[char]--;
          }
        }
      }
      return grades;
    });

    updatedBoard.forEach(cell => {
      if (!cell.stamped) {
        const matches = evaluateCondition(
          cell, 
          secretWord, 
          solvedGuesses, 
          solvedGuesses.length, 
          guessColorsHistory
        );

        if (matches) {
          cell.stamped = true;
          earnedLabels.push(cell.label);
        }
      }
    });

    if (earnedLabels.length > 0) {
      setRoundEarnedStamps(earnedLabels);
      setShowEarnedStampsModal(true);
      setBingoBoard(updatedBoard);
      localStorage.setItem('wordle_bingo_board', JSON.stringify(updatedBoard));
      
      // Trigger a light spray of confetti
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });

      recalculateCompletedLines(updatedBoard, true);
    } else {
      showToast('Solved the Wordle, but no new Bingo cells qualified this round.', 'info');
    }
  };

  // Wordle Keypress handlers
  const handleTypeChar = (char: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + char.toUpperCase());
    }
  };

  const handleDeleteChar = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleWordSubmit = () => {
    if (currentGuess.length !== 5) {
      showToast('Word must be exactly 5 letters!', 'error');
      setInvalidWordShake(true);
      setTimeout(() => setInvalidWordShake(false), 500);
      return;
    }

    const formattedGuess = currentGuess.toUpperCase();

    // Verify word exists in our standard list
    if (!WORDS.includes(formattedGuess)) {
      showToast('Not in word list!', 'error');
      setInvalidWordShake(true);
      setTimeout(() => setInvalidWordShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, formattedGuess];
    setGuesses(newGuesses);
    localStorage.setItem('wordle_bingo_guesses', JSON.stringify(newGuesses));
    setCurrentGuess('');

    // Check Win/Loss Status
    if (formattedGuess === secretWord.toUpperCase()) {
      // Won!
      setGameStatus('won');
      localStorage.setItem('wordle_bingo_game_status', 'won');

      // Update career stats
      const nextStreak = stats.currentStreak + 1;
      const maxStreak = Math.max(stats.maxStreak, nextStreak);
      const totalGuessesCount = stats.totalGuesses + newGuesses.length;

      // Award 1 Gold Chip for winning
      const updatedStats: GameStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        currentStreak: nextStreak,
        maxStreak: maxStreak,
        totalGuesses: totalGuessesCount,
        chips: stats.chips + 1
      };
      setStats(updatedStats);
      localStorage.setItem('wordle_bingo_stats', JSON.stringify(updatedStats));

      showToast('🎉 Brilliant! Word solved! +1 Gold Chip!', 'success');

      // Evaluate Bingo conditions!
      processBingoStampsOnWin(newGuesses);

    } else if (newGuesses.length >= 6) {
      // Lost!
      setGameStatus('lost');
      localStorage.setItem('wordle_bingo_game_status', 'lost');

      const updatedStats: GameStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        currentStreak: 0,
        totalGuesses: stats.totalGuesses + 6
      };
      setStats(updatedStats);
      localStorage.setItem('wordle_bingo_stats', JSON.stringify(updatedStats));

      showToast(`💀 Out of guesses! Word was ${secretWord}. Reset streak!`, 'error');
    }
  };

  // Powerups Actions
  const handleBuyPowerUp = (id: string) => {
    const pu = powerUps.find(p => p.id === id);
    if (!pu || stats.chips < pu.cost) return;

    const updatedStats: GameStats = {
      ...stats,
      chips: stats.chips - pu.cost
    };
    setStats(updatedStats);
    localStorage.setItem('wordle_bingo_stats', JSON.stringify(updatedStats));

    const updatedPowerups = powerUps.map(p => {
      if (p.id === id) {
        return { ...p, count: p.count + 1 };
      }
      return p;
    });
    setPowerUps(updatedPowerups);
    localStorage.setItem('wordle_bingo_powerups', JSON.stringify(updatedPowerups));

    showToast(`🛒 Purchased: ${pu.name}! Spent ${pu.cost} Gold Chips.`, 'success');
  };

  const handleUsePowerUp = (id: string) => {
    const pu = powerUps.find(p => p.id === id);
    if (!pu || pu.count <= 0) return;

    if (id === 'blast') {
      // Letter Blast: eliminate 3 incorrect letters
      if (gameStatus !== 'playing') {
        showToast('Can only blast letters during active gameplay!', 'error');
        return;
      }

      const unusedIncorrectLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => {
        const isSecret = secretWord.toUpperCase().includes(letter);
        const isBlasted = blastedLetters.has(letter);
        const isGuessed = guesses.some(g => g.toUpperCase().includes(letter));
        return !isSecret && !isBlasted && !isGuessed;
      });

      if (unusedIncorrectLetters.length === 0) {
        showToast('No more letters can be blasted!', 'error');
        return;
      }

      // Select up to 3 random letters
      const selectedBlasts: string[] = [];
      const tempLetters = [...unusedIncorrectLetters];
      for (let i = 0; i < Math.min(3, tempLetters.length); i++) {
        const randIdx = Math.floor(Math.random() * tempLetters.length);
        selectedBlasts.push(tempLetters[randIdx]);
        tempLetters.splice(randIdx, 1);
      }

      const newBlasted = new Set(blastedLetters);
      selectedBlasts.forEach(l => newBlasted.add(l));
      setBlastedLetters(newBlasted);
      localStorage.setItem('wordle_bingo_blasted', JSON.stringify(Array.from(newBlasted)));

      // Deduct inventory
      const updatedPowerups = powerUps.map(p => {
        if (p.id === 'blast') return { ...p, count: p.count - 1 };
        return p;
      });
      setPowerUps(updatedPowerups);
      localStorage.setItem('wordle_bingo_powerups', JSON.stringify(updatedPowerups));

      showToast(`💥 Letter Blast! Blasted: ${selectedBlasts.join(', ')} from keyboard!`, 'success');

    } else if (id === 'clue') {
      // Reveal Clue: place a letter hint in the grid
      if (gameStatus !== 'playing') {
        showToast('Can only reveal clues during active gameplay!', 'error');
        return;
      }

      // Find indices 0..4 that are not already revealed
      const unrevealedIndices: number[] = [];
      for (let i = 0; i < 5; i++) {
        if (!revealedLetters[i]) {
          unrevealedIndices.push(i);
        }
      }

      if (unrevealedIndices.length === 0) {
        showToast('All letters are already revealed!', 'error');
        return;
      }

      const randIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      const targetLetter = secretWord[randIndex].toUpperCase();

      const newRevealed = { ...revealedLetters, [randIndex]: targetLetter };
      setRevealedLetters(newRevealed);
      localStorage.setItem('wordle_bingo_revealed', JSON.stringify(newRevealed));

      // Deduct inventory
      const updatedPowerups = powerUps.map(p => {
        if (p.id === 'clue') return { ...p, count: p.count - 1 };
        return p;
      });
      setPowerUps(updatedPowerups);
      localStorage.setItem('wordle_bingo_powerups', JSON.stringify(updatedPowerups));

      showToast(`👁️ Revealed Clue! Position ${randIndex + 1} contains letter: ${targetLetter}`, 'success');

    } else if (id === 'wildcard') {
      // Wildcard Stamp: enters wildcard mode
      setActivePowerUp('wildcard');
      showToast('🎯 Wildcard Mode! Tap any unstamped Bingo cell to check it off!', 'info');
    }
  };

  // Check if a powerup is currently active
  const isPowerUpActive = (id: string): boolean => {
    return id === 'wildcard' && activePowerUp === 'wildcard';
  };

  // Reroll Bingo Card Action
  const handleRerollBingoCard = () => {
    const confirmReroll = window.confirm(
      'Are you sure you want to reroll? This shuffles the 5x5 Bingo conditions into a completely new configuration. Your stamped cells will be reset, but you retain your chips and career stats.'
    );
    if (!confirmReroll) return;

    const newBoard = generateBingoBoard();
    setBingoBoard(newBoard);
    localStorage.setItem('wordle_bingo_board', JSON.stringify(newBoard));
    
    // Clear completed lines for the fresh board
    setCompletedLines([]);
    
    showToast('🎲 Bingo grid successfully rerolled!', 'success');
  };

  return (
    <div className="min-h-screen bg-vibrant-bg text-vibrant-dark flex flex-col antialiased" id="vibrant-root">
      
      {/* Header */}
      <header className="border-b-4 border-vibrant-dark bg-white sticky top-0 z-40 px-4 py-4 shadow-md" id="main-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-vibrant-red rounded-xl border-2 border-vibrant-dark shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-display tracking-tight text-vibrant-dark flex items-center gap-2">
                WORDLE BINGO
              </h1>
              <p className="text-[10px] text-vibrant-red font-bold font-display uppercase tracking-widest">PUZZLE SOLVING FUSED WITH BINGO PATHS</p>
            </div>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-3 font-display">
            {/* Coins */}
            <div className="flex items-center gap-2 bg-[#FFE66D] border-2 border-vibrant-dark px-4 py-2 rounded-2xl text-vibrant-dark text-sm font-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <Coins className="w-4 h-4 text-vibrant-dark animate-pulse" />
              <span>{stats.chips} CHIPS</span>
            </div>

            {/* Help Icon */}
            <button
              onClick={() => setIsInstructionsOpen(true)}
              className="p-2.5 border-2 border-vibrant-dark bg-white rounded-2xl text-vibrant-dark hover:bg-vibrant-gray-light shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              title="How to Play"
              id="header-help-btn"
            >
              <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Side: Current Wordle Game (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <WordleGame
            secretWord={secretWord}
            guesses={guesses}
            currentGuess={currentGuess}
            gameStatus={gameStatus}
            onTypeChar={handleTypeChar}
            onDeleteChar={handleDeleteChar}
            onWordSubmit={handleWordSubmit}
            blastedLetters={blastedLetters}
            revealedLetters={revealedLetters}
            invalidWordShake={invalidWordShake}
          />

          {/* Play Controls Panel */}
          {gameStatus !== 'playing' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-white border-4 border-vibrant-dark rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-base font-extrabold text-vibrant-dark font-display uppercase tracking-tight">
                  {gameStatus === 'won' ? '🎉 Challenge Completed!' : '💀 Round Ended!'}
                </h4>
                <p className="text-xs text-slate-500 font-sans font-medium mt-1">
                  Solve another Wordle puzzle to qualify more cells!
                </p>
              </div>
              <button
                onClick={startFreshRound}
                className="px-6 py-3 bg-vibrant-teal hover:opacity-95 text-white font-black font-display rounded-2xl border-b-4 border-black/15 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                id="next-round-btn"
              >
                NEXT ROUND
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Middle Side: Bingo Board Grid (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BingoBoard
            board={bingoBoard}
            onCellClick={handleBingoCellClick}
            wildcardActive={activePowerUp === 'wildcard'}
            completedLines={completedLines}
          />
        </div>

        {/* Right Side: Stats Panel & shop (3 Columns) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <StatsPanel
            stats={stats}
            powerUps={powerUps}
            onBuyPowerUp={handleBuyPowerUp}
            onUsePowerUp={handleUsePowerUp}
            isPowerUpActive={isPowerUpActive}
            onRerollBingoCard={handleRerollBingoCard}
            canReroll={true}
          />
        </div>

      </main>

      {/* Instructions Modal Overlay */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl shadow-xl border-4 flex items-center gap-3 font-sans text-sm max-w-md w-[90vw]"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: toastMessage.type === 'success' ? '#6AAA64' : toastMessage.type === 'error' ? '#FF6B6B' : '#4ECDC4',
              color: '#2D3436'
            }}
            id="toast-message"
          >
            {toastMessage.type === 'success' ? (
              <CheckSquare className="w-5 h-5 flex-shrink-0 text-vibrant-green" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-vibrant-red" />
            ) : (
              <Info className="w-5 h-5 flex-shrink-0 text-vibrant-teal" />
            )}
            <span className="font-extrabold font-display uppercase tracking-tight leading-normal">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto p-1 hover:bg-vibrant-gray-light rounded-lg text-slate-400 hover:text-vibrant-dark cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bingo Stamps Congratulations Modal on Round Win */}
      <AnimatePresence>
        {showEarnedStampsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#FFF9F2] border-4 border-vibrant-dark text-vibrant-dark rounded-3xl shadow-2xl p-6 relative"
              id="stamps-bonus-modal"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-[#FFE66D] text-vibrant-dark rounded-2xl border-2 border-vibrant-dark flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="w-7 h-7 animate-spin stroke-[2.5]" style={{ animationDuration: '6s' }} />
                </div>
                
                <h3 className="text-xl font-black font-display text-vibrant-dark mb-1 uppercase tracking-tight">Bingo Stamps Earned!</h3>
                <p className="text-[10px] text-vibrant-red font-bold font-display uppercase mb-4 tracking-widest">MATCHED CONDITIONS FOR WORD "{secretWord}"</p>

                <div className="w-full space-y-2 mb-6" id="earned-stamps-list">
                  {roundEarnedStamps.map((label, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 bg-white border-2 border-vibrant-gray-light text-vibrant-green rounded-xl text-xs font-black flex items-center justify-between font-display shadow-sm"
                    >
                      <span className="text-vibrant-dark">{label}</span>
                      <span className="text-[9px] bg-vibrant-green text-white px-2 py-0.5 rounded-full uppercase font-sans font-bold">STAMPED</span>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => setShowEarnedStampsModal(false)}
                  className="w-full py-3 bg-vibrant-teal text-white font-black font-display rounded-2xl border-b-4 border-black/15 shadow-sm cursor-pointer hover:opacity-95"
                >
                  FABULOUS!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t-4 border-vibrant-dark bg-white py-5 px-4 text-center text-xs text-slate-500 font-sans font-bold" id="main-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Wordle Bingo. All rights reserved.</span>
          <span className="text-vibrant-red uppercase tracking-wider text-[10px]">Pure Client-Side Simulation &bull; Zero Delay Puzzles</span>
        </div>
      </footer>
    </div>
  );
}
