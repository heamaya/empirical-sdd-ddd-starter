<template>
  <div>
    <router-link to="/" class="text-sm text-indigo-600 hover:underline mb-6 inline-block">&larr; Back to plays</router-link>

    <p v-if="notFound" class="text-gray-500 text-sm mt-4">Play not found.</p>

    <template v-else>
      <form @submit.prevent="createPoem" class="mb-6 space-y-2">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Poem title"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          v-model="newBody"
          placeholder="Poem body (optional)"
          rows="4"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
        <p v-if="createError" class="text-red-600 text-sm">{{ createError }}</p>
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Add Poem
        </button>
      </form>

      <p v-if="poems.length === 0" class="text-gray-500 text-sm">Write your first poem</p>

      <ul class="space-y-3">
        <li
          v-for="poem in poems"
          :key="poem.id"
          class="bg-white border border-gray-200 rounded-md px-4 py-3"
        >
          <template v-if="editingId === poem.id">
            <div class="space-y-2">
              <input
                v-model="editTitle"
                type="text"
                class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                v-model="editBody"
                rows="4"
                class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
              <p v-if="editError" class="text-red-600 text-xs">{{ editError }}</p>
              <div class="flex gap-2">
                <button
                  @click="saveEdit(poem.id)"
                  class="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  @click="cancelEdit"
                  class="text-gray-500 px-3 py-1 rounded text-xs hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-start gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ poem.title }}</p>
                <p v-if="poem.body" class="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{{ poem.body }}</p>
              </div>
              <button
                v-if="poem.body.trim()"
                @click="requestReview(poem)"
                :disabled="reviewLoading[poem.id]"
                class="text-gray-400 hover:text-purple-600 text-xs px-2 py-1 rounded hover:bg-gray-100 shrink-0 disabled:opacity-50"
              >
                {{ reviewLoading[poem.id] ? 'Reviewing…' : 'Get Review' }}
              </button>
              <button
                v-if="poem.body.trim()"
                @click="requestComparison(poem)"
                :disabled="comparisonLoading[poem.id]"
                class="text-gray-400 hover:text-teal-600 text-xs px-2 py-1 rounded hover:bg-gray-100 shrink-0 disabled:opacity-50"
              >
                {{ comparisonLoading[poem.id] ? 'Comparing…' : 'Compare Poets' }}
              </button>
              <button
                @click="startEdit(poem)"
                class="text-gray-400 hover:text-indigo-600 text-xs px-2 py-1 rounded hover:bg-gray-100 shrink-0"
              >
                Edit
              </button>
              <button
                @click="deletePoem(poem)"
                class="text-gray-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-gray-100 shrink-0"
              >
                Delete
              </button>
            </div>

            <p v-if="reviewErrors[poem.id]" class="text-red-600 text-xs mt-2">{{ reviewErrors[poem.id] }}</p>
            <p v-if="comparisonErrors[poem.id]" class="text-red-600 text-xs mt-2">{{ comparisonErrors[poem.id] }}</p>

            <div v-if="reviews[poem.id]" class="mt-3 border-t border-gray-100 pt-3">
              <p class="text-xs font-semibold text-gray-700 mb-2">AI Review</p>
              <table class="w-full text-xs mb-3 border-collapse">
                <thead>
                  <tr class="text-left text-gray-500">
                    <th class="pr-3 pb-1 font-medium w-24">Aspect</th>
                    <th class="pr-3 pb-1 font-medium w-12">Score</th>
                    <th class="pb-1 font-medium">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="aspect in ['rhythm', 'imagery', 'emotion', 'structure']" :key="aspect" class="border-t border-gray-100">
                    <td class="pr-3 py-1 capitalize text-gray-700">{{ aspect }}</td>
                    <td class="pr-3 py-1 text-gray-900 font-medium">{{ reviews[poem.id]!.grades[aspect as keyof typeof reviews[poem.id]['grades']].score }}/5</td>
                    <td class="py-1 text-gray-600">{{ reviews[poem.id]!.grades[aspect as keyof typeof reviews[poem.id]['grades']].rationale }}</td>
                  </tr>
                </tbody>
              </table>
              <p class="text-xs font-semibold text-gray-700 mb-1">Suggestions</p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="(s, i) in reviews[poem.id]!.suggestions" :key="i" class="text-xs text-gray-600">{{ s }}</li>
              </ul>
            </div>

            <div v-if="comparisons[poem.id]" class="mt-3 border-t border-gray-100 pt-3">
              <p class="text-xs font-semibold text-gray-700 mb-2">Poet Comparisons</p>
              <div
                v-for="entry in comparisons[poem.id]"
                :key="entry.name"
                class="mb-2 last:mb-0"
              >
                <p class="text-xs font-bold text-gray-800">{{ entry.name }}</p>
                <p class="text-xs text-gray-600 mt-0.5">{{ entry.explanation }}</p>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface Poem {
  id: number
  play_id: number
  title: string
  body: string
  created_at: string
}

interface GradeDetail {
  score: number
  rationale: string
}

interface Review {
  poem_id: number
  grades: {
    rhythm: GradeDetail
    imagery: GradeDetail
    emotion: GradeDetail
    structure: GradeDetail
  }
  suggestions: string[]
  created_at: string
}

