import type { Book, BookStatus } from '../types/book'

export const csvHeaders = [
  'ID',
  'Title',
  'Author',
  'Status',
  'Rating',
  'Notes',
  'Created At',
  'Started At',
  'Finished At'
]

export interface CSVImportResult {
  books: Book[]
  errors: string[]
}

const createBookId = (): string =>
  'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)

const parseCSV = (content: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]
    const nextCharacter = content[index + 1]

    if (character === '"' && quoted && nextCharacter === '"') {
      field += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(field)
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1
      row.push(field)
      if (row.some(value => value.trim() !== '')) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field)
    if (row.some(value => value.trim() !== '')) rows.push(row)
  }

  return rows
}

export const importBooksFromCSV = (
  content: string,
  existingIds: Set<string>
): CSVImportResult => {
  const rows = parseCSV(content.replace(/^\uFEFF/, ''))

  if (rows.length === 0) {
    return { books: [], errors: ['The CSV file is empty.'] }
  }

  const headers = rows[0].map(header => header.trim().toLowerCase())
  const expectedHeaders = csvHeaders.map(header => header.toLowerCase())
  const hasExpectedHeaders = expectedHeaders.every(
    (header, index) => headers[index] === header
  )

  if (!hasExpectedHeaders) {
    return {
      books: [],
      errors: ['This file does not match the Ook CSV format.']
    }
  }

  const importedBooks: Book[] = []
  const errors: string[] = []

  rows.slice(1).forEach((values, rowIndex) => {
    const lineNumber = rowIndex + 2
    const title = values[1]?.trim() || ''
    const author = values[2]?.trim() || ''
    const status = values[3]?.trim() as BookStatus
    const rating = Number(values[4])

    if (!title || !author) {
      errors.push(`Row ${lineNumber}: title and author are required.`)
      return
    }

    if (!['to-read', 'reading', 'finished'].includes(status)) {
      errors.push(`Row ${lineNumber}: invalid reading status.`)
      return
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      errors.push(`Row ${lineNumber}: rating must be a whole number from 0 to 5.`)
      return
    }

    const now = new Date().toISOString()
    let id = values[0]?.trim() || createBookId()

    while (existingIds.has(id)) id = createBookId()
    existingIds.add(id)

    const createdAt = values[6]?.trim() || now
    const startedAt = values[7]?.trim() || createdAt
    const finishedAt = values[8]?.trim() || undefined

    importedBooks.push({
      id,
      title,
      author,
      status,
      rating,
      notes: values[5]?.trim() || '',
      createdAt,
      updatedAt: now,
      startedAt,
      ...(status === 'finished' && finishedAt ? { finishedAt } : {})
    })
  })

  return { books: importedBooks, errors }
}

export const exportBooksToCSV = (books: Book[]): void => {
  if (books.length === 0) return

  const csvRows = [csvHeaders.join(',')]

  for (const book of books) {
    const row = [
      `"${book.id.replace(/"/g, '""')}"`,
      `"${book.title.replace(/"/g, '""')}"`,
      `"${book.author.replace(/"/g, '""')}"`,
      `"${book.status}"`,
      book.rating || 0,
      `"${(book.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${book.createdAt}"`,
      `"${book.startedAt ?? book.createdAt}"`,
      `"${book.finishedAt ?? ''}"`
    ]
    csvRows.push(row.join(','))
  }

  const csvContent =
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'))
  const downloadAnchor = document.createElement('a')

  downloadAnchor.setAttribute('href', csvContent)
  downloadAnchor.setAttribute(
    'download',
    `books_export_${new Date().toISOString().slice(0, 10)}.csv`
  )
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  document.body.removeChild(downloadAnchor)
}