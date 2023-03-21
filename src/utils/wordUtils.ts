// src/utils/wordUtils.ts
import _ from 'lodash';
import dictionaries from '../data/dictionaries.json';

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
  const combined = words.join('');
  return _.shuffle(combined).join('');
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
