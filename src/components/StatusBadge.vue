<script setup lang="ts">
import type { BookStatus } from '../types/book'

interface Props {
  status: BookStatus | string
}

defineProps<Props>()

const statusConfig: Record<string, { label: string; icon: string; classes: string }> = {
  'to-read': {
    label: 'To Read',
    icon: '⏳',
    classes: 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-sm shadow-sky-500/10'
  },
  'reading': {
    label: 'Reading',
    icon: '🌿',
    classes: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-sm shadow-emerald-500/10'
  },
  'finished': {
    label: 'Finished',
    icon: '🍌',
    classes: 'bg-amber-400/25 text-amber-300 border-amber-400/60 shadow-sm shadow-amber-400/15 font-bold'
  }
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors',
      statusConfig[status]?.classes || 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
    ]"
  >
    <span class="text-xs">{{ statusConfig[status]?.icon }}</span>
    <span>{{ statusConfig[status]?.label || status }}</span>
  </span>
</template>
