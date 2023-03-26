// src/App.tsx
import { useState } from 'react';
import { canMakeWord, isEnglishWord, scrambleWords, subtractWords, getTodaysJumbly, checkSolution } from './utils/wordUtils';
import './App.css';

const InformationPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <button className="information-button" onClick={togglePopup}>?</button>
      {showPopup && (
        <div className="information-overlay">
          <div className="information-popup">
            <p>Instructions:</p>
            <ul>
              <li>Click the letters to create 4 letter words</li>
              <li>Guessed letters will be replaced with new ones</li>
              <li>If you reach a dead end, you have to restart</li>
              <li>If you're stuck, check your solutions to see which guesses are correct</li>
              <li>Use all 20 letters to make 5 words and you win!</li>
            </ul>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

// const words = getTodaysRandomWords();
const scrambled = getTodaysJumbly();
// const scrambled = 'poeicedadfchnmacuusf';

function App() {
  const date = new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
  const [showInformationPopup, setShowInformationPopup] = useState(false);
  const [remainingLetters, setRemainingLetters] = useState(scrambled.slice(0, 8));
  const [remainingLettersRest, setRemainingLettersRest] = useState(scrambled.slice(8));
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

  const toggleInformationPopup = () => {
    setShowInformationPopup(!showInformationPopup);
  };

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

  const handleCheck = () => {
    const solutionChecks = checkSolution(scrambled, guessedWords);
  
    const guessedWordItems = document.querySelectorAll('.guessed-word-item');
  
    for (let i = 0; i < guessedWordItems.length; i++) {
      const [word, isValid] = solutionChecks[i];
      guessedWordItems[i].classList.toggle('guessed-word-item--correct', isValid);
      guessedWordItems[i].classList.toggle('guessed-word-item--incorrect', !isValid);
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
      <h1>Jumbly {date}</h1>
      <InformationPopup />
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
            <button type="button" onClick={handleCheck}>Check</button>
          </div>
        </div>
      </form>
      {guessedWords.length === 5 && <h3>You Win!</h3>}
      <h3>Guessed Words</h3>
      <ul>
        {guessedWords.map((word, index) => (
          <li key={index} className="guessed-word-item">
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
