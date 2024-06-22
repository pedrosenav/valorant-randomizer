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
