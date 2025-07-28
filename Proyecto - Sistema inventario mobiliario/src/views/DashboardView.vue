<template>
  <div class="dashboard">
    <div class="row">
      <div class="col-12">
        <h1 class="titulo-uleam">Universidad Laica</h1>
        <h1 class="titulo-uleam">"Eloy Alfaro de Manabí"</h1>
        <br>
      </div>
      
      <div class="col-lg-6 mb-4">
        <div class="info-section">
          <p class="texto1">
            Este sistema web está diseñado para administrar el inventario
            de mobiliario de la "Universidad Laica Eloy Alfaro de Manabí"
          </p>
          <ul class="list-unstyled feature-list">
            <li class="mb-2">
              <i class="fas fa-check-circle text-success me-2"></i> 
              Registrar y organizar el mobiliario universitario.
            </li>
            <li class="mb-2">
              <i class="fas fa-tools text-warning me-2"></i> 
              Reportar daños y gestionar mantenimientos.
            </li>
            <li class="mb-2">
              <i class="fas fa-truck-moving text-primary me-2"></i> 
              Reubicar mobiliario entre distintas aulas o facultades.
            </li>
            <li class="mb-2">
              <i class="fas fa-users text-info me-2"></i> 
              Administrar usuarios encargados del sistema.
            </li>
          </ul>
          <p class="mt-4">
            Utiliza el menú lateral para acceder a las diferentes funcionalidades del sistema.
          </p>
        </div>
      </div>
      
      <div class="col-lg-6 mb-4">
        <div class="text-center">
          <img 
            src="../assets/Uleam - logo.png" 
            class="img-fluid logo-main" 
            alt="ULEAM Logo"
            style="max-width: 400px;"
          />
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="row mt-5">
      <div class="col-12">
        <h3 class="mb-4">
          <i class="fas fa-chart-bar me-2"></i>
          Resumen del Sistema
        </h3>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card stat-card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Total Items</h5>
                <h2 class="display-6">{{ stats.totalItems }}</h2>
              </div>
              <div class="stat-icon">
                <i class="fas fa-couch fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card stat-card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">En Buen Estado</h5>
                <h2 class="display-6">{{ stats.itemsByState['Buen estado'] || 0 }}</h2>
              </div>
              <div class="stat-icon">
                <i class="fas fa-check-circle fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card stat-card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Requieren Atención</h5>
                <h2 class="display-6">{{ stats.itemsByState['Regular'] || 0 }}</h2>
              </div>
              <div class="stat-icon">
                <i class="fas fa-exclamation-triangle fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-4">
        <div class="card stat-card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Necesitan Reparación</h5>
                <h2 class="display-6">{{ stats.itemsByState['Necesita reparación'] || 0 }}</h2>
              </div>
              <div class="stat-icon">
                <i class="fas fa-tools fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones Recientes -->
    <div class="row mt-4">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">
              <i class="fas fa-history me-2"></i>
              Actividades Recientes
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentActions.length === 0" class="text-center text-muted py-4">
              <i class="fas fa-inbox fa-2x mb-3"></i>
              <p>No hay actividades recientes</p>
            </div>
            <div v-else class="activity-list">
              <div 
                v-for="action in recentActions" 
                :key="action.id"
                class="activity-item d-flex align-items-start mb-3"
              >
                <div class="activity-icon me-3">
                  <i 
                    class="fas"
                    :class="getActionIcon(action.type)"
                  ></i>
                </div>
                <div class="activity-content flex-grow-1">
                  <div class="activity-description">{{ action.description }}</div>
                  <div class="activity-details text-muted small">
                    {{ action.details }}
                  </div>
                  <div class="activity-time text-muted small">
                    {{ formatDate(action.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header bg-dark text-white">
            <h5 class="mb-0">
              <i class="fas fa-user me-2"></i>
              Información del Usuario
            </h5>
          </div>
          <div class="card-body text-center">
            <div class="user-avatar mb-3">
              <img 
                :src="user?.avatar || '/img/default-avatar.png'" 
                class="rounded-circle"
                width="80"
                height="80"
                alt="Avatar"
              />
            </div>
            <h5>{{ user?.fullName }}</h5>
            <p class="text-muted mb-2">{{ user?.role }}</p>
            <p class="text-muted small">{{ user?.facultad }}</p>
            <div class="mt-3">
              <router-link 
                to="/actualizar-datos" 
                class="btn btn-outline-primary btn-sm"
              >
                <i class="fas fa-edit me-1"></i>
                Editar Perfil
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Accesos Rápidos -->
    <div class="row mt-4">
      <div class="col-12">
        <h4 class="mb-3">
          <i class="fas fa-bolt me-2"></i>
          Accesos Rápidos
        </h4>
      </div>
      
      <div class="col-md-4 mb-3">
        <router-link 
          to="/registrar-mobiliario" 
          class="card quick-action-card text-decoration-none"
        >
          <div class="card-body text-center">
            <i class="fas fa-plus-circle fa-3x text-success mb-3"></i>
            <h5>Registrar Mobiliario</h5>
            <p class="text-muted">Agregar nuevo elemento al inventario</p>
          </div>
        </router-link>
      </div>
      
      <div class="col-md-4 mb-3">
        <router-link 
          to="/inventario" 
          class="card quick-action-card text-decoration-none"
        >
          <div class="card-body text-center">
            <i class="fas fa-list fa-3x text-primary mb-3"></i>
            <h5>Ver Inventario</h5>
            <p class="text-muted">Consultar todos los elementos registrados</p>
          </div>
        </router-link>
      </div>
      
      <div class="col-md-4 mb-3">
        <router-link 
          to="/reporte-mobiliario" 
          class="card quick-action-card text-decoration-none"
        >
          <div class="card-body text-center">
            <i class="fas fa-tools fa-3x text-warning mb-3"></i>
            <h5>Reportar Daño</h5>
            <p class="text-muted">Informar sobre elementos dañados</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMobiliarioStore } from '@/stores/mobiliario'
import { useLocalStorage } from '@/composables/useLocalStorage'

const authStore = useAuthStore()
const mobiliarioStore = useMobiliarioStore()
const { getItem } = useLocalStorage()

const user = computed(() => authStore.user)

const stats = computed(() => {
  return {
    totalItems: mobiliarioStore.totalItems,
    itemsByState: mobiliarioStore.itemsByState
  }
})

const recentActions = ref([])

const getActionIcon = (type) => {
  const icons = {
    'login': 'fa-sign-in-alt text-success',
    'logout': 'fa-sign-out-alt text-muted',
    'create': 'fa-plus text-success',
    'update': 'fa-edit text-primary',
    'delete': 'fa-trash text-danger',
    'generate_code': 'fa-qrcode text-info',
    'restore_draft': 'fa-undo text-warning'
  }
  return icons[type] || 'fa-info-circle text-info'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Hace un momento'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`
  if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Cargar datos del inventario
  mobiliarioStore.loadItems()
  
  // Cargar actividades recientes
  const actions = getItem('recent_actions') || []
  recentActions.value = actions.slice(0, 5)
  
  // Animaciones de entrada
  setTimeout(() => {
    document.querySelectorAll('.titulo-uleam, .info-section, .logo-main').forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible')
      }, index * 200)
    })
  }, 100)
})
</script>

