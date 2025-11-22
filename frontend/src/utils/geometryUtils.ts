export interface Point {
  x: number
  y: number
}

export interface Line {
  start: Point
  end: Point
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

/**
 * Calculate angle between two points in degrees
 */
export function angle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI)
}

/**
 * Find intersection point of two lines
 */
export function lineIntersection(line1: Line, line2: Line): Point | null {
  const x1 = line1.start.x
  const y1 = line1.start.y
  const x2 = line1.end.x
  const y2 = line1.end.y
  const x3 = line2.start.x
  const y3 = line2.start.y
  const x4 = line2.end.x
  const y4 = line2.end.y

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

  if (denominator === 0) return null

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    }
  }

  return null
}

/**
 * Calculate area of a polygon
 */
export function polygonArea(points: Point[]): number {
  let area = 0
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length
    area += points[i].x * points[j].y
    area -= points[j].x * points[i].y
  }
  return Math.abs(area / 2)
}

/**
 * Convert pixels to feet (assuming 1 foot = 20 pixels by default)
 */
export function pixelsToFeet(pixels: number, pixelsPerFoot: number = 20): number {
  return pixels / pixelsPerFoot
}

/**
 * Convert feet to pixels
 */
export function feetToPixels(feet: number, pixelsPerFoot: number = 20): number {
  return feet * pixelsPerFoot
}

/**
 * Convert pixels to meters
 */
export function pixelsToMeters(pixels: number, pixelsPerMeter: number = 65.6): number {
  return pixels / pixelsPerMeter
}

/**
 * Convert meters to pixels
 */
export function metersToPixels(meters: number, pixelsPerMeter: number = 65.6): number {
  return meters * pixelsPerMeter
}

/**
 * Format measurement for display
 */
export function formatMeasurement(pixels: number, unit: 'imperial' | 'metric'): string {
  if (unit === 'imperial') {
    const feet = pixelsToFeet(pixels)
    const wholeFeet = Math.floor(feet)
    const inches = Math.round((feet - wholeFeet) * 12)
    return inches > 0 ? `${wholeFeet}'-${inches}"` : `${wholeFeet}'`
  } else {
    const meters = pixelsToMeters(pixels)
    return `${meters.toFixed(2)}m`
  }
}

/**
 * Find perpendicular point on a line from a given point
 */
export function perpendicularPoint(line: Line, point: Point): Point {
  const dx = line.end.x - line.start.x
  const dy = line.end.y - line.start.y
  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) return line.start

  const t = ((point.x - line.start.x) * dx + (point.y - line.start.y) * dy) / lengthSquared

  return {
    x: line.start.x + t * dx,
    y: line.start.y + t * dy
  }
}

/**
 * Check if a point is near a line (within threshold)
 */
export function isPointNearLine(point: Point, line: Line, threshold: number = 5): boolean {
  const perpPoint = perpendicularPoint(line, point)
  const dist = distance(point, perpPoint)
  return dist <= threshold
}

/**
 * Calculate midpoint between two points
 */
export function midpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}
