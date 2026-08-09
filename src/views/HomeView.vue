<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import StarRating from '../components/StarRating.vue'
import StatusBadge from '../components/StatusBadge.vue'
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  LayoutGrid,
  LayoutList,
  BookOpen,
  Filter,
  Star,
  CheckCircle2,
  Clock,
  Bookmark
} from 'lucide-vue-next'

const router = useRouter()
const bookStore = useBookStore()

const searchQuery = ref('')
const selectedStatus = ref('all')
const viewMode = ref('grid') // 'grid' | 'table'

// Confirm modal state
const bookToDelete = ref(null)

const filteredBooks = computed(() => {
  return bookStore.books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedStatus.value === 'all' || book.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const handleEdit = (id) => {
  router.push(`/edit/${id}`)
}

const confirmDelete = (book) => {
  bookToDelete.value = book
}

const executeDelete = () => {
  if (bookToDelete.value) {
    bookStore.deleteBook(bookToDelete.value.id)
    bookToDelete.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner / Stats summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3">
        <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <BookOpen class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Total Books</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.total }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3">
        <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <Clock class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">To Read</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.toRead }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3">
        <div class="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
          <Bookmark class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Reading</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.reading }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-3">
        <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <CheckCircle2 class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Finished</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.finished }}</p>
        </div>
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
      <!-- Search & Filter Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <!-- Search bar -->
        <div class="relative flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books by title or author..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative min-w-[160px]">
          <Filter class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            v-model="selectedStatus"
            class="w-full pl-10 pr-8 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 justify-between sm:justify-end">
        <!-- View mode toggle -->
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

        <!-- CSV Export Button -->
        <button
          @click="bookStore.exportToCSV"
          :disabled="bookStore.books.length === 0"
          class="px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download class="w-4 h-4 text-emerald-400" />
          <span class="hidden sm:inline">Export CSV</span>
        </button>

        <!-- Add Book Button -->
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
