<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookStore } from '../stores/bookStore'
import {
  BookOpen,
  Clock,
  Bookmark,
  CheckCircle2,
  BarChart3,
  Award,
  TrendingUp,
  Download,
  Trash2,
  Calendar
} from 'lucide-vue-next'

const bookStore = useBookStore()
const importInput = ref<HTMLInputElement | null>(null)
const importMessage = ref('')
const importError = ref('')
const showClearConfirm = ref(false)

const openImportDialog = (): void => {
  importInput.value?.click()
}

const clearAllBooks = (): void => {
  bookStore.clearBooks()
  showClearConfirm.value = false
}

const handleImport = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  importMessage.value = ''
  importError.value = ''

  try {
    const result = await bookStore.importFromCSV(file)
    if (result.imported > 0) {
      importMessage.value = `Ook! Imported ${result.imported} book${result.imported === 1 ? '' : 's'}.`
    }
    if (result.skipped > 0 || result.errors.length > 0) {
      importError.value = result.errors.join(' ')
    } else if (result.imported === 0) {
      importError.value = 'No books were imported.'
    }
  } catch {
    importError.value = 'The CSV file could not be read.'
  } finally {
    input.value = ''
  }
}

function formatDuration(days: number): string {
  if (days === 0) return '—'
  if (days < 30) return `${days} days`
  const months = Math.round(days / 30)
  return months === 1 ? '~1 month' : `~${months} months`
}

