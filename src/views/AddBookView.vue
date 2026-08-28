<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import BookForm from '../components/BookForm.vue'
import type { BookFormData } from '../types/book'
import { PlusCircle } from 'lucide-vue-next'

const router = useRouter()
const bookStore = useBookStore()

const handleSave = (bookData: BookFormData): void => {
  bookStore.addBook(bookData)
  router.push('/')
}

const handleCancel = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <div class="p-3 bg-amber-400/20 border border-amber-400/30 rounded-2xl text-amber-300 shadow-md">
        <PlusCircle class="w-6 h-6 text-amber-400" />
      </div>
      <div>
        <h1 class="text-2xl font-bold font-display text-white">Add New Book to Library</h1>
        <p class="text-xs sm:text-sm text-emerald-300/80">Feed the Librarian's collection with a new volume. Ook!</p>
      </div>
    </div>

    <BookForm :is-edit="false" @save="handleSave" @cancel="handleCancel" />
  </div>
</template>
