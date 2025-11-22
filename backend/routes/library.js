import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// Get furniture library
router.get('/furniture', (req, res) => {
  try {
    const furniturePath = join(__dirname, '../../frontend/src/data/furnitureData.json')
    const furnitureData = JSON.parse(fs.readFileSync(furniturePath, 'utf-8'))
    res.json(furnitureData)
  } catch (error) {
    console.error('Error fetching furniture library:', error)
    res.status(500).json({ error: 'Failed to fetch furniture library' })
  }
})

// Get architectural symbols
router.get('/symbols', (req, res) => {
  try {
    const furniturePath = join(__dirname, '../../frontend/src/data/furnitureData.json')
    const data = JSON.parse(fs.readFileSync(furniturePath, 'utf-8'))
    res.json({ symbols: data.symbols || [] })
  } catch (error) {
    console.error('Error fetching symbols:', error)
    res.status(500).json({ error: 'Failed to fetch symbols' })
  }
})

// Get material textures (placeholder)
router.get('/materials', (req, res) => {
  try {
    const materials = [
      { id: 'drywall', name: 'Drywall', color: '#F5F5DC', texture: null },
      { id: 'brick', name: 'Brick', color: '#B22222', texture: null },
      { id: 'concrete', name: 'Concrete', color: '#808080', texture: null },
      { id: 'wood', name: 'Wood', color: '#8B4513', texture: null },
      { id: 'tile', name: 'Tile', color: '#FFFFFF', texture: null },
      { id: 'carpet', name: 'Carpet', color: '#D2B48C', texture: null },
    ]
    res.json({ materials })
  } catch (error) {
    console.error('Error fetching materials:', error)
    res.status(500).json({ error: 'Failed to fetch materials' })
  }
})

export default router
