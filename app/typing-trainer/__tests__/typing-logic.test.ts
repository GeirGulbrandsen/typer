import { generateText, calculateAccuracy, calculateWPM, unlockNextLetter, allLetters, initialUnlockedLetters } from '../typing-logic';
import { defaultWordList } from '../../wordlists'; // Import directly from the source

describe('typing-logic', () => {
  describe('generateText', () => {
    it('should generate text with only unlocked letters', () => {
      const unlockedLetters = 'etaoin';
      const text = generateText(unlockedLetters, true);
      expect(text.split('').every(char => unlockedLetters.includes(char) || char === ' ')).toBe(true);
    });

    it('should include the last unlocked letter when not mastered', () => {
      const unlockedLetters = 'etaoin';
      const text = generateText(unlockedLetters, false);
      expect(text.includes('n')).toBe(true);
    });

    it('should return a word from the defaultWordList when all letters are unlocked', () => {
      const text = generateText(allLetters, true);
      expect(text.length).toBeGreaterThan(0);
      expect(defaultWordList.includes(text)).toBe(true);
    });

    it('should have an increased chance of returning a pangram when all letters are unlocked', () => {
      const pangrams = defaultWordList.slice(-5);
      const trials = 1000;
      let pangramCount = 0;

      for (let i = 0; i < trials; i++) {
        const text = generateText(allLetters, true);
        if (pangrams.includes(text)) {
          pangramCount++;
        }
      }

      // The probability of selecting a pangram should be higher than just their representation in the list
      const expectedProbability = pangrams.length / defaultWordList.length;
      const actualProbability = pangramCount / trials;
      expect(actualProbability).toBeGreaterThan(expectedProbability);
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate 100% accuracy for identical strings', () => {
      expect(calculateAccuracy('test', 'test')).toBe(100);
    });

    it('should calculate 0% accuracy for completely different strings', () => {
      expect(calculateAccuracy('test', 'abcd')).toBe(0);
    });

    it('should calculate partial accuracy', () => {
      expect(calculateAccuracy('test', 'tast')).toBe(75);
    });
  });

  describe('calculateWPM', () => {
    it('should calculate WPM correctly', () => {
      const words = ['the', 'quick', 'brown', 'fox'];
      const startTime = Date.now() - 60000; // 1 minute ago
      expect(calculateWPM(words, startTime)).toBe(4);
    });
  });

  describe('unlockNextLetter', () => {
    it('should unlock the next letter', () => {
      expect(unlockNextLetter('etaoin')).toBe('etaoins');
    });

    it('should not unlock beyond all letters', () => {
      expect(unlockNextLetter(allLetters)).toBe(allLetters);
    });
  });
});
