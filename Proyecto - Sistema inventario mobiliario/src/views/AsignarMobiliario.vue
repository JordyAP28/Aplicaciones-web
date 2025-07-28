<template>
  <div class="asignar-mobiliario">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-principal">Reubicación de Mobiliario</h1>
        <hr>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="fas fa-filter me-2"></i> Filtros
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <label class="form-label">Código</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="QR/ID"
                  v-model="filters.codigo"
                  @input="applyFilters"
                />
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Ubicación Actual</label>
                <select 
                  class="form-select" 
                  v-model="filters.ubicacion"
                  @change="applyFilters"
                >
                  <option value="">Todas las ubicaciones</option>
                  <option value="Edificio A">Edificio A</option>
                  <option value="Edificio B">Edificio B</option>
                  <option value="Edificio C">Edificio C</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Tipo de Mobiliario</label>
                <select 
                  class="form-select" 
                  v-model="filters.tipo"
                  @change="applyFilters"
                >
                  <option value="">Todos los tipos</option>
                  <option value="silla">Sillas</option>
                  <option value="mesa">Mesas</option>
                  <option value="escritorio">Escritorios</option>
                  <option value="estante">Estantes</option>
                  <option value="pizarra">Pizarras</option>
                </select>
              </div>
              <div class="col-md-2 mb-3 d-flex align-items-end">
                <button class="btn btn-uleam w-100" @click="clearFilters">
                  <i class="fas fa-sync me-2"></i> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Mobiliario -->
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i> Mobiliario Disponible
            </h5>
          </div>
          <div class="card-body" style="max-height: 400px; overflow-y: auto;">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            <div v-else-if="filteredItems.length === 0" class="text-center py-4 text-muted">
              <i class="fas fa-inbox fa-2x mb-3"></i>
              <p>No se encontraron elementos</p>
            </div>
            <div v-else class="list-group">
              <button
                v-for="item in filteredItems"
                :key="item.id"
                type="button"
                class="list-group-item list-group-item-action mobiliario-card"
                :class="{ active: selectedItem?.id === item.id }"
                @click="selectItem(item)"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">
                      <i class="fase m-2" :class="getTypeIcon(item.categoria)"></i>
                      {{ item.tipo }}
                    </h6>
                    <small class="text-muted">Código: {{ item.codigo }}</small>
                    <br>
                    <small class="text-muted">Material: {{ item.material }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-secondary mb-1">
                      {{ item.ubicacion.edificio }}
                    </span>
                    <br>
                    <small class="text-muted">{{ item.ubicacion.aula }}</small>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de Reubicación -->
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h5 class="mb-0">
              <i class="fas fa-edit me-2"></i> Detalles de Reubicación
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <label class="form-label">Mobiliario seleccionado</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="selectedItem ? `${selectedItem.tipo} - ${selectedItem.codigo}` : ''"
                    readonly
                    placeholder="Seleccione un elemento de la lista"
                  />
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Ubicación Actual</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    :value="selectedItem ? `${selectedItem.ubicacion.edificio}, ${selectedItem.ubicacion.aula}` : ''"
                    readonly
                  />
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Nueva Facultad <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.nuevaFacultad"
                    :class="{ 'is-invalid': errors.nuevaFacultad }"
                    @change="updateEdificio"
                    :disabled="!selectedItem"
                  >
                    <option value="" disabled>Seleccione facultad</option>
                    <option value="ingenieria">Ingeniería</option>
                    <option value="medicina">Medicina</option>
                    <option value="educacion">Educación</option>
                  </select>
                  <div v-if="errors.nuevaFacultad" class="invalid-feedback">
                    {{ errors.nuevaFacultad }}
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <label class="form-label">Nueva Aula <span class="text-danger">*</span></label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="form.nuevaUbicacion"
                    :class="{ 'is-invalid': errors.nuevaUbicacion }"
                    placeholder="Ej: Aula 101, Lab 3"
                    :disabled="!selectedItem"
                  />
                  <div v-if="errors.nuevaUbicacion" class="invalid-feedback">
                    {{ errors.nuevaUbicacion }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label class="form-label">Responsable <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    v-model="form.responsable"
                    :class="{ 'is-invalid': errors.responsable }"
                    :disabled="!selectedItem"
                  >
                    <option value="" disabled>Seleccione responsable</option>
                    <option value="departamento">Departamento de Logística</option>
                    <option value="mantenimiento">Personal de Mantenimiento</option>
                    <option value="docente">Docente Responsable</option>
                    <option value="administrativo">Personal Administrativo</option>
                  </select>
                  <div v-if="errors.responsable" class="invalid-feedback">
                    {{ errors.responsable }}
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Fecha de reubicación <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="form.fechaReubicacion"
                    :class="{ 'is-invalid': errors.fechaReubicacion }"
                    :min="today"
                    :disabled="!selectedItem"
                  />
                  <div v-if="errors.fechaReubicacion" class="invalid-feedback">
                    {{ errors.fechaReubicacion }}
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <label class="form-label">Motivo de reubicación</label>
                  <select 
                    class="form-select" 
                    v-model="form.motivo"
                    :disabled="!selectedItem"
                  >
                    <option value="">Seleccione motivo</option>
                    <option value="reorganizacion">Reorganización de espacios</option>
                    <option value="mantenimiento">Mantenimiento del aula</option>
                    <option value="solicitud">Solicitud específica</option>
                    <option value="optimizacion">Optimización de recursos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Observaciones</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="form.observaciones"
                  placeholder="Detalles adicionales sobre la reubicación..."
                  :disabled="!selectedItem"
                  maxlength="500"
                ></textarea>
                <small class="text-muted">{{ form.observaciones.length }}/500 caracteres</small>
              </div>
              <div class="text-center">
                <button 
                  type="submit" 
                  class="btn btn-uleam"
                  :disabled="!selectedItem || loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-save me-2"></i> 
                  {{ loading ? 'Guardando...' : 'Guardar Reubicación' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-secondary ms-2"
                  @click="resetForm"
                  :disabled="loading"
                >
                  <i class="fas fa-times me-2"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
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
              <i class="fas fa-check-circle me-2"></i>¡Reubicación Exitosa!
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              @click="showSuccessModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="lastReubication">
            <div class="text-center mb-3">
              <i class="fas fa-truck-moving text-success" style="font-size: 3rem;"></i>
            </div>
            <h6 class="text-center">Mobiliario reubicado correctamente</h6>
            <div class="alert alert-success">
              <strong>Elemento:</strong> {{ lastReubication.item }}<br>
              <strong>Desde:</strong> {{ lastReubication.from }}<br>
              <strong>Hacia:</strong> {{ lastReubication.to }}<br>
              <strong>Fecha:</strong> {{ formatDate(lastReubication.fecha) }}
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button 
              type="button" 
              class="btn btn-success" 
              @click="showSuccessModal = false"
            >
              <i class="fas fa-plus me-1"></i>Reubicar Otro
            </button>
            <router-link to="/inventario" class="btn btn-outline-primary">
              <i class="fas fa-list me-1"></i>Ver Inventario
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
import { useMobiliarioStore } from '@/stores/mobiliario'
import { useAuthStore } from '@/stores/auth'

const mobiliarioStore = useMobiliarioStore()
const authStore = useAuthStore()

const loading = ref(false)
const selectedItem = ref(null)
const showSuccessModal = ref(false)
const lastReubication = ref(null)

const today = computed(() => new Date().toISOString().split('T')[0])

const filters = reactive({
  codigo: '',
  ubicacion: '',
  tipo: ''
})

const form = reactive({
  nuevaFacultad: '',
  nuevaUbicacion: '',
  responsable: '',
  fechaReubicacion: '',
  motivo: '',
  observaciones: ''
})

const errors = reactive({
  nuevaFacultad: '',
  nuevaUbicacion: '',
  responsable: '',
  fechaReubicacion: ''
})

// Computed
const filteredItems = computed(() => {
  let items = [...mobiliarioStore.items]
  
  if (filters.codigo) {
    items = items.filter(item => 
      item.codigo.toLowerCase().includes(filters.codigo.toLowerCase())
    )
  }
  
  if (filters.ubicacion) {
    items = items.filter(item => 
      item.ubicacion.edificio === filters.ubicacion
    )
  }
  
  if (filters.tipo) {
    items = items.filter(item => item.categoria === filters.tipo)
  }
  
  return items
})

// Methods
const applyFilters = () => {
  // Los filtros se aplican automáticamente via computed
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
}

const selectItem = (item) => {
  selectedItem.value = item
  resetForm()
}

const getTypeIcon = (tipo) => {
  const icons = {
    'silla': 'fa-chair',
    'mesa': 'fa-table', 
    'escritorio': 'fa-desktop',
    'estante': 'fa-books',
    'pizarra': 'fa-chalkboard'
  }
  return icons[tipo] || 'fa-couch'
}

const updateEdificio = () => {
  // Actualizar automáticamente el edificio basado en la facultad
  const edificios = {
    'ingenieria': 'Edificio A',
    'medicina': 'Edificio B',
    'educacion': 'Edificio C'
  }
  // Esta información se usará al guardar
}

const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!form.nuevaFacultad) {
    errors.nuevaFacultad = 'La facultad es obligatoria'
    isValid = false
  }

  if (!form.nuevaUbicacion.trim()) {
    errors.nuevaUbicacion = 'La nueva ubicación es obligatoria'
    isValid = false
  } else if (form.nuevaUbicacion.length < 2) {
    errors.nuevaUbicacion = 'La ubicación debe tener al menos 2 caracteres'
    isValid = false
  }

  if (!form.responsable) {
    errors.responsable = 'El responsable es obligatorio'
    isValid = false
  }

  if (!form.fechaReubicacion) {
    errors.fechaReubicacion = 'La fecha es obligatoria'
    isValid = false
  } else if (form.fechaReubicacion < today.value) {
    errors.fechaReubicacion = 'La fecha no puede ser anterior a hoy'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!selectedItem.value) {
    alert('Por favor seleccione un elemento de la lista')
    return
  }

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const edificios = {
      'ingenieria': 'Edificio A',
      'medicina': 'Edificio B',
      'educacion': 'Edificio C'
    }

    const oldLocation = `${selectedItem.value.ubicacion.edificio}, ${selectedItem.value.ubicacion.aula}`
    const newLocation = `${edificios[form.nuevaFacultad]}, ${form.nuevaUbicacion}`

    // Actualizar el item en el store
    const updates = {
      facultad: form.nuevaFacultad,
      ubicacion: {
        edificio: edificios[form.nuevaFacultad],
        aula: form.nuevaUbicacion
      },
      responsable: form.responsable,
      observaciones: form.observaciones || selectedItem.value.observaciones
    }

    mobiliarioStore.updateItem(selectedItem.value.id, updates)

    // Registrar la reubicación
    authStore.addRecentAction({
      type: 'relocate',
      description: 'Reubicó mobiliario',
      details: `${selectedItem.value.tipo} de ${oldLocation} a ${newLocation}`
    })

    // Preparar datos para el modal
    lastReubication.value = {
      item: `${selectedItem.value.tipo} - ${selectedItem.value.codigo}`,
      from: oldLocation,
      to: newLocation,
      fecha: form.fechaReubicacion
    }

    // Mostrar modal de éxito
    showSuccessModal.value = true

    // Reset form
    resetForm()
    selectedItem.value = null

  } catch (error) {
    console.error('Error al reubicar:', error)
    alert('Error al guardar la reubicación. Intente nuevamente.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES')
}

onMounted(() => {
  // Cargar items del inventario
  mobiliarioStore.loadItems()
  
  // Establecer fecha por defecto
  form.fechaReubicacion = today.value
})
</script>

<style scoped>
.asignar-mobiliario {
  animation: fadeInUp 0.6s ease-out;
}

.mobiliario-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
  margin-bottom: 0.5rem;
}

.mobiliario-card:hover {
  background-color: #f8f9fa;
  border-color: #dc3545;
}

.mobiliario-card.active {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.mobiliario-card.active .text-muted {
  color: rgba(255, 255, 255, 0.8) !important;
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
  padding: 0.75rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-uleam:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
  color: white;
}

.btn-uleam:disabled {
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.form-control:focus,
.form-select:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
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