import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, CornerDownLeft, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { GuessLetter, LetterState } from '../types';

interface WordleGameProps {
  secretWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  onTypeChar: (char: string) => void;
  onDeleteChar: () => void;
  onWordSubmit: () => void;
  blastedLetters: Set<string>;
  revealedLetters: { [index: number]: string }; // index -> char (revealed as hints)
  invalidWordShake: boolean; // triggers a shake animation when word is not in dictionary
}

export default function WordleGame({
  secretWord,
  guesses,
  currentGuess,
  gameStatus,
  onTypeChar,
  onDeleteChar,
  onWordSubmit,
  blastedLetters,
  revealedLetters,
  invalidWordShake
}: WordleGameProps) {
  const maxAttempts = 6;
  const wordLength = 5;

  // Track physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        onWordSubmit();
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        onDeleteChar();
      } else if (/^[A-Z]$/.test(key)) {
        onTypeChar(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, onWordSubmit, onDeleteChar, onTypeChar]);

  // Classic Wordle grading algorithm for previous guesses
  const getGuessGrades = (guess: string): LetterState[] => {
    const grades: LetterState[] = Array(wordLength).fill('absent');
    const secretLetters = secretWord.toUpperCase().split('');
    const guessLetters = guess.toUpperCase().split('');

    // Letter count inventory
    const secretCounts: { [key: string]: number } = {};
    secretLetters.forEach(char => {
      secretCounts[char] = (secretCounts[char] || 0) + 1;
    });

    // First pass: Correct (Green)
    for (let i = 0; i < wordLength; i++) {
      if (guessLetters[i] === secretLetters[i]) {
        grades[i] = 'correct';
        secretCounts[guessLetters[i]]--;
      }
    }

    // Second pass: Present (Yellow)
    for (let i = 0; i < wordLength; i++) {
      if (grades[i] !== 'correct') {
        const char = guessLetters[i];
        if (secretCounts[char] && secretCounts[char] > 0) {
          grades[i] = 'present';
          secretCounts[char]--;
        }
      }
    }

    return grades;
  };

  // Build the letter key mapping (which letters are Green, Yellow, Gray, Blasted)
  const getKeyboardLetterStates = (): { [key: string]: LetterState | 'blasted' } => {
    const letterStates: { [key: string]: LetterState | 'blasted' } = {};

    // 1. Mark blasted letters first
    blastedLetters.forEach(letter => {
      letterStates[letter.toUpperCase()] = 'blasted';
    });

    // 2. Aggregate actual guess feedback
    guesses.forEach(guess => {
      const formattedGuess = guess.toUpperCase();
      const grades = getGuessGrades(formattedGuess);

      for (let i = 0; i < wordLength; i++) {
        const char = formattedGuess[i];
        const currentGrade = grades[i];
        const existingGrade = letterStates[char];

        // Preference: correct > present > absent > blasted
        if (existingGrade === 'correct') {
          // Keep it correct
        } else if (currentGrade === 'correct') {
          letterStates[char] = 'correct';
        } else if (existingGrade === 'present') {
          // Keep it present
        } else if (currentGrade === 'present') {
          letterStates[char] = 'present';
        } else if (!existingGrade || existingGrade === 'blasted') {
          letterStates[char] = 'absent';
        }
      }
    });

    return letterStates;
  };

  const keyboardStates = getKeyboardLetterStates();

  // Keyboard Rows
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Render a cell on the Wordle grid
  const renderGridCell = (rowIdx: number, colIdx: number) => {
    // 1. Submitted guess rows
    if (rowIdx < guesses.length) {
      const guess = guesses[rowIdx];
      const char = guess[colIdx].toUpperCase();
      const grades = getGuessGrades(guess);
      const grade = grades[colIdx];

      const bgClass =
        grade === 'correct'
          ? 'bg-vibrant-green text-white border-vibrant-green'
          : grade === 'present'
          ? 'bg-vibrant-ochre text-white border-vibrant-ochre'
          : 'bg-vibrant-gray-dark text-white border-vibrant-gray-dark';

      return (
        <motion.div
          key={`cell-${rowIdx}-${colIdx}`}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 360 }}
          transition={{ duration: 0.5, delay: colIdx * 0.1 }}
          className={`w-full aspect-square flex items-center justify-center font-black text-xl md:text-2xl rounded-xl border shadow-sm font-display ${bgClass}`}
          id={`grid-cell-${rowIdx}-${colIdx}`}
        >
          {char}
        </motion.div>
      );
    }

    // 2. Current active typing row
    if (rowIdx === guesses.length) {
      const char = currentGuess[colIdx]?.toUpperCase() || '';
      const hasChar = char !== '';
      const clueChar = revealedLetters[colIdx]?.toUpperCase() || '';

      const isShaking = invalidWordShake;

      return (
        <motion.div
          key={`cell-${rowIdx}-${colIdx}`}
          animate={
            isShaking
              ? { x: [0, -6, 6, -6, 6, 0] }
              : hasChar
              ? { scale: [1, 1.15, 1] }
              : { scale: 1 }
          }
          transition={{ duration: isShaking ? 0.35 : 0.12 }}
          className={`w-full aspect-square flex items-center justify-center font-black text-xl md:text-2xl rounded-xl border-4 font-display relative ${
            hasChar
              ? 'border-vibrant-dark bg-white text-vibrant-dark shadow-sm'
              : clueChar
              ? 'border-vibrant-green/40 bg-vibrant-green/5 text-vibrant-green'
              : 'border-vibrant-border bg-white text-slate-300'
          }`}
          id={`grid-cell-${rowIdx}-${colIdx}`}
        >
          {hasChar ? (
            char
          ) : clueChar ? (
            <span className="text-vibrant-green flex flex-col items-center select-none font-sans text-[10px] uppercase font-bold">
              <span>{clueChar}</span>
              <span className="text-[7px] text-vibrant-green/60 tracking-tight leading-none mt-0.5">CLUE</span>
            </span>
          ) : (
            ''
          )}
        </motion.div>
      );
    }

    // 3. Future row
    return (
      <div
        key={`cell-${rowIdx}-${colIdx}`}
        className="w-full aspect-square flex items-center justify-center rounded-xl border-2 border-vibrant-gray-light bg-white text-transparent"
        id={`grid-cell-${rowIdx}-${colIdx}`}
      >
        -
      </div>
    );
  };

  return (
    <div className="bg-white border-4 border-vibrant-red/20 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-6" id="wordle-game-container">
      
      {/* Game Header Clues */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-vibrant-gray-light pb-4" id="wordle-header">
        <div>
          <h2 className="text-sm font-black font-display text-vibrant-red uppercase tracking-widest flex items-center gap-1.5">
            Guess the Word
          </h2>
          <p className="text-[10px] text-slate-500 font-sans font-bold mt-0.5">
            {guesses.length} OF {maxAttempts} ATTEMPTS COMPLETED
          </p>
        </div>

        {/* Revealed clues indicators */}
        {Object.keys(revealedLetters).length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-vibrant-green/10 text-vibrant-green border border-vibrant-green/20 rounded-xl text-xs font-mono font-bold animate-pulse">
            <Eye className="w-3.5 h-3.5" />
            <span>{Object.keys(revealedLetters).length} CLUE{Object.keys(revealedLetters).length > 1 ? 'S' : ''} ACTIVE</span>
          </div>
        )}
      </div>

      {/* Secret Word Reveal on Game Over */}
      {gameStatus !== 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${
            gameStatus === 'won'
              ? 'bg-vibrant-green/10 border-vibrant-green text-vibrant-green'
              : 'bg-vibrant-red/10 border-vibrant-red text-vibrant-red'
          }`}
          id="game-over-banner"
        >
          <span className="text-xs uppercase font-mono tracking-wider font-extrabold">
            {gameStatus === 'won' ? '🎉 CHALLENGE SOLVED!' : '💀 OUT OF ATTEMPTS'}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-600 font-semibold">The hidden word was:</span>
            <strong className="text-lg font-black font-display tracking-wider text-vibrant-dark underline decoration-dashed decoration-vibrant-red decoration-2">
              {secretWord.toUpperCase()}
            </strong>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="flex justify-center" id="wordle-grid-container">
        <div className="grid grid-rows-6 gap-2.5 w-full max-w-[240px] md:max-w-[260px]" id="wordle-grid">
          {Array(maxAttempts)
            .fill(null)
            .map((_, rowIdx) => (
              <div key={`row-${rowIdx}`} className="grid grid-cols-5 gap-2.5">
                {Array(wordLength)
                  .fill(null)
                  .map((_, colIdx) => renderGridCell(rowIdx, colIdx))}
              </div>
            ))}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <div className="flex flex-col gap-2 border-t border-vibrant-gray-light pt-5" id="virtual-keyboard">
        {keyboardRows.map((row, rowIdx) => (
          <div key={`kbd-row-${rowIdx}`} className="flex justify-center gap-1.5">
            {row.map(char => {
              const letterState = keyboardStates[char];
              const isEnter = char === 'ENTER';
              const isBackspace = char === 'BACKSPACE';
              const isSpecial = isEnter || isBackspace;
              const isBlasted = letterState === 'blasted';

              let keyBg = 'bg-vibrant-border hover:bg-slate-300 text-vibrant-dark border-b-4 border-black/10';
              if (isBlasted) {
                keyBg = 'bg-vibrant-gray-light text-slate-400 border-transparent opacity-35 line-through cursor-not-allowed pointer-events-none';
              } else if (letterState === 'correct') {
                keyBg = 'bg-vibrant-green text-white border-b-4 border-black/15 shadow-sm';
              } else if (letterState === 'present') {
                keyBg = 'bg-vibrant-ochre text-white border-b-4 border-black/15 shadow-sm';
              } else if (letterState === 'absent') {
                keyBg = 'bg-vibrant-gray-dark text-white border-b-4 border-black/15 shadow-sm';
              } else if (isEnter) {
                keyBg = 'bg-vibrant-teal text-white border-b-4 border-black/15 shadow-sm hover:opacity-90';
              } else if (isBackspace) {
                keyBg = 'bg-vibrant-red text-white border-b-4 border-black/15 shadow-sm hover:opacity-90';
              }

              return (
                <button
                  key={char}
                  onClick={() => {
                    if (isBlasted) return;
                    if (isEnter) onWordSubmit();
                    else if (isBackspace) onDeleteChar();
                    else onTypeChar(char);
                  }}
                  disabled={isBlasted || (gameStatus !== 'playing')}
                  className={`flex items-center justify-center font-bold font-sans rounded-lg text-xs cursor-pointer select-none transition-all ${keyBg} ${
                    isSpecial 
                      ? 'px-3 h-12 text-[10px]' 
                      : 'w-7 h-12 md:w-8 md:h-12 flex-grow'
                  }`}
                  id={`kbd-key-${char}`}
                >
                  {isBackspace ? (
                    <span className="font-extrabold font-sans text-[10px]">DEL</span>
                  ) : char}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
