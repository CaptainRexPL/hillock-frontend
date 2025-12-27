<template>
  <section class="d-flex flex-column justify-content-center align-items-center mt-5">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-10 col-lg-10 col-xl-6">
          <div class="card shadow" style="border-radius: 1rem;">
            <div class="card-body p-4">

              <h2 class="fw-bold mb-4 text-center">Your Profile</h2>

              <div v-if="!user" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading information...</p>
              </div>

              <div v-else>
                <!-- Username -->
                <div class="mb-3 row">
                  <label class="col-sm-4 col-form-label"><strong>Username:</strong></label>
                  <div class="col-sm-8 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                    <span v-if="!editing.username" class="flex-grow-1">{{ user.username }}</span>
                    <input v-else v-model="editValues.username" type="text" class="form-control me-0 me-sm-2 mb-2 mb-sm-0 flex-grow-1" />

                    <div v-if="!editing.username" class="ms-0 ms-sm-2">
                      <button class="btn btn-outline-primary btn-sm" @click="startEdit('username')">Edit</button>
                    </div>
                    <div v-else class="d-flex gap-2 mt-2 mt-sm-0">
                      <button class="btn btn-success btn-sm" @click="saveEdit('username')">Save</button>
                      <button class="btn btn-secondary btn-sm" @click="cancelEdit('username')">Cancel</button>
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3 row">
                  <label class="col-sm-4 col-form-label"><strong>Email:</strong></label>
                  <div class="col-sm-8 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                    <span v-if="!editing.email" class="flex-grow-1">{{ user.email }}</span>
                    <input v-else v-model="editValues.email" type="email" class="form-control me-0 me-sm-2 mb-2 mb-sm-0 flex-grow-1" />

                    <div v-if="!editing.email" class="ms-0 ms-sm-2">
                      <button class="btn btn-outline-primary btn-sm" @click="startEdit('email')">Edit</button>
                    </div>
                    <div v-else class="d-flex gap-2 mt-2 mt-sm-0">
                      <button class="btn btn-success btn-sm" @click="saveEdit('email')">Save</button>
                      <button class="btn btn-secondary btn-sm" @click="cancelEdit('email')">Cancel</button>
                    </div>
                  </div>
                </div>

                <!-- Change password -->
                <div class="mb-3 row align-items-center">
                  <label class="col-sm-4 col-form-label"><strong>Password:</strong></label>
                  <div class="col-sm-8">
                    <button class="btn btn-warning btn-sm" @click="openPasswordModal">Change password</button>
                  </div>
                </div>

                <!-- Other fields -->
                <div class="mb-2"><strong>Roles:</strong> {{ user.roles.join(', ') }}</div>
                <div class="mb-3 row">
                  <div v-if="user.discordAccount">
                    <h3 class="fw-bold mb-1 mt-1 text-center">Your Discord Profile</h3>
                    <div class="d-flex flex-row align-items-top">
                      <img
                          :src="avatarUrl"
                          class="rounded-circle mb-3"
                          style="width: 64px; height: 64px;"
                          alt="Avatar"
                      />
                      <div class="d-flex flex-column mt-3">
                        <span> {{ user.discordAccount.global_name }} (id: {{ user.discordAccount.id }}) </span>
                        <div class="col-sm-8">
                          <button class="btn btn-danger btn-sm" @click="unlinkDiscord">Unlink discord account</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="col-sm-8">
                      <button class="btn btn-primary btn-sm" @click="linkDiscordAccount">Link with discord</button>
                    </div>
                  </div>
                </div>

                <div class="mb-2"><strong>Pokerscore:</strong> {{ user.pokerScore }}</div>
                <div class="mb-2"><strong>Last login:</strong> {{ formatDate(user.lastLoginTimestamp) }}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal do zmiany hasła -->
    <div class="modal fade" tabindex="-1" :class="{ show: showPasswordModal }" style="display: block;" v-if="showPasswordModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Change Password</h5>
            <button type="button" class="btn-close" @click="closePasswordModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="passwordMessage" :class="{'text-success': passwordSuccess, 'text-danger': !passwordSuccess}">
              {{ passwordMessage }}
            </div>

            <!-- Old Password -->
            <div class="mb-3">
              <label class="form-label">Old Password</label>
              <input type="password" class="form-control" v-model="password.oldPassword" />
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <label class="form-label">New Password</label>
              <input type="password" class="form-control" v-model="password.newPassword" />
            </div>

            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input type="password" class="form-control" v-model="password.confirmPassword" />
            </div>

            <!-- Error -->
            <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closePasswordModal">Cancel</button>
            <button class="btn btn-success" @click="savePassword">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tło dla modala -->
    <div class="modal-backdrop fade show" v-if="showPasswordModal"></div>

    <!-- Logout warning modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: logoutWarning }" style="display: block;" v-if="logoutWarning">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Attention</h5>
          </div>
          <div class="modal-body">
            <p>Due to security reasons, you will be logged out.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="confirmLogout">OK</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="logoutWarning"></div>

    <!-- Toast -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      <div class="toast align-items-center text-white" role="alert" :class="[toastClass, { show: showToast }]">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="showToast = false"></button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import {ref, reactive, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from '../stores/useAuthStore'
import { profileApi } from '../api/profile'

const auth = useAuthStore()

const editing = reactive({username: false, email: false})
const editValues = reactive({username: '', email: ''})

const showPasswordModal = ref(false)
const password = reactive({oldPassword: '', newPassword: '', confirmPassword: ''})
const passwordError = ref('')
const passwordMessage = ref('')
const passwordSuccess = ref(false)
const logoutWarning = ref(false)

const router = useRouter()

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastClass = ref('bg-success')

function showSuccessToast(message) {
  toastMessage.value = message
  toastClass.value = 'toast align-items-center text-white bg-success border-0'
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

function showErrorToast(message) {
  toastMessage.value = message
  toastClass.value = 'toast align-items-center text-white bg-danger border-0'
  showToast.value = true
  setTimeout(() => showToast.value = false, 5000)
}

const user = computed(() => auth.user ?? null)

onMounted(async () => {
  await auth.getMe()
  if (user.value) {
    //console.log('profile-on-mounted', auth.user)
    //user.value = auth.user
    editValues.username = user.value.username
    editValues.email = user.value.email
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString()
}

const avatarUrl = computed(() => {
  if (!user.value.discordAccount) return ''
  return `https://cdn.discordapp.com/avatars/${user.value.discordAccount.id}/${user.value.discordAccount.avatar}.png`
})

function linkDiscordAccount() {
  const backendUrl = import.meta.env.VITE_API_URL
  window.location.href = `${backendUrl}/profile/discord/url`
}



async function unlinkDiscord() {
  await auth.unlinkDiscordAccount();
}

async function confirmLogout() {
  logoutWarning.value = false
  await auth.logout(router)
}

async function saveEdit(field) {
  try {
    const payload = {[field]: editValues[field]}
    const res = await auth.updateProfile(payload)
    if (res.data?.success === true) {
      editing[field] = false
      showSuccessToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`)

      if (field === 'email') {
        logoutWarning.value = true
      }
    } else {
      showErrorToast(res.data?.message || 'Update failed')
    }
  } catch (err) {
    showErrorToast(err.message || 'Error updating profile')
  }
}

function startEdit(field) {
  editValues[field] = user.value[field]
  editing[field] = true
}

function cancelEdit(field) {
  editValues[field] = user.value[field]
  editing[field] = false
}

// Password modal
function openPasswordModal() {
  password.oldPassword = ''
  password.newPassword = ''
  password.confirmPassword = ''
  passwordError.value = ''
  passwordMessage.value = ''
  passwordSuccess.value = false
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
}

// Save password
async function savePassword() {
  passwordError.value = ''
  passwordMessage.value = ''
  passwordSuccess.value = false

  if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
    passwordError.value = 'All fields are required.'
    return
  }

  if (password.newPassword.length < 8 || password.newPassword.length > 255) {
    passwordError.value = 'New password must be between 8 and 255 characters.'
    return
  }

  if (password.newPassword !== password.confirmPassword) {
    passwordError.value = 'New password and confirmation do not match.'
    return
  }

  try {
    const res = await auth.updateProfile({
      oldPassword: password.oldPassword,
      newPassword: password.newPassword,
      confirmPassword: password.confirmPassword
    })

    if (res.data?.success === true) {
      passwordMessage.value = res.data?.message || 'Password updated successfully'
      passwordSuccess.value = true
      passwordError.value = ''
      showPasswordModal.value = false
      showSuccessToast('Password updated successfully')
      logoutWarning.value = true
    } else {
      passwordError.value = res.data?.message || 'Password update failed'
      showErrorToast(passwordError.value)
    }
  } catch (err) {
    passwordError.value = err.response?.data?.message || 'Password update failed'
    showErrorToast(passwordError.value)
  }
}
</script>

<style scoped>
.card {
  max-width: 1024px;
  margin: auto;
}

/* Modal bootstrap */
.modal {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  z-index: 1040;
}

.modal-content {
  z-index: 1050;
  position: relative;
}
</style>
