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
  User
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

const handleEdit = (): void => {
  router.push(`/edit/${bookId.value}`)
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <router-link
      to="/"
      class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      Back to library
    </router-link>

    <div v-if="book" class="space-y-6">
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2 min-w-0">
            <StatusBadge :status="book.status" />
            <h1 class="text-2xl md:text-3xl font-bold text-slate-100 break-words">
              {{ book.title }}
            </h1>
            <p class="text-slate-400 flex items-center gap-2">
              <User class="w-4 h-4 shrink-0" />
              <span>{{ book.author }}</span>
            </p>
          </div>
          <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
            <BookOpen class="w-6 h-6" />
          </div>
        </div>

        <div v-if="book.status === 'finished'" class="flex items-center gap-3 px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span class="text-sm font-medium text-slate-400">Rating</span>
          <StarRating :model-value="book.rating" readonly size="md" />
          <span class="text-sm font-semibold text-slate-400">{{ book.rating }} / 5</span>
        </div>

        <div v-if="book.notes" class="space-y-2">
          <h2 class="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileText class="w-4 h-4 text-indigo-400" />
            Notes & Thoughts
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 italic font-light whitespace-pre-wrap">
            {{ book.notes }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              Added
            </p>
            <p class="text-sm text-slate-200">{{ formatDate(book.createdAt) }}</p>
          </div>
          <div class="px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              Started
            </p>
            <p class="text-sm text-slate-200">{{ formatDate(book.startedAt ?? book.createdAt) }}</p>
          </div>
          <div v-if="book.finishedAt" class="px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              Finished
            </p>
            <p class="text-sm text-slate-200">{{ formatDate(book.finishedAt) }}</p>
          </div>
          <div class="px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5" />
              Last Updated
            </p>
            <p class="text-sm text-slate-200">{{ formatDate(book.updatedAt) }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-800/80">
          <button
            v-if="book.status === 'reading'"
            @click="handleFinish"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 class="w-4 h-4" />
            Mark as Finished
          </button>
          <button
            @click="handleEdit"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 class="w-4 h-4" />
            Edit Book
          </button>
        </div>
      </div>
    </div>

    <div v-else class="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-xl">
      <AlertCircle class="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-slate-200 mb-2">Book Not Found</h3>
      <p class="text-slate-400 text-sm mb-6">This book does not exist or has been deleted.</p>
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
      >
        Return to Home
      </router-link>
    </div>
  </div>
</template>
