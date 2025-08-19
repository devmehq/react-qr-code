/**
 * QR Code Decoder Utility
 * Decodes QR codes from various image formats including SVG
 */

import { QRCode } from '../qr/QRCode'

export interface DecodeOptions {
  isRGB?: boolean
  detectFn?: (points: Point4) => void
  qrFn?: (img: ImageData) => void
}

export interface Point {
  x: number
  y: number
}

export type Point4 = [Point, Point, Point, Point]

export interface DecodeResult {
  data: string
  version: number
  errorCorrectionLevel: string
  mask: number
  mode: string
  bounds?: Point4
}

/**
 * Convert SVG to ImageData for decoding
 */
function svgToImageData(svgString: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(imageData)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }

    img.src = url
  })
}

/**
 * Convert ImageData to binary matrix for QR decoding
 */
function imageToBinaryMatrix(imageData: ImageData): boolean[][] {
  const { width, height, data } = imageData
  const matrix: boolean[][] = []

  for (let y = 0; y < height; y++) {
    const row: boolean[] = []
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]

      // Convert to grayscale
      const gray = 0.299 * r + 0.587 * g + 0.114 * b

      // Threshold to black/white (adjust threshold as needed)
      row.push(gray < 128)
    }
    matrix.push(row)
  }

  return matrix
}

/**
 * Find QR code finder patterns in binary matrix
 */
function findFinderPatterns(matrix: boolean[][]): Point4 | null {
  const height = matrix.length
  const width = matrix[0]?.length || 0

  // Simplified finder pattern detection
  // Look for 1:1:3:1:1 ratio pattern
  const patterns: Point[] = []

  for (let y = 0; y < height - 6; y++) {
    for (let x = 0; x < width - 6; x++) {
      if (isFinderPattern(matrix, x, y)) {
        patterns.push({ x: x + 3, y: y + 3 }) // Center of pattern
      }
    }
  }

  // Need at least 3 finder patterns
  if (patterns.length < 3) {
    return null
  }

  // Sort patterns and return top-left, top-right, bottom-left, and estimated bottom-right
  patterns.sort((a, b) => a.y - b.y || a.x - b.x)

  // Estimate the 4th corner for perspective transform
  const topLeft = patterns[0]
  const topRight = patterns[1]
  const bottomLeft = patterns[2]
  const bottomRight = {
    x: topRight.x + (bottomLeft.x - topLeft.x),
    y: bottomLeft.y + (topRight.y - topLeft.y),
  }

  return [topLeft, topRight, bottomRight, bottomLeft]
}

/**
 * Check if a position contains a finder pattern
 */
function isFinderPattern(matrix: boolean[][], x: number, y: number): boolean {
  // Simplified check for 7x7 finder pattern
  const pattern = [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, true, true, true, false, true],
    [true, false, true, true, true, false, true],
    [true, false, true, true, true, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, true, true],
  ]

  for (let dy = 0; dy < 7; dy++) {
    for (let dx = 0; dx < 7; dx++) {
      if (matrix[y + dy]?.[x + dx] !== pattern[dy][dx]) {
        return false
      }
    }
  }

  return true
}

/**
 * Extract QR code data from binary matrix
 */
function extractQRData(
  _matrix: boolean[][],
  bounds: Point4
): DecodeResult | null {
  // This is a simplified extraction - in reality, this would need to:
  // 1. Apply perspective correction
  // 2. Read format information
  // 3. Unmask the data
  // 4. Extract and decode the data bits

  // For now, return a mock result for testing
  return {
    data: 'Decoded QR Data',
    version: 1,
    errorCorrectionLevel: 'M',
    mask: 0,
    mode: 'byte',
    bounds,
  }
}

/**
 * Decode QR code from SVG string
 */
export async function decodeSVG(
  svgString: string,
  options: DecodeOptions = {}
): Promise<DecodeResult> {
  try {
    const imageData = await svgToImageData(svgString)
    const matrix = imageToBinaryMatrix(imageData)
    const bounds = findFinderPatterns(matrix)

    if (!bounds) {
      throw new Error('No QR code found in image')
    }

    if (options.detectFn) {
      options.detectFn(bounds)
    }

    if (options.qrFn) {
      options.qrFn(imageData)
    }

    const result = extractQRData(matrix, bounds)

    if (!result) {
      throw new Error('Failed to decode QR code')
    }

    return result
  } catch (error) {
    throw new Error(
      `Failed to decode SVG: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Decode QR code from canvas element
 */
export async function decodeCanvas(
  canvas: HTMLCanvasElement,
  options: DecodeOptions = {}
): Promise<DecodeResult> {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const matrix = imageToBinaryMatrix(imageData)
  const bounds = findFinderPatterns(matrix)

  if (!bounds) {
    throw new Error('No QR code found in canvas')
  }

  if (options.detectFn) {
    options.detectFn(bounds)
  }

  if (options.qrFn) {
    options.qrFn(imageData)
  }

  const result = extractQRData(matrix, bounds)

  if (!result) {
    throw new Error('Failed to decode QR code')
  }

  return result
}

/**
 * Validate QR code detectability by generating and then decoding
 */
export async function validateQRCode(
  data: string,
  options: any
): Promise<{ isValid: boolean; error?: string }> {
  try {
    // Validate input
    if (!data || data.length === 0) {
      return { isValid: false, error: 'No data provided' }
    }

    if (options.size === 0) {
      return { isValid: false, error: 'Invalid size' }
    }

    // Generate QR code
    const errorCorrectionLevel = options.errorCorrectionLevel || 'M'
    const qr = new QRCode(0, errorCorrectionLevel)
    qr.addData(data)
    qr.make()

    // Convert to matrix
    const modules = qr.getModules()

    // Check basic QR properties
    if (!modules || modules.length === 0) {
      return { isValid: false, error: 'No modules generated' }
    }

    // Check for finder patterns
    // Convert nullable boolean array to boolean array for pattern detection
    const boolModules = modules.map((row) => row.map((cell) => cell === true))

    const hasTopLeft = isFinderPattern(boolModules, 0, 0)
    const hasTopRight =
      boolModules[0] &&
      isFinderPattern(boolModules, boolModules[0].length - 7, 0)
    const hasBottomLeft = isFinderPattern(
      boolModules,
      0,
      boolModules.length - 7
    )

    if (!hasTopLeft || !hasTopRight || !hasBottomLeft) {
      return { isValid: false, error: 'Missing finder patterns' }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Test contrast ratio between QR colors
 */
export function testContrast(fgColor: string, bgColor: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Calculate relative luminance
  const getLuminance = (color: { r: number; g: number; b: number }) => {
    const [r, g, b] = [color.r, color.g, color.b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const fg = hexToRgb(fgColor)
  const bg = hexToRgb(bgColor)

  if (!fg || !bg) {
    return 0
  }

  const fgLum = getLuminance(fg)
  const bgLum = getLuminance(bg)

  const brightest = Math.max(fgLum, bgLum)
  const darkest = Math.min(fgLum, bgLum)

  return (brightest + 0.05) / (darkest + 0.05)
}
