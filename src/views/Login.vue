<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100 gradient-custom">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card bg-dark text-white" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <div class="mb-md-5 mt-md-4 pb-5">

                                <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                <p class="text-white-50 mb-5">Please enter your email and password!</p>
                                <form @submit.prevent="handleLogin">
                                    <div data-mdb-input-init class="form-outline form-white mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <input type="email" id="email" v-model="email"  class="form-control form-control-lg" required />
                                    </div>
                                    <div data-mdb-input-init class="form-outline form-white mb-4">
                                        <label class="form-label" for="password">Password</label>
                                        <input type="password" id="password" v-model="password" class="form-control form-control-lg" required />
                                    </div>
                                    <!-- TODO: Add a way to reset passwords -->
                                    <!-- <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p> -->
                                    

                                    <button data-mdb-button-init data-mdb-ripple-init
                                        class="btn btn-outline-light btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Authorizing...' : 'Login' }}</button>
                                </form>
                                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>             
                            </div>

                            <div>
                                <p class="mb-0">Don't have an account? <RouterLink class="text-white-50 fw-bold" to="/register">Register</RouterLink></p>
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
        errorMessage.value = err.message || 'Błąd logowania'
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
