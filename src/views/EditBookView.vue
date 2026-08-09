<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import BookForm from '../components/BookForm.vue'
import type { BookFormData } from '../types/book'
import { Edit3, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const bookId = computed<string>(() => route.params.id as string)
const book = computed(() => bookStore.getBookById(bookId.value))

const handleSave = (updatedData: BookFormData): void => {
  if (bookId.value) {
    bookStore.updateBook(bookId.value, updatedData)
    router.push('/')
  }
}

const handleCancel = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div v-if="book" class="space-y-6">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <Edit3 class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Edit Book</h1>
          <p class="text-sm text-slate-400">Update information for "{{ book.title }}"</p>
        </div>
      </div>

      <BookForm
        :initial-data="book"
        :is-edit="true"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-xl">
      <AlertCircle class="w-12 h-12 text-amber-400 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-slate-200 mb-2">Book Not Found</h3>
      <p class="text-slate-400 text-sm mb-6">The book you are trying to edit does not exist or has been deleted.</p>
      <router-link
        to="/"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
      >
        Return to Home
      </router-link>
    </div>
  </div>
</template>
