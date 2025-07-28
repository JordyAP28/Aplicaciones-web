<template>
  <div class="nuevo-usuario">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-principal">Nuevo Usuario</h1>
        <hr>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0">
          <i class="fas fa-user-plus me-2"></i>
          Registro de Usuario
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Información de Documento -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-id-card me-2"></i>Información de Identificación
            </legend>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="tipoDocumento" class="form-label">
                  Tipo de Documento <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select" 
                  id="tipoDocumento"
                  v-model="form.tipoDocumento"
                  :class="{ 'is-invalid': errors.tipoDocumento }"
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="cedula">Cédula</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="ruc">RUC</option>
                </select>
                <div v-if="errors.tipoDocumento" class="invalid-feedback">
                  {{ errors.tipoDocumento }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="numeroDocumento" class="form-label">
                  Número de Documento <span class="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="numeroDocumento"
                  v-model="form.numeroDocumento"
                  :class="{ 'is-invalid': errors.numeroDocumento }"
                  @input="validateDocumento"
                  placeholder="Ej: 1234567890"
                />
                <div v-if="errors.numeroDocumento" class="invalid-feedback">
                  {{ errors.numeroDocumento }}
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Información Personal -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-user me-2"></i>Información Personal
            </legend>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="nombres" class="form-label">
                  Nombres <span class="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nombres"
                  v-model="form.nombres"
                  :class="{ 'is-invalid': errors.nombres }"
                  @input="filterNameInput('nombres')"
                  placeholder="Nombres completos"
                />
                <div v-if="errors.nombres" class="invalid-feedback">
                  {{ errors.nombres }}
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <label for="apellidos" class="form-label">
                  Apellidos <span class="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="apellidos"
                  v-model="form.apellidos"
                  :class="{ 'is-invalid': errors.apellidos }"
                  @input="filterNameInput('apellidos')"
                  placeholder="Apellidos completos"
                />
                <div v-if="errors.apellidos" class="invalid-feedback">
                  {{ errors.apellidos }}
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <label for="genero" class="form-label">Género</label>
                <select class="form-select" id="genero" v-model="form.genero">
                  <option value="">No especificar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="fechaNacimiento"
                  v-model="form.fechaNacimiento"
                  :class="{ 'is-invalid': errors.fechaNacimiento }"
                  :max="maxBirthDate"
                  @change="validateFechaNacimiento"
                />
                <div v-if="errors.fechaNacimiento" class="invalid-feedback">
                  {{ errors.fechaNacimiento }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="telefono" class="form-label">Teléfono/Celular</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="telefono"
                  v-model="form.telefono"
                  @input="filterPhoneInput"
                  placeholder="Ej: 0999999999"
                  maxlength="10"
                />
              </div>
            </div>
          </fieldset>

          <!-- Información de Contacto -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-envelope me-2"></i>Información de Contacto
            </legend>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">
                  Correo Electrónico <span class="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                  @blur="validateEmail"
                  placeholder="usuario@uleam.edu.ec"
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
                <small class="text-muted">Preferentemente correo institucional</small>
              </div>
              <div class="col-md-6 mb-3">
                <label for="emailSecundario" class="form-label">Correo Secundario</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="emailSecundario"
                  v-model="form.emailSecundario"
                  placeholder="correo.personal@gmail.com"
                />
              </div>
            </div>
          </fieldset>

          <!-- Información Institucional -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-building me-2"></i>Información Institucional
            </legend>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="rol" class="form-label">
                  Rol de Usuario <span class="text-danger">*</span>
                </label>
                <select 
                  class="form-select" 
                  id="rol"
                  v-model="form.rol"
                  :class="{ 'is-invalid': errors.rol }"
                  @change="updatePermissions"
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="administrador">Administrador</option>
                  <option value="docente">Docente</option>
                  <option value="tecnico">Técnico</option>
                  <option value="invitado">Invitado</option>
                </select>
                <div v-if="errors.rol" class="invalid-feedback">
                  {{ errors.rol }}
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <label for="facultad" class="form-label">Facultad/Departamento</label>
                <select class="form-select" id="facultad" v-model="form.facultad">
                  <option value="">No asignado</option>
                  <option value="facci">FACCI</option>
                  <option value="fci">FCI</option>
                  <option value="fadcom">FADCOM</option>
                  <option value="medicina">Medicina</option>
                  <option value="educacion">Educación</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label for="cargo" class="form-label">Cargo</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="cargo"
                  v-model="form.cargo"
                  placeholder="Ej: Profesor, Técnico, Administrador"
                />
              </div>
            </div>
          </fieldset>

          <!-- Información de Cuenta -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-key me-2"></i>Información de Cuenta
            </legend>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="usuario" class="form-label">
                  Nombre de Usuario <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    id="usuario"
                    v-model="form.usuario"
                    :class="{ 'is-invalid': errors.usuario }"
                    @blur="validateUsuario"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="generarUsuario"
                  >
                    <i class="fas fa-magic me-2"></i>Generar
                  </button>
                  <div v-if="errors.usuario" class="invalid-feedback">
                    {{ errors.usuario }}
                  </div>
                </div>
                <small class="text-muted">Debe ser único en el sistema</small>
              </div>
              <div class="col-md-6 mb-3">
                <label for="estado" class="form-label">
                  Estado <span class="text-danger">*</span>
                </label>
                <select class="form-select" id="estado" v-model="form.estado">
                  <option value="activo" selected>Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="contrasena" class="form-label">
                  Contraseña <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control" 
                    id="contrasena"
                    v-model="form.contrasena"
                    :class="{ 'is-invalid': errors.contrasena }"
                    @input="validatePassword"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    @click="showPassword = !showPassword"
                  >
                    <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                  <div v-if="errors.contrasena" class="invalid-feedback">
                    {{ errors.contrasena }}
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
              <div class="col-md-6 mb-3">
                <label for="confirmarContrasena" class="form-label">
                  Confirmar Contraseña <span class="text-danger">*</span>
                </label>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  id="confirmarContrasena"
                  v-model="form.confirmarContrasena"
                  :class="{ 'is-invalid': errors.confirmarContrasena }"
                  @blur="validatePasswordConfirm"
                  placeholder="Repita la contraseña"
                />
                <div v-if="errors.confirmarContrasena" class="invalid-feedback">
                  {{ errors.confirmarContrasena }}
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Foto de Perfil -->
          <fieldset class="mb-4">
            <legend class="fieldset-legend">
              <i class="fas fa-camera me-2"></i>Foto de Perfil
            </legend>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="fotoPerfil" class="form-label">Foto de Perfil</label>
                <input 
                  type="file" 
                  class="form-control" 
                  id="fotoPerfil"
                  @change="handleFileUpload"
                  accept="image/*"
                />
                <small class="text-muted">Tamaño máximo: 2MB (Formatos: JPG, PNG)</small>
                <div v-if="errors.fotoPerfil" class="text-danger small mt-1">
                  {{ errors.fotoPerfil }}
                </div>
              </div>
              <div class="col-md-6">
                <div v-if="imagePreview" class="text-center">
                  <img 
                    :src="imagePreview" 
                    class="img-thumbnail rounded-circle"
                    style="width: 150px; height: 150px; object-fit: cover;"
                    alt="Preview"
                  />
                  <div class="mt-2">
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-danger"
                      @click="removeImage"
                    >
                      <i class="fas fa-times me-1"></i> Remover
                    </button>
                  </div>
                </div>
                <div v-else class="text-center">
                  <div 
                    class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                    style="width: 150px; height: 150px;"
                  >
                    <i class="fas fa-user fa-3x text-muted"></i>
                  </div>
                  <small class="text-muted">Sin foto</small>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Permisos -->
          <fieldset class="mb-4" v-if="form.rol">
            <legend class="fieldset-legend">
              <i class="fas fa-shield-alt me-2"></i>Permisos del Sistema
            </legend>
            <div class="row">
              <div class="col-12">
                <div class="alert alert-info">
                  <strong>Permisos asignados para {{ getRolText(form.rol) }}:</strong>
                  <ul class="mb-0 mt-2">
                    <li v-for="permiso in currentPermissions" :key="permiso">
                      {{ permiso }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- Botones -->
          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button 
              type="button" 
              class="btn btn-secondary me-md-2"
              @click="handleReset"
              :disabled="loading"
            >
              <i class="fas fa-undo me-2"></i>Limpiar
            </button>
            <button 
              type="submit" 
              class="btn btn-success"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ loading ? 'Guardando...' : 'Guardar Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de éxito -->
    <div 
      class="modal fade" 
      :class="{ show: showSuccessModal }"
      :style="{ display: showSuccessModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="fas fa-check-circle me-2"></i>¡Usuario Creado!
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showSuccessModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="lastCreatedUser">
            <div class="text-center mb-3">
              <i class="fas fa-user-check text-success" style="font-size: 3rem;"></i>
            </div>
            <h6 class="text-center">Usuario registrado correctamente</h6>
            <div class="alert alert-success">
              <strong>Nombre:</strong> {{ lastCreatedUser.nombres }} {{ lastCreatedUser.apellidos }}<br>
              <strong>Usuario:</strong> {{ lastCreatedUser.usuario }}<br>
              <strong>Email:</strong> {{ lastCreatedUser.email }}<br>
              <strong>Rol:</strong> {{ getRolText(lastCreatedUser.rol) }}
            </div>
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Importante:</strong> Comunique las credenciales al usuario de forma segura.
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button 
              type="button" 
              class="btn btn-success" 
              @click="showSuccessModal = false"
            >
              <i class="fas fa-plus me-1"></i>Crear Otro
            </button>
            <router-link to="/lista-usuarios" class="btn btn-outline-primary">
              <i class="fas fa-list me-1"></i>Ver Usuarios
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showSuccessModal"
      class="modal-backdrop fade show"
      @click="showSuccessModal = false"
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
const showPassword = ref(false)
const imagePreview = ref(null)
const showSuccessModal = ref(false)
const lastCreatedUser = ref(null)

const maxBirthDate = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  return maxDate.toISOString().split('T')[0]
})

const form = reactive({
  tipoDocumento: '',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  genero: '',
  fechaNacimiento: '',
  telefono: '',
  email: '',
  emailSecundario: '',
  rol: '',
  facultad: '',
  cargo: '',
  usuario: '',
  estado: 'activo',
  contrasena: '',
  confirmarContrasena: '',
  fotoPerfil: null
})

const errors = reactive({
  tipoDocumento: '',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  email: '',
  rol: '',
  usuario: '',
  contrasena: '',
  confirmarContrasena: '',
  fotoPerfil: ''
})

const passwordStrength = ref(0)

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

const currentPermissions = computed(() => {
  const permissions = {
    'administrador': [
      'Acceso completo al sistema',
      'Gestión de usuarios',
      'Configuración del sistema',
      'Reportes avanzados'
    ],
    'docente': [
      'Registro de mobiliario',
      'Consulta de inventario',
      'Reportar daños',
      'Actualizar perfil'
    ],
    'tecnico': [
      'Gestión de mantenimientos',
      'Reubicación de mobiliario',
      'Consulta de inventario',
      'Reportes técnicos'
    ],
    'invitado': [
      'Solo consulta de inventario',
      'Actualizar perfil personal'
    ]
  }
  return permissions[form.rol] || []
})

// Methods
const filterNameInput = (field) => {
  // Solo permitir letras y espacios
  form[field] = form[field].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
}

const filterPhoneInput = () => {
  // Solo permitir números
  form.telefono = form.telefono.replace(/[^0-9]/g, '')
}

const validateDocumento = () => {
  const documento = form.numeroDocumento
  errors.numeroDocumento = ''
  
  if (!documento) return
  
  if (form.tipoDocumento === 'cedula') {
    if (!/^\d{10}$/.test(documento)) {
      errors.numeroDocumento = 'La cédula debe tener 10 dígitos'
      return
    }
    
    // Validar algoritmo de cédula ecuatoriana
    if (!validarCedulaEcuatoriana(documento)) {
      errors.numeroDocumento = 'Número de cédula inválido'
    }
  } else if (form.tipoDocumento === 'pasaporte') {
    if (documento.length < 6 || documento.length > 12) {
      errors.numeroDocumento = 'El pasaporte debe tener entre 6 y 12 caracteres'
    }
  } else if (form.tipoDocumento === 'ruc') {
    if (!/^\d{13}$/.test(documento)) {
      errors.numeroDocumento = 'El RUC debe tener 13 dígitos'
    }
  }
  
  // Verificar si ya existe
  if (isDocumentExists(documento)) {
    errors.numeroDocumento = 'Este documento ya está registrado'
  }
}

const validarCedulaEcuatoriana = (cedula) => {
  if (cedula.length !== 10) return false
  
  const digitos = cedula.split('').map(Number)
  const provincia = parseInt(cedula.substring(0, 2))
  
  if (provincia < 1 || provincia > 24) return false
  
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let suma = 0
  
  for (let i = 0; i < 9; i++) {
    let producto = digitos[i] * coeficientes[i]
    if (producto > 9) producto -= 9
    suma += producto
  }
  
  const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10)
  return digitoVerificador === digitos[9]
}

