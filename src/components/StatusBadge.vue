<script setup lang="ts">
import type { BookStatus } from '../types/book'

interface Props {
  status: BookStatus | string
}

defineProps<Props>()

const statusConfig: Record<string, { label: string; classes: string }> = {
  'to-read': {
    label: 'To Read',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  'reading': {
    label: 'Reading',
    classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
  },
  'finished': {
    label: 'Finished',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  }
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm shadow-sm',
      statusConfig[status]?.classes || 'bg-slate-800 text-slate-300 border-slate-700'
    ]"
  >
    <span
      :class="[
        'w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse',
        status === 'reading' ? 'bg-indigo-400' : status === 'finished' ? 'bg-emerald-400' : 'bg-amber-400'
      ]"
    ></span>
    {{ statusConfig[status]?.label || status }}
  </span>
</template>
