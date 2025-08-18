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
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          v-if="isLoggedIn"
          class="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <!-- <li class="nav-item" :class="{ active: $route.path === '/' }" :aria-current="$route.path === '/' ? 'page' : null">
              <RouterLink class="nav-link" to="/">Home</RouterLink>
            </li>
            <li class="nav-item" :class="{ active: $route.path === '/profile' }" :aria-current="$route.path === '/profile' ? 'page' : null">
              <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
            </li> -->
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ auth.user?.username || 'Użytkownik' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <RouterLink class="dropdown-item" to="/profile">Profile</RouterLink>
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
import { computed } from 'vue'
import { useAuthStore } from './stores/useAuthStore'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.accessToken)
const router = useRouter()

function logout() {
  auth.logout(router)
}
</script>
<style scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
