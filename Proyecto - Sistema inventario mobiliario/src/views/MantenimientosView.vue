<template>
  <div class="mantenimientos">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-principal">Mantenimiento de Mobiliario</h1>
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
            <label for="filtroEstado" class="form-label">Estado</label>
            <select 
              class="form-select" 
              id="filtroEstado"
              v-model="filters.estado"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroTipo" class="form-label">Tipo</label>
            <select 
              class="form-select" 
              id="filtroTipo"
              v-model="filters.tipo"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroFechaInicio" class="form-label">Fecha Inicio</label>
            <input 
              type="date" 
              class="form-control" 
              id="filtroFechaInicio"
              v-model="filters.fechaInicio"
              @change="applyFilters"
            />
          </div>
          <div class="col-md-3 mb-3">
            <label for="filtroFechaFin" class="form-label">Fecha Fin</label>
            <input 
              type="date" 
              class="form-control" 
              id="filtroFechaFin"
              v-model="filters.fechaFin"
              @change="applyFilters"
            />
          </div>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button 
            class="btn btn-outline-secondary me-md-2" 
            type="button"
            @click="clearFilters"
          >
            <i class="fas fa-sync-alt me-2"></i>Limpiar
          </button>
          <button 
            class="btn btn-uleam" 
            type="button"
            @click="applyFilters"
          >
            <i class="fas fa-search me-2"></i>Buscar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Mantenimientos -->
    <div class="card shadow-sm">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span>
          <i class="fas fa-list me-2"></i>Registros de Mantenimiento
        </span>
        <button 
          class="btn btn-sm btn-success" 
          @click="showNuevoModal = true"
        >
          <i class="fas fa-plus me-2"></i>Nuevo
        </button>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else-if="filteredMantenimientos.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-inbox fa-2x mb-3"></i>
          <p>No se encontraron mantenimientos</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>Código</th>
                <th>Mobiliario</th>
                <th>Fecha Reporte</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Técnico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mantenimiento in paginatedMantenimientos" :key="mantenimiento.id">
                <td>
                  <span class="badge bg-primary">{{ mantenimiento.codigo }}</span>
                </td>
                <td>
                  <div>
                    <strong>{{ mantenimiento.mobiliarioTipo }}</strong>
                    <br>
                    <small class="text-muted">{{ mantenimiento.mobiliarioCodigo }}</small>
                  </div>
                </td>
                <td>{{ formatDate(mantenimiento.fechaCreacion) }}</td>
                <td>
                  <span 
                    class="badge"
                    :class="getTipoBadgeClass(mantenimiento.tipo)"
                  >
                    {{ getTipoText(mantenimiento.tipo) }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="getEstadoBadgeClass(mantenimiento.estado)"
                  >
                    {{ getEstadoText(mantenimiento.estado) }}
                  </span>
                </td>
                <td>
                  {{ mantenimiento.tecnicoAsignado || 'Sin asignar' }}
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary" 
                      title="Ver detalles"
                      @click="viewMantenimiento(mantenimiento)"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-success" 
                      title="Editar"
                      @click="editMantenimiento(mantenimiento)"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      title="Eliminar"
                      @click="deleteMantenimiento(mantenimiento)"
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
        <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-3">
          <ul class="pagination justify-content-center">
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

    <!-- Modal Nuevo Mantenimiento -->
    <div 
      class="modal fade" 
      :class="{ show: showNuevoModal }"
      :style="{ display: showNuevoModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              <i class="fas fa-plus-circle me-2"></i>Nuevo Mantenimiento
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="closeNuevoModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitNuevo">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="codigoMobiliario" class="form-label">
                    Código Mobiliario <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      id="codigoMobiliario"
                      v-model="nuevoForm.codigoMobiliario"
                      :class="{ 'is-invalid': nuevoErrors.codigoMobiliario }"
                      placeholder="ULEAM-XXXX"
                      @blur="buscarMobiliarioNuevo"
                    />
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="buscarMobiliarioNuevo"
                    >
                      <i class="fas fa-search"></i>
                    </button>
                    <div v-if="nuevoErrors.codigoMobiliario" class="invalid-feedback">
                      {{ nuevoErrors.codigoMobiliario }}
                    </div>
                  </div>
                  <div v-if="mobiliarioEncontradoNuevo" class="mt-2 p-2 bg-light rounded">
                    <small class="text-success">
                      <i class="fas fa-check-circle me-1"></i>
                      <strong>{{ mobiliarioEncontradoNuevo.tipo }}</strong> - 
                      {{ mobiliarioEncontradoNuevo.ubicacion.edificio }}, {{ mobiliarioEncontradoNuevo.ubicacion.aula }}
                    </small>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="tipoMantenimiento" class="form-label">
                    Tipo de Mantenimiento <span class="text-danger">*</span>
                  </label>
                  <select 
                    class="form-select" 
                    id="tipoMantenimiento"
                    v-model="nuevoForm.tipo"
                    :class="{ 'is-invalid': nuevoErrors.tipo }"
                  >
                    <option value="" disabled>Seleccione...</option>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                    <option value="urgente">Urgente</option>
                  </select>
                  <div v-if="nuevoErrors.tipo" class="invalid-feedback">
                    {{ nuevoErrors.tipo }}
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="descripcionMantenimiento" class="form-label">
                  Descripción <span class="text-danger">*</span>
                </label>
                <textarea 
                  class="form-control" 
                  id="descripcionMantenimiento" 
                  rows="3"
                  v-model="nuevoForm.descripcion"
                  :class="{ 'is-invalid': nuevoErrors.descripcion }"
                  placeholder="Describa el mantenimiento a realizar..."
                  maxlength="500"
                ></textarea>
                <div class="d-flex justify-content-between">
                  <div v-if="nuevoErrors.descripcion" class="invalid-feedback d-block">
                    {{ nuevoErrors.descripcion }}
                  </div>
                  <small class="text-muted">{{ nuevoForm.descripcion.length }}/500 caracteres</small>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="tecnicoAsignado" class="form-label">
                    Técnico Asignado <span class="text-danger">*</span>
                  </label>
                  <select 
                    class="form-select" 
                    id="tecnicoAsignado"
                    v-model="nuevoForm.tecnicoAsignado"
                    :class="{ 'is-invalid': nuevoErrors.tecnicoAsignado }"
                  >
                    <option value="" disabled>Seleccione...</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="María González">María González</option>
                    <option value="Carlos Rodríguez">Carlos Rodríguez</option>
                    <option value="Ana Martínez">Ana Martínez</option>
                  </select>
                  <div v-if="nuevoErrors.tecnicoAsignado" class="invalid-feedback">
                    {{ nuevoErrors.tecnicoAsignado }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="fechaProgramada" class="form-label">
                    Fecha Programada <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="fechaProgramada"
                    v-model="nuevoForm.fechaProgramada"
                    :class="{ 'is-invalid': nuevoErrors.fechaProgramada }"
                    :min="today"
                  />
                  <div v-if="nuevoErrors.fechaProgramada" class="invalid-feedback">
                    {{ nuevoErrors.fechaProgramada }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="prioridad" class="form-label">Prioridad</label>
                  <select class="form-select" id="prioridad" v-model="nuevoForm.prioridad">
                    <option value="baja">Baja</option>
                    <option value="media" selected>Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="costoEstimado" class="form-label">Costo Estimado (USD)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="costoEstimado"
                    v-model.number="nuevoForm.costoEstimado"
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="observaciones" class="form-label">Observaciones</label>
                <textarea 
                  class="form-control" 
                  id="observaciones" 
                  rows="2"
                  v-model="nuevoForm.observaciones"
                  placeholder="Observaciones adicionales..."
                  maxlength="300"
                ></textarea>
                <small class="text-muted">{{ nuevoForm.observaciones.length }}/300 caracteres</small>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeNuevoModal"
              :disabled="loadingNuevo"
            >
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="handleSubmitNuevo"
              :disabled="loadingNuevo"
            >
              <span v-if="loadingNuevo" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ loadingNuevo ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Detalles -->
    <div 
      class="modal fade" 
      :class="{ show: showDetallesModal }"
      :style="{ display: showDetallesModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              <i class="fas fa-info-circle me-2"></i>Detalles del Mantenimiento
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showDetallesModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedMantenimiento">
            <div class="row">
              <div class="col-md-6">
                <h6>Información General</h6>
                <table class="table table-borderless table-sm">
                  <tr>
                    <td class="fw-bold">Código:</td>
                    <td>{{ selectedMantenimiento.codigo }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Tipo:</td>
                    <td>
                      <span 
                        class="badge"
                        :class="getTipoBadgeClass(selectedMantenimiento.tipo)"
                      >
                        {{ getTipoText(selectedMantenimiento.tipo) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Estado:</td>
                    <td>
                      <span 
                        class="badge"
                        :class="getEstadoBadgeClass(selectedMantenimiento.estado)"
                      >
                        {{ getEstadoText(selectedMantenimiento.estado) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Prioridad:</td>
                    <td>
                      <span 
                        class="badge"
                        :class="getPrioridadBadgeClass(selectedMantenimiento.prioridad)"
                      >
                        {{ getPrioridadText(selectedMantenimiento.prioridad) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Técnico:</td>
                    <td>{{ selectedMantenimiento.tecnicoAsignado }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Información del Mobiliario</h6>
                <table class="table table-borderless table-sm">
                  <tr>
                    <td class="fw-bold">Código:</td>
                    <td>{{ selectedMantenimiento.mobiliarioCodigo }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Tipo:</td>
                    <td>{{ selectedMantenimiento.mobiliarioTipo }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Ubicación:</td>
                    <td>{{ selectedMantenimiento.ubicacion }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Fecha Creación:</td>
                    <td>{{ formatDate(selectedMantenimiento.fechaCreacion) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Fecha Programada:</td>
                    <td>{{ formatDate(selectedMantenimiento.fechaProgramada) }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <h6>Descripción</h6>
                <p class="text-muted">{{ selectedMantenimiento.descripcion }}</p>
                
                <div v-if="selectedMantenimiento.observaciones">
                  <h6>Observaciones</h6>
                  <p class="text-muted">{{ selectedMantenimiento.observaciones }}</p>
                </div>
                
                <div v-if="selectedMantenimiento.costoEstimado">
                  <h6>Costo Estimado</h6>
                  <p class="text-success fw-bold">${{ selectedMantenimiento.costoEstimado }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showDetallesModal = false"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showNuevoModal || showDetallesModal"
      class="modal-backdrop fade show"
      @click="closeModals"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useMobiliarioStore } from '@/stores/mobiliario'
import { useAuthStore } from '@/stores/auth'
import { useLocalStorage } from '@/composables/useLocalStorage'

const mobiliarioStore = useMobiliarioStore()
const authStore = useAuthStore()
const { getItem, setItem } = useLocalStorage()

const loading = ref(false)
const loadingNuevo = ref(false)
const showNuevoModal = ref(false)
const showDetallesModal = ref(false)
const selectedMantenimiento = ref(null)
const mantenimientos = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const mobiliarioEncontradoNuevo = ref(null)

const today = computed(() => new Date().toISOString().split('T')[0])

const filters = reactive({
  estado: '',
  tipo: '',
  fechaInicio: '',
  fechaFin: ''
})

const nuevoForm = reactive({
  codigoMobiliario: '',
  tipo: '',
  descripcion: '',
  tecnicoAsignado: '',
  fechaProgramada: '',
  prioridad: 'media',
  costoEstimado: null,
  observaciones: ''
})

const nuevoErrors = reactive({
  codigoMobiliario: '',
  tipo: '',
  descripcion: '',
  tecnicoAsignado: '',
  fechaProgramada: ''
})

// Computed
const filteredMantenimientos = computed(() => {
  let filtered = [...mantenimientos.value]
  
  if (filters.estado) {
    filtered = filtered.filter(m => m.estado === filters.estado)
  }
  
  if (filters.tipo) {
    filtered = filtered.filter(m => m.tipo === filters.tipo)
  }
  
  if (filters.fechaInicio) {
    filtered = filtered.filter(m => 
      new Date(m.fechaCreacion) >= new Date(filters.fechaInicio)
    )
  }
  
  if (filters.fechaFin) {
    filtered = filtered.filter(m => 
      new Date(m.fechaCreacion) <= new Date(filters.fechaFin)
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredMantenimientos.value.length / itemsPerPage)
})

const paginatedMantenimientos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMantenimientos.value.slice(start, end)
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
const loadMantenimientos = () => {
  loading.value = true
  try {
    // Cargar mantenimientos desde localStorage
    const savedMantenimientos = getItem('maintenances') || []
    
    // Cargar también reportes de daño como mantenimientos
    const reportes = getItem('damage_reports') || []
    const mantenimientosFromReportes = reportes.map(reporte => ({
      id: reporte.id,
      codigo: reporte.codigo.replace('RPT-', 'MNT-'),
      mobiliarioCodigo: reporte.mobiliarioCodigo,
      mobiliarioTipo: reporte.mobiliarioTipo,
      tipo: 'correctivo',
      descripcion: `Reparar: ${reporte.descripcion}`,
      estado: 'pendiente',
      tecnicoAsignado: null,
      fechaCreacion: reporte.fechaReporte,
      fechaProgramada: null,
      prioridad: reporte.nivelUrgencia === 'critico' ? 'critica' : 
                 reporte.nivelUrgencia === 'alto' ? 'alta' : 'media',
      costoEstimado: null,
      observaciones: reporte.comentarios,
      ubicacion: reporte.ubicacion,
      origen: 'reporte'
    }))
    
    mantenimientos.value = [...savedMantenimientos, ...mantenimientosFromReportes]
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

const buscarMobiliarioNuevo = () => {
  if (!nuevoForm.codigoMobiliario.trim()) {
    nuevoErrors.codigoMobiliario = 'Ingrese un código válido'
    return
  }

  const item = mobiliarioStore.items.find(
    item => item.codigo.toLowerCase() === nuevoForm.codigoMobiliario.toLowerCase()
  )

  if (item) {
    mobiliarioEncontradoNuevo.value = item
    nuevoErrors.codigoMobiliario = ''
  } else {
    mobiliarioEncontradoNuevo.value = null
    nuevoErrors.codigoMobiliario = 'Mobiliario no encontrado'
  }
}

const validateNuevoForm = () => {
  Object.keys(nuevoErrors).forEach(key => {
    nuevoErrors[key] = ''
  })

  let isValid = true

  if (!nuevoForm.codigoMobiliario.trim()) {
    nuevoErrors.codigoMobiliario = 'El código del mobiliario es obligatorio'
    isValid = false
  } else if (!mobiliarioEncontradoNuevo.value) {
    nuevoErrors.codigoMobiliario = 'Debe buscar y seleccionar un mobiliario válido'
    isValid = false
  }

  if (!nuevoForm.tipo) {
    nuevoErrors.tipo = 'El tipo de mantenimiento es obligatorio'
    isValid = false
  }

  if (!nuevoForm.descripcion.trim()) {
    nuevoErrors.descripcion = 'La descripción es obligatoria'
    isValid = false
  } else if (nuevoForm.descripcion.length < 10) {
    nuevoErrors.descripcion = 'La descripción debe tener al menos 10 caracteres'
    isValid = false
  }

  if (!nuevoForm.tecnicoAsignado) {
    nuevoErrors.tecnicoAsignado = 'El técnico asignado es obligatorio'
    isValid = false
  }

  if (!nuevoForm.fechaProgramada) {
    nuevoErrors.fechaProgramada = 'La fecha programada es obligatoria'
    isValid = false
  } else if (nuevoForm.fechaProgramada < today.value) {
    nuevoErrors.fechaProgramada = 'La fecha no puede ser anterior a hoy'
    isValid = false
  }

  return isValid
}

const handleSubmitNuevo = async () => {
  if (!validateNuevoForm()) {
    return
  }

  loadingNuevo.value = true

  try {
    const mantenimientoData = {
      id: Date.now(),
      codigo: `MNT-${Date.now()}`,
      mobiliarioCodigo: nuevoForm.codigoMobiliario,
      mobiliarioTipo: mobiliarioEncontradoNuevo.value?.tipo,
      tipo: nuevoForm.tipo,
      descripcion: nuevoForm.descripcion,
      estado: 'pendiente',
      tecnicoAsignado: nuevoForm.tecnicoAsignado,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaProgramada: nuevoForm.fechaProgramada,
      prioridad: nuevoForm.prioridad,
      costoEstimado: nuevoForm.costoEstimado,
      observaciones: nuevoForm.observaciones,
      ubicacion: `${mobiliarioEncontradoNuevo.value?.ubicacion.edificio}, ${mobiliarioEncontradoNuevo.value?.ubicacion.aula}`,
      usuarioCreacion: authStore.user?.id,
      origen: 'manual'
    }

    // Guardar en localStorage
    const savedMantenimientos = getItem('maintenances') || []
    savedMantenimientos.push(mantenimientoData)
    setItem('maintenances', savedMantenimientos)

    // Registrar acción
    authStore.addRecentAction({
      type: 'create_maintenance',
      description: 'Creó nuevo mantenimiento',
      details: `${mobiliarioEncontradoNuevo.value?.tipo} - ${nuevoForm.codigoMobiliario}`
    })

    // Recargar lista
    loadMantenimientos()

    // Cerrar modal
    closeNuevoModal()

  } catch (error) {
    console.error('Error al crear mantenimiento:', error)
    alert('Error al crear el mantenimiento. Intente nuevamente.')
  } finally {
    loadingNuevo.value = false
  }
}

const closeNuevoModal = () => {
  showNuevoModal.value = false
  resetNuevoForm()
}

const resetNuevoForm = () => {
  Object.keys(nuevoForm).forEach(key => {
    if (key === 'prioridad') {
      nuevoForm[key] = 'media'
    } else if (key === 'costoEstimado') {
      nuevoForm[key] = null
    } else {
      nuevoForm[key] = ''
    }
  })
  
  Object.keys(nuevoErrors).forEach(key => {
    nuevoErrors[key] = ''
  })
  
  mobiliarioEncontradoNuevo.value = null
}

const viewMantenimiento = (mantenimiento) => {
  selectedMantenimiento.value = mantenimiento
  showDetallesModal.value = true
}

const editMantenimiento = (mantenimiento) => {
  console.log('Editar mantenimiento:', mantenimiento)
  // Implementar edición
}

const deleteMantenimiento = (mantenimiento) => {
  if (confirm(`¿Está seguro de eliminar el mantenimiento ${mantenimiento.codigo}?`)) {
    const savedMantenimientos = getItem('maintenances') || []
    const updatedMantenimientos = savedMantenimientos.filter(m => m.id !== mantenimiento.id)
    setItem('maintenances', updatedMantenimientos)
    
    authStore.addRecentAction({
      type: 'delete_maintenance',
      description: 'Eliminó mantenimiento',
      details: `${mantenimiento.mobiliarioTipo} - ${mantenimiento.codigo}`
    })
    
    loadMantenimientos()
  }
}

const closeModals = () => {
  showNuevoModal.value = false
  showDetallesModal.value = false
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'No especificado'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getTipoText = (tipo) => {
  const tipos = {
    'preventivo': 'Preventivo',
    'correctivo': 'Correctivo',
    'urgente': 'Urgente'
  }
  return tipos[tipo] || tipo
}

const getTipoBadgeClass = (tipo) => {
  const classes = {
    'preventivo': 'bg-info',
    'correctivo': 'bg-warning',
    'urgente': 'bg-danger'
  }
  return classes[tipo] || 'bg-secondary'
}

const getEstadoText = (estado) => {
  const estados = {
    'pendiente': 'Pendiente',
    'en-proceso': 'En Proceso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return estados[estado] || estado
}

const getEstadoBadgeClass = (estado) => {
  const classes = {
    'pendiente': 'bg-warning',
    'en-proceso': 'bg-primary',
    'completado': 'bg-success',
    'cancelado': 'bg-secondary'
  }
  return classes[estado] || 'bg-secondary'
}

const getPrioridadText = (prioridad) => {
  const prioridades = {
    'baja': 'Baja',
    'media': 'Media',
    'alta': 'Alta',
    'critica': 'Crítica'
  }
  return prioridades[prioridad] || prioridad
}

const getPrioridadBadgeClass = (prioridad) => {
  const classes = {
    'baja': 'bg-success',
    'media': 'bg-info',
    'alta': 'bg-warning',
    'critica': 'bg-danger'
  }
  return classes[prioridad] || 'bg-secondary'
}

onMounted(() => {
  mobiliarioStore.loadItems()
  loadMantenimientos()
  nuevoForm.fechaProgramada = today.value
})
</script>

<style scoped>
.mantenimientos {
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
</style>