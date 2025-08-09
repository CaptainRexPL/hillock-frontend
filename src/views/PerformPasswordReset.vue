<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-dark text-white" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">
                            <div class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Reset your password</h2>
                                <div v-if="loading">Request verification...</div>
                                <div v-else-if="!tokenValid">
                                    <p style="color: red;">{{msg}}</p>
                                    <button data-mdb-button-init data-mdb-ripple-init
                                        class="btn btn-outline-light btn-lg px-5" type="button" @click="router.push('/')" :disabled="loading">Go back</button>
                                </div>
                                <div v-else>
                                    <p class="text-white-50 mb-5">Welcome {{ user }}!<br> In order to set your new password, fill in both fields on this page with your new password</p>
                                    <form @submit.prevent="handlePasswordReset">
                                        <div data-mdb-input-init class="form-outline form-white mb-4">
                                            <label class="form-label" for="password">New password</label>
                                            <input type="password" id="password" v-model="password" class="form-control form-control-lg" required placeholder="********" />
                                        </div>
                                        <div data-mdb-input-init class="form-outline form-white mb-4">
                                            <label class="form-label" for="confirmPassword">Confirm new password</label>
                                            <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control form-control-lg" required placeholder="********" />
                                        </div>
                                        <button data-mdb-button-init data-mdb-ripple-init
                                            class="btn btn-outline-light btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Resetting...' : 'Reset password' }}</button>
                                    </form>
                                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                                </div>             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { accountApi } from '../api/account'

const router = useRouter()
const route = useRoute()

const namespace = route.params.namespace
const token = route.params.token

const loading = ref(true)
const tokenValid = ref(false)
const msg = ref('')
const user = ref('')

const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')


onMounted(async () => {
  try {
    const response = await accountApi.verifyPasswordReset({ namespace, token })  

    const { success, username, message } = response.data

    tokenValid.value = success === true
    user.value = username
    msg.value = message

  } catch (error) {
    msg.value = `Server returned error while attemting to verificate request`
    tokenValid.value = false
  } finally {
    loading.value = false
  }
})

async function handlePasswordReset() {
    errorMessage.value = ''
    loading.value = true
    try {
        console.log('rrr', {namespace, token })
        await accountApi.performPasswordReset({ namespace, token, data: { password: password.value, confirmPassword: confirmPassword.value } })
        const returnUrl = route.query.returnUrl || '/'
        router.push(returnUrl)
    } catch (err) {
        errorMessage.value = err.message || 'Failed to perform password reset'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login {
    max-width: 400px;
    margin: 3rem auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
}

button {
    padding: 0.5rem 1rem;
    width: 100%;
}

.error {
    margin-top: 1rem;
    color: red;
}
</style>
