export type BookStatus = 'to-read' | 'reading' | 'finished'

export interface Book {
  id: string
  title: string
  author: string
  status: BookStatus
  rating: number
  notes: string
  createdAt: string
  updatedAt: string
  startedAt?: string
  finishedAt?: string
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
