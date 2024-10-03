'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { defaultWordList } from '../wordlists'

const allLetters = 'etaoinshrdlcumwfgypbvkjxqz'
const initialUnlockedLetters = 'etaoin'

const generateText = (unlockedLetters: string, lastLetterMastered: boolean, wordCount: number = 10) => {
  if (unlockedLetters === allLetters) {
    // All letters are unlocked, include pangrams in the selection
    const allOptions = [...defaultWordList, ...defaultWordList.slice(-5)] // Add pangrams to the options
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
    return Array(wordCount).fill('a').join(' ') // Fallback to prevent empty text
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

export default function ProgressiveTouchTypingTrainer() {
  const [unlockedLetters, setUnlockedLetters] = useState(initialUnlockedLetters)
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState(100)
  const [wpm, setWpm] = useState(0)
  const [lastLetterMastered, setLastLetterMastered] = useState(true)

  const generateNewText = useCallback(() => {
    const newText = generateText(unlockedLetters, lastLetterMastered)
    setText(newText)
    setUserInput('')
    setStartTime(null)
    setAccuracy(100)
    setWpm(0)
  }, [unlockedLetters, lastLetterMastered])

  useEffect(() => {
    generateNewText()
  }, [generateNewText])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setUserInput(inputValue)

    if (!startTime) {
      setStartTime(Date.now())
    }

    const words = inputValue.trim().split(/\s+/)
    const accurateChars = inputValue.split('').filter((char, index) => char === text[index]).length
    const currentAccuracy = Math.round((accurateChars / inputValue.length) * 100) || 100
    setAccuracy(currentAccuracy)

    const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000 // in minutes
    const currentWpm = Math.round((words.length / timeElapsed) || 0)
    setWpm(currentWpm)

    if (inputValue.length >= text.length) {
      if (currentAccuracy >= 95 && currentWpm >= 20) {
        if (!lastLetterMastered) {
          setLastLetterMastered(true)
        } else if (unlockedLetters !== allLetters) {
          unlockNextLetter()
        }
      }
      generateNewText()
    }
  }

  const unlockNextLetter = () => {
    const nextLetterIndex = allLetters.indexOf(unlockedLetters[unlockedLetters.length - 1]) + 1
    if (nextLetterIndex < allLetters.length) {
      setUnlockedLetters(allLetters.slice(0, nextLetterIndex + 1))
      setLastLetterMastered(false)
    }
  }

  return (
    <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Progressive Touch Typing Trainer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center gap-1" aria-label="Unlocked letters">
            {allLetters.split('').map((letter) => (
              <span
                key={letter}
                className={`w-6 h-6 flex items-center justify-center rounded ${
                  unlockedLetters.includes(letter) 
                    ? lastLetterMastered || letter !== unlockedLetters[unlockedLetters.length - 1]
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
          <Progress 
            value={(unlockedLetters.length / allLetters.length) * 100} 
            className="w-full"
          />
          <div className="text-lg font-medium bg-muted p-4 rounded" aria-label="Sample text to type">
            {text}
          </div>
          <textarea
            className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            aria-label="Type the sample text here"
          />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Words per minute</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
          </div>
          <Button onClick={generateNewText} className="w-full">
            New Text
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}