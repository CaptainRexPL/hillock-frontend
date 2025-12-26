<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">
          <img src="./assets/images/logo.png" alt="Hillock logo" title="Hillock logo - go to homepage" height="48"/>
        </RouterLink>
        <button
            v-if="isLoggedIn"
            class="navbar-toggler"
            type="button"
            @click="toggleHamburger"
            :aria-expanded="hamburgerOpen.toString()"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          v-if="isLoggedIn"
          class="collapse navbar-collapse justify-content-between"
          :class="{ show: hamburgerOpen }"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <ul class="navbar-nav me-3">
            <li class="nav-item dropdown" ref="userDropdown">
              <button
                  class="nav-link dropdown-toggle btn btn-link"
                  type="button"
                  @click="toggleDropdown"
                  :aria-expanded="isOpen.toString()"
              >
                {{ auth.user?.username || 'User' }}
              </button>

              <ul
                  class="dropdown-menu dropdown-menu-end"
                  :class="{ show: isOpen }">
                <li>
                  <RouterLink class="dropdown-item" to="/profile" @click="closeDropdown">Profile</RouterLink>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="d-flex flex-grow-1">
      <main class="flex-grow-1 p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'

const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.accessToken)
const router = useRouter()

const isOpen = ref(false)
const userDropdown = ref(null)
const hamburgerOpen = ref(false)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function toggleHamburger() {
  hamburgerOpen.value = !hamburgerOpen.value
}

function logout() {
  auth.logout(router)
}

function handleClickOutside(event) {
  const dropdownEl = userDropdown.value
  if (dropdownEl && !dropdownEl.contains(event.target)) {
    closeDropdown()
  }
}
</script>
<style scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
