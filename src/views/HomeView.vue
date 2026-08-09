<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import StarRating from '../components/StarRating.vue'
import StatusBadge from '../components/StatusBadge.vue'
import type { Book } from '../types/book'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  LayoutList,
  BookOpen,
  Clock,
  Bookmark,
  CheckCircle2
} from 'lucide-vue-next'

const router = useRouter()
const bookStore = useBookStore()

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('all')
const viewMode = ref<'grid' | 'table'>('grid')

// Confirm modal state
const bookToDelete = ref<Book | null>(null)

const statusTabs = computed(() => [
  {
    id: 'all',
    label: 'All Books',
    count: bookStore.stats.total,
    activeClasses: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500',
    icon: BookOpen
  },
  {
    id: 'to-read',
    label: 'To Read',
    count: bookStore.stats.toRead,
    activeClasses: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30',
    icon: Clock
  },
  {
    id: 'reading',
    label: 'Reading',
    count: bookStore.stats.reading,
    activeClasses: 'bg-sky-500/20 text-sky-300 border-sky-500/40 ring-1 ring-sky-500/30',
    icon: Bookmark
  },
  {
    id: 'finished',
    label: 'Finished',
    count: bookStore.stats.finished,
    activeClasses: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30',
    icon: CheckCircle2
  }
])

const filteredBooks = computed<Book[]>(() => {
  return bookStore.books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'all' || book.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const handleEdit = (id: string): void => {
  router.push(`/edit/${id}`)
}

const confirmDelete = (book: Book): void => {
  bookToDelete.value = book
}

const executeDelete = (): void => {
  if (bookToDelete.value) {
    bookStore.deleteBook(bookToDelete.value.id)
    bookToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Prominent Status Filter Pills Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        v-for="tab in statusTabs"
        :key="tab.id"
        @click="selectedStatus = tab.id"
        :class="[
          'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap cursor-pointer select-none',
          selectedStatus === tab.id
            ? tab.activeClasses
            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
        <span
          :class="[
            'ml-1 px-2 py-0.5 rounded-full text-xs font-bold transition-colors',
            selectedStatus === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-slate-800 text-slate-400'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Secondary Search & Controls Bar -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books by title or author..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      <!-- View Toggles & Add Button -->
      <div class="flex items-center gap-3 justify-between sm:justify-end">
        <div class="flex bg-slate-950/70 border border-slate-800 rounded-xl p-1">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-colors cursor-pointer',
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            ]"
            title="Grid View"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-2 rounded-lg transition-colors cursor-pointer',
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            ]"
            title="Table View"
          >
            <LayoutList class="w-4 h-4" />
          </button>
        </div>

        <router-link
          to="/add"
          class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Add Book</span>
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredBooks.length === 0"
      class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center backdrop-blur-xl"
    >
      <div class="w-16 h-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
        <BookOpen class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-semibold text-slate-200 mb-1">No books found</h3>
      <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">
        {{
          searchQuery || selectedStatus !== 'all'
            ? 'No books match your filter criteria. Try resetting filters.'
            : 'Your library is empty. Start adding your favorite books now!'
        }}
      </p>
      <router-link
        to="/add"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20"
      >
        <Plus class="w-4 h-4" />
        Add Your First Book
      </router-link>
    </div>

    <!-- GRID VIEW -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="book in filteredBooks"
        :key="book.id"
        class="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-500/5"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <StatusBadge :status="book.status" />
            <StarRating :model-value="book.rating" readonly size="sm" />
          </div>

          <h3 class="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {{ book.title }}
          </h3>
          <p class="text-slate-400 text-sm mb-4 font-medium">by {{ book.author }}</p>

          <p v-if="book.notes" class="text-slate-300 text-sm line-clamp-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 mb-4 italic font-light">
            "{{ book.notes }}"
          </p>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <span class="text-xs text-slate-500">
            {{ new Date(book.updatedAt || book.createdAt).toLocaleDateString() }}
          </span>
          <div class="flex items-center gap-1">
            <button
              @click="handleEdit(book.id)"
              class="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Book"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button
              @click="confirmDelete(book)"
              class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete Book"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else class="bg-slate-900/70 border border-slate-800 rounded-2xl backdrop-blur-xl overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold">Title</th>
              <th scope="col" class="px-6 py-4 font-semibold">Author</th>
              <th scope="col" class="px-6 py-4 font-semibold">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold">Rating</th>
              <th scope="col" class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80">
            <tr
              v-for="book in filteredBooks"
              :key="book.id"
              class="hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-6 py-4 font-semibold text-slate-100">
                {{ book.title }}
              </td>
              <td class="px-6 py-4 text-slate-300">
                {{ book.author }}
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="book.status" />
              </td>
              <td class="px-6 py-4">
                <StarRating :model-value="book.rating" readonly size="sm" />
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="handleEdit(book.id)"
                    class="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(book)"
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="bookToDelete"
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 class="text-xl font-bold text-slate-100">Confirm Deletion</h3>
        <p class="text-slate-300 text-sm">
          Are you sure you want to delete <span class="font-semibold text-indigo-400">"{{ bookToDelete.title }}"</span>? This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="bookToDelete = null"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-lg shadow-rose-600/25 transition-colors cursor-pointer"
          >
            Delete Book
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
