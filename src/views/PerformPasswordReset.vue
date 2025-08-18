<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card">
                        <div class="card-body p-5 text-center">
                            <div class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Reset your password</h2>
                                <div v-if="loading">Request verification...</div>
                                <div v-else-if="!tokenValid">
                                    <p style="color: red;" class="mb-5">{{msg}}</p>
                                    <button class="btn btn-outline-primary btn-lg px-5" type="button" @click="router.push('/')" :disabled="loading">Go back</button>
                                </div>
                                <div v-else>
                                    <p class="mb-5">Welcome {{ user }}!<br> In order to set your new password, fill in both fields on this page with your new password</p>
                                    <form @submit.prevent="handlePasswordReset">
                                        <div class="form-group mb-4">
                                            <label class="form-label" for="password">New password</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                                <input type="password" id="password" v-model="password" class="form-control input_pass" placeholder="password"/>
                                            </div>
                                        </div>
                                        <div class="form-group mb-4">
                                            <label class="form-label" for="confirmPassword">Confirm new password</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                                <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control input_pass" placeholder="password"/>
                                            </div>
                                        </div>
                                        <button class="btn btn-outline-primary btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Resetting...' : 'Reset password' }}</button>
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
    const response = await accountApi.verifyPasswordReset({ token })  

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
        console.log('rrr', {token })
        await accountApi.performPasswordReset({ token, data: { password: password.value, confirmPassword: confirmPassword.value } })
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
.error {
    margin-top: 1rem;
    color: red;
}
</style>
