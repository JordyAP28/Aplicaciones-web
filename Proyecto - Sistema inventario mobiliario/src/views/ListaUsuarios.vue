<template>
  <div class="lista-usuarios">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-principal">Listado de Usuarios</h1>
        <hr>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-dark text-white">
        <i class="fas fa-filter me-2"></i>Filtros de Búsqueda
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="filtroRol" class="form-label">Rol</label>
            <select 
              class="form-select" 
              id="filtroRol"
              v-model="filters.rol"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="administrador">Administrador</option>
              <option value="docente">Docente</option>
              <option value="tecnico">Técnico</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroEstado" class="form-label">Estado</label>
            <select 
              class="form-select" 
              id="filtroEstado"
              v-model="filters.estado"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroFacultad" class="form-label">Facultad</label>
            <select 
              class="form-select" 
              id="filtroFacultad"
              v-model="filters.facultad"
              @change="applyFilters"
            >
              <option value="">Todas</option>
              <option value="facci">FACCI</option>
              <option value="fci">FCI</option>
              <option value="fadcom">FADCOM</option>
              <option value="medicina">Medicina</option>
              <option value="educacion">Educación</option>
              <option value="administrativo">Administrativo</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroBusqueda" class="form-label">Buscar</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="filtroBusqueda"
                v-model="filters.busqueda"
                @input="applyFilters"
                placeholder="Nombre, documento, email..."
              />
              <button class="btn btn-uleam" type="button" @click="clearFilters">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="card shadow-sm">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>
          <i class="fas fa-list me-2"></i>Registros de Usuarios
          <span class="badge bg-light text-dark ms-2">{{ filteredUsers.length }}</span>
        </span>
        <div>
          <button 
            class="btn btn-sm btn-success me-2" 
            @click="exportUsers"
          >
            <i class="fas fa-file-excel me-2"></i>Exportar
          </button>
          <router-link 
            to="/nuevo-usuario" 
            class="btn btn-sm btn-primary"
          >
            <i class="fas fa-plus me-2"></i>Nuevo Usuario
          </router-link>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-users-slash fa-3x mb-3"></i>
          <h5>No se encontraron usuarios</h5>
          <p>No hay usuarios que coincidan con los filtros aplicados.</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover table-striped">
            <thead class="table-dark">
              <tr>
                <th width="50px">#</th>
                <th>Usuario</th>
                <th>Nombres</th>
                <th>Rol</th>
                <th>Documento</th>
                <th>Estado</th>
                <th>Último Acceso</th>
                <th width="120px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in paginatedUsers" :key="user.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="user.avatar || '/img/default-avatar.png'" 
                      class="rounded-circle me-2"
                      width="32"
                      height="32"
                      :alt="user.nombres"
                      style="object-fit: cover;"
                    />
                    <div>
                      <span class="fw-bold">{{ user.usuario }}</span>
                      <br>
                      <small class="text-muted">{{ user.email }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span class="fw-bold">{{ user.nombres }} {{ user.apellidos }}</span>
                    <br>
                    <small class="text-muted">{{ getFacultadText(user.facultad) }}</small>
                  </div>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="getRolBadgeClass(user.rol)"
                  >
                    {{ getRolText(user.rol) }}
                  </span>
                </td>
                <td>
                  <span>{{ user.numeroDocumento }}</span>
                  <br>
                  <small class="text-muted">{{ getTipoDocumentoText(user.tipoDocumento) }}</small>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="getEstadoBadgeClass(user.estado)"
                  >
                    {{ getEstadoText(user.estado) }}
                  </span>
                </td>
                <td>
                  <span v-if="user.ultimoAcceso">
                    {{ formatDate(user.ultimoAcceso) }}
                  </span>
                  <span v-else class="text-muted">Nunca</span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm" role="group">
                    <button 
                      type="button" 
                      class="btn btn-outline-primary" 
                      title="Ver detalles"
                      @click="viewUser(user)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-warning" 
                      title="Editar"
                      @click="editUser(user)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-danger" 
                      title="Eliminar"
                      @click="deleteUser(user)"
                      :disabled="user.id === currentUser?.id"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Paginación -->
        <div class="card-footer bg-white" v-if="totalPages > 1">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted">
              Mostrando <span class="fw-bold">{{ startIndex }}-{{ endIndex }}</span> 
              de <span class="fw-bold">{{ filteredUsers.length }}</span> usuarios
            </div>
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button 
                    class="page-link" 
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                  >
                    Anterior
                  </button>
                </li>
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item" 
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button 
                    class="page-link" 
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Usuario -->
    <div 
      class="modal fade" 
      :class="{ show: showViewModal }"
      :style="{ display: showViewModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              <i class="fas fa-user me-2"></i>Detalles del Usuario
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showViewModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-md-4 text-center mb-3">
                <img 
                  :src="selectedUser.avatar || '/img/default-avatar.png'" 
                  class="rounded-circle img-thumbnail"
                  width="150"
                  height="150"
                  :alt="selectedUser.nombres"
                  style="object-fit: cover;"
                />
                <h5 class="mt-2">{{ selectedUser.nombres }} {{ selectedUser.apellidos }}</h5>
                <p class="text-muted">@{{ selectedUser.usuario }}</p>
                <span 
                  class="badge"
                  :class="getEstadoBadgeClass(selectedUser.estado)"
                >
                  {{ getEstadoText(selectedUser.estado) }}
                </span>
              </div>
              <div class="col-md-8">
                <div class="row">
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Documento:</label>
                    <p>{{ selectedUser.numeroDocumento }} ({{ getTipoDocumentoText(selectedUser.tipoDocumento) }})</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Email:</label>
                    <p>{{ selectedUser.email }}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Teléfono:</label>
                    <p>{{ selectedUser.telefono || 'No especificado' }}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Fecha Nacimiento:</label>
                    <p>{{ formatDate(selectedUser.fechaNacimiento) || 'No especificado' }}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Rol:</label>
                    <p>
                      <span 
                        class="badge"
                        :class="getRolBadgeClass(selectedUser.rol)"
                      >
                        {{ getRolText(selectedUser.rol) }}
                      </span>
                    </p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Facultad:</label>
                    <p>{{ getFacultadText(selectedUser.facultad) }}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Cargo:</label>
                    <p>{{ selectedUser.cargo || 'No especificado' }}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <label class="form-label fw-bold">Creado:</label>
                    <p>{{ formatDate(selectedUser.fechaCreacion) }}</p>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label fw-bold">Último Acceso:</label>
                    <p>{{ selectedUser.ultimoAcceso ? formatDateTime(selectedUser.ultimoAcceso) : 'Nunca ha accedido' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Permisos -->
            <div class="mt-3" v-if="selectedUser.permisos">
              <h6>Permisos del Sistema:</h6>
              <div class="row">
                <div class="col-12">
                  <ul class="list-group list-group-flush">
                    <li 
                      v-for="permiso in selectedUser.permisos" 
                      :key="permiso"
                      class="list-group-item d-flex align-items-center"
                    >
                      <i class="fas fa-check-circle text-success me-2"></i>
                      {{ permiso }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showViewModal = false"
            >
              Cerrar
            </button>
            <button 
              type="button" 
              class="btn btn-warning"
              @click="editUser(selectedUser)"
            >
              <i class="fas fa-edit me-1"></i>Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showViewModal"
      class="modal-backdrop fade show"
      @click="showViewModal = false"
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
const showViewModal = ref(false)
const selectedUser = ref(null)
const users = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

const currentUser = computed(() => authStore.user)

const filters = reactive({
  rol: '',
  estado: '',
  facultad: '',
  busqueda: ''
})

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value]
  
  if (filters.rol) {
    filtered = filtered.filter(user => user.rol === filters.rol)
  }
  
  if (filters.estado) {
    filtered = filtered.filter(user => user.estado === filters.estado)
  }
  
  if (filters.facultad) {
    filtered = filtered.filter(user => user.facultad === filters.facultad)
  }
  
  if (filters.busqueda) {
    const search = filters.busqueda.toLowerCase()
    filtered = filtered.filter(user =>
      user.nombres.toLowerCase().includes(search) ||
      user.apellidos.toLowerCase().includes(search) ||
      user.usuario.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.numeroDocumento.includes(search)
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const startIndex = computed(() => {
  if (filteredUsers.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredUsers.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const start = Math.max(1, current - 2)
    const end = Math.min(total, start + maxVisible - 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Methods
const loadUsers = () => {
  loading.value = true
  try {
    const savedUsers = getItem('users') || []
    
    // Agregar usuario actual si no existe
    if (savedUsers.length === 0) {
      const currentUserData = {
        id: 1,
        nombres: 'Administrador',
        apellidos: 'Sistema',
        usuario: 'admin',
        email: 'admin@uleam.edu.ec',
        rol: 'administrador',
        estado: 'activo',
        numeroDocumento: '1234567890',
        tipoDocumento: 'cedula',
        facultad: 'administrativo',
        fechaCreacion: new Date().toISOString(),
        ultimoAcceso: new Date().toISOString(),
        permisos: [
          'Acceso completo al sistema',
          'Gestión de usuarios',
          'Configuración del sistema',
          'Reportes avanzados'
        ]
      }
      savedUsers.push(currentUserData)
      setItem('users', savedUsers)
    }
    
    users.value = savedUsers
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const viewUser = (user) => {
  selectedUser.value = user
  showViewModal.value = true
  
  authStore.addRecentAction({
    type: 'view_user',
    description: 'Vio detalles de usuario',
    details: `${user.nombres} ${user.apellidos}`
  })
}

const editUser = (user) => {
  console.log('Editar usuario:', user)
  showViewModal.value = false
  // Aquí se implementaría la navegación al formulario de edición
  // O se podría abrir un modal de edición
}

const deleteUser = (user) => {
  if (user.id === currentUser.value?.id) {
    alert('No puedes eliminar tu propio usuario')
    return
  }
  
  if (confirm(`¿Está seguro de eliminar al usuario ${user.nombres} ${user.apellidos}?`)) {
    users.value = users.value.filter(u => u.id !== user.id)
    
    // Actualizar en localStorage
    setItem('users', users.value)
    
    authStore.addRecentAction({
      type: 'delete_user',
      description: 'Eliminó usuario',
      details: `${user.nombres} ${user.apellidos}`
    })
    
    // Si estamos en la última página y no quedan elementos, ir a la anterior
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

const exportUsers = () => {
  const data = filteredUsers.value.map(user => ({
    'Nombres': `${user.nombres} ${user.apellidos}`,
    'Usuario': user.usuario,
    'Email': user.email,
    'Documento': user.numeroDocumento,
    'Tipo Documento': getTipoDocumentoText(user.tipoDocumento),
    'Rol': getRolText(user.rol),
    'Estado': getEstadoText(user.estado),
    'Facultad': getFacultadText(user.facultad),
    'Fecha Creación': formatDate(user.fechaCreacion),
    'Último Acceso': user.ultimoAcceso ? formatDateTime(user.ultimoAcceso) : 'Nunca'
  }))
  
  const csvContent = generateCSV(data)
  downloadFile(csvContent, 'usuarios.csv', 'text/csv')
  
  authStore.addRecentAction({
    type: 'export_users',
    description: 'Exportó lista de usuarios',
    details: `${data.length} usuarios`
  })
}

const generateCSV = (data) => {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => Object.values(row))
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
  
  return csvContent
}

const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'No especificado'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'No especificado'
  return new Date(dateString).toLocaleString('es-ES')
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

const getRolBadgeClass = (rol) => {
  const classes = {
    'administrador': 'bg-danger',
    'docente': 'bg-primary',
    'tecnico': 'bg-warning',
    'invitado': 'bg-secondary'
  }
  return classes[rol] || 'bg-secondary'
}

const getEstadoText = (estado) => {
  const estados = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'pendiente': 'Pendiente'
  }
  return estados[estado] || estado
}

const getEstadoBadgeClass = (estado) => {
  const classes = {
    'activo': 'bg-success',
    'inactivo': 'bg-secondary',
    'pendiente': 'bg-warning'
  }
  return classes[estado] || 'bg-secondary'
}

const getTipoDocumentoText = (tipo) => {
  const tipos = {
    'cedula': 'Cédula',
    'pasaporte': 'Pasaporte',
    'ruc': 'RUC'
  }
  return tipos[tipo] || tipo
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

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.lista-usuarios {
  animation: fadeInUp 0.6s ease-out;
}

.titulo-principal {
  color: #dc3545;
  font-weight: bold;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 1rem;
}

.btn-uleam {
  background: linear-gradient(45deg, #dc3545, #c82333);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-uleam:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
  color: white;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.8rem;
  padding: 0.5em 0.8em;
}

.btn-group .btn {
  border-radius: 4px;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.btn-group .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination .page-link {
  color: #dc3545;
  border-color: #dc3545;
}

.pagination .page-item.active .page-link {
  background-color: #dc3545;
  border-color: #dc3545;
}

.pagination .page-link:hover {
  color: #c82333;
  background-color: #f8f9fa;
  border-color: #c82333;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.img-thumbnail {
  border: 3px solid #e9ecef;
}

.list-group-item {
  border: none;
  padding: 0.5rem 0;
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
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group .btn {
    padding: 0.25rem 0.5rem;
  }
  
  .badge {
    font-size: 0.7rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}
</style>