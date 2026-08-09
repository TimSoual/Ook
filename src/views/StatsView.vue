<script setup lang="ts">
import { useBookStore } from '../stores/bookStore'
import {
  BookOpen,
  Clock,
  Bookmark,
  CheckCircle2,
  BarChart3,
  Award,
  TrendingUp,
  Download
} from 'lucide-vue-next'

const bookStore = useBookStore()
</script>

<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <BarChart3 class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Reading Statistics</h1>
          <p class="text-sm text-slate-400">Overview and metrics of your reading collection.</p>
        </div>
      </div>

      <!-- CSV Export Button -->
      <button
        @click="bookStore.exportToCSV"
        :disabled="bookStore.books.length === 0"
        class="px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-md"
      >
        <Download class="w-4 h-4 text-emerald-400" />
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
        <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
          <BookOpen class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Total Books</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.total }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
        <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">To Read</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.toRead }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
        <div class="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
          <Bookmark class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Reading</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.reading }}</p>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl flex items-center gap-4">
        <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <CheckCircle2 class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Finished</p>
          <p class="text-2xl font-bold text-slate-100">{{ bookStore.stats.finished }}</p>
        </div>
      </div>
    </div>

    <!-- Rating & Breakdown Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Average Rating Card -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Award class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold text-slate-200">Average Rating</h2>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-extrabold text-amber-400">{{ bookStore.stats.avgRating }}</span>
          <span class="text-slate-400 text-sm">out of 5 stars</span>
        </div>
        <p class="text-slate-400 text-sm">Based on your ratings across {{ bookStore.stats.total }} books in your library.</p>
      </div>

      <!-- Completion Rate Card -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <TrendingUp class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-semibold text-slate-200">Completion Rate</h2>
        </div>
        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-extrabold text-emerald-400">
            {{ bookStore.stats.total > 0 ? Math.round((bookStore.stats.finished / bookStore.stats.total) * 100) : 0 }}%
          </span>
          <span class="text-slate-400 text-sm">completed</span>
        </div>
        <p class="text-slate-400 text-sm">
          {{ bookStore.stats.finished }} of {{ bookStore.stats.total }} books marked as finished.
        </p>
      </div>
    </div>
  </div>
</template>
