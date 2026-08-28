<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import BookForm from '../components/BookForm.vue'
import type { BookFormData } from '../types/book'
import { Edit3, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const showDeleteConfirm = ref(false)

const bookId = computed<string>(() => route.params.id as string)
const book = computed(() => bookStore.getBookById(bookId.value))

const handleSave = (updatedData: BookFormData): void => {
  if (bookId.value) {
    bookStore.updateBook(bookId.value, updatedData)
    router.push(`/book/${bookId.value}`)
  }
}

const handleCancel = (): void => {
  router.push(`/book/${bookId.value}`)
}

const executeDelete = (): void => {
  if (bookId.value) {
    bookStore.deleteBook(bookId.value)
    router.push('/')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div v-if="book" class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-3 bg-amber-400/20 border border-amber-400/30 rounded-2xl text-amber-300 shadow-md">
          <Edit3 class="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 class="text-2xl font-bold font-display text-white">Edit Book Details</h1>
          <p class="text-xs sm:text-sm text-emerald-300/80">Updating catalog entry for "{{ book.title }}"</p>
        </div>
      </div>

      <BookForm
        :initial-data="book"
        :is-edit="true"
        @save="handleSave"
        @cancel="handleCancel"
        @delete="showDeleteConfirm = true"
      />
    </div>

    <div v-else class="bg-emerald-950/60 border border-emerald-900/80 rounded-3xl p-12 text-center backdrop-blur-xl">
      <AlertCircle class="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <h3 class="text-xl font-bold font-display text-white mb-2">Book Not Found</h3>
      <p class="text-emerald-300/70 text-sm mb-6">Ook? The book you are trying to edit does not exist on the shelf.</p>
      <router-link
        to="/"
        class="inline-flex items-center px-5 py-2.5 bg-amber-400 text-amber-950 font-bold text-sm rounded-xl transition-all shadow-md"
      >
        Return to Bookshelf
      </router-link>
    </div>

    <div
      v-if="showDeleteConfirm && book"
      class="fixed inset-0 bg-emerald-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div class="bg-emerald-950 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="text-xl font-bold font-display text-white">Confirm Book Deletion</h3>
        <p class="text-emerald-200/80 text-sm">
          Are you sure you want to remove <span class="font-bold text-amber-300">"{{ book.title }}"</span> from the library?
        </p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
          >
            Delete Book
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
