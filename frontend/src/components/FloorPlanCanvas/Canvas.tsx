import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { Box } from '@mui/material'
import { useFloorPlanStore } from '../../store/floorPlanStore'
import { snapToGrid } from '../../utils/snapUtils'
import { v4 as uuidv4 } from 'uuid'

interface CanvasProps {
  selectedTool: string
}

export default function FloorPlanCanvas({ selectedTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [tempLine, setTempLine] = useState<fabric.Line | null>(null)

  const {
    setCanvas,
    addElement,
    gridSize,
    snapToGrid: snapEnabled,
    activeLayer,
  } = useFloorPlanStore()

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasRef.current.parentElement?.clientWidth || 800,
      height: canvasRef.current.parentElement?.clientHeight || 600,
      backgroundColor: '#ffffff',
      selection: selectedTool === 'select',
    })

    fabricCanvasRef.current = canvas
    setCanvas(canvas)

    // Draw grid
    drawGrid(canvas, gridSize)

    // Handle window resize
    const handleResize = () => {
      const parent = canvasRef.current?.parentElement
      if (parent) {
        canvas.setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        })
        drawGrid(canvas, gridSize)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    canvas.selection = selectedTool === 'select'

    if (selectedTool === 'wall') {
      canvas.defaultCursor = 'crosshair'
      setupWallDrawing(canvas)
    } else if (selectedTool === 'door' || selectedTool === 'window') {
      canvas.defaultCursor = 'crosshair'
      setupDoorWindowPlacement(canvas, selectedTool)
    } else if (selectedTool === 'measure') {
      canvas.defaultCursor = 'crosshair'
      setupMeasurement(canvas)
    } else {
      canvas.defaultCursor = 'default'
      removeAllListeners(canvas)
    }
  }, [selectedTool])

  const drawGrid = (canvas: fabric.Canvas, size: number) => {
    const width = canvas.getWidth()
    const height = canvas.getHeight()

    // Remove existing grid
    const existingGrid = canvas.getObjects().filter((obj: any) => (obj as any).isGrid)
    existingGrid.forEach((obj: any) => canvas.remove(obj))

    // Draw vertical lines
    for (let i = 0; i < width / size; i++) {
      const line = new fabric.Line([i * size, 0, i * size, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })
      ;(line as any).isGrid = true
      canvas.add(line)
    }

    // Draw horizontal lines
    for (let i = 0; i < height / size; i++) {
      const line = new fabric.Line([0, i * size, width, i * size], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })
      ;(line as any).isGrid = true
      canvas.add(line)
    }

    canvas.sendToBack(...canvas.getObjects().filter((obj: any) => obj.isGrid))
  }

  const setupWallDrawing = (canvas: fabric.Canvas) => {
    const handleMouseDown = (e: fabric.IEvent) => {
      if (!e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      setStartPoint(pointer)
      setIsDrawing(true)

      // Create temporary line
      const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: '#000000',
        strokeWidth: 6,
        selectable: false,
        evented: false,
      })

      canvas.add(line)
      setTempLine(line)
    }

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawing || !tempLine || !startPoint || !e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      tempLine.set({ x2: pointer.x, y2: pointer.y })
      canvas.renderAll()
    }

    const handleMouseUp = (e: fabric.IEvent) => {
      if (!isDrawing || !startPoint || !e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      // Remove temporary line
      if (tempLine) {
        canvas.remove(tempLine)
      }

      // Create final wall
      const wall = new fabric.Line(
        [startPoint.x, startPoint.y, pointer.x, pointer.y],
        {
          stroke: '#000000',
          strokeWidth: 6,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        }
      )

      const wallId = uuidv4()
      ;(wall as any).elementId = wallId

      canvas.add(wall)

      addElement({
        id: wallId,
        type: 'wall',
        layer: activeLayer,
        data: {
          start: startPoint,
          end: pointer,
          thickness: 6,
        },
        fabricObject: wall,
      })

      setIsDrawing(false)
      setStartPoint(null)
      setTempLine(null)
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
  }

  const setupDoorWindowPlacement = (canvas: fabric.Canvas, type: string) => {
    const handleMouseDown = (e: fabric.IEvent) => {
      if (!e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      const width = 36 // Standard 3 feet in pixels
      const height = 6

      const rect = new fabric.Rect({
        left: pointer.x - width / 2,
        top: pointer.y - height / 2,
        width: width,
        height: height,
        fill: type === 'door' ? '#8B4513' : '#87CEEB',
        stroke: '#000000',
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
      })

      const elementId = uuidv4()
      ;(rect as any).elementId = elementId

      canvas.add(rect)

      addElement({
        id: elementId,
        type: type as 'door' | 'window',
        layer: activeLayer,
        data: {
          position: pointer,
          width: width,
        },
        fabricObject: rect,
      })
    }

    canvas.on('mouse:down', handleMouseDown)
  }

  const setupMeasurement = (canvas: fabric.Canvas) => {
    const handleMouseDown = (e: fabric.IEvent) => {
      if (!e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      setStartPoint(pointer)
      setIsDrawing(true)
    }

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawing || !startPoint || !e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      if (tempLine) {
        canvas.remove(tempLine)
      }

      const line = new fabric.Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
        stroke: '#FF0000',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      })

      canvas.add(line)
      setTempLine(line)
    }

    const handleMouseUp = (e: fabric.IEvent) => {
      if (!isDrawing || !startPoint || !e.pointer) return

      const pointer = snapEnabled
        ? snapToGrid(e.pointer, gridSize)
        : e.pointer

      if (tempLine) {
        canvas.remove(tempLine)
      }

      const dx = pointer.x - startPoint.x
      const dy = pointer.y - startPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const distanceFeet = (distance / 20).toFixed(2) // Assuming 20px = 1 foot

      const line = new fabric.Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
        stroke: '#FF0000',
        strokeWidth: 2,
        selectable: true,
      })

      const text = new fabric.Text(`${distanceFeet}'`, {
        left: (startPoint.x + pointer.x) / 2,
        top: (startPoint.y + pointer.y) / 2 - 10,
        fontSize: 14,
        fill: '#FF0000',
        backgroundColor: '#FFFFFF',
        selectable: true,
      })

      const group = new fabric.Group([line, text], {
        selectable: true,
      })

      const elementId = uuidv4()
      ;(group as any).elementId = elementId

      canvas.add(group)

      addElement({
        id: elementId,
        type: 'measurement',
        layer: 'measurements',
        data: {
          start: startPoint,
          end: pointer,
          distance: distanceFeet,
        },
        fabricObject: group,
      })

      setIsDrawing(false)
      setStartPoint(null)
      setTempLine(null)
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
  }

  const removeAllListeners = (canvas: fabric.Canvas) => {
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
  }

  // Handle drag and drop from furniture library
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const furnitureData = JSON.parse(e.dataTransfer.getData('furniture'))
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const furniture = new fabric.Rect({
      left: x - furnitureData.width / 2,
      top: y - furnitureData.height / 2,
      width: furnitureData.width,
      height: furnitureData.height,
      fill: furnitureData.color || '#8B4513',
      stroke: '#000000',
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    })

    const text = new fabric.Text(furnitureData.icon || furnitureData.name.charAt(0), {
      left: x,
      top: y,
      fontSize: 24,
      originX: 'center',
      originY: 'center',
      selectable: false,
    })

    const group = new fabric.Group([furniture, text], {
      selectable: true,
    })

    const elementId = uuidv4()
    ;(group as any).elementId = elementId

    canvas.add(group)

    addElement({
      id: elementId,
      type: 'furniture',
      layer: 'furniture',
      data: {
        name: furnitureData.name,
        width: furnitureData.width,
        height: furnitureData.height,
      },
      fabricObject: group,
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <Box
      sx={{ width: '100%', height: '100%', position: 'relative' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas ref={canvasRef} />
    </Box>
  )
}
