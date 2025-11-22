import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import db from '../models/database.js'

const router = express.Router()

// Get all projects
router.get('/', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all()
    res.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Get a single project
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Get elements for this project
    const elements = db.prepare('SELECT * FROM elements WHERE project_id = ?').all(id)

    // Get layers for this project
    const layers = db.prepare('SELECT * FROM layers WHERE project_id = ?').all(id)

    res.json({
      ...project,
      elements,
      layers,
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// Create a new project
router.post('/', (req, res) => {
  try {
    const { name, description, data } = req.body
    const id = uuidv4()

    const stmt = db.prepare(`
      INSERT INTO projects (id, name, description, data)
      VALUES (?, ?, ?, ?)
    `)

    stmt.run(id, name, description || '', JSON.stringify(data || {}))

    // Create default layers
    const defaultLayers = [
      { id: uuidv4(), name: 'Structure', color: '#000000' },
      { id: uuidv4(), name: 'Furniture', color: '#8B4513' },
      { id: uuidv4(), name: 'Electrical', color: '#FFD700' },
      { id: uuidv4(), name: 'Plumbing', color: '#4169E1' },
      { id: uuidv4(), name: 'Measurements', color: '#FF0000' },
    ]

    const layerStmt = db.prepare(`
      INSERT INTO layers (id, project_id, name, color)
      VALUES (?, ?, ?, ?)
    `)

    defaultLayers.forEach(layer => {
      layerStmt.run(layer.id, id, layer.name, layer.color)
    })

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
    res.status(201).json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// Update a project
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, description, data, thumbnail } = req.body

    const stmt = db.prepare(`
      UPDATE projects
      SET name = ?, description = ?, data = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = stmt.run(
      name,
      description || '',
      JSON.stringify(data || {}),
      thumbnail || null,
      id
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
    res.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// Delete a project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params

    const stmt = db.prepare('DELETE FROM projects WHERE id = ?')
    const result = stmt.run(id)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

// Add element to project
router.post('/:id/elements', (req, res) => {
  try {
    const { id } = req.params
    const { type, layer, data } = req.body

    const elementId = uuidv4()

    const stmt = db.prepare(`
      INSERT INTO elements (id, project_id, type, layer, data)
      VALUES (?, ?, ?, ?, ?)
    `)

    stmt.run(elementId, id, type, layer, JSON.stringify(data))

    const element = db.prepare('SELECT * FROM elements WHERE id = ?').get(elementId)
    res.status(201).json(element)
  } catch (error) {
    console.error('Error adding element:', error)
    res.status(500).json({ error: 'Failed to add element' })
  }
})

// Delete element from project
router.delete('/:id/elements/:elementId', (req, res) => {
  try {
    const { elementId } = req.params

    const stmt = db.prepare('DELETE FROM elements WHERE id = ?')
    const result = stmt.run(elementId)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Element not found' })
    }

    res.json({ message: 'Element deleted successfully' })
  } catch (error) {
    console.error('Error deleting element:', error)
    res.status(500).json({ error: 'Failed to delete element' })
  }
})

export default router
