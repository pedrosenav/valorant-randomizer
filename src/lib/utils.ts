import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pickRandomItem<T>(array: T[]) {
  const min = 0
  const max = array.length - 1

  if (min > max) {
    throw new Error('Tá errado patrão')
  }
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min

  return array[randomNum]
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice() // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) // Get a random index from 0 to i
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]] // Swap elements
  }
  return shuffledArray
}
