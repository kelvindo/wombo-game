// src/App.tsx
import { useState } from 'react';
import { canMakeWord, isEnglishWord, scrambleWords, subtractWords } from './utils/wordUtils';
import './App.css';

const words = ['tree', 'boat', 'frog', 'lion', 'duck'];
const scrambled = scrambleWords(words);

function App() {
  const [remainingLetters, setRemainingLetters] = useState(scrambled);
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [inputWord, setInputWord] = useState('');

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
        setRemainingLetters(newRemainingLetters);
        setGuessedWords([...guessedWords, inputWord]);
        setInputWord('');
      }
    }
  };

  return (
    <div className="App">
      <h1>Wombo Game</h1>
      <h2>Scrambled Letters: {remainingLetters}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputWord}
          maxLength={4}
          onChange={(e) => setInputWord(e.target.value)}
        />
        <button type="submit">Guess</button>
      </form>
      <h3>Guessed Words:</h3>
      <ul>
        {guessedWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
