import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'book-tracker-books-v1'

const initialSampleBooks = [
  {
    id: 'sample-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'finished',
    rating: 5,
    notes: 'An easy & proven way to build good habits & break bad ones. Essential reading on behavioral psychology.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'reading',
    rating: 5,
    notes: 'Deep dive into storage engines, distributed consensus, data modeling, and fault tolerance.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'sample-3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    status: 'to-read',
    rating: 4,
    notes: 'Sci-Fi novel from the author of The Martian. Recommended by friends.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
]

export const useBookStore = defineStore('bookStore', () => {
  const books = ref([])
  const isLoaded = ref(false)

  // Initialize and load from LocalStorage
  const loadBooks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        books.value = JSON.parse(stored)
      } else {
        // First load defaults with sample data
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

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
    } catch (e) {
      console.error('Failed to save books to localStorage:', e)
    }
  }

  // Getters
  const getBookById = computed(() => {
    return (id) => books.value.find(b => b.id === id)
  })

  const stats = computed(() => {
    const total = books.value.length
    const toRead = books.value.filter(b => b.status === 'to-read').length
    const reading = books.value.filter(b => b.status === 'reading').length
    const finished = books.value.filter(b => b.status === 'finished').length
    const avgRating = total > 0 
      ? (books.value.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / total).toFixed(1) 
      : '0.0'

    return { total, toRead, reading, finished, avgRating }
  })

  // Actions
  const addBook = (bookData) => {
    const now = new Date().toISOString()
    const newBook = {
      ...bookData,
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: now,
      updatedAt: now
    }
    books.value.unshift(newBook)
    saveToLocalStorage()
    return newBook
  }

  const updateBook = (id, bookData) => {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      books.value[index] = {
        ...books.value[index],
        ...bookData,
        updatedAt: new Date().toISOString()
      }
      saveToLocalStorage()
    }
  }

  const deleteBook = (id) => {
    books.value = books.value.filter(b => b.id !== id)
    saveToLocalStorage()
  }

  const exportToCSV = () => {
    if (books.value.length === 0) return

    const headers = ['ID', 'Title', 'Author', 'Status', 'Rating', 'Notes', 'Created At']
    const csvRows = [headers.join(',')]

    for (const book of books.value) {
      const row = [
        `"${book.id.replace(/"/g, '""')}"`,
        `"${book.title.replace(/"/g, '""')}"`,
        `"${book.author.replace(/"/g, '""')}"`,
        `"${book.status}"`,
        book.rating || 0,
        `"${(book.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${book.createdAt}"`
      ]
      csvRows.push(row.join(','))
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', csvContent)
    downloadAnchor.setAttribute('download', `books_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    document.body.removeChild(downloadAnchor)
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
    exportToCSV,
    loadBooks
  }
})