<style scoped>
.titulo-uleam {
  color: #dc3545;
  font-weight: bold;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.titulo-uleam.visible {
  opacity: 1;
  transform: translateY(0);
}

.texto1 {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
}

.info-section {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.8s ease;
}

.info-section.visible {
  opacity: 1;
  transform: translateX(0);
}

.feature-list li {
  font-size: 1rem;
  line-height: 1.8;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list li:last-child {
  border-bottom: none;
}

.logo-main {
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s ease;
}

.logo-main.visible {
  opacity: 1;
  transform: scale(1);
}

.stat-card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  opacity: 0.7;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background-color: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-description {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.activity-details {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
}

.user-avatar img {
  border: 3px solid #e9ecef;
  object-fit: cover;
}

.quick-action-card {
  border: 2px solid #e9ecef;
  border-radius: 15px;
  transition: all 0.3s ease;
  color: inherit;
}

.quick-action-card:hover {
  border-color: #dc3545;
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.15);
  color: inherit;
}

.quick-action-card .card-body {
  padding: 2rem 1.5rem;
}

.quick-action-card h5 {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.quick-action-card p {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.dashboard {
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
  .titulo-uleam {
    font-size: 1.8rem;
  }
  
  .quick-action-card .card-body {
    padding: 1.5rem 1rem;
  }
  
  .stat-card .display-6 {
    font-size: 2rem;
  }
}
</style>