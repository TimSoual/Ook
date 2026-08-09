<script setup>
import { defineProps, defineEmits } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  readonly: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  }
})

const emit = defineEmits(['update:modelValue'])

const setRating = (star) => {
  if (!props.readonly) {
    emit('update:modelValue', star)
  }
}

const starSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7'
}
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :disabled="readonly"
      @click="setRating(star)"
      :class="[
        readonly ? 'cursor-default' : 'cursor-pointer transform hover:scale-115 transition-transform duration-150',
        'focus:outline-none'
      ]"
      :aria-label="`Rate ${star} out of 5 stars`"
    >
      <Star
        :class="[
          starSizeClasses[size] || starSizeClasses.md,
          star <= modelValue
            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
            : 'fill-slate-800 text-slate-600 hover:text-slate-500'
        ]"
      />
    </button>
  </div>
</template>
