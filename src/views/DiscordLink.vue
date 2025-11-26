<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { profileApi } from '../api/profile'

const route = useRoute()
const router = useRouter()

const user = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const modalMessage = ref("")
let confirmModal = null
const isModalOpen = ref(false)

const token = route.params.token

const avatarUrl = computed(() => {
  if (!user.value) return ''
  return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png`
})

async function loadProfile() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await profileApi.getDiscordData(token)
    user.value = response.data
  } catch (e) {
    errorMessage.value = e.message || 'Nie udało się pobrać informacji z Discorda.'
  } finally {
    loading.value = false
  }
}

function showConfirmModal(message) {
  modalMessage.value = message

  if (!confirmModal) {
    const modalEl = document.getElementById("confirmModal")

    modalEl.addEventListener("shown.bs.modal", () => {
      isModalOpen.value = true
    })
    modalEl.addEventListener("hidden.bs.modal", () => {
      isModalOpen.value = false
    })

    confirmModal = new Modal(modalEl)
  }

  confirmModal.show()
}

async function handleAction(action) {
  try {
    let response

    if (action === "accept") {
      response = await profileApi.confirmLink({ token })
    } else {
      response = await profileApi.cancelLink({ token })
    }

    if (response.status === 200 || response.status === 204) {
      showConfirmModal(
          action === "accept"
              ? "Połączenie profilu zakończone sukcesem!"
              : "Proces łączenia profilu został anulowany."
      )
    }
  } catch (e) {
    showConfirmModal("Wystąpił błąd. Spróbuj ponownie.")
  }
}

const accept = () => handleAction("accept")
const cancelToken = () => handleAction("cancel")

onMounted(() => {
  loadProfile()
})
</script>


<template>
  <div>
  <section class="d-flex flex-column justify-content-center align-items-center h-100 gradient-custom" :class="{ faded: isModalOpen }">
    <div class="container auth-container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card" style="border-radius: 1rem;">
            <div class="card-body auth-card text-center">

              <div v-if="loading" class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2 text-uppercase">Ładowanie...</h2>
              </div>

              <div v-else-if="errorMessage" class="mb-md-5 mt-md-4 pb-5">
                <h2 class="fw-bold mb-2 text-uppercase text-danger">Błąd</h2>
                <p>{{ errorMessage }}</p>
              </div>

              <div v-else class="mb-md-5 mt-md-4 pb-3">
                <h2 class="fw-bold mb-4 text-uppercase">Czy dokonać połączenia profilu?</h2>

                <div class="d-flex flex-column align-items-center">
                  <img
                      :src="avatarUrl"
                      class="rounded-circle mb-3"
                      style="width: 120px; height: 120px;"
                      alt="Avatar"
                  />

                  <h4 class="fw-bold mb-1">{{ user.username }}</h4>
                  <p class="text-muted mb-1">ID: {{ user.id }}</p>
                </div>

                <div class="d-flex justify-content-center gap-3 mt-2">
                  <button class="btn btn-outline-primary btn-lg px-5" @click="accept">
                    Tak
                  </button>

                  <button class="btn btn-outline-secondary btn-lg px-5" @click="cancelToken">
                    Anuluj
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="confirmModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Informacja</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          {{ modalMessage }}
        </div>
        <div class="modal-footer">
          <button type="button"
                  class="btn btn-primary"
                  data-bs-dismiss="modal"
                  @click="router.push('/')">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
@media (max-height: 700px) {
  .auth-card {
    padding: 1.5rem !important; /* lub mniej */
  }

  .auth-container {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

.faded {
  opacity: 0.2;
  filter: blur(2px);
  transition: opacity 0.2s ease-in-out;
}

section {
  transition: opacity 0.2s ease-in-out;
}
</style>