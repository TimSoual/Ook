<script setup lang="ts">
import { Library, Plus, WifiOff, BarChart3, BookOpen } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOffline = ref<boolean>(!navigator.onLine)

const updateOnlineStatus = (): void => {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
    <!-- Ambient Background Glows -->
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
    <div class="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

    <header class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Library class="w-6 h-6 text-white" />
          </div>
          <div>
            <span class="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              BookTracker
            </span>
            <span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              PWA
            </span>
          </div>
        </router-link>

        <div class="flex items-center gap-2 sm:gap-3">
          <div
            v-if="isOffline"
            class="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-medium"
          >
            <WifiOff class="w-3.5 h-3.5" />
            <span>Offline</span>
          </div>

          <router-link
            to="/"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              route.path === '/' ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            ]"
          >
            <BookOpen class="w-4 h-4" />
            <span class="hidden sm:inline">Books</span>
          </router-link>

          <router-link
            to="/stats"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
              route.path === '/stats' ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            ]"
          >
            <BarChart3 class="w-4 h-4" />
            <span class="hidden sm:inline">Stats</span>
          </router-link>

          <router-link
            to="/add"
            class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus class="w-4 h-4" />
            <span class="hidden sm:inline">Add Book</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
