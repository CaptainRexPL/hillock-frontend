<template>
    <section class="d-flex flex-column justify-content-center align-items-center h-100">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card" style="border-radius: 1rem;">
                        <div class="card-body p-5 text-center">

                            <div class="mb-md-5 mt-md-4 pb-5">

                                <h2 class="fw-bold mb-2 text-uppercase">Register</h2>
                                <p class="mb-5">Please enter your email and password!</p>
                                <form @submit.prevent="handleRegister">
                                    <div class="form-group mb-4">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                            <input type="email" id="email" v-model="email"  class="form-control form-control-lg" required placeholder="example@example.com" />
                                        </div>
                                    </div>
                                    <div class="form-group mb-4">
                                        <label class="form-label" for="username">Username</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                            <input type="text" id="username" v-model="username"  class="form-control form-control-lg" required placeholder="username123" />
                                        </div>
                                    </div>
                                    <div  class="form-group mb-4">
                                        <label class="form-label" for="password">Password</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                            <input type="password" id="password" v-model="password" class="form-control form-control-lg" required placeholder="********" />
                                        </div>
                                    </div>
                                    <div  class="form-group mb-4">
                                        <label class="form-label" for="confirmPassword">Confirm password</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                            <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control form-control-lg" required placeholder="********" />
                                        </div>
                                    </div>
                                    <div data-mdb-input-init class="form-outline form-white mb-4">
                                        <label class="form-label" for="invite">Invite code</label>
                                        <input type="text" id="invite" v-model="invite"  class="form-control form-control-lg" required />
                                    </div>
                                    <p class="small mb-5 pb-lg-2">Forgot password? Reset it <RouterLink class="fw-bold" to="/reset/request">here</RouterLink></p>
                                    

                                    <button class="btn btn-outline-primary btn-lg px-5" type="submit" :disabled="loading"> {{ loading ? 'Registering...' : 'Register' }}</button>
                                </form>
                                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>             
                            </div>

                            <div>
                                <p class="mb-0">Already have an account? <RouterLink class="fw-bold" to="/login">Login</RouterLink></p>
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
import { accountApi } from '../api/account.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const invite = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleRegister() {
    errorMessage.value = ''
    loading.value = true
    try {
        await accountApi.createAccount({ 
            email: email.value, 
            username: username.value, 
            password: password.value, 
            confirmPassword: confirmPassword.value,
            invite: invite.value
         })
        router.push('/')
    } catch (err) {
        errorMessage.value = err.message || 'Failed to register'
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
