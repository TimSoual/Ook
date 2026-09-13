import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BookFormData } from '../types/book'
import { exportBooksToCSV, importBooksFromCSV } from '../utils/bookCsv'

const STORAGE_KEY = 'book-tracker-books-v1'

const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
const fifteenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
const fiveDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
const twoDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()

const initialSampleBooks: Book[] = [
  {
    id: 'sample-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'finished',
    rating: 5,
    notes: 'An easy & proven way to build good habits & break bad ones. Essential reading on behavioral psychology.',
    createdAt: thirtyDaysAgo,
    updatedAt: fiveDaysAgo,
    startedAt: thirtyDaysAgo,
    finishedAt: fiveDaysAgo
  },
  {
    id: 'sample-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'reading',
    rating: 5,
    notes: 'Deep dive into storage engines, distributed consensus, data modeling, and fault tolerance.',
    createdAt: fifteenDaysAgo,
    updatedAt: twoDaysAgo,
    startedAt: fifteenDaysAgo
  },
  {
    id: 'sample-3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    status: 'to-read',
    rating: 4,
    notes: 'Sci-Fi novel from the author of The Martian. Recommended by friends.',
    createdAt: fiveDaysAgo,
    updatedAt: fiveDaysAgo,
    startedAt: fiveDaysAgo
  }
]

const normalizeBook = (book: Book): Book => ({
  ...book,
  startedAt: book.startedAt ?? book.createdAt,
  ...(book.status === 'finished' && !book.finishedAt
    ? { finishedAt: book.updatedAt ?? book.createdAt }
    : {})
})

const createBookId = (): string =>
  'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)

export const useBookStore = defineStore('bookStore', () => {
  const books = ref<Book[]>([])
  const isLoaded = ref<boolean>(false)

  // Initialize and load from LocalStorage
  const loadBooks = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        books.value = (JSON.parse(stored) as Book[]).map(normalizeBook)
      } else {
        books.value = initialSampleBooks
        saveToLocalStorage()
      }
    } catch (e) {
      console.error('Failed to load books from localStorage:', e)
      books.value = initialSampleBooks
    } finally {
      isLoaded.value = true
    }
  }

  const saveToLocalStorage = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
    } catch (e) {
      console.error('Failed to save books to localStorage:', e)
    }
  }

  // Getters
  const getBookById = computed(() => {
    return (id: string): Book | undefined => books.value.find(b => b.id === id)
  })

  const stats = computed(() => {
    const MILLISECONDS_IN_A_DAY = 86400000;
    const total = books.value.length
    const toRead = books.value.filter(b => b.status === 'to-read').length
    const reading = books.value.filter(b => b.status === 'reading').length
    const finished = books.value.filter(b => b.status === 'finished').length
    const avgRating = total > 0 
      ? (books.value.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / total).toFixed(1) 
      : '0.0'
  
    // Finished this month
    const now = new Date()
    const finishedThisMonth = books.value.filter(b => {
      if (!b.finishedAt) return false
      const finishedDate = new Date(b.finishedAt)
      return (
        finishedDate.getMonth() === now.getMonth() &&
        finishedDate.getFullYear() === now.getFullYear()
      )
    }).length
    const finishedThisYear = books.value.filter(b => {
      if (!b.finishedAt) return false
      const finishedDate = new Date(b.finishedAt)
      return (
        finishedDate.getFullYear() === now.getFullYear()
      )
    }).length
  
    // Pace metrics only use finished books with a valid reading period.
    // Important: daysToFinish is the number of calendar days in total, including the starting day, not a duration.
    const completedReads = books.value.flatMap(book => {
      if (book.status !== 'finished' || !book.startedAt || !book.finishedAt) {
        return []
      }

      const dayNumber = (d: Date): number => {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MILLISECONDS_IN_A_DAY
      }

      const start = new Date(book.startedAt);
      const end = new Date(book.finishedAt);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return []
      }

      const daysToFinish = Math.abs(dayNumber(end) - dayNumber(start)) + 1;
      return [{ book, daysToFinish }]
    })
    const sortedReads = [...completedReads].sort((a, b) => a.daysToFinish - b.daysToFinish)
    const avgDaysToFinish = completedReads.length > 0
      ? Math.round(completedReads.reduce((sum, read) => sum + read.daysToFinish, 0) / completedReads.length)
      : 0
    const middle = Math.floor(sortedReads.length / 2)
    const medianDaysToFinish = sortedReads.length === 0
      ? 0
      : sortedReads.length % 2 === 1
        ? sortedReads[middle].daysToFinish
        : Math.round((sortedReads[middle - 1].daysToFinish + sortedReads[middle].daysToFinish) / 2)
    const fastestRead = sortedReads[0]
    const slowestRead = sortedReads.at(-1)
  
    return { 
      total, 
      toRead, 
      reading, 
      finished, 
      avgRating, 
      finishedThisMonth,
      finishedThisYear,
      avgDaysToFinish,
      medianDaysToFinish,
      fastestRead,
      slowestRead
    }
  })

  // Actions
  const addBook = (bookData: BookFormData): Book => {
    const now = new Date().toISOString()
    const newBook: Book = {
      ...bookData,
      id: createBookId(),
      createdAt: now,
      updatedAt: now,
      startedAt: now,
      ...(bookData.status === 'finished' ? { finishedAt: now } : {})
    }
    books.value.unshift(newBook)
    saveToLocalStorage()
    return newBook
  }

  const updateBook = (id: string, bookData: Partial<BookFormData>): void => {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      const existing = books.value[index]
      const now = new Date().toISOString()
      const newStatus = bookData.status ?? existing.status
      const dateUpdates: Pick<Book, 'finishedAt'> = {}

      if (newStatus === 'finished' && existing.status !== 'finished' && !bookData.finishedAt) {
        dateUpdates.finishedAt = now
      } else if (newStatus !== 'finished' && existing.status === 'finished' && !('finishedAt' in bookData)) {
        dateUpdates.finishedAt = undefined
      }

      books.value[index] = {
        ...existing,
        ...bookData,
        ...dateUpdates,
        startedAt: bookData.startedAt ?? existing.startedAt ?? existing.createdAt,
        updatedAt: now
      }
      saveToLocalStorage()
    }
  }

  const deleteBook = (id: string): void => {
    books.value = books.value.filter(b => b.id !== id)
    saveToLocalStorage()
  }

  const clearBooks = (): void => {
    books.value = []
    saveToLocalStorage()
  }

  const exportToCSV = (): void => {
    exportBooksToCSV(books.value)
  }

  const importFromCSV = async (file: File): Promise<{ imported: number; skipped: number; errors: string[] }> => {
    const result = importBooksFromCSV(
      await file.text(),
      new Set(books.value.map(book => book.id))
    )

    if (result.books.length > 0) {
      books.value = [...result.books, ...books.value]
      saveToLocalStorage()
    }

    return {
      imported: result.books.length,
      skipped: result.errors.length,
      errors: result.errors
    }
  }

  // Auto load on store creation
  loadBooks()

  return {
    books,
    isLoaded,
    getBookById,
    stats,
    addBook,
    updateBook,
    deleteBook,
    clearBooks,
    exportToCSV,
    importFromCSV,
    loadBooks
  }
})
