<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-dark text-white" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">
                            <div class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Reset your password</h2>
                                <p class="text-white-50 mb-5">Please enter your email. If there is a Hillock account associated with it, you should receive an email with instructions on how to reset your password</p>
                                <form @submit.prevent="handlePasswordResetRequest">
                                    <div data-mdb-input-init class="form-outline form-white mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <input type="email" id="email" v-model="email"  class="form-control form-control-lg" required placeholder="example@example.com" />
                                    </div>
                                    <button data-mdb-button-init data-mdb-ripple-init
                                        class="btn btn-outline-light btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Sending...' : 'Send password reset request' }}</button>
                                </form>
                                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>             
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { accountApi } from '../api/account'

const router = useRouter()
const route = useRoute()

const email = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handlePasswordResetRequest() {
    errorMessage.value = ''
    loading.value = true
    try {
        const response = await accountApi.requestPasswordReset({ email: email.value })
        const { message } = response.data
        console.log(message)
        const returnUrl = route.query.returnUrl || '/'
        router.push(returnUrl)
    } catch (err) {
        errorMessage.value = err.message || 'Failed to send the request'
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