const librarianRank = computed(() => {
  const finished = bookStore.stats.finished
  if (finished === 0) return { title: 'Novice Book Finder', badge: '🌱', desc: 'Add finished books to earn bananas for the Librarian!' }
  if (finished < 3) return { title: 'Apprentice Ook', badge: '🍌', desc: 'Off to a great start in the Unseen University!' }
  if (finished < 7) return { title: 'Senior Orangutan Reader', badge: '🦧', desc: 'The Librarian is highly impressed with your appetite!' }
  if (finished < 15) return { title: 'Grand Master of the Library', badge: '👑🍌', desc: 'Legendary reader! Arch-Chancellor of the Shelves.' }
  return { title: 'Supreme Discworld Librarian', badge: '✨🦧✨', desc: 'Master of L-Space itself! Unlimited bananas for you!' }
})
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-amber-400/20 border border-amber-400/40 rounded-2xl text-amber-300 shadow-md">
          <BarChart3 class="w-7 h-7 text-amber-400" />
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-display text-white">Librarian's Stats & Stash</h1>
          <p class="text-xs sm:text-sm text-emerald-300/80">Track your reading progress, banana stash, and data backup.</p>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <input
          ref="importInput"
          type="file"
          accept=".csv,text/csv"
          class="hidden"
          @change="handleImport"
        />
        <button
          @click="openImportDialog"
          class="px-4 py-2.5 rounded-xl border border-emerald-700/60 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105"
        >
          <Download class="w-4 h-4 rotate-180 text-amber-400" />
          <span>Import CSV</span>
        </button>
        <button
          @click="bookStore.exportToCSV"
          :disabled="bookStore.books.length === 0"
          class="px-4 py-2.5 rounded-xl border border-amber-400/50 bg-amber-400/20 hover:bg-amber-400/30 disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105"
        >
          <Download class="w-4 h-4 text-amber-400" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <div v-if="importMessage || importError" class="space-y-2 text-sm">
      <p v-if="importMessage" class="text-amber-300 bg-amber-400/20 p-3 rounded-xl border border-amber-400/40 font-semibold flex items-center gap-2">
        <span>🍌</span> {{ importMessage }}
      </p>
      <p v-if="importError" class="text-rose-300 bg-rose-500/20 p-3 rounded-xl border border-rose-500/40 font-semibold">
        {{ importError }}
      </p>
    </div>

    <!-- Librarian Rank Card -->
    <div class="bg-gradient-to-r from-emerald-900/80 via-emerald-800/60 to-amber-950/60 border border-amber-400/40 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div class="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
        <div class="w-20 h-20 bg-amber-400/20 border-2 border-amber-400/50 rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-banana">
          {{ librarianRank.badge }}
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
            Current Librarian Rank
          </span>
          <h2 class="text-2xl font-bold font-display text-white mt-1">
            {{ librarianRank.title }}
          </h2>
          <p class="text-emerald-200/80 text-sm mt-1">
            {{ librarianRank.desc }}
          </p>
        </div>
      </div>

      <div class="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto">
        <span class="text-xs text-emerald-300/80 font-medium block">Total Bananas Stashed</span>
        <span class="text-3xl font-extrabold text-amber-400 font-display flex items-center justify-center gap-1 mt-0.5">
          <span>{{ bookStore.stats.finished }}</span>
          <span>🍌</span>
        </span>
      </div>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors">
        <div class="p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300">
          <BookOpen class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-emerald-300/70 font-medium">Total Books</p>
          <p class="text-2xl font-bold font-display text-white">{{ bookStore.stats.total }}</p>
        </div>
      </div>

      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4 hover:border-sky-500/50 transition-colors">
        <div class="p-3 bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-300">
          <Clock class="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <p class="text-xs text-emerald-300/70 font-medium">To Read</p>
          <p class="text-2xl font-bold font-display text-sky-300">{{ bookStore.stats.toRead }}</p>
        </div>
      </div>

      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4 hover:border-emerald-400/50 transition-colors">
        <div class="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300">
          <Bookmark class="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p class="text-xs text-emerald-300/70 font-medium">Reading Now</p>
          <p class="text-2xl font-bold font-display text-emerald-300">{{ bookStore.stats.reading }}</p>
        </div>
      </div>

      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4 hover:border-amber-400/50 transition-colors">
        <div class="p-3 bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300">
          <CheckCircle2 class="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <p class="text-xs text-emerald-300/70 font-medium">Finished (Bananas)</p>
          <p class="text-2xl font-bold font-display text-amber-300">{{ bookStore.stats.finished }} 🍌</p>
        </div>
      </div>
    </div>

    <!-- Rating & Breakdown Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-6 backdrop-blur-xl space-y-3">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-amber-400/20 border border-amber-400/30 rounded-xl text-amber-300">
            <Award class="w-5 h-5 text-amber-400" />
          </div>
          <h2 class="text-base font-bold font-display text-white">This Month</h2>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-extrabold font-display text-amber-300">
            {{ bookStore.stats.finishedThisMonth }}
          </span>
          <span class="text-xs text-emerald-300/70">{{ bookStore.stats.finishedThisMonth === 1 ? 'banana' : 'bananas' }}</span>
        </div>
      </div>

      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-6 backdrop-blur-xl space-y-3">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-amber-400/20 border border-amber-400/30 rounded-xl text-amber-300">
            <Calendar class="w-5 h-5 text-amber-400" />
          </div>
          <h2 class="text-base font-bold font-display text-white">This Year</h2>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-extrabold font-display text-amber-300">
            {{ bookStore.stats.finishedThisYear }}
          </span>
          <span class="text-xs text-emerald-300/70">{{ bookStore.stats.finishedThisYear === 1 ? 'banana' : 'bananas' }}</span>
        </div>
      </div>

      <div class="bg-emerald-950/60 border border-emerald-900/80 rounded-2xl p-6 backdrop-blur-xl space-y-3">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300">
            <TrendingUp class="w-5 h-5 text-emerald-400" />
          </div>
          <h2 class="text-base font-bold font-display text-white">Avg Pace</h2>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-extrabold font-display text-emerald-300">
            {{ formatDuration(bookStore.stats.avgDaysToFinish) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Destructive Action -->
    <div class="pt-4 border-t border-emerald-900/60 flex justify-end">
      <button
        @click="showClearConfirm = true"
        :disabled="bookStore.books.length === 0"
        class="text-xs text-emerald-500/80 hover:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Trash2 class="w-3.5 h-3.5" />
        Clear all books from shelf
      </button>
    </div>

    <!-- Clear Books Modal -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-emerald-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-emerald-950 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div class="flex items-start gap-3">
          <div class="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 shrink-0">
            <Trash2 class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl font-bold font-display text-white">Clear all books?</h2>
            <p class="text-emerald-200/80 text-sm mt-2">
              This will permanently remove all {{ bookStore.books.length }} books and empty the Librarian's stash. This cannot be undone!
            </p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="showClearConfirm = false"
            class="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="clearAllBooks"
            class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
          >
            Clear all books
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
