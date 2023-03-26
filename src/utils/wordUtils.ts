// src/utils/wordUtils.ts
import _ from 'lodash';
import dictionaries from '../data/dictionaries.json';
import dailys from '../data/daily_jumbly.json';
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
  const date = new Date();
  const seed = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const rng = RandomSeed.create(seed);

  let scrambled = "";
  let chunk = "";
  for (let i = words.length - 1; i >= 0; i--) {
    chunk += words[i];

    if (chunk.length === 8) {
      chunk = chunk.split('').sort(() => rng.random() - 0.5).join('');
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


export const getTodaysJumbly = (): string => {
  const startDate = new Date('2023-01-01');
  const today = new Date();
  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / dayInMilliseconds);
  const index = daysSinceStart % Object.keys(dailys).length;
  return dailys[index];
};

class TrieNode {
  children: { [key: string]: TrieNode } = {};
  is_end: boolean = false;
}

class Trie {
  root: TrieNode;

  constructor(words: string[]) {
    this.root = new TrieNode();
    for (const word of words) {
      let node = this.root;
      for (const c of word) {
        if (!(c in node.children)) {
          node.children[c] = new TrieNode();
        }
        node = node.children[c];
      }
      node.is_end = true;
    }
  }

  contains(word: string): boolean {
    let node = this.root;
    for (const c of word) {
      if (!(c in node.children)) {
        return false;
      }
      node = node.children[c];
    }
    return node.is_end;
  }

  has_prefix(prefix: string): boolean {
    let node = this.root;
    for (const c of prefix) {
      if (!(c in node.children)) {
        return false;
      }
      node = node.children[c];
    }
    return true;
  }
}

function findSingleSolutionRec(
  trie: Trie,
  letters: string,
  partial_word: string,
  completed_words: string[]
): string[] | undefined {
  if (completed_words.length === 5) {
    return completed_words;
  }

  for (let i = 0; i < Math.min(letters.length, 8 - partial_word.length); i++) {
    const c = letters[i];
    const new_word = partial_word + c;
    if (new_word.length === 4) {
      if (trie.contains(new_word)) {
        return findSingleSolutionRec(
          trie,
          letters.slice(0, i) + letters.slice(i + 1),
          "",
          [...completed_words, new_word]
        );
      }
    } else if (trie.has_prefix(new_word)) {
      const solution = findSingleSolutionRec(
        trie,
        letters.slice(0, i) + letters.slice(i + 1),
        new_word,
        completed_words
      );
      if (solution) {
        return solution;
      }
    }
  }

  return undefined;
}

function findSingleSolution(dictionary: string[], letters: string): string[] | undefined {
  const trie = new Trie(dictionary);
  return findSingleSolutionRec(trie, letters, "", []);
}

function removeWordFromLetters(letters: string, word: string): string {
  let remaining_letters = letters;
  for (const c of word) {
    if (remaining_letters.includes(c)) {
      remaining_letters = remaining_letters.replace(c, "");
    } else {
      throw new Error(`Word '${word}' cannot be formed from letters '${letters}'`);
    }
  }
  return remaining_letters;
}

export function checkSolution(
  all_letters: string,
  partial_solution: string[]
): [string, boolean][] {
  const trie = new Trie(fourLetterWords);
  let remaining_letters = all_letters;
  const solution_checks: [string, boolean][] = [];
  const completed_words: string[] = [];
  for (const word of partial_solution) {
    remaining_letters = removeWordFromLetters(remaining_letters, word);
    completed_words.push(word);
    const solution = findSingleSolutionRec(trie, remaining_letters, "", completed_words);
    solution_checks.push([word, solution !== undefined]);
  }

  return solution_checks;
}
