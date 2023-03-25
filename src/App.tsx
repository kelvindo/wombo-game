// src/App.tsx
import { useState } from 'react';
import { canMakeWord, isEnglishWord, scrambleWords, subtractWords, getTodaysRandomWords } from './utils/wordUtils';
import './App.css';

// const words = getTodaysRandomWords();
// const scrambled = scrambleWords(words);
const scrambled = 'poeicedadfchnmacuusf';

function App() {
  const date = new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
  const [remainingLetters, setRemainingLetters] = useState(scrambled.slice(0, 8));
  const [remainingLettersRest, setRemainingLettersRest] = useState(scrambled.slice(8));
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

  const handleClearInput = () => {
    setInputWord('');
  };

  const handleRestart = () => {
    setRemainingLetters(scrambled.slice(0, 8));
    setRemainingLettersRest(scrambled.slice(8));
    setGuessedWords([]);
    setInputWord('');
  };

  const handleTileClick = (index: number) => {
    const letter = remainingLetters[index];
    if (inputWord.length < 4) {
      setInputWord(inputWord + letter);
      const tile = document.querySelector(`.remaining-letters-tile:nth-child(${index + 1})`);
      tile?.classList.add('highlighted');
      setTimeout(() => {
        tile?.classList.remove('highlighted');
      }, 250);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      inputWord.length === 4 &&
      isEnglishWord(inputWord) &&
      canMakeWord(inputWord, remainingLetters) &&
      !guessedWords.includes(inputWord)
    ) {
      const newRemainingLetters = subtractWords(remainingLetters, inputWord);
      if (newRemainingLetters !== remainingLetters) {
        // Highlight the tiles of the guessed word
        const guessedWordTiles = document.querySelectorAll('.remaining-letters-tile');
        for (let i = 0; i < remainingLetters.length; i++) {
          const letter = remainingLetters[i];
          if (inputWord.includes(letter)) {
            guessedWordTiles[i].classList.add('highlighted');
          }
          setTimeout(() => {
            guessedWordTiles[i].classList.remove('highlighted');
          }, 500);
        }
        
        setTimeout(() => {
          setRemainingLetters(newRemainingLetters + remainingLettersRest.slice(0, 4));
          setRemainingLettersRest(remainingLettersRest.slice(4))
          setGuessedWords([...guessedWords, inputWord]);
          setInputWord('');
        }, 500);
      }
    }
  };

  return (
    <div className="App">
      <h1>Wombo {date}</h1>
      <h2 className="remaining-letters">
        {remainingLetters.split('').map((letter, index) => (
          <span key={index} className="remaining-letters-tile" onClick={() => handleTileClick(index)}>
            {letter.toUpperCase()}
          </span>
        ))}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={inputWord}
            maxLength={4}
            onChange={(e) => setInputWord(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Guess</button>
            <button type="button" onClick={handleClearInput}>Clear</button>
            <button type="button" onClick={handleRestart}>Restart</button>
          </div>
        </div>
      </form>
      {guessedWords.length === 5 && <h3>You Win!</h3>}
      <h3>Guessed Words</h3>
      <ul>
        {guessedWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
