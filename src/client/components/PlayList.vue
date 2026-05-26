<template>
  <div>
    <form @submit.prevent="createPlay" class="flex gap-2 mb-6">
      <input
        v-model="newName"
        type="text"
        placeholder="New play name"
        class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
      >
        Create
      </button>
    </form>

    <p v-if="createError" class="text-red-600 text-sm mb-4">{{ createError }}</p>

    <p v-if="plays.length === 0" class="text-gray-500 text-sm">
      Create your first play to get started
    </p>

    <ul class="space-y-2">
      <li
        v-for="play in plays"
        :key="play.id"
        class="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-3"
      >
        <template v-if="editingId === play.id">
          <input
            v-model="editName"
            type="text"
            class="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter="saveRename(play.id)"
            @keydown.escape="cancelRename"
            @blur="saveRename(play.id)"
            ref="editInput"
          />
          <p v-if="renameError" class="text-red-600 text-xs">{{ renameError }}</p>
        </template>
        <template v-else>
          <router-link
            :to="'/plays/' + play.id"
            class="flex-1 text-sm text-gray-800 hover:text-indigo-600 hover:underline"
          >{{ play.name }}</router-link>
          <button
            @click="startRename(play)"
            class="text-gray-400 hover:text-indigo-600 text-xs px-2 py-1 rounded hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            @click="deletePlay(play)"
            class="text-gray-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-gray-100"
          >
            Delete
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Play {
  id: number
  name: string
  created_at: string
}

const plays = ref<Play[]>([])
const newName = ref('')
const createError = ref('')

const editingId = ref<number | null>(null)
const editName = ref('')
const renameError = ref('')
const editInput = ref<HTMLInputElement | null>(null)

async function fetchPlays() {
  const res = await fetch('/plays')
  plays.value = await res.json()
}

async function createPlay() {
  createError.value = ''
  const name = newName.value.trim()

  if (!name) {
    createError.value = 'Name cannot be empty'
    return
  }

  const res = await fetch('/plays', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!res.ok) {
    const data = await res.json()
    createError.value = data.error ?? 'Failed to create play'
    return
  }

  newName.value = ''
  await fetchPlays()
}

function startRename(play: Play) {
  editingId.value = play.id
  editName.value = play.name
  renameError.value = ''
  nextTick(() => {
    editInput.value?.focus()
  })
}

function cancelRename() {
  editingId.value = null
  editName.value = ''
  renameError.value = ''
}

async function saveRename(id: number) {
  if (editingId.value !== id) return

  const name = editName.value.trim()
  if (!name) {
    renameError.value = 'Name cannot be empty'
    return
  }

  const res = await fetch(`/plays/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!res.ok) {
    const data = await res.json()
    renameError.value = data.error ?? 'Failed to rename play'
    return
  }

  editingId.value = null
  await fetchPlays()
}

async function deletePlay(play: Play) {
  if (!window.confirm(`Delete "${play.name}"? This cannot be undone.`)) return

  const res = await fetch(`/plays/${play.id}`, { method: 'DELETE' })

  if (!res.ok && res.status !== 404) {
    window.alert('Failed to delete play')
    return
  }

  await fetchPlays()
}

onMounted(fetchPlays)
</script>
