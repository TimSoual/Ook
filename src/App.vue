<script setup lang="ts">
import { Plus, WifiOff, BarChart3, BookOpen, Sparkles } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isOffline = ref<boolean>(!navigator.onLine)
const ookSaying = ref<string>('Ook!')
const showSaying = ref<boolean>(false)

const sayings = [
  'Ook! 🍌',
  'OOK!',
  'Ook? 📚',
  'Oooook! 🌴',
  'Ook ook! 🐵',
  'The Librarian approves! 🍌'
]

const speakOok = () => {
  const randomIndex = Math.floor(Math.random() * sayings.length)
  ookSaying.value = sayings[randomIndex]
  showSaying.value = true
  setTimeout(() => {
    showSaying.value = false
  }, 2200)
}

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
  <div class="min-h-screen jungle-bg text-emerald-50 flex flex-col font-sans relative overflow-x-hidden">
    <!-- Ambient Jungle Glows -->
    <div class="fixed top-0 left-1/4 w-[28rem] h-[28rem] bg-emerald-600/15 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
    <div class="fixed bottom-0 right-1/4 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    <div class="fixed top-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none -z-10"></div>

    <!-- Header Navigation -->
    <header class="sticky top-0 z-40 bg-[#031711]/85 backdrop-blur-xl border-b border-emerald-900/60 shadow-lg shadow-emerald-950/40">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <!-- Logo & Title -->
        <router-link to="/" class="flex items-center gap-3.5 group cursor-pointer select-none" @click="speakOok">
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <img
              src="/src/assets/logo.png"
              alt="Ook Orangutan Logo"
              class="w-11 h-11 rounded-xl object-cover relative z-10 border border-emerald-400/30 group-hover:scale-105 transition-transform duration-300 shadow-md"
            />
            <span class="absolute -bottom-1 -right-1 text-sm z-20 animate-banana">🍌</span>
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold font-display tracking-wide text-white group-hover:text-amber-300 transition-colors">
                Ook
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 shadow-inner uppercase tracking-wider flex items-center gap-1">
                <span>Discworld PWA</span>
              </span>
            </div>
            <span class="text-xs text-emerald-300/70 hidden sm:block font-medium">
              The Librarian's Book Tracker
            </span>
          </div>
        </router-link>

        <!-- Interactive Ook speech bubble -->
        <div v-if="showSaying" class="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-bold shadow-lg shadow-amber-400/20 animate-bounce">
          <Sparkles class="w-3.5 h-3.5" />
          <span>{{ ookSaying }}</span>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            v-if="isOffline"
            class="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-medium"
          >
            <WifiOff class="w-3.5 h-3.5" />
            <span>Offline</span>
          </div>

          <router-link
            to="/"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 border',
              route.path === '/'
                ? 'bg-emerald-900/80 text-amber-300 border-amber-400/40 shadow-md shadow-emerald-950/50'
                : 'text-emerald-200/80 border-transparent hover:text-white hover:bg-emerald-900/40'
            ]"
          >
            <BookOpen class="w-4 h-4 text-emerald-400" />
            <span class="hidden sm:inline">Bookshelf</span>
          </router-link>

          <router-link
            to="/stats"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 border',
              route.path === '/stats'
                ? 'bg-emerald-900/80 text-amber-300 border-amber-400/40 shadow-md shadow-emerald-950/50'
                : 'text-emerald-200/80 border-transparent hover:text-white hover:bg-emerald-900/40'
            ]"
          >
            <BarChart3 class="w-4 h-4 text-amber-400" />
            <span class="hidden sm:inline">Banana Stats</span>
          </router-link>

          <router-link
            to="/add"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-bold text-sm transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus class="w-4 h-4 stroke-[3]" />
            <span class="hidden sm:inline">Add Book</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
      <router-view v-slot="{ Component }">
        <transition name="jungle-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Playful Footer -->
    <footer class="border-t border-emerald-900/40 py-6 text-center text-xs text-emerald-400/60 font-medium">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="flex items-center gap-1.5">
          <span>Ook! Managed with care at the Unseen University Library.</span>
          <span>🍌</span>
        </p>
        <p class="text-emerald-500/50">"Do not turn down the corners of the pages!"</p>
      </div>
    </footer>
  </div>
</template>

<style>
.jungle-fade-enter-active,
.jungle-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.jungle-fade-enter-from,
.jungle-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
