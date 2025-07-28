<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="text-center mb-4">
          <img src="../assets/Uleam - logo.png" class="img-fluid" style="max-height: 75px;" alt="ULEAM" />
          <h1 class="titulo1 text-white mt-3">Sistema de Gestión de Mobiliario</h1>
        </div>

        <div class="card shadow-lg">
          <div class="card-body p-4">
            <h2 class="titulo2 text-center mb-4">Iniciar Sesión</h2>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">
                  <i class="fas fa-user me-2"></i>Usuario
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="fas fa-at text-muted"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control form-control-lg" 
                    id="username"
                    v-model="form.username"
                    :class="{ 'is-invalid': errors.username }"
                    placeholder="Usuario o correo institucional" 
                    required 
                    autofocus
                  />
                  <div v-if="errors.username" class="invalid-feedback">
                    {{ errors.username }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fas fa-key me-2"></i>Contraseña
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="fas fa-lock text-muted"></i>
                  </span>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control form-control-lg" 
                    id="password"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Ingrese su contraseña" 
                    required
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="togglePassword"
                  >
                    <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="rememberMe"
                    v-model="form.rememberMe"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Recordar sesión
                  </label>
                </div>
                <a href="#" class="text-decoration-none">¿Olvidó su contraseña?</a>
              </div>

              <button 
                class="btn btn-danger btn-lg w-100 py-2 mb-3" 
                type="submit"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-sign-in-alt me-2"></i>
                {{ loading ? 'Ingresando...' : 'Ingresar' }}
              </button>

              <div v-if="errors.general" class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errors.general }}
              </div>

              <div class="text-center pt-3 border-top">
                <p class="text-muted mb-0">
                  ¿No tienes una cuenta? 
                  <a href="#" class="text-decoration-none">Contacta al administrador</a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div class="text-center mt-4 text-white">
          <small>
            &copy; 2025 Universidad Laica "Eloy Alfaro de Manabí"<br>
            Todos los derechos reservados
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  username: '',
  password: '',
  general: ''
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  // Limpiar errores previos
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!form.username.trim()) {
    errors.username = 'El usuario es obligatorio'
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errors.general = ''

  try {
    const result = await authStore.login({
      username: form.username,
      password: form.password,
      rememberMe: form.rememberMe
    })

    if (result.success) {
      // Redirigir al dashboard
      router.push('/')
    } else {
      errors.general = result.error || 'Credenciales inválidas'
    }
  } catch (error) {
    errors.general = 'Error al iniciar sesión. Intente nuevamente.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.titulo1 {
  font-size: 1.5rem;
  font-weight: 300;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.titulo2 {
  color: #dc3545;
  font-weight: 600;
  font-size: 1.8rem;
}

.card {
  border: none;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.btn-danger {
  background: linear-gradient(45deg, #dc3545, #c82333);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.input-group-text {
  border-color: #ced4da;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>