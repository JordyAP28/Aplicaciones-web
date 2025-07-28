import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useAuthStore = defineStore('auth', () => {
  const { getItem, setItem, removeItem } = useLocalStorage()
  
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (credentials) => {
    try {
      // Simular autenticación (aquí irían las validaciones reales)
      const mockUser = {
        id: 1,
        username: credentials.username,
        fullName: 'Jordy Alvarado',
        email: 'jordy@uleam.edu.ec',
        role: 'Administrador',
        facultad: 'FACCI',
        avatar: null,
        lastLogin: new Date().toISOString()
      }
      
      user.value = mockUser
      
      // Guardar sesión en localStorage
      setItem('user_session', {
        user: mockUser,
        token: 'mock-jwt-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      
      // Registrar acción
      addRecentAction({
        type: 'login',
        description: 'Inició sesión en el sistema',
        details: `Usuario: ${mockUser.username}`
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    if (user.value) {
      addRecentAction({
        type: 'logout',
        description: 'Cerró sesión',
        details: `Usuario: ${user.value.username}`
      })
    }
    
    user.value = null
    removeItem('user_session')
  }
  
  const checkAuth = () => {
    const session = getItem('user_session')
    if (session && session.expiresAt && new Date(session.expiresAt) > new Date()) {
      user.value = session.user
      return true
    } else {
      logout()
      return false
    }
  }
  
  const updateUser = (userData) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      
      // Actualizar en localStorage
      const session = getItem('user_session')
      if (session) {
        session.user = user.value
        setItem('user_session', session)
      }
      
      addRecentAction({
        type: 'update_profile',
        description: 'Actualizó datos del perfil',
        details: 'Información personal'
      })
    }
  }
  
  const addRecentAction = (action) => {
    const actions = getItem('recent_actions') || []
    actions.unshift({
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user.value?.username || 'Sistema'
    })
    
    // Mantener solo las últimas 50 acciones
    if (actions.length > 50) {
      actions.splice(50)
    }
    
    setItem('recent_actions', actions)
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateUser,
    addRecentAction
  }
})