import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useAuthStore } from './auth'

export const useMobiliarioStore = defineStore('mobiliario', () => {
  const { getItem, setItem } = useLocalStorage()
  const authStore = useAuthStore()
  
  const items = ref([])
  const drafts = ref({})
  const loading = ref(false)
  const currentFilters = ref({})
  
  // Computed
  const totalItems = computed(() => items.value.length)
  const itemsByState = computed(() => {
    const states = {}
    items.value.forEach(item => {
      states[item.estado] = (states[item.estado] || 0) + 1
    })
    return states
  })
  
  const filteredItems = computed(() => {
    let filtered = [...items.value]
    
    if (currentFilters.value.codigo) {
      filtered = filtered.filter(item => 
        item.codigo.toLowerCase().includes(currentFilters.value.codigo.toLowerCase())
      )
    }
    
    if (currentFilters.value.tipo) {
      filtered = filtered.filter(item => item.categoria === currentFilters.value.tipo)
    }
    
    if (currentFilters.value.facultad) {
      filtered = filtered.filter(item => item.facultad === currentFilters.value.facultad)
    }
    
    if (currentFilters.value.estado) {
      filtered = filtered.filter(item => item.estado === currentFilters.value.estado)
    }
    
    return filtered
  })
  
  // Actions
  const loadItems = () => {
    loading.value = true
    try {
      const savedItems = getItem('inventory_items') || []
      items.value = savedItems
    } finally {
      loading.value = false
    }
  }
  
  const saveItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      codigo: itemData.codigo,
      tipo: itemData.tipo,
      categoria: itemData.categoria || itemData.tipo,
      material: itemData.material || 'No especificado',
      ubicacion: {
        edificio: getEdificioByFacultad(itemData.facultad),
        aula: itemData.aula || 'Sin asignar'
      },
      facultad: itemData.facultad,
      estado: getEstadoText(itemData.estado),
      estadoColor: getEstadoColor(itemData.estado),
      fechaRegistro: new Date().toISOString().split('T')[0],
      fechaAdquisicion: itemData.fecha_adquisicion || null,
      ultimoMantenimiento: new Date().toISOString().split('T')[0],
      valor: parseFloat(itemData.valor) || 0,
      responsable: itemData.responsable,
      observaciones: itemData.observaciones || 'Sin observaciones',
      usuario: authStore.user?.fullName || 'Usuario desconocido',
      foto: itemData.foto || null
    }
    
    items.value.push(newItem)
    setItem('inventory_items', items.value)
    
    authStore.addRecentAction({
      type: 'create',
      description: 'Registró nuevo mobiliario',
      details: `${newItem.tipo} - ${newItem.codigo}`
    })
    
    return newItem
  }
  
  const updateItem = (id, updates) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates }
      setItem('inventory_items', items.value)
      
      authStore.addRecentAction({
        type: 'update',
        description: 'Actualizó mobiliario',
        details: `${items.value[index].tipo} - ${items.value[index].codigo}`
      })
      
      return items.value[index]
    }
    return null
  }
  
  const deleteItem = (id) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      const deletedItem = items.value[index]
      items.value.splice(index, 1)
      setItem('inventory_items', items.value)
      
      authStore.addRecentAction({
        type: 'delete',
        description: 'Eliminó mobiliario',
        details: `${deletedItem.tipo} - ${deletedItem.codigo}`
      })
      
      return deletedItem
    }
    return null
  }
  
  const searchItems = (query) => {
    if (!query) return items.value
    
    const lowercaseQuery = query.toLowerCase()
    return items.value.filter(item =>
      item.codigo.toLowerCase().includes(lowercaseQuery) ||
      item.tipo.toLowerCase().includes(lowercaseQuery) ||
      item.material.toLowerCase().includes(lowercaseQuery) ||
      item.ubicacion.edificio.toLowerCase().includes(lowercaseQuery) ||
      item.ubicacion.aula.toLowerCase().includes(lowercaseQuery)
    )
  }
  
  const setFilters = (filters) => {
    currentFilters.value = { ...filters }
  }
  
  const clearFilters = () => {
    currentFilters.value = {}
  }
  
  const generateCode = () => {
    const digitCount = 4 + Math.floor(Math.random() * 3)
    let numericPart = ''
    
    for (let i = 0; i < digitCount; i++) {
      numericPart += Math.floor(Math.random() * 10)
    }
    
    const newCode = 'ULEAM-' + numericPart
    
    // Verificar que sea único
    const exists = items.value.some(item => item.codigo === newCode)
    if (exists) {
      return generateCode() // Recursión si existe
    }
    
    return newCode
  }
  
  const isCodeUnique = (code) => {
    return !items.value.some(item => item.codigo === code)
  }
  
  // Draft management
  const saveDraft = (formType, data) => {
    drafts.value[formType] = {
      data,
      savedAt: new Date().toISOString()
    }
    setItem('form_drafts', drafts.value)
  }
  
  const getDraft = (formType) => {
    const saved = getItem('form_drafts') || {}
    return saved[formType] || null
  }
  
  const removeDraft = (formType) => {
    delete drafts.value[formType]
    setItem('form_drafts', drafts.value)
  }
  
  // Utility functions
  const getEdificioByFacultad = (facultad) => {
    const edificios = {
      'ingenieria': 'Edificio A',
      'medicina': 'Edificio B', 
      'educacion': 'Edificio C'
    }
    return edificios[facultad] || 'Sin asignar'
  }
  
  const getEstadoText = (estado) => {
    const estados = {
      'nuevo': 'Nuevo',
      'bueno': 'Buen estado',
      'regular': 'Regular',
      'malo': 'Necesita reparación'
    }
    return estados[estado] || estado
  }
  
  const getEstadoColor = (estado) => {
    const colores = {
      'nuevo': 'primary',
      'bueno': 'success',
      'regular': 'warning',
      'malo': 'danger'
    }
    return colores[estado] || 'secondary'
  }
  
  return {
    // State
    items,
    loading,
    currentFilters,
    
    // Computed
    totalItems,
    itemsByState,
    filteredItems,
    
    // Actions
    loadItems,
    saveItem,
    updateItem,
    deleteItem,
    searchItems,
    setFilters,
    clearFilters,
    generateCode,
    isCodeUnique,
    saveDraft,
    getDraft,
    removeDraft
  }
})