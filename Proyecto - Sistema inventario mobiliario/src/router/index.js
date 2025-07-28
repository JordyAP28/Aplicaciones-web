import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Componentes de Layout
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Páginas
import Login from '@/views/LoginView.vue'
import Dashboard from '@/views/DashboardView.vue'
import RegistrarMobiliario from '@/views/RegistrarMobiliario.vue'
import Inventario from '@/views/InventarioView.vue'
import AsignarMobiliario from '@/views/AsignarMobiliario.vue'
import ReporteMobiliario from '@/views/ReporteMobiliario.vue'
import Mantenimientos from '@/views/MantenimientosView.vue'
import NuevoUsuario from '@/views/NuevoUsuario.vue'
import ListaUsuarios from '@/views/ListaUsuarios.vue'
import ActualizarDatos from '@/views/ActualizarDatos.vue'

const routes = [
  // Rutas de autenticación
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      }
    ]
  },
  
  // Rutas principales
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/registrar-mobiliario',
        name: 'RegistrarMobiliario',
        component: RegistrarMobiliario
      },
      {
        path: '/inventario',
        name: 'Inventario',
        component: Inventario
      },
      {
        path: '/asignar-mobiliario',
        name: 'AsignarMobiliario',
        component: AsignarMobiliario
      },
      {
        path: '/reporte-mobiliario',
        name: 'ReporteMobiliario',
        component: ReporteMobiliario
      },
      {
        path: '/mantenimientos',
        name: 'Mantenimientos',
        component: Mantenimientos
      },
      {
        path: '/nuevo-usuario',
        name: 'NuevoUsuario',
        component: NuevoUsuario
      },
      {
        path: '/lista-usuarios',
        name: 'ListaUsuarios',
        component: ListaUsuarios
      },
      {
        path: '/actualizar-datos',
        name: 'ActualizarDatos',
        component: ActualizarDatos
      }
    ]
  },
  
  // Redirección por defecto
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router