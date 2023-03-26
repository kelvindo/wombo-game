// src/App.tsx
import { useState } from 'react';
import { canMakeWord, isEnglishWord, subtractWords, getTodaysJumbly, checkSolution } from './utils/wordUtils';
import './App.css';

const scrambled = getTodaysJumbly();

function App() {
  const date = new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
  const [remainingLetters, setRemainingLetters] = useState(scrambled.slice(0, 8));
  const [remainingLettersRest, setRemainingLettersRest] = useState(scrambled.slice(8));
  const [stack, setStack] = useState<[string, string][]>([]);
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

  const handleBackspace = () => {
    // If the input has letters, remove a letter.
    if (inputWord.length > 0) {
      setInputWord(inputWord.slice(0, -1))

    // If the input is empty, then remove the last guessed word.
    } else {
      const prevItem = stack.pop();
      if (prevItem) {
        setStack(stack);
        setRemainingLetters(prevItem[0]);
        setRemainingLettersRest(prevItem[1]);
        guessedWords.pop()
        setGuessedWords(guessedWords);
      }
    }
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

  const handleHint = () => {
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

    // Check that the word has 4 letters, is English, and can be made from the tiles.
    if (
      inputWord.length === 4 &&
      isEnglishWord(inputWord) &&
      canMakeWord(inputWord, remainingLetters)
    ) {
      // Remove the guessed word from the letters.
      const newRemainingLetters = subtractWords(remainingLetters, inputWord);
      
      // Highlight the tiles of the guessed word.
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
      
      // Update the state of the letters after the highlight is done.
      setTimeout(() => {
        setStack([...stack, [remainingLetters, remainingLettersRest]])
        setRemainingLetters(newRemainingLetters + remainingLettersRest.slice(0, 4));
        setRemainingLettersRest(remainingLettersRest.slice(4))
        setGuessedWords([...guessedWords, inputWord]);
        setInputWord('');
      }, 500);
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
            <button type="button" onClick={handleBackspace}>Back</button>
            <button type="button" onClick={handleHint}>Hint</button>
          </div>
        </div>
      </form>
      {guessedWords.length === 5 && <h3>You Win!</h3>}
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
              <li>Click the letters to guess 4 letter words</li>
              <li>Guessed letters will be replaced with new ones</li>
              <li>Use the "back" button to remove letters or words</li>
              <li>Use the "hint" button to check which words are correct</li>
              <li>Use all 20 letters to make 5 words and you win!</li>
            </ul>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