interface PoetEntry {
  name: string
  explanation: string
}

const route = useRoute()
const playId = Number(route.params.id)

const poems = ref<Poem[]>([])
const notFound = ref(false)

const newTitle = ref('')
const newBody = ref('')
const createError = ref('')

const editingId = ref<number | null>(null)
const editTitle = ref('')
const editBody = ref('')
const editError = ref('')

const reviews = ref<Record<number, Review>>({})
const reviewLoading = ref<Record<number, boolean>>({})
const reviewErrors = ref<Record<number, string>>({})

const comparisons = ref<Record<number, PoetEntry[]>>({})
const comparisonLoading = ref<Record<number, boolean>>({})
const comparisonErrors = ref<Record<number, string>>({})

async function fetchPoems() {
  const res = await fetch(`/plays/${playId}/poems`)
  if (res.status === 404) {
    notFound.value = true
    return
  }
  const data: Poem[] = await res.json()
  poems.value = data
  for (const poem of data) {
    if (poem.body.trim()) {
      fetchExistingReview(poem.id)
      fetchExistingComparison(poem.id)
    }
  }
}

async function fetchExistingReview(poemId: number) {
  const res = await fetch(`/plays/${playId}/poems/${poemId}/review`)
  if (res.ok) {
    const data: Review = await res.json()
    reviews.value = { ...reviews.value, [poemId]: data }
  }
}

async function fetchExistingComparison(poemId: number) {
  const res = await fetch(`/plays/${playId}/poems/${poemId}/comparison`)
  if (res.ok) {
    const data: { poem_id: number; poets: PoetEntry[]; created_at: string } = await res.json()
    comparisons.value = { ...comparisons.value, [poemId]: data.poets }
  }
}

async function requestComparison(poem: Poem) {
  comparisonErrors.value = { ...comparisonErrors.value, [poem.id]: '' }
  comparisonLoading.value = { ...comparisonLoading.value, [poem.id]: true }

  try {
    const res = await fetch(`/plays/${playId}/poems/${poem.id}/comparison`, { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      if (res.status === 400) {
        comparisonErrors.value = { ...comparisonErrors.value, [poem.id]: data.error ?? 'Poem body is empty' }
      } else if (res.status === 503) {
        comparisonErrors.value = { ...comparisonErrors.value, [poem.id]: 'AI comparison is unavailable: API key not configured' }
      } else {
        comparisonErrors.value = { ...comparisonErrors.value, [poem.id]: data.error ?? 'Comparison failed' }
      }
      return
    }

    comparisons.value = { ...comparisons.value, [poem.id]: data.poets as PoetEntry[] }
  } finally {
    comparisonLoading.value = { ...comparisonLoading.value, [poem.id]: false }
  }
}

async function requestReview(poem: Poem) {
  reviewErrors.value = { ...reviewErrors.value, [poem.id]: '' }
  reviewLoading.value = { ...reviewLoading.value, [poem.id]: true }

  try {
    const res = await fetch(`/plays/${playId}/poems/${poem.id}/review`, { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      if (res.status === 400) {
        reviewErrors.value = { ...reviewErrors.value, [poem.id]: data.error ?? 'Poem body is empty' }
      } else if (res.status === 503) {
        reviewErrors.value = { ...reviewErrors.value, [poem.id]: 'AI review is unavailable: API key not configured' }
      } else {
        reviewErrors.value = { ...reviewErrors.value, [poem.id]: data.error ?? 'Review failed' }
      }
      return
    }

    reviews.value = { ...reviews.value, [poem.id]: data as Review }
  } finally {
    reviewLoading.value = { ...reviewLoading.value, [poem.id]: false }
  }
}

async function createPoem() {
  createError.value = ''
  const title = newTitle.value.trim()

  if (!title) {
    createError.value = 'Title cannot be empty'
    return
  }

  const res = await fetch(`/plays/${playId}/poems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body: newBody.value.trim() }),
  })

  if (!res.ok) {
    const data = await res.json()
    createError.value = data.error ?? 'Failed to create poem'
    return
  }

  newTitle.value = ''
  newBody.value = ''
  await fetchPoems()
}

function startEdit(poem: Poem) {
  editingId.value = poem.id
  editTitle.value = poem.title
  editBody.value = poem.body
  editError.value = ''
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
  editBody.value = ''
  editError.value = ''
}

async function saveEdit(id: number) {
  editError.value = ''
  const title = editTitle.value.trim()

  if (!title) {
    editError.value = 'Title cannot be empty'
    return
  }

  const res = await fetch(`/plays/${playId}/poems/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body: editBody.value.trim() }),
  })

  if (!res.ok) {
    const data = await res.json()
    editError.value = data.error ?? 'Failed to update poem'
    return
  }

  editingId.value = null
  await fetchPoems()
}

async function deletePoem(poem: Poem) {
  if (!window.confirm(`Delete "${poem.title}"? This cannot be undone.`)) return

  const res = await fetch(`/plays/${playId}/poems/${poem.id}`, { method: 'DELETE' })

  if (!res.ok && res.status !== 404) {
    window.alert('Failed to delete poem')
    return
  }

  await fetchPoems()
}

onMounted(fetchPoems)
</script>
