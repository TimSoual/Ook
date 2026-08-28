<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import StarRating from './StarRating.vue'
import { BookOpen, User, Tag, FileText, CheckCircle2, ArrowLeft, Trash2, Calendar } from 'lucide-vue-next'
import type { Book, BookFormData, BookStatus } from '../types/book'

interface Props {
  initialData?: Partial<Book>
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    title: '',
    author: '',
    status: 'to-read',
    rating: 5,
    notes: ''
  }),
  isEdit: false
})

const emit = defineEmits<{
  (e: 'save', data: BookFormData): void
  (e: 'cancel'): void
  (e: 'delete'): void
}>()

const router = useRouter()

const formData = ref<BookFormData>({
  title: '',
  author: '',
  status: 'to-read',
  rating: 5,
  notes: '',
  startedAt: '',
  finishedAt: ''
})

const errors = ref({
  title: '',
  author: ''
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        title: newVal.title || '',
        author: newVal.author || '',
        status: (newVal.status as BookStatus) || 'to-read',
        rating: newVal.rating || 5,
        notes: newVal.notes || '',
        startedAt: newVal.startedAt ? newVal.startedAt.slice(0, 10) : '',
        finishedAt: newVal.finishedAt ? newVal.finishedAt.slice(0, 10) : ''
      }
    }
  },
  { immediate: true, deep: true }
)

const validate = (): boolean => {
  let isValid = true
  errors.value = { title: '', author: '' }

  if (!formData.value.title.trim()) {
    errors.value.title = 'Book title is required'
    isValid = false
  }

  if (!formData.value.author.trim()) {
    errors.value.author = 'Author name is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = (): void => {
  if (!validate()) return
  emit('save', { ...formData.value })
}

const handleCancel = (): void => {
  emit('cancel')
  router.push('/')
}
</script>

<template>
  <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <BookOpen class="w-4 h-4 text-indigo-400" />
          Book Title <span class="text-rose-400">*</span>
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          placeholder="e.g. The Hobbit"
          :class="[
            'w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200',
            errors.title ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/40'
          ]"
        />
        <p v-if="errors.title" class="mt-1.5 text-sm text-rose-400 flex items-center gap-1">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label for="author" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <User class="w-4 h-4 text-indigo-400" />
          Author <span class="text-rose-400">*</span>
        </label>
        <input
          id="author"
          v-model="formData.author"
          type="text"
          placeholder="e.g. J.R.R. Tolkien"
          :class="[
            'w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200',
            errors.author ? 'border-rose-500 focus:ring-rose-500/50' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/40'
          ]"
        />
        <p v-if="errors.author" class="mt-1.5 text-sm text-rose-400 flex items-center gap-1">
          {{ errors.author }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="status" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Tag class="w-4 h-4 text-indigo-400" />
            Reading Status
          </label>
          <select
            id="status"
            v-model="formData.status"
            class="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 cursor-pointer"
          >
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            Rating
          </label>
          <div class="px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between min-h-[50px]">
            <StarRating v-model="formData.rating" size="lg" />
            <span class="text-sm font-semibold text-slate-400">{{ formData.rating }} / 5</span>
          </div>
        </div>
      </div>

      <div v-if="isEdit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="startedAt" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-indigo-400" />
            Started At
          </label>
          <input
            id="startedAt"
            v-model="formData.startedAt"
            type="date"
            class="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200"
          />
        </div>

        <div>
          <label for="finishedAt" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Calendar class="w-4 h-4 text-indigo-400" />
            Finished At
          </label>
          <input
            id="finishedAt"
            v-model="formData.finishedAt"
            type="date"
            class="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label for="notes" class="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <FileText class="w-4 h-4 text-indigo-400" />
          Notes & Thoughts
        </label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="4"
          placeholder="Write your review, key takeaways, or thoughts about this book..."
          class="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition-all duration-200 resize-y min-h-[120px]"
        ></textarea>
      </div>

      <div class="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="handleCancel"
            class="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft class="w-4 h-4" />
            Cancel
          </button>

          <button
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 class="w-4 h-4" />
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80"  v-if="isEdit">
        <button
         
          type="button"
          @click="emit('delete')"
          class="px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Trash2 class="w-4 h-4" />
          Delete
        </button>
      </div>
    </form>
  </div>
</template>
