<template>
  <div class="inventario">
    <div class="card shadow">
      <div class="card-header bg-uleam text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="fas fa-couch me-2"></i>Inventario de Mobiliario
          </h5>
          <button 
            class="btn btn-sm btn-light" 
            @click="showExportModal = true"
          >
            <i class="fas fa-file-export me-1"></i> Exportar
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card-body border-bottom">
        <div class="row g-3">
          <div class="col-md-3">
            <label for="filterCodigo" class="form-label">Código</label>
            <input 
              type="text" 
              id="filterCodigo" 
              class="form-control" 
              placeholder="QR/ID..."
              v-model="filters.codigo"
              @input="applyFilters"
            />
          </div>
          <div class="col-md-3">
            <label for="filterTipo" class="form-label">Tipo</label>
            <select 
              id="filterTipo" 
              class="form-select"
              v-model="filters.tipo"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="silla">Sillas</option>
              <option value="mesa">Mesas</option>
              <option value="escritorio">Escritorios</option>
              <option value="estante">Estantes</option>
              <option value="pizarra">Pizarras</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="filterFacultad" class="form-label">Facultad</label>
            <select 
              id="filterFacultad" 
              class="form-select"
              v-model="filters.facultad"
              @change="applyFilters"
            >
              <option value="">Todas</option>
              <option value="ingenieria">Ingeniería</option>
              <option value="medicina">Medicina</option>
              <option value="educacion">Educación</option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-uleam w-100" @click="clearFilters">
              <i class="fas fa-sync me-1"></i> Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th width="120">Código</th>
              <th>Tipo</th>
              <th>Material</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th width="120">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredItems.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <p class="mb-0">No se encontraron elementos</p>
              </td>
            </tr>
            <tr v-else v-for="item in paginatedItems" :key="item.id">
              <td>
                <span class="badge bg-dark">{{ item.codigo }}</span>
              </td>
              <td>
                <i class="fas me-2" :class="getTypeIcon(item.categoria)"></i>
                {{ item.tipo }}
              </td>
              <td>{{ item.material }}</td>
              <td>
                <span class="d-block">{{ item.ubicacion.edificio }}</span>
                <small class="text-muted">{{ item.ubicacion.aula }}</small>
              </td>
              <td>
                <span 
                  class="badge"
                  :class="`bg-${item.estadoColor}`"
                >
                  {{ item.estado }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button 
                    class="btn btn-outline-primary" 
                    title="Ver detalles"
                    @click="viewItem(item)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    class="btn btn-outline-warning" 
                    title="Editar"
                    @click="editItem(item)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-outline-danger" 
                    title="Eliminar"
                    @click="deleteItem(item)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="card-footer bg-white">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted">
            Mostrando <span class="fw-bold">{{ startIndex }}-{{ endIndex }}</span> 
            de <span class="fw-bold">{{ filteredItems.length }}</span> elementos
          </div>
          <nav v-if="totalPages > 1">
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

    <!-- Modal de exportación -->
    <div 
      class="modal fade" 
      :class="{ show: showExportModal }"
      :style="{ display: showExportModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Exportar Inventario</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showExportModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-check mb-2">
              <input 
                class="form-check-input" 
                type="radio" 
                name="exportType" 
                id="exportPDF"
                v-model="exportType"
                value="pdf"
              />
              <label class="form-check-label" for="exportPDF">
                <i class="fas fa-file-pdf text-danger me-1"></i> PDF
              </label>
            </div>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="radio" 
                name="exportType" 
                id="exportExcel"
                v-model="exportType"
                value="excel"
              />
              <label class="form-check-label" for="exportExcel">
                <i class="fas fa-file-excel text-success me-1"></i> Excel
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showExportModal = false"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-uleam"
              @click="exportData"
              :disabled="!exportType"
            >
              <i class="fas fa-download me-1"></i> Descargar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div 
      class="modal fade" 
      :class="{ show: showDetailsModal }"
      :style="{ display: showDetailsModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-info-circle me-2"></i>
              Detalles del Mobiliario
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showDetailsModal = false"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedItem">
            <div class="row">
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tr>
                    <td class="fw-bold">Código:</td>
                    <td>{{ selectedItem.codigo }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Tipo:</td>
                    <td>{{ selectedItem.tipo }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Material:</td>
                    <td>{{ selectedItem.material }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Estado:</td>
                    <td>
                      <span 
                        class="badge"
                        :class="`bg-${selectedItem.estadoColor}`"
                      >
                        {{ selectedItem.estado }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Valor:</td>
                    <td>${{ selectedItem.valor || 'No especificado' }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tr>
                    <td class="fw-bold">Facultad:</td>
                    <td>{{ getFacultadName(selectedItem.facultad) }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Edificio:</td>
                    <td>{{ selectedItem.ubicacion.edificio }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Aula:</td>
                    <td>{{ selectedItem.ubicacion.aula }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Responsable:</td>
                    <td>{{ selectedItem.responsable || 'Sin asignar' }}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Registrado:</td>
                    <td>{{ formatDate(selectedItem.fechaRegistro) }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div v-if="selectedItem.observaciones" class="mt-3">
              <h6>Observaciones:</h6>
              <p class="text-muted">{{ selectedItem.observaciones }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showDetailsModal = false"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop para modales -->
    <div 
      v-if="showExportModal || showDetailsModal"
      class="modal-backdrop fade show"
      @click="closeModals"
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
const showExportModal = ref(false)
const showDetailsModal = ref(false)
const selectedItem = ref(null)
const exportType = ref('pdf')
const currentPage = ref(1)
const itemsPerPage = 10

const filters = reactive({
  codigo: '',
  tipo: '',
  facultad: ''
})

// Computed
const filteredItems = computed(() => {
  let items = [...mobiliarioStore.items]
  
  if (filters.codigo) {
    items = items.filter(item => 
      item.codigo.toLowerCase().includes(filters.codigo.toLowerCase())
    )
  }
  
  if (filters.tipo) {
    items = items.filter(item => item.categoria === filters.tipo)
  }
  
  if (filters.facultad) {
    items = items.filter(item => item.facultad === filters.facultad)
  }
  
  return items
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const startIndex = computed(() => {
  if (filteredItems.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage
  return Math.min(end, filteredItems.value.length)
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
const applyFilters = () => {
  currentPage.value = 1
  mobiliarioStore.setFilters(filters)
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  currentPage.value = 1
  mobiliarioStore.clearFilters()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
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

const getFacultadName = (facultad) => {
  const nombres = {
    'ingenieria': 'Ingeniería',
    'medicina': 'Medicina',
    'educacion': 'Educación'
  }
  return nombres[facultad] || facultad
}

const formatDate = (dateString) => {
  if (!dateString) return 'No especificado'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const viewItem = (item) => {
  selectedItem.value = item
  showDetailsModal.value = true
}

const editItem = (item) => {
  // Implementar edición
  console.log('Editar item:', item)
  authStore.addRecentAction({
    type: 'view',
    description: 'Vio detalles de mobiliario',
    details: `${item.tipo} - ${item.codigo}`
  })
}

const deleteItem = (item) => {
  if (confirm(`¿Está seguro de eliminar el mobiliario ${item.codigo}?`)) {
    mobiliarioStore.deleteItem(item.id)
    
    // Si estamos en la última página y no quedan elementos, ir a la anterior
    if (paginatedItems.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }
  }
}

const exportData = () => {
  const data = filteredItems.value
  
  if (exportType.value === 'excel') {
    exportToExcel(data)
  } else {
    exportToPDF(data)
  }
  
  showExportModal.value = false
  
  authStore.addRecentAction({
    type: 'export',
    description: `Exportó inventario a ${exportType.value.toUpperCase()}`,
    details: `${data.length} elementos`
  })
}

const exportToExcel = (data) => {
  // Simular exportación a Excel
  const csvContent = generateCSV(data)
  downloadFile(csvContent, 'inventario.csv', 'text/csv')
}

const exportToPDF = (data) => {
  // Simular exportación a PDF
  console.log('Exporting to PDF:', data)
  alert('Funcionalidad de exportación a PDF en desarrollo')
}

const generateCSV = (data) => {
  const headers = ['Código', 'Tipo', 'Material', 'Edificio', 'Aula', 'Estado', 'Valor', 'Fecha Registro']
  const rows = data.map(item => [
    item.codigo,
    item.tipo,
    item.material,
    item.ubicacion.edificio,
    item.ubicacion.aula,
    item.estado,
    item.valor || 0,
    item.fechaRegistro
  ])
  
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

const closeModals = () => {
  showExportModal.value = false
  showDetailsModal.value = false
}

onMounted(() => {
  // Cargar items del inventario
  mobiliarioStore.loadItems()
})
</script>

<style scoped>
.bg-uleam {
  background-color: #dc3545 !important;
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

.btn-uleam:disabled {
  opacity: 0.7;
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
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

.inventario {
  animation: fadeInUp 0.6s ease-out;
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
}
</style>