const fs = require('fs');

const readWordsFromFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.split('\n').filter((word) => /^[a-zA-Z]+$/.test(word)).map((word) => word.toLowerCase());
};

const createDictionary = (words, length) => {
  return words.filter((word) => word.length === length);
};

const allWords = readWordsFromFile('usa.txt');
const threeLetterWords = createDictionary(allWords, 3);
const fourLetterWords = createDictionary(allWords, 4);
const fiveLetterWords = createDictionary(allWords, 5);

const dictionaries = {
  threeLetterWords,
  fourLetterWords,
  fiveLetterWords
};

fs.writeFileSync('dictionaries.json', JSON.stringify(dictionaries));
