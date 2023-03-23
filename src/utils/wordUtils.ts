// src/utils/wordUtils.ts
import _ from 'lodash';
import dictionaries from '../data/dictionaries.json';
import RandomSeed from 'random-seed';

const fourLetterWords = dictionaries.fourLetterWords;
const fiveLetterWords = dictionaries.fiveLetterWords;
const threeLetterWords = dictionaries.threeLetterWords;


export const isEnglishWord = (word: string): boolean => {
  const lowercaseWord = word.toLowerCase();

  if (lowercaseWord.length === 3) {
    return threeLetterWords.includes(lowercaseWord);
  } else if (lowercaseWord.length === 4) {
    return fourLetterWords.includes(lowercaseWord);
  } else if (lowercaseWord.length === 5) {
    return fiveLetterWords.includes(lowercaseWord);
  } else {
    return false;
  }
};

export function canMakeWord(word: string, remainingLetters: string): boolean {
  const letterCounts = new Map<string, number>();
  for (const letter of remainingLetters) {
    const count = letterCounts.get(letter) || 0;
    letterCounts.set(letter, count + 1);
  }
  for (const letter of word) {
    const count = letterCounts.get(letter) || 0;
    if (count === 0) {
      return false;
    }
    letterCounts.set(letter, count - 1);
  }
  return true;
}


export const scrambleWords = (words: string[]): string => {
  let scrambled = "";
  let chunk = "";
  for (let i = words.length - 1; i >= 0; i--) {
    chunk += words[i]

    if (chunk.length == 8) {
      chunk = _.shuffle(chunk).join('');
      scrambled = chunk.slice(4, 8) + scrambled;
      chunk = chunk.slice(0, 4);
    }
  }

  return chunk + scrambled;
};


export const subtractWords = (pool: string, word: string): string => {
  const poolArray = pool.split('');
  for (const letter of word) {
    const index = poolArray.indexOf(letter);
    if (index >= 0) {
      poolArray.splice(index, 1);
    }
  }
  return poolArray.join('');
};

export const getTodaysRandomWords = (): string[] => {
  const date = new Date();
  const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const rng = RandomSeed.create(seed);
  const shuffled = [...fourLetterWords];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 5);
};

export const getRandomWordsAndScramble = (): string => {
  const date = new Date();
  const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const rng = RandomSeed.create(seed);
  const shuffledWords = [...fourLetterWords].sort(() => rng.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, 5);
  let scrambled = "";
  let chunk = "";
  for (let i = selectedWords.length - 1; i >= 0; i--) {
    chunk += selectedWords[i];

    if (chunk.length === 8) {
      chunk = chunk.split('').sort(() => rng.random() - 0.5).join('');
      scrambled = chunk.slice(4, 8) + scrambled;
      chunk = chunk.slice(0, 4);
    }
  }

  return chunk + scrambled;
};