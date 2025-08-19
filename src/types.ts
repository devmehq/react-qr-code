import { CSSProperties } from 'react'

// QR Code Error Correction Levels
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

// Rendering targets
export type RenderAs = 'svg' | 'canvas'

// Shape types for QR code modules
export type ModuleShape = 'square' | 'circle' | 'rounded' | 'diamond' | 'star'

// Corner shape types
export type CornerShape = 'square' | 'rounded' | 'circle'

// Image/Logo configuration
export interface ImageSettings {
  src: string
  height?: number
  width?: number
  excavate?: boolean
  x?: number
  y?: number
  opacity?: number
  crossOrigin?: 'anonymous' | 'use-credentials'
}

// Gradient configuration
export interface GradientSettings {
  type: 'linear' | 'radial'
  colors: string[]
  angle?: number // For linear gradients
}

// Custom styling options
export interface QRCodeStyle {
  module?: {
    shape?: ModuleShape
    color?: string | GradientSettings
    size?: number
  }
  corner?: {
    shape?: CornerShape
    color?: string
  }
  background?: {
    color?: string | GradientSettings
    image?: string
    opacity?: number
  }
}

// Download options
export interface DownloadOptions {
  filename?: string
  format?: 'png' | 'jpeg' | 'webp' | 'svg'
  quality?: number // For JPEG/WebP
  scale?: number // Multiplier for resolution
}

// QR Code Data Types
export interface WiFiData {
  ssid: string
  password?: string
  security?: 'WEP' | 'WPA' | 'WPA2' | 'nopass'
  hidden?: boolean
}

export interface VCardData {
  firstName?: string
  lastName?: string
  organization?: string
  phone?: string
  email?: string
  url?: string
  address?: string
}

export interface SMSData {
  phone: string
  message?: string
}

export interface EmailData {
  to: string
  subject?: string
  body?: string
  cc?: string
  bcc?: string
}

export interface GeoLocationData {
  latitude: number
  longitude: number
  altitude?: number
}

export interface EventData {
  summary: string
  startDate: Date
  endDate?: Date
  location?: string
  description?: string
}

export type QRDataType =
  | { type: 'text'; data: string }
  | { type: 'url'; data: string }
  | { type: 'wifi'; data: WiFiData }
  | { type: 'vcard'; data: VCardData }
  | { type: 'sms'; data: SMSData }
  | { type: 'email'; data: EmailData }
  | { type: 'geo'; data: GeoLocationData }
  | { type: 'event'; data: EventData }
  | { type: 'phone'; data: string }
  | {
      type: 'bitcoin'
      data: {
        address: string
        amount?: number
        label?: string
        message?: string
      }
    }
  | {
      type: 'ethereum'
      data: { address: string; amount?: number; gas?: number }
    }

// Main component props
export interface ReactQrCodeProps {
  // Basic props
  value?: string | QRDataType
  size?: number
  level?: ErrorCorrectionLevel
  bgColor?: string
  fgColor?: string

  // Rendering
  renderAs?: RenderAs
  marginSize?: number

  // Styling
  style?: CSSProperties
  className?: string
  id?: string
  title?: string

  // Advanced styling
  qrStyle?: QRCodeStyle

  // Image/Logo
  imageSettings?: ImageSettings

  // Callbacks
  onLoad?: () => void
  onError?: (error: Error) => void
  onClick?: (event: React.MouseEvent) => void

  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string

  // Performance
  lazy?: boolean
  debounceMs?: number

  // Features
  includeMargin?: boolean
  minVersion?: number
  maskPattern?: number

  // Download
  enableDownload?: boolean
  downloadOptions?: DownloadOptions

  // Animation
  animated?: boolean
  animationDuration?: number
  animationDelay?: number
}

// Hook return types
export interface QRCodeRef {
  download: (options?: DownloadOptions) => Promise<void>
  copy: () => Promise<void>
  getDataURL: (format?: string, quality?: number) => Promise<string>
  getSVGString: () => string
}

// QR Code generation options
export interface QRCodeOptions {
  typeNumber: number
  errorCorrectionLevel: number
  mode?: number
  maskPattern?: number
}

// Module data structure
export interface QRModule {
  row: number
  col: number
  isDark: boolean
  isCorner?: boolean
  isTiming?: boolean
  isAlignment?: boolean
}

// Error types
export class QRCodeError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = 'QRCodeError'
  }
}

export class DataTooLongError extends QRCodeError {
  constructor(message: string) {
    super(message, 'DATA_TOO_LONG')
  }
}

export class InvalidDataError extends QRCodeError {
  constructor(message: string) {
    super(message, 'INVALID_DATA')
  }
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RGB = {
  r: number
  g: number
  b: number
}

export type RGBA = RGB & {
  a: number
}

// Constants
export const ERROR_CORRECTION_LEVELS = {
  L: 1, // ~7% correction
  M: 0, // ~15% correction
  Q: 3, // ~25% correction
  H: 2, // ~30% correction
} as const

export const QR_MODES = {
  NUMERIC: 1,
  ALPHANUMERIC: 2,
  BYTE: 4,
  KANJI: 8,
} as const

export const MAX_VERSION = 40
export const MIN_VERSION = 1
