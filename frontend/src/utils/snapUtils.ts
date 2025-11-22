import { Point } from './geometryUtils'

/**
 * Snap a point to the nearest grid intersection
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }
}

/**
 * Snap angle to nearest 15 degrees (for orthogonal and diagonal drawing)
 */
export function snapAngle(angle: number, snapDegrees: number = 15): number {
  return Math.round(angle / snapDegrees) * snapDegrees
}

/**
 * Find nearest snap point from a list of potential snap points
 */
export function findNearestSnapPoint(
  point: Point,
  snapPoints: Point[],
  threshold: number = 10
): Point | null {
  let nearestPoint: Point | null = null
  let minDistance = threshold

  for (const snapPoint of snapPoints) {
    const dx = point.x - snapPoint.x
    const dy = point.y - snapPoint.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < minDistance) {
      minDistance = dist
      nearestPoint = snapPoint
    }
  }

  return nearestPoint
}

/**
 * Generate snap points for an object (corners, midpoints, etc.)
 */
export function generateSnapPoints(
  x: number,
  y: number,
  width: number,
  height: number
): Point[] {
  return [
    { x, y }, // top-left
    { x: x + width, y }, // top-right
    { x: x + width, y: y + height }, // bottom-right
    { x, y: y + height }, // bottom-left
    { x: x + width / 2, y }, // top-middle
    { x: x + width / 2, y: y + height }, // bottom-middle
    { x, y: y + height / 2 }, // left-middle
    { x: x + width, y: y + height / 2 }, // right-middle
    { x: x + width / 2, y: y + height / 2 }, // center
  ]
}

/**
 * Constrain point to horizontal or vertical line from origin
 */
export function constrainToAxis(origin: Point, current: Point): Point {
  const dx = Math.abs(current.x - origin.x)
  const dy = Math.abs(current.y - origin.y)

  // Snap to the dominant axis
  if (dx > dy) {
    return { x: current.x, y: origin.y }
  } else {
    return { x: origin.x, y: current.y }
  }
}

/**
 * Draw guidelines for snapping
 */
export function drawSnapGuides(
  ctx: CanvasRenderingContext2D,
  point: Point,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save()
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])

  // Vertical guide
  ctx.beginPath()
  ctx.moveTo(point.x, 0)
  ctx.lineTo(point.x, canvasHeight)
  ctx.stroke()

  // Horizontal guide
  ctx.beginPath()
  ctx.moveTo(0, point.y)
  ctx.lineTo(canvasWidth, point.y)
  ctx.stroke()

  ctx.restore()
}
