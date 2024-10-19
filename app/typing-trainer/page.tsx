'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateText, calculateAccuracy, calculateWPM, unlockNextLetter, allLetters, initialUnlockedLetters } from './typing-logic'

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
    const currentAccuracy = calculateAccuracy(inputValue, text)
    setAccuracy(currentAccuracy)

    const currentWpm = startTime ? calculateWPM(words, startTime) : 0
    setWpm(currentWpm)

    if (inputValue.length >= text.length) {
      if (currentAccuracy >= 95 && currentWpm >= 20) {
        if (!lastLetterMastered) {
          setLastLetterMastered(true)
        } else if (unlockedLetters !== allLetters) {
          setUnlockedLetters(unlockNextLetter(unlockedLetters))
          setLastLetterMastered(false)
        }
      }
      generateNewText()
    }
  }

  return (
    <div className="pt-8 px-4 sm:pt-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
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
