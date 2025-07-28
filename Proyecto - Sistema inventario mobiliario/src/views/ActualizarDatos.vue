<template>
  <div class="actualizar-datos">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-principal">Actualizar Datos</h1>
        <hr>
      </div>
    </div>

    <div class="row">
      <!-- Foto de Perfil y Seguridad -->
      <div class="col-lg-4">
        <!-- Foto de Perfil -->
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-dark text-white">
            <i class="fas fa-id-card me-2"></i>Foto de Perfil
          </div>
          <div class="card-body text-center">
            <div class="position-relative mx-auto mb-3" style="width: 180px;">
              <img 
                :src="currentUser?.avatar || '/img/default-avatar.png'" 
                class="rounded-circle img-thumbnail"
                width="180"
                height="180"
                alt="Foto de perfil"
                id="fotoPerfil"
                style="object-fit: cover;"
              />
              <div v-if="newImagePreview" class="position-absolute top-0 start-0">
                <img 
                  :src="newImagePreview" 
                  class="rounded-circle img-thumbnail"
                  width="180"
                  height="180"
                  alt="Nueva foto"
                  style="object-fit: cover; border: 3px solid #28a745;"
                />
              </div>
            </div>
            <input 
              type="file" 
              class="d-none" 
              id="inputFoto" 
              accept="image/*"
              @change="handlePhotoChange"
            />
            <button 
              class="btn btn-outline-danger w-100 mb-2" 
              @click="$refs.inputFoto.click()"
            >
              <i class="fas fa-sync me-2"></i>Cambiar Foto
            </button>
            <button 
              v-if="newImagePreview" 
              class="btn btn-outline-secondary w-100 mb-2"
              @click="cancelPhotoChange"
            >
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <small class="text-muted d-block">Formatos: JPG, PNG (Max. 2MB)</small>
            <div v-if="photoError" class="text-danger small mt-2">
              {{ photoError }}
            </div>
          </div>
        </div>

        <!-- Seguridad -->
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white">
            <i class="fas fa-lock me-2"></i>Seguridad
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button 
                class="btn btn-outline-warning" 
                @click="showPasswordModal = true"
              >
                <i class="fas fa-key me-2"></i>Cambiar Contraseña
              </button>
              <div class="mt-2">
                <small class="text-muted">
                  <i class="fas fa-info-circle me-1"></i>
                  Última actualización: {{ formatDate(currentUser?.fechaActualizacion) || 'Nunca' }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Personal -->
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <span>
              <i class="fas fa-user-edit me-2"></i>Información Personal
            </span>
            <button 
              class="btn btn-sm btn-outline-light" 
              @click="toggleEdit"
              :disabled="loading"
            >
              <i class="fas" :class="editMode ? 'fa-times' : 'fa-edit'"></i>
              {{ editMode ? 'Cancelar' : 'Editar' }}
            </button>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nombres" class="form-label">Nombres</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="nombres"
                    v-model="form.nombres"
                    :readonly="!editMode"
                    :class="{ 'is-invalid': errors.nombres }"
                    @input="filterNameInput('nombres')"
                  />
                  <div v-if="errors.nombres" class="invalid-feedback">
                    {{ errors.nombres }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="apellidos" class="form-label">Apellidos</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="apellidos"
                    v-model="form.apellidos"
                    :readonly="!editMode"
                    :class="{ 'is-invalid': errors.apellidos }"
                    @input="filterNameInput('apellidos')"
                  />
                  <div v-if="errors.apellidos" class="invalid-feedback">
                    {{ errors.apellidos }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="tipoDocumento" class="form-label">Tipo de Documento</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="tipoDocumento"
                    :value="getTipoDocumentoText(currentUser?.tipoDocumento)"
                    readonly
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="documento" class="form-label">Número de Documento</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="documento"
                    :value="currentUser?.numeroDocumento"
                    readonly
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Correo Institucional</label>
                <div class="input-group">
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    v-model="form.email"
                    :readonly="!editMode"
                    :class="{ 'is-invalid': errors.email }"
                    @blur="validateEmail"
                  />
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="telefono" class="form-label">Teléfono/Celular</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    id="telefono"
                    v-model="form.telefono"
                    :readonly="!editMode"
                    @input="filterPhoneInput"
                    placeholder="0999999999"
                    maxlength="10"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="fechaNacimiento"
                    v-model="form.fechaNacimiento"
                    :readonly="!editMode"
                    :max="maxBirthDate"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="facultad" class="form-label">Facultad/Departamento</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="facultad"
                    :value="getFacultadText(currentUser?.facultad)"
                    readonly
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="cargo" class="form-label">Cargo</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="cargo"
                    v-model="form.cargo"
                    :readonly="!editMode"
                    placeholder="Su cargo actual"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="genero" class="form-label">Género</label>
                  <select 
                    class="form-select" 
                    id="genero"
                    v-model="form.genero"
                    :disabled="!editMode"
                  >
                    <option value="">No especificar</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="rol" class="form-label">Rol del Sistema</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="rol"
                    :value="getRolText(currentUser?.rol)"
                    readonly
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="emailSecundario" class="form-label">Email Secundario</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="emailSecundario"
                  v-model="form.emailSecundario"
                  :readonly="!editMode"
                  placeholder="correo.personal@ejemplo.com"
                />
              </div>

              <!-- Botones de acción -->
              <div class="row" v-if="editMode">
                <div class="col-12 text-center">
                  <button 
                    type="button" 
                    class="btn btn-secondary me-2"
                    @click="cancelEdit"
                    :disabled="loading"
                  >
                    <i class="fas fa-times me-2"></i>Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-success"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-save me-2"></i>
                    {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <div 
      class="modal fade" 
      :class="{ show: showPasswordModal }"
      :style="{ display: showPasswordModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              <i class="fas fa-key me-2"></i>Cambiar Contraseña
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="closePasswordModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handlePasswordChange">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Contraseña Actual</label>
                <div class="input-group">
                  <input 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    :class="{ 'is-invalid': passwordErrors.currentPassword }"
                    required
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <i class="fas" :class="showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <div v-if="passwordErrors.currentPassword" class="invalid-feedback">
                    {{ passwordErrors.currentPassword }}
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Nueva Contraseña</label>
                <div class="input-group">
                  <input 
                    :type="showNewPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :class="{ 'is-invalid': passwordErrors.newPassword }"
                    @input="validateNewPassword"
                    required
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i class="fas" :class="showNewPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <div v-if="passwordErrors.newPassword" class="invalid-feedback">
                    {{ passwordErrors.newPassword }}
                  </div>
                </div>
                <div class="progress mt-2" style="height: 5px;">
                  <div 
                    class="progress-bar"
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrengthWidth }"
                  ></div>
                </div>
                <small class="text-muted">{{ passwordStrengthText }}</small>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Nueva Contraseña</label>
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  class="form-control" 
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                  @blur="validatePasswordConfirm"
                  required
                />
                <div v-if="passwordErrors.confirmPassword" class="invalid-feedback">
                  {{ passwordErrors.confirmPassword }}
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closePasswordModal"
              :disabled="loadingPassword"
            >
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="handlePasswordChange"
              :disabled="loadingPassword"
            >
              <span v-if="loadingPassword" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ loadingPassword ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showPasswordModal"
      class="modal-backdrop fade show"
      @click="closePasswordModal"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLocalStorage } from '@/composables/useLocalStorage'

const authStore = useAuthStore()
const { getItem, setItem } = useLocalStorage()

const loading = ref(false)
const loadingPassword = ref(false)
const editMode = ref(false)
const showPasswordModal = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const newImagePreview = ref(null)
const photoError = ref('')
const newPhotoFile = ref(null)
const passwordStrength = ref(0)

const currentUser = computed(() => authStore.user)
const maxBirthDate = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return maxDate.toISOString().split('T')[0]
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 25) return 'bg-danger'
  if (passwordStrength.value < 50) return 'bg-warning'
  if (passwordStrength.value < 75) return 'bg-info'
  return 'bg-success'
})

