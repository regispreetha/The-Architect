import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbDir = join(__dirname, '..', 'data')
const dbPath = join(dbDir, 'floorplans.json')

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Simple JSON database
class JSONDatabase {
  constructor(path) {
    this.path = path
    this.data = { projects: [], elements: [], layers: [] }
    this.load()
  }

  load() {
    try {
      if (fs.existsSync(this.path)) {
        const content = fs.readFileSync(this.path, 'utf-8')
        this.data = JSON.parse(content)
      }
    } catch (error) {
      console.error('Error loading database:', error)
    }
  }

  save() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }

  prepare(query) {
    // Simple query parser for compatibility
    return {
      all: (params) => {
        if (query.includes('SELECT * FROM projects')) {
          return this.data.projects
        } else if (query.includes('SELECT * FROM elements WHERE project_id')) {
          return this.data.elements.filter(e => e.project_id === params)
        } else if (query.includes('SELECT * FROM layers WHERE project_id')) {
          return this.data.layers.filter(l => l.project_id === params)
        }
        return []
      },
      get: (id) => {
        if (query.includes('SELECT * FROM projects WHERE id')) {
          return this.data.projects.find(p => p.id === id)
        } else if (query.includes('SELECT * FROM elements WHERE id')) {
          return this.data.elements.find(e => e.id === id)
        }
        return null
      },
      run: (...params) => {
        if (query.includes('INSERT INTO projects')) {
          const [id, name, description, data] = params
          const project = {
            id,
            name,
            description: description || '',
            data: data || '{}',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          this.data.projects.push(project)
          this.save()
          return { changes: 1 }
        } else if (query.includes('INSERT INTO elements')) {
          const [id, project_id, type, layer, data] = params
          const element = {
            id,
            project_id,
            type,
            layer,
            data,
            created_at: new Date().toISOString()
          }
          this.data.elements.push(element)
          this.save()
          return { changes: 1 }
        } else if (query.includes('INSERT INTO layers')) {
          const [id, project_id, name, color] = params
          const layer = {
            id,
            project_id,
            name,
            color,
            visible: 1,
            locked: 0
          }
          this.data.layers.push(layer)
          this.save()
          return { changes: 1 }
        } else if (query.includes('UPDATE projects')) {
          const [name, description, data, thumbnail, id] = params
          const index = this.data.projects.findIndex(p => p.id === id)
          if (index !== -1) {
            this.data.projects[index] = {
              ...this.data.projects[index],
              name,
              description,
              data,
              thumbnail,
              updated_at: new Date().toISOString()
            }
            this.save()
            return { changes: 1 }
          }
          return { changes: 0 }
        } else if (query.includes('DELETE FROM projects')) {
          const id = params[0]
          const initialLength = this.data.projects.length
          this.data.projects = this.data.projects.filter(p => p.id !== id)
          this.data.elements = this.data.elements.filter(e => e.project_id !== id)
          this.data.layers = this.data.layers.filter(l => l.project_id !== id)
          this.save()
          return { changes: initialLength - this.data.projects.length }
        } else if (query.includes('DELETE FROM elements')) {
          const id = params[0]
          const initialLength = this.data.elements.length
          this.data.elements = this.data.elements.filter(e => e.id !== id)
          this.save()
          return { changes: initialLength - this.data.elements.length }
        }
        return { changes: 0 }
      }
    }
  }
}

const db = new JSONDatabase(dbPath)

export function initDatabase() {
  console.log('Database initialized successfully (JSON file storage)')
}

export default db
