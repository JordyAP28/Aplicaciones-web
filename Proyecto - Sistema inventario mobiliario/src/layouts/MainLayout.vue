<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">
        <img src="../../public/Uleam - logo.png" class="logo" alt="ULEAM" />
      </router-link>
      <button 
        class="menu-toggle ms-auto" 
        @click="toggleSidebar"
        :class="{ active: !sidebarCollapsed }"
      >
        <i class="fas" :class="!sidebarCollapsed ? 'fa-times' : 'fa-bars'"></i>
      </button>
    </nav>

    <!-- Sidebar -->
    <div 
      class="sidebar" 
      :class="{ collapsed: sidebarCollapsed }"
    >
      <ul class="sidebar-menu">
        <li class="section-title">GESTIÓN DE MOBILIARIO</li>
        <li>
          <router-link to="/registrar-mobiliario" class="sidebar-link">
            <i class="fas fa-plus-circle me-2"></i> Registrar mobiliario
          </router-link>
        </li>
        <li>
          <router-link to="/inventario" class="sidebar-link">
            <i class="fas fa-list me-2"></i> Inventario
          </router-link>
        </li>
        <li>
          <router-link to="/asignar-mobiliario" class="sidebar-link">
            <i class="fas fa-truck-moving me-2"></i> Reubicación
          </router-link>
        </li>

        <li class="section-title">MANTENIMIENTO</li>
        <li>
          <router-link to="/reporte-mobiliario" class="sidebar-link">
            <i class="fas fa-tools me-2"></i> Reportar daño
          </router-link>
        </li>
        <li>
          <router-link to="/mantenimientos" class="sidebar-link">
            <i class="fas fa-clipboard-check me-2"></i> Mantenimientos
          </router-link>
        </li>

        <li class="section-title">GESTIÓN DE USUARIOS</li>
        <li>
          <router-link to="/nuevo-usuario" class="sidebar-link">
            <i class="fas fa-user-plus me-2"></i> Nuevo Usuario
          </router-link>
        </li>
        <li>
          <router-link to="/lista-usuarios" class="sidebar-link">
            <i class="fas fa-users me-2"></i> Lista de Usuarios
          </router-link>
        </li>

        <li class="section-title">CUENTA</li>
        <li>
          <router-link to="/actualizar-datos" class="sidebar-link">
            <i class="fas fa-sync-alt me-2"></i> Actualizar datos
          </router-link>
        </li>
        <li>
          <a href="#" @click.prevent="handleLogout" class="sidebar-link">
            <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
          </a>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div 
      class="main-content" 
      :class="{ expanded: sidebarCollapsed }"
    >
      <div class="container-fluid">
        <router-view />
      </div>
    </div>

    <!-- Notification Toast -->
    <div 
      v-if="notification.show"
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index: 9999"
    >
      <div 
        class="toast show"
        :class="`bg-${notification.type}`"
      >
        <div class="toast-header">
          <i 
            class="fas me-2"
            :class="getNotificationIcon(notification.type)"
          ></i>
          <strong class="me-auto text-white">{{ getNotificationTitle(notification.type) }}</strong>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="hideNotification"
          ></button>
        </div>
        <div class="toast-body text-white">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)
const notification = ref({
  show: false,
  message: '',
  type: 'info'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    authStore.logout()
    router.push('/login')
  }
}

const showNotification = (message, type = 'info') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    hideNotification()
  }, 4000)
}

const hideNotification = () => {
  notification.value.show = false
}

const getNotificationIcon = (type) => {
  const icons = {
    'success': 'fa-check-circle',
    'info': 'fa-info-circle',
    'warning': 'fa-exclamation-triangle',
    'danger': 'fa-exclamation-circle'
  }
  return icons[type] || 'fa-info-circle'
}

const getNotificationTitle = (type) => {
  const titles = {
    'success': 'Éxito',
    'info': 'Información',
    'warning': 'Advertencia',
    'danger': 'Error'
  }
  return titles[type] || 'Notificación'
}

onMounted(() => {
  // Animaciones de entrada
  setTimeout(() => {
    document.querySelectorAll('.main-content, .sidebar').forEach(el => {
      el.classList.add('visible')
    })
  }, 150)
})

// Exponer métodos globalmente para que los componentes hijos puedan usarlos
defineExpose({
  showNotification
})
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
}

.logo {
  height: 40px;
}

.menu-toggle {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  width: 280px;
  height: calc(100vh - 60px);
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  overflow-y: auto;
  transition: transform 0.3s ease;  /* Cambiado */
  z-index: 1020;
}

.sidebar.visible {
  opacity: 1;
  transform: translateX(0);
}

.sidebar.collapsed {
  transform: translateX(-280px);  /* Cambiado */
}

.sidebar-menu {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.sidebar-menu li {
  margin: 0;
}

.section-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #6c757d;
  padding: 1rem 1.5rem 0.5rem;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background-color: #e9ecef;
  color: #dc3545;
  border-left-color: #dc3545;
}

.sidebar-link.router-link-active {
  background-color: #dc3545;
  color: white;
  border-left-color: #dc3545;
}

.main-content {
  margin-left: 280px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  padding: 2rem;
  transition: margin-left 0.3s ease;  /* Cambiado */
}

.main-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.main-content.expanded {
  margin-left: 0;
}

.toast-container {
  z-index: 9999;
}

.toast {
  min-width: 300px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;  /* Cambiado */
    transform: translateX(-280px);
  }
  
  .sidebar.collapsed {
    transform: translateX(0);  /* Invertido para móviles */
  }
  
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>