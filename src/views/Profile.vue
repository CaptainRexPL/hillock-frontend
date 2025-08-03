<template>
  <div class="profile container mt-4">
    <h1>Your profile</h1>
    <div v-if="user">
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>
      <p><strong>Pokerscore:</strong> {{ user.pokerscore }}</p>
      <p><strong>Last login:</strong> {{ formatDate(user.lastLoginTimestamp) }}</p>
    </div>
    <div v-else>
      <p>Loading information...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'

const auth = useAuthStore()
const user = ref(null)

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString()
}

onMounted(() => {
  if (auth.user) {
    user.value = auth.user
  }
})
</script>

<style scoped>
.profile {
  max-width: 600px;
}
</style>
