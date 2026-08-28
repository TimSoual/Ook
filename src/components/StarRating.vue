<script setup lang="ts">
import { Star } from 'lucide-vue-next'

interface Props {
  modelValue?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  useBananas?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  readonly: false,
  size: 'md',
  useBananas: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const setRating = (star: number): void => {
  if (!props.readonly) {
    emit('update:modelValue', star)
  }
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm w-4 h-4',
  md: 'text-lg w-6 h-6',
  lg: 'text-2xl w-8 h-8'
}
</script>

<template>
  <div class="flex items-center gap-1 select-none" :title="`${modelValue} / 5 Bananas`">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="setRating(star)"
      :class="[
        readonly ? 'cursor-default' : 'cursor-pointer transform hover:scale-125 active:scale-95 transition-all duration-150',
        'focus:outline-none flex items-center justify-center'
      ]"
      :aria-label="`Rate ${star} out of 5 bananas`"
    >
      <template v-if="useBananas">
        <span
          :class="[
            sizeClasses[size] || sizeClasses.md,
            star <= modelValue
              ? 'opacity-100 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] scale-105'
              : 'opacity-25 grayscale hover:opacity-60'
          ]"
        >
          🍌
        </span>
      </template>
      <template v-else>
        <Star
          :class="[
            sizeClasses[size] || sizeClasses.md,
            star <= modelValue
              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
              : 'fill-emerald-950 text-emerald-800/80 hover:text-emerald-700'
          ]"
        />
      </template>
    </button>
  </div>
</template>
