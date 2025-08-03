<template>
  <div class="home">
    <h1>Welcome to Hillock!</h1>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = authStore.user?.username || 'Guest'

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