const isDocumentExists = (documento) => {
  const users = getItem('users') || []
  return users.some(user => user.numeroDocumento === documento)
}

const validateFechaNacimiento = () => {
  errors.fechaNacimiento = ''
  
  if (!form.fechaNacimiento) return
  
  const birthDate = new Date(form.fechaNacimiento)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  if (age < 18) {
    errors.fechaNacimiento = 'El usuario debe ser mayor de edad'
  } else if (age > 100) {
    errors.fechaNacimiento = 'Fecha de nacimiento inválida'
  }
}

const validateEmail = () => {
  errors.email = ''
  
  if (!form.email) return
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Formato de email inválido'
    return
  }
  
  // Verificar si ya existe
  if (isEmailExists(form.email)) {
    errors.email = 'Este email ya está registrado'
  }
}

const isEmailExists = (email) => {
  const users = getItem('users') || []
  return users.some(user => user.email === email)
}

const validateUsuario = () => {
  errors.usuario = ''
  
  if (!form.usuario) return
  
  if (form.usuario.length < 6) {
    errors.usuario = 'El usuario debe tener al menos 6 caracteres'
    return
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(form.usuario)) {
    errors.usuario = 'Solo se permiten letras, números, guiones y puntos'
    return
  }
  
  // Verificar si ya existe
  if (isUsernameExists(form.usuario)) {
    errors.usuario = 'Este nombre de usuario ya existe'
  }
}

