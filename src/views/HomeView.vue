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
  LayoutGrid,
  LayoutList,
  BookOpen,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles
} from 'lucide-vue-next'

const router = useRouter()
const bookStore = useBookStore()

const searchQuery = ref<string>('')
const selectedStatus = ref<string>('all')
const viewMode = ref<'grid' | 'table'>('table')

const statusTabs = computed(() => [
  {
    id: 'all',
    label: 'All Books',
    count: bookStore.stats.total,
    activeClasses: 'bg-purple-900/80 text-purple-200 border-purple-400/50 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400/40',
    iconColor: 'text-purple-300',
    badgeActive: 'bg-purple-400 text-purple-950',
    icon: BookOpen
  },
  {
    id: 'to-read',
    label: 'To Read',
    count: bookStore.stats.toRead,
    activeClasses: 'bg-sky-900/80 text-sky-200 border-sky-400/50 shadow-lg shadow-sky-950/50 ring-1 ring-sky-400/40',
    iconColor: 'text-sky-300',
    badgeActive: 'bg-sky-400 text-sky-950',
    icon: Clock
  },
  {
    id: 'reading',
    label: 'Reading',
    count: bookStore.stats.reading,
    activeClasses: 'bg-emerald-900/80 text-emerald-200 border-emerald-400/50 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/40',
    iconColor: 'text-emerald-300',
    badgeActive: 'bg-emerald-400 text-emerald-950',
    icon: Bookmark
  },
  {
    id: 'finished',
    label: 'Finished 🍌',
    count: bookStore.stats.finished,
    activeClasses: 'bg-amber-900/80 text-amber-200 border-amber-400/60 shadow-lg shadow-amber-950/50 ring-1 ring-amber-400/40 font-bold',
    iconColor: 'text-amber-300',
    badgeActive: 'bg-amber-400 text-amber-950',
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

const handleView = (id: string): void => {
  router.push(`/book/${id}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Playful Banner / Banana Stash Banner -->
    <div class="bg-gradient-to-r from-emerald-900/60 via-emerald-800/40 to-amber-950/40 border border-emerald-700/40 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
      <div class="absolute -right-6 -bottom-6 text-7xl opacity-15 pointer-events-none select-none">
        🌿
      </div>
      <div class="flex items-center gap-4">
        <div class="relative flex-shrink-0">
          <img src="/src/assets/logo.png" alt="Ook Mascot" class="w-14 h-14 rounded-2xl border border-amber-400/40 shadow-lg object-cover" />
          <span class="absolute -top-2 -right-2 bg-amber-400 text-amber-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow">OOK!</span>
        </div>
        <div>
          <h2 class="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
            <span>The Librarian's Library</span>
            <span class="text-amber-400 text-lg">🍌</span>
          </h2>
          <p class="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
            You've collected <strong class="text-amber-300 font-bold">{{ bookStore.stats.finished }} Bananas</strong> (Finished books) for the stash!
          </p>
        </div>
      </div>

      <router-link
        to="/stats"
        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-amber-300 text-xs font-bold transition-all shrink-0 hover:scale-105"
      >
        <Sparkles class="w-4 h-4 text-amber-400" />
        <span>View Banana Stats</span>
      </router-link>
    </div>

    <!-- Status Filter Tabs Bar -->
    <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
      <button
        v-for="tab in statusTabs"
        :key="tab.id"
        @click="selectedStatus = tab.id"
        :class="[
          'w-full sm:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center sm:justify-start gap-2 cursor-pointer select-none',
          selectedStatus === tab.id
            ? tab.activeClasses
            : 'bg-emerald-950/60 border-emerald-900/60 text-emerald-300/70 hover:bg-emerald-900/50 hover:text-emerald-100'
        ]"
      >
        <component :is="tab.icon" :class="['w-4 h-4 shrink-0', selectedStatus === tab.id ? tab.iconColor : 'text-emerald-400/70']" />
        <span class="truncate">{{ tab.label }}</span>
        <span
          :class="[
            'ml-auto sm:ml-1 px-2 py-0.5 rounded-full text-xs font-bold transition-colors shrink-0',
            selectedStatus === tab.id
              ? tab.badgeActive
              : 'bg-emerald-900/80 text-emerald-300'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Search & Controls Bar -->
    <div class="bg-emerald-950/70 border border-emerald-900/70 rounded-2xl p-4 backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-lg">
      <!-- Search Input -->
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books by title or author... (Ook!)"
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-emerald-950/90 border border-emerald-800/80 text-emerald-100 text-sm placeholder-emerald-500/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
        />
      </div>

      <!-- View Toggles & Add Button -->
      <div class="flex items-center gap-3 justify-between sm:justify-end">
        <div class="flex bg-emerald-950 border border-emerald-800 rounded-xl p-1">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-colors cursor-pointer',
              viewMode === 'grid' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-emerald-400 hover:text-emerald-200'
            ]"
            title="Grid View"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-2 rounded-lg transition-colors cursor-pointer',
              viewMode === 'table' ? 'bg-amber-400 text-amber-950 font-bold' : 'text-emerald-400 hover:text-emerald-200'
            ]"
            title="Table View"
          >
            <LayoutList class="w-4 h-4" />
          </button>
        </div>

        <router-link
          to="/add"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4 stroke-[3]" />
          <span>Add Book</span>
        </router-link>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredBooks.length === 0"
      class="bg-emerald-950/40 border border-emerald-900/60 rounded-3xl p-12 text-center backdrop-blur-xl"
    >
      <div class="w-20 h-20 bg-emerald-900/40 border border-emerald-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400 text-4xl shadow-inner animate-banana">
        🍌
      </div>
      <h3 class="text-xl font-bold font-display text-white mb-2">Ook? No books found!</h3>
      <p class="text-emerald-300/70 text-sm max-w-md mx-auto mb-6">
        {{
          searchQuery || selectedStatus !== 'all'
            ? 'The Librarian searched every shelf, but found no books matching your filter.'
            : 'Your library is empty! Feed the Librarian by adding your first book now.'
        }}
      </p>
      <router-link
        to="/add"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/25"
      >
        <Plus class="w-4 h-4 stroke-[3]" />
        Add a Book 📚
      </router-link>
    </div>

    <!-- GRID VIEW -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="book in filteredBooks"
        :key="book.id"
        @click="handleView(book.id)"
        class="bg-gradient-to-b from-emerald-950/80 to-emerald-900/50 border border-emerald-800/80 hover:border-amber-400/50 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
      >
        <!-- Leaf Corner accent -->
        <div class="absolute -right-4 -top-4 w-12 h-12 bg-emerald-700/20 rounded-full blur-sm pointer-events-none"></div>

        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <StatusBadge :status="book.status" />
            <StarRating v-if="book.status === 'finished'" :model-value="book.rating" readonly size="sm" />
          </div>

          <h3 class="text-lg font-bold font-display text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
            {{ book.title }}
          </h3>
          <p class="text-emerald-300/80 text-sm mb-4 font-medium">by {{ book.author }}</p>

          <p v-if="book.notes" class="text-emerald-100/90 text-sm line-clamp-3 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800/60 mb-4 italic font-light">
            "{{ book.notes }}"
          </p>
        </div>

        <div class="pt-4 border-t border-emerald-800/60 flex items-center justify-between">
          <span class="text-xs text-emerald-400/60">
            {{ new Date(book.updatedAt || book.createdAt).toLocaleDateString() }}
          </span>
          <span class="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div v-else class="bg-emerald-950/70 border border-emerald-900/70 rounded-3xl backdrop-blur-xl overflow-hidden shadow-xl">
      <table class="w-full text-left text-sm text-emerald-100 table-fixed sm:table-auto">
        <thead class="bg-emerald-950/90 text-xs uppercase tracking-wider text-emerald-400 font-semibold border-b border-emerald-900/80">
          <tr>
            <th scope="col" class="px-4 py-3 sm:px-6 sm:py-4 font-semibold w-[45%] sm:w-auto">Title</th>
            <th scope="col" class="hidden sm:table-cell px-6 py-4 font-semibold">Author</th>
            <th scope="col" class="px-3 py-3 sm:px-6 sm:py-4 font-semibold w-[30%] sm:w-auto">Status</th>
            <th scope="col" class="hidden sm:table-cell px-6 py-4 font-semibold">Rating (Bananas 🍌)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-emerald-900/60">
          <tr
            v-for="book in filteredBooks"
            :key="book.id"
            @click="handleView(book.id)"
            class="hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <td class="px-4 py-3 sm:px-6 sm:py-4 align-top">
              <div class="font-bold text-white group-hover:text-amber-300 break-words">{{ book.title }}</div>
              <div class="text-emerald-300/70 text-xs mt-0.5 sm:hidden">{{ book.author }}</div>
              <StarRating
                v-if="book.status === 'finished'"
                :model-value="book.rating"
                readonly
                size="sm"
                class="mt-1.5 sm:hidden"
              />
            </td>
            <td class="hidden sm:table-cell px-6 py-4 text-emerald-200/90">
              {{ book.author }}
            </td>
            <td class="px-3 py-3 sm:px-6 sm:py-4 align-top">
              <StatusBadge :status="book.status" />
            </td>
            <td class="hidden sm:table-cell px-6 py-4">
              <StarRating v-if="book.status === 'finished'" :model-value="book.rating" readonly size="sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
