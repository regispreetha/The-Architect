import express from 'express'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// Export floor plan as PDF
router.post('/pdf', async (req, res) => {
  try {
    const { projectName, elements, dimensions } = req.body

    // Create PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'floor-plan'}.pdf"`)

    // Pipe PDF to response
    doc.pipe(res)

    // Add title
    doc.fontSize(20).text(projectName || 'Floor Plan', {
      align: 'center',
    })

    doc.moveDown()

    // Add date
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, {
      align: 'right',
    })

    doc.moveDown(2)

    // Draw elements (simplified representation)
    if (elements && elements.length > 0) {
      doc.fontSize(12).text('Floor Plan Elements:', { underline: true })
      doc.moveDown()

      elements.forEach((element, index) => {
        doc.fontSize(10).text(`${index + 1}. ${element.type.toUpperCase()} - Layer: ${element.layer}`)
      })
    }

    // Add dimensions if provided
    if (dimensions) {
      doc.moveDown(2)
      doc.fontSize(12).text('Dimensions:', { underline: true })
      doc.moveDown()
      doc.fontSize(10).text(`Total Area: ${dimensions.totalArea || 'N/A'}`)
      doc.text(`Perimeter: ${dimensions.perimeter || 'N/A'}`)
    }

    // Add footer
    doc.fontSize(8).text('Created with Architectural Floor Plan Designer', {
      align: 'center',
    })

    // Finalize PDF
    doc.end()
  } catch (error) {
    console.error('Error generating PDF:', error)
    res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

// Export floor plan as SVG
router.post('/svg', async (req, res) => {
  try {
    const { projectName, elements } = req.body

    // Create SVG content
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <title>${projectName || 'Floor Plan'}</title>
  <rect width="800" height="600" fill="white"/>
`

    // Add elements to SVG (simplified)
    if (elements && elements.length > 0) {
      elements.forEach((element) => {
        if (element.type === 'wall' && element.data.start && element.data.end) {
          svg += `  <line x1="${element.data.start.x}" y1="${element.data.start.y}" x2="${element.data.end.x}" y2="${element.data.end.y}" stroke="black" stroke-width="6"/>\n`
        }
      })
    }

    svg += '</svg>'

    // Set response headers
    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'floor-plan'}.svg"`)

    res.send(svg)
  } catch (error) {
    console.error('Error generating SVG:', error)
    res.status(500).json({ error: 'Failed to generate SVG' })
  }
})

// Export floor plan data as JSON
router.post('/json', async (req, res) => {
  try {
    const { projectName, data } = req.body

    // Set response headers
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${projectName || 'floor-plan'}.json"`)

    res.json(data)
  } catch (error) {
    console.error('Error generating JSON:', error)
    res.status(500).json({ error: 'Failed to generate JSON' })
  }
})

export default router
