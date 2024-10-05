import { defaultWordList } from '../wordlists'

export const allLetters = 'etaoinshrdlcumwfgypbvkjxqz'
export const initialUnlockedLetters = 'etaoin'

export const generateText = (unlockedLetters: string, lastLetterMastered: boolean, wordCount: number = 10) => {
  if (unlockedLetters === allLetters) {
    const allOptions = [...defaultWordList, ...defaultWordList.slice(-5)]
    return allOptions[Math.floor(Math.random() * allOptions.length)]
  }

  let availableWords = defaultWordList.filter(word => 
    word.split('').every(letter => unlockedLetters.includes(letter) || !allLetters.includes(letter))
  )

  if (!lastLetterMastered) {
    const lastUnlockedLetter = unlockedLetters[unlockedLetters.length - 1]
    availableWords = availableWords.filter(word => word.includes(lastUnlockedLetter))
  }

  if (availableWords.length === 0) {
    return Array(wordCount).fill('a').join(' ')
  }

  const generatedText = []
  const usedWords = new Set()

  for (let i = 0; i < wordCount; i++) {
    let selectedWord
    do {
      selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)]
    } while (usedWords.has(selectedWord) && usedWords.size < availableWords.length)

    generatedText.push(selectedWord)
    usedWords.add(selectedWord)
  }

  return generatedText.join(' ')
}

export const calculateAccuracy = (inputValue: string, text: string) => {
  const accurateChars = inputValue.split('').filter((char, index) => char === text[index]).length
  return Math.round((accurateChars / inputValue.length) * 100) || 100
}

export const calculateWPM = (words: string[], startTime: number) => {
  const timeElapsed = (Date.now() - startTime) / 60000 // in minutes
  return Math.round((words.length / timeElapsed) || 0)
}

export const unlockNextLetter = (unlockedLetters: string) => {
  const nextLetterIndex = allLetters.indexOf(unlockedLetters[unlockedLetters.length - 1]) + 1
  if (nextLetterIndex < allLetters.length) {
    return allLetters.slice(0, nextLetterIndex + 1)
  }
  return unlockedLetters
}