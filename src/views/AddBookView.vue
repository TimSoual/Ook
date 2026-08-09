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
      <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
        <PlusCircle class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-100">Add New Book</h1>
        <p class="text-sm text-slate-400">Fill in the details to add a new book to your personal library.</p>
      </div>
    </div>

    <BookForm :is-edit="false" @save="handleSave" @cancel="handleCancel" />
  </div>
</template>
