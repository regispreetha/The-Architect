import { create } from 'zustand'
import { fabric } from 'fabric'

export interface FloorPlanElement {
  id: string
  type: 'wall' | 'door' | 'window' | 'furniture' | 'room' | 'measurement'
  data: any
  layer: string
  fabricObject?: fabric.Object
}

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  color: string
}

interface FloorPlanStore {
  elements: FloorPlanElement[]
  selectedObject: FloorPlanElement | null
  layers: Layer[]
  activeLayer: string
  canvas: fabric.Canvas | null
  gridSize: number
  snapToGrid: boolean
  unitSystem: 'imperial' | 'metric'

  // Actions
  setCanvas: (canvas: fabric.Canvas) => void
  addElement: (element: FloorPlanElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, data: Partial<FloorPlanElement>) => void
  setSelectedObject: (object: FloorPlanElement | null) => void
  addLayer: (layer: Layer) => void
  setActiveLayer: (layerId: string) => void
  toggleLayerVisibility: (layerId: string) => void
  setGridSize: (size: number) => void
  setSnapToGrid: (snap: boolean) => void
  setUnitSystem: (system: 'imperial' | 'metric') => void
  clearAll: () => void
}

export const useFloorPlanStore = create<FloorPlanStore>((set) => ({
  elements: [],
  selectedObject: null,
  layers: [
    { id: 'structure', name: 'Structure', visible: true, locked: false, color: '#000000' },
    { id: 'furniture', name: 'Furniture', visible: true, locked: false, color: '#8B4513' },
    { id: 'electrical', name: 'Electrical', visible: true, locked: false, color: '#FFD700' },
    { id: 'plumbing', name: 'Plumbing', visible: true, locked: false, color: '#4169E1' },
    { id: 'measurements', name: 'Measurements', visible: true, locked: false, color: '#FF0000' },
  ],
  activeLayer: 'structure',
  canvas: null,
  gridSize: 20,
  snapToGrid: true,
  unitSystem: 'imperial',

  setCanvas: (canvas) => set({ canvas }),

  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  })),

  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id)
  })),

  updateElement: (id, data) => set((state) => ({
    elements: state.elements.map(el =>
      el.id === id ? { ...el, ...data } : el
    )
  })),

  setSelectedObject: (object) => set({ selectedObject: object }),

  addLayer: (layer) => set((state) => ({
    layers: [...state.layers, layer]
  })),

  setActiveLayer: (layerId) => set({ activeLayer: layerId }),

  toggleLayerVisibility: (layerId) => set((state) => ({
    layers: state.layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    )
  })),

  setGridSize: (size) => set({ gridSize: size }),

  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  setUnitSystem: (system) => set({ unitSystem: system }),

  clearAll: () => set({ elements: [], selectedObject: null }),
}))
