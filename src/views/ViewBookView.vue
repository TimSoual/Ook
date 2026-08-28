<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import StarRating from '../components/StarRating.vue'
import StatusBadge from '../components/StatusBadge.vue'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit2,
  FileText,
  User,
  Sparkles
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const bookId = computed<string>(() => route.params.id as string)
const book = computed(() => bookStore.getBookById(bookId.value))

const formatDate = (date?: string): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleFinish = (): void => {
  if (bookId.value) {
    bookStore.updateBook(bookId.value, { status: 'finished' })
  }
}

const handleStart = (): void => {
  if (bookId.value) {
    bookStore.updateBook(bookId.value, { status: 'reading' })
  }
}

const handleEdit = (): void => {
  router.push(`/edit/${bookId.value}`)
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <router-link
      to="/"
      class="inline-flex items-center gap-2 text-sm text-emerald-300/80 hover:text-amber-300 font-semibold transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      Back to Bookshelf
    </router-link>

    <div v-if="book" class="space-y-6">
      <div class="bg-emerald-950/80 border border-emerald-900/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2 min-w-0">
            <StatusBadge :status="book.status" />
            <h1 class="text-2xl md:text-3xl font-bold font-display text-white break-words">
              {{ book.title }}
            </h1>
            <p class="text-emerald-300/80 flex items-center gap-2 font-medium">
              <User class="w-4 h-4 shrink-0 text-amber-400" />
              <span>{{ book.author }}</span>
            </p>
          </div>
          <div class="p-3 bg-amber-400/20 border border-amber-400/30 rounded-2xl text-amber-300 shrink-0 shadow-md">
            <BookOpen class="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <div v-if="book.status === 'finished'" class="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-950/90 border border-emerald-800/80 rounded-2xl">
          <span class="text-xs font-bold text-emerald-300 uppercase tracking-wider">Librarian Rating</span>
          <div class="flex items-center gap-2">
            <StarRating :model-value="book.rating" readonly size="md" />
            <span class="text-sm font-bold text-amber-300">{{ book.rating }} / 5 🍌</span>
          </div>
        </div>

        <div v-if="book.notes" class="space-y-2">
          <h2 class="text-sm font-semibold text-emerald-200 flex items-center gap-2">
            <FileText class="w-4 h-4 text-amber-400" />
            Notes & Librarian Review
          </h2>
          <p class="text-emerald-100 text-sm leading-relaxed bg-emerald-950/90 p-4 rounded-2xl border border-emerald-800/60 italic font-light whitespace-pre-wrap">
            "{{ book.notes }}"
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="px-4 py-3 bg-emerald-950/50 border border-emerald-900/60 rounded-2xl">
            <p class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-400" />
              Added to Shelf
            </p>
            <p class="text-sm font-semibold text-white">{{ formatDate(book.createdAt) }}</p>
          </div>
          <div class="px-4 py-3 bg-emerald-950/50 border border-emerald-900/60 rounded-2xl">
            <p class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-400" />
              Started
            </p>
            <p class="text-sm font-semibold text-white">{{ formatDate(book.startedAt ?? book.createdAt) }}</p>
          </div>
          <div v-if="book.finishedAt" class="px-4 py-3 bg-emerald-950/50 border border-emerald-900/60 rounded-2xl">
            <p class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-400" />
              Finished
            </p>
            <p class="text-sm font-semibold text-amber-300">{{ formatDate(book.finishedAt) }} 🍌</p>
          </div>
          <div class="px-4 py-3 bg-emerald-950/50 border border-emerald-900/60 rounded-2xl">
            <p class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-amber-400" />
              Last Updated
            </p>
            <p class="text-sm font-semibold text-white">{{ formatDate(book.updatedAt) }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-emerald-900/80">
          <button
            v-if="book.status === 'reading'"
            @click="handleFinish"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 class="w-4 h-4 stroke-[3]" />
            Mark as Finished 🍌
          </button>
          <button
            v-if="book.status === 'to-read'"
            @click="handleStart"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles class="w-4 h-4" />
            Mark as Reading
          </button>
          <button
            @click="handleEdit"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-emerald-700/60 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 class="w-4 h-4" />
            Edit Book Details
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-emerald-950/60 border border-emerald-900/80 rounded-3xl p-12 text-center backdrop-blur-xl">
      <AlertCircle class="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <h3 class="text-xl font-bold font-display text-white mb-2">Book Not Found</h3>
      <p class="text-emerald-300/70 text-sm mb-6">Ook? This book does not exist or has been removed from the library shelves.</p>
      <router-link
        to="/"
        class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-bold text-sm rounded-xl transition-all shadow-md"
      >
        Return to Bookshelf
      </router-link>
    </div>
  </div>
</template>
