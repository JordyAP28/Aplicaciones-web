import { ref, watch } from 'vue'

export function useLocalStorage() {
  const STORAGE_PREFIX = 'uleam_'
  
  const getItem = (key) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return null
    }
  }
  
  const setItem = (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
      return false
    }
  }
  
  const removeItem = (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  }
  
  const clear = () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX))
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
  
  const exists = (key) => {
    return localStorage.getItem(STORAGE_PREFIX + key) !== null
  }
  
  // Composable reactivo para un valor específico
  const useStorageValue = (key, defaultValue = null) => {
    const storedValue = getItem(key)
    const value = ref(storedValue !== null ? storedValue : defaultValue)
    
    watch(value, (newValue) => {
      if (newValue === null || newValue === undefined) {
        removeItem(key)
      } else {
        setItem(key, newValue)
      }
    }, { deep: true })
    
    return value
  }
  
  return {
    getItem,
    setItem,
    removeItem,
    clear,
    exists,
    useStorageValue
  }
}

// ULEAMStorage class para compatibilidad con el código original
export class ULEAMStorage {
  constructor() {
    this.prefix = 'uleam_'
  }
  
  get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key}:`, error)
      return null
    }
  }
  
  save(key, data) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
      return false
    }
  }
  
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key)
      return true
    } catch (error) {
      console.error(`Error removing ${key}:`, error)
      return false
    }
  }
  
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }
  
  exists(key) {
    return localStorage.getItem(this.prefix + key) !== null
  }
  
  // Draft management
  saveDraft(formType, data) {
    const drafts = this.get('form_drafts') || {}
    drafts[formType] = {
      data,
      savedAt: new Date().toISOString()
    }
    return this.save('form_drafts', drafts)
  }
  
  getDraft(formType) {
    const drafts = this.get('form_drafts') || {}
    return drafts[formType] || null
  }
  
  removeDraft(formType) {
    const drafts = this.get('form_drafts') || {}
    delete drafts[formType]
    return this.save('form_drafts', drafts)
  }
  
  // User session
  getUserSession() {
    return this.get('user_session')
  }
  
  saveUserSession(sessionData) {
    return this.save('user_session', sessionData)
  }
  
  removeUserSession() {
    return this.remove('user_session')
  }
  
  // Recent actions
  addRecentAction(action) {
    const actions = this.get('recent_actions') || []
    actions.unshift({
      ...action,
      id: Date.now(),
      timestamp: new Date().toISOString()
    })
    
    // Mantener solo las últimas 50 acciones
    if (actions.length > 50) {
      actions.splice(50)
    }
    
    return this.save('recent_actions', actions)
  }
  
  getRecentActions(limit = 10) {
    const actions = this.get('recent_actions') || []
    return limit ? actions.slice(0, limit) : actions
  }
  
  // Statistics
  getStats() {
    const items = this.get('inventory_items') || []
    const users = this.get('users') || []
    const actions = this.get('recent_actions') || []
    
    return {
      totalItems: items.length,
      totalUsers: users.length,
      recentActions: actions.length,
      itemsByState: items.reduce((acc, item) => {
        acc[item.estado] = (acc[item.estado] || 0) + 1
        return acc
      }, {}),
      lastUpdate: new Date().toISOString()
    }
  }
}

// Instancia global para compatibilidad
if (typeof window !== 'undefined') {
  window.ULEAMStorage = ULEAMStorage
}