const passwordStrengthWidth = computed(() => `${passwordStrength.value}%`)

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 25) return 'Muy débil'
  if (passwordStrength.value < 50) return 'Débil'
  if (passwordStrength.value < 75) return 'Buena'
  return 'Fuerte'
})

const form = reactive({
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  cargo: '',
  genero: '',
  emailSecundario: ''
})

const errors = reactive({
  nombres: '',
  apellidos: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Methods
const loadUserData = () => {
  if (currentUser.value) {
    form.nombres = currentUser.value.nombres || ''
    form.apellidos = currentUser.value.apellidos || ''
    form.email = currentUser.value.email || ''
    form.telefono = currentUser.value.telefono || ''
    form.fechaNacimiento = currentUser.value.fechaNacimiento || ''
    form.cargo = currentUser.value.cargo || ''
    form.genero = currentUser.value.genero || ''
    form.emailSecundario = currentUser.value.emailSecundario || ''
  }
}

const toggleEdit = () => {
  if (editMode.value) {
    cancelEdit()
  } else {
    editMode.value = true
  }
}

const cancelEdit = () => {
  editMode.value = false
  loadUserData() // Restaurar datos originales
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const filterNameInput = (field) => {
  form[field] = form[field].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
}

const filterPhoneInput = () => {
  form.telefono = form.telefono.replace(/[^0-9]/g, '')
}

const validateEmail = () => {
  errors.email = ''
  
  if (!form.email) {
    errors.email = 'El email es obligatorio'
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Formato de email inválido'
    return
  }
  
  // Verificar si ya existe (excepto el actual)
  const users = getItem('users') || []
  const existingUser = users.find(user => user.email === form.email && user.id !== currentUser.value?.id)
  if (existingUser) {
    errors.email = 'Este email ya está en uso por otro usuario'
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!form.nombres.trim()) {
    errors.nombres = 'Los nombres son obligatorios'
    isValid = false
  }

  if (!form.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son obligatorios'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'El email es obligatorio'
    isValid = false
  } else {
    validateEmail()
    if (errors.email) isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Actualizar datos del usuario
    const updatedUserData = {
      ...currentUser.value,
      nombres: form.nombres,
      apellidos: form.apellidos,
      email: form.email,
      telefono: form.telefono,
      fechaNacimiento: form.fechaNacimiento,
      cargo: form.cargo,
      genero: form.genero,
      emailSecundario: form.emailSecundario,
      fechaActualizacion: new Date().toISOString()
    }

    // Si hay nueva foto, agregarla
    if (newPhotoFile.value) {
      updatedUserData.avatar = newImagePreview.value
    }

    // Actualizar en el store de autenticación
    authStore.updateUser(updatedUserData)

    // Actualizar en la lista de usuarios
    const users = getItem('users') || []
    const userIndex = users.findIndex(user => user.id === currentUser.value.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUserData
      setItem('users', users)
    }

    // Registrar acción
    authStore.addRecentAction({
      type: 'update_profile',
      description: 'Actualizó su perfil personal',
      details: 'Información personal'
    })

    // Salir del modo edición
    editMode.value = false
    newImagePreview.value = null
    newPhotoFile.value = null

    // Mostrar mensaje de éxito
    alert('Datos actualizados correctamente')

  } catch (error) {
    console.error('Error al actualizar datos:', error)
    alert('Error al actualizar los datos. Intente nuevamente.')
  } finally {
    loading.value = false
  }
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  photoError.value = ''

  // Validar tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    photoError.value = 'Solo se permiten imágenes JPEG o PNG'
    event.target.value = ''
    return
  }

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    photoError.value = 'La imagen debe pesar menos de 2MB'
    event.target.value = ''
    return
  }

  newPhotoFile.value = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    newImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const cancelPhotoChange = () => {
  newImagePreview.value = null
  newPhotoFile.value = null
  photoError.value = ''
  document.getElementById('inputFoto').value = ''
}

const validateNewPassword = () => {
  const password = passwordForm.newPassword
  let strength = 0
  
  if (password.length >= 8) strength += 25
  if (password.match(/[a-z]/)) strength += 25
  if (password.match(/[A-Z]/)) strength += 25
  if (password.match(/[0-9]/)) strength += 25
  if (password.match(/[^a-zA-Z0-9]/)) strength += 25
  
  passwordStrength.value = Math.min(strength, 100)
  
  passwordErrors.newPassword = ''
  if (password && password.length < 8) {
    passwordErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
  }
}

const validatePasswordConfirm = () => {
  passwordErrors.confirmPassword = ''
  
  if (passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Las contraseñas no coinciden'
  }
}

const validatePasswordForm = () => {
  Object.keys(passwordErrors).forEach(key => {
    passwordErrors[key] = ''
  })

  let isValid = true

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'La contraseña actual es obligatoria'
    isValid = false
  } else if (passwordForm.currentPassword !== currentUser.value?.contrasena) {
    passwordErrors.currentPassword = 'La contraseña actual es incorrecta'
    isValid = false
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'La nueva contraseña es obligatoria'
    isValid = false
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Debe confirmar la nueva contraseña'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  if (passwordForm.currentPassword === passwordForm.newPassword) {
    passwordErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual'
    isValid = false
  }

  return isValid
}

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) {
    return
  }

  loadingPassword.value = true

  try {
    // Actualizar contraseña del usuario
    const updatedUserData = {
      ...currentUser.value,
      contrasena: passwordForm.newPassword,
      fechaActualizacion: new Date().toISOString()
    }

    // Actualizar en el store de autenticación
    authStore.updateUser(updatedUserData)

    // Actualizar en la lista de usuarios
    const users = getItem('users') || []
    const userIndex = users.findIndex(user => user.id === currentUser.value.id)
    if (userIndex !== -1) {
      users[userIndex] = updatedUserData
      setItem('users', users)
    }

    // Registrar acción
    authStore.addRecentAction({
      type: 'change_password',
      description: 'Cambió su contraseña',
      details: 'Contraseña actualizada'
    })

    // Cerrar modal y limpiar formulario
    closePasswordModal()
    alert('Contraseña actualizada correctamente')

  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    alert('Error al cambiar la contraseña. Intente nuevamente.')
  } finally {
    loadingPassword.value = false
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  
  // Limpiar formulario
  Object.keys(passwordForm).forEach(key => {
    passwordForm[key] = ''
  })
  
  Object.keys(passwordErrors).forEach(key => {
    passwordErrors[key] = ''
  })
  
  passwordStrength.value = 0
  showCurrentPassword.value = false
  showNewPassword.value = false
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getTipoDocumentoText = (tipo) => {
  const tipos = {
    'cedula': 'Cédula',
    'pasaporte': 'Pasaporte',
    'ruc': 'RUC'
  }
  return tipos[tipo] || tipo || 'No especificado'
}

const getFacultadText = (facultad) => {
  const facultades = {
    'facci': 'FACCI',
    'fci': 'FCI',
    'fadcom': 'FADCOM',
    'medicina': 'Medicina',
    'educacion': 'Educación',
    'administrativo': 'Administrativo'
  }
  return facultades[facultad] || facultad || 'No asignado'
}

const getRolText = (rol) => {
  const roles = {
    'administrador': 'Administrador',
    'docente': 'Docente',
    'tecnico': 'Técnico',
    'invitado': 'Invitado'
  }
  return roles[rol] || rol || 'No especificado'
}

onMounted(() => {
  loadUserData()
  
  // Agregar referencia al input file
  const inputFoto = document.getElementById('inputFoto')
  if (inputFoto) {
    inputFoto.addEventListener('change', handlePhotoChange)
  }
})
</script>

<style scoped>
.actualizar-datos {
  animation: fadeInUp 0.6s ease-out;
}

.titulo-principal {
  color: #dc3545;
  font-weight: bold;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 1rem;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.img-thumbnail {
  border: 3px solid #e9ecef;
  transition: all 0.3s ease;
}

.img-thumbnail:hover {
  border-color: #dc3545;
}

.form-control:focus,
.form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control[readonly] {
  background-color: #f8f9fa;
  color: #6c757d;
}

.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn-outline-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

.progress {
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.3s ease;
}

.position-relative .position-absolute {
  border-radius: 50%;
  overflow: hidden;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.input-group .btn {
  border-radius: 0 0.375rem 0.375rem 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
  
  .img-thumbnail {
    width: 120px !important;
    height: 120px !important;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}

/* Animación para cambios guardados */
.form-control.saved {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  animation: savedGlow 2s ease-out;
}

@keyframes savedGlow {
  0% {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }
  100% {
    border-color: #ced4da;
    box-shadow: none;
  }
}
</style>