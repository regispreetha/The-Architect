import { useState } from 'react'
import { Box } from '@mui/material'
import Toolbar from './components/UI/Toolbar'
import FloorPlanCanvas from './components/FloorPlanCanvas/Canvas'
import Viewer3D from './components/ThreeD/Viewer3D'
import PropertyPanel from './components/UI/PropertyPanel'
import FurnitureLibrary from './components/Library/FurnitureLibrary'
import LayerManager from './components/UI/LayerManager'
import { useFloorPlanStore } from './store/floorPlanStore'

function App() {
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const { selectedObject } = useFloorPlanStore()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Toolbar */}
      <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Library */}
        <Box sx={{ width: 250, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <FurnitureLibrary />
        </Box>

        {/* Center - Canvas Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 2D Floor Plan Canvas */}
          <Box sx={{ flex: 1, position: 'relative', backgroundColor: '#f5f5f5' }}>
            <FloorPlanCanvas selectedTool={selectedTool} />
          </Box>

          {/* 3D Preview Window */}
          <Box sx={{ height: '40%', borderTop: 1, borderColor: 'divider', backgroundColor: '#000' }}>
            <Viewer3D />
          </Box>
        </Box>

        {/* Right Sidebar - Properties and Layers */}
        <Box sx={{ width: 300, borderLeft: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <PropertyPanel selectedObject={selectedObject} />
          <LayerManager />
        </Box>
      </Box>
    </Box>
  )
}

export default App
