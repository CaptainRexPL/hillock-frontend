<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">
                            <div class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Reset your password</h2>
                                <p class="mb-5">Please enter your email. If there is a Hillock account associated with it, you should receive an email with instructions on how to reset your password</p>
                                <form @submit.prevent="handlePasswordResetRequest">
                                    <div class="form-group mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                            <input type="email" id="email" v-model="email"  class="form-control form-control-lg" required placeholder="example@example.com" />
                                        </div>
                                    </div>
                                    <button class="btn btn-outline-primary btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Sending...' : 'Send password reset request' }}</button>
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
.error {
    margin-top: 1rem;
    color: red;
}
</style>
