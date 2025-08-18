<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card">
                        <div class="card-body p-5 text-center">
                            <div class="mb-md-5 mt-md-4 pb-5">
                                <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                <p class="mb-5">Please enter your email and password!</p>
                                <form @submit.prevent="handleLogin">
                                    <div class="form-group mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                            <input type="email" id="email" v-model="email" class="form-control" placeholder="user email" />
                                        </div>
                                    </div>
                                    <div  class="form-group mb-4">
                                        <label class="form-label" for="password">Password</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                            <input type="password" id="password" v-model="password" class="form-control input_pass" placeholder="password" />
                                        </div>
                                    </div>
                                    <p class="small mb-5 pb-lg-2">Forgot password? Reset it <RouterLink class="fw-bold" to="/reset/request">here</RouterLink></p>
                                    <button class="btn btn-outline-primary btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Authorizing...' : 'Login' }}</button>
                                </form>
                                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>             
                            </div>
                            <div>
                                <p class="mb-0">Don't have an account? <RouterLink class="fw-bold" to="/register">Register</RouterLink></p>
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
import { useAuthStore } from '../stores/useAuthStore'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
    errorMessage.value = ''
    loading.value = true
    try {
        await authStore.login({ email: email.value, password: password.value })
        const returnUrl = route.query.returnUrl || '/'
        router.push(returnUrl)
    } catch (err) {
        errorMessage.value = err.message || 'Failed to log in'
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