const isUsernameExists = (username) => {
  const users = getItem('users') || []
  return users.some(user => user.usuario === username)
}

const generarUsuario = () => {
  if (!form.nombres || !form.apellidos) {
    alert('Ingrese nombres y apellidos primero')
    return
  }
  
  const nombres = form.nombres.split(' ')[0].toLowerCase()
  const apellidos = form.apellidos.split(' ')[0].toLowerCase()
  let usuario = `${nombres}.${apellidos}`
  
  // Si ya existe, agregar números
  let counter = 1
  let originalUsuario = usuario
  
  while (isUsernameExists(usuario)) {
    usuario = `${originalUsuario}${counter}`
    counter++
  }
  
  form.usuario = usuario
  validateUsuario()
}

const validatePassword = () => {
  const password = form.contrasena
  let strength = 0
  
  if (password.length >= 8) strength += 25
  if (password.match(/[a-z]/)) strength += 25
  if (password.match(/[A-Z]/)) strength += 25
  if (password.match(/[0-9]/)) strength += 25
  if (password.match(/[^a-zA-Z0-9]/)) strength += 25
  
  passwordStrength.value = Math.min(strength, 100)
  
  errors.contrasena = ''
  if (password && password.length < 8) {
    errors.contrasena = 'La contraseña debe tener al menos 8 caracteres'
  }
}

const validatePasswordConfirm = () => {
  errors.confirmarContrasena = ''
  
  if (form.confirmarContrasena && form.contrasena !== form.confirmarContrasena) {
    errors.confirmarContrasena = 'Las contraseñas no coinciden'
  }
}

const updatePermissions = () => {
  // Los permisos se actualizan automáticamente via computed
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    errors.fotoPerfil = 'Solo se permiten imágenes JPEG o PNG'
    event.target.value = ''
    return
  }

  // Validar tamaño (2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.fotoPerfil = 'La imagen debe pesar menos de 2MB'
    event.target.value = ''
    return
  }

  errors.fotoPerfil = ''
  form.fotoPerfil = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.fotoPerfil = null
  imagePreview.value = null
  document.getElementById('fotoPerfil').value = ''
}

const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Validaciones obligatorias
  const requiredFields = [
    { field: 'tipoDocumento', message: 'El tipo de documento es obligatorio' },
    { field: 'numeroDocumento', message: 'El número de documento es obligatorio' },
    { field: 'nombres', message: 'Los nombres son obligatorios' },
    { field: 'apellidos', message: 'Los apellidos son obligatorios' },
    { field: 'email', message: 'El email es obligatorio' },
    { field: 'rol', message: 'El rol es obligatorio' },
    { field: 'usuario', message: 'El nombre de usuario es obligatorio' },
    { field: 'contrasena', message: 'La contraseña es obligatoria' },
    { field: 'confirmarContrasena', message: 'Debe confirmar la contraseña' }
  ]

  requiredFields.forEach(({ field, message }) => {
    if (!form[field] || !form[field].toString().trim()) {
      errors[field] = message
      isValid = false
    }
  })

  // Validaciones específicas
  if (form.numeroDocumento && !isValidDocument()) {
    isValid = false
  }

  if (form.email && !isValidEmail()) {
    isValid = false
  }

  if (form.usuario && form.usuario.length < 6) {
    errors.usuario = 'El usuario debe tener al menos 6 caracteres'
    isValid = false
  }

  if (form.contrasena && form.contrasena.length < 8) {
    errors.contrasena = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  if (form.contrasena !== form.confirmarContrasena) {
    errors.confirmarContrasena = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Verificar duplicados
  if (isDocumentExists(form.numeroDocumento)) {
    errors.numeroDocumento = 'Este documento ya está registrado'
    isValid = false
  }

  if (isEmailExists(form.email)) {
    errors.email = 'Este email ya está registrado'
    isValid = false
  }

  if (isUsernameExists(form.usuario)) {
    errors.usuario = 'Este nombre de usuario ya existe'
    isValid = false
  }

  return isValid
}

const isValidDocument = () => {
  if (form.tipoDocumento === 'cedula') {
    return /^\d{10}$/.test(form.numeroDocumento) && validarCedulaEcuatoriana(form.numeroDocumento)
  }
  return true
}

const isValidEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.email)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const userData = {
      id: Date.now(),
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento,
      nombres: form.nombres,
      apellidos: form.apellidos,
      genero: form.genero,
      fechaNacimiento: form.fechaNacimiento,
      telefono: form.telefono,
      email: form.email,
      emailSecundario: form.emailSecundario,
      rol: form.rol,
      facultad: form.facultad,
      cargo: form.cargo,
      usuario: form.usuario,
      estado: form.estado,
      contrasena: form.contrasena, // En producción esto debería ser hasheado
      fotoPerfil: form.fotoPerfil ? form.fotoPerfil.name : null,
      fechaCreacion: new Date().toISOString(),
      usuarioCreador: authStore.user?.id,
      ultimoAcceso: null,
      permisos: currentPermissions.value
    }

    // Guardar en localStorage
    const users = getItem('users') || []
    users.push(userData)
    setItem('users', users)

    // Registrar acción
    authStore.addRecentAction({
      type: 'create_user',
      description: 'Creó nuevo usuario',
      details: `${form.nombres} ${form.apellidos} - ${form.rol}`
    })

    // Preparar datos para el modal
    lastCreatedUser.value = userData

    // Mostrar modal de éxito
    showSuccessModal.value = true

    // Limpiar formulario
    resetForm()

  } catch (error) {
    console.error('Error al crear usuario:', error)
    alert('Error al crear el usuario. Intente nuevamente.')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  if (confirm('¿Está seguro de limpiar todos los campos?')) {
    resetForm()
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (key === 'estado') {
      form[key] = 'activo'
    } else if (key === 'fotoPerfil') {
      form[key] = null
    } else {
      form[key] = ''
    }
  })
  
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
  
  passwordStrength.value = 0
  removeImage()
}

const getRolText = (rol) => {
  const roles = {
    'administrador': 'Administrador',
    'docente': 'Docente',
    'tecnico': 'Técnico',
    'invitado': 'Invitado'
  }
  return roles[rol] || rol
}

onMounted(() => {
  // Configuración inicial si es necesaria
})
</script>

<style scoped>
.nuevo-usuario {
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

fieldset {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  background-color: #fafafa;
}

.fieldset-legend {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  padding: 0 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #dc3545;
  padding-bottom: 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
  color: white;
}

.btn-success:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

.progress {
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  transition: width 0.3s ease;
}

.img-thumbnail {
  border: 3px solid #e9ecef;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
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
  fieldset {
    padding: 1rem;
  }
  
  .fieldset-legend {
    font-size: 1rem;
  }
}
</style>