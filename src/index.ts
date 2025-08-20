import { QRDataType } from './types/types'

// Main components
export { ReactQrCode, ReactQrCode as default } from './components/ReactQrCode'
export { AdvancedQRCode } from './components/AdvancedQRCode'

// Types
export type {
  ReactQrCodeProps,
  ErrorCorrectionLevel,
  RenderAs,
  ModuleShape,
  CornerShape,
  ImageSettings,
  GradientSettings,
  QRCodeStyle,
  DownloadOptions,
  WiFiData,
  VCardData,
  SMSData,
  EmailData,
  GeoLocationData,
  EventData,
  QRDataType,
  QRCodeRef,
  QRCodeOptions,
  QRModule,
  RGB,
  RGBA,
} from './types/types'

// Advanced Types
export type {
  AdvancedQRCodeProps,
  AdvancedQRStyleOptions,
  EyeShape,
  EyeFrameShape,
  EyeCustomization,
  SingleEyeConfig,
  BodyShape,
  BodyCustomization,
  BodyPattern,
  BackgroundPattern,
  BackgroundCustomization,
  BackgroundImage,
  BackgroundEffect,
  BorderConfig,
  ColorEffect,
  AnimationType,
  AnimationConfig,
  FluidConfig,
  GradientConfig,
  GradientStop,
  ShadowConfig,
  GlowConfig,
  QRTheme,
} from './types/advanced'

// Export preset themes
export { PRESET_THEMES } from './types/advanced'

// Error classes
export { QRCodeError, DataTooLongError, InvalidDataError } from './types/types'

// Constants
export {
  ERROR_CORRECTION_LEVELS,
  QR_MODES,
  MAX_VERSION,
  MIN_VERSION,
} from './types/types'

// Utilities
export { DataEncoder } from './utils/dataEncoder'
export { validateInput, estimateVersion } from './utils/validation'
export { downloadQRCode, copyQRCode } from './utils/download'

// QR Code generation classes (for advanced usage)
export { QRCode } from './qr/QRCode'
export { QRUtil } from './qr/QRUtil'

// Helper functions for creating QR data
export const QRHelpers = {
  wifi: (
    ssid: string,
    password?: string,
    security?: 'WEP' | 'WPA' | 'WPA2' | 'nopass',
    hidden = false
  ): QRDataType => ({
    type: 'wifi',
    data: { ssid, password, security, hidden },
  }),

  vcard: (data: {
    firstName?: string
    lastName?: string
    organization?: string
    phone?: string
    email?: string
    url?: string
    address?: string
  }): QRDataType => ({
    type: 'vcard',
    data,
  }),

  sms: (phone: string, message?: string): QRDataType => ({
    type: 'sms',
    data: { phone, message },
  }),

  email: (
    to: string,
    subject?: string,
    body?: string,
    cc?: string,
    bcc?: string
  ): QRDataType => ({
    type: 'email',
    data: { to, subject, body, cc, bcc },
  }),

  geo: (
    latitude: number,
    longitude: number,
    altitude?: number
  ): QRDataType => ({
    type: 'geo',
    data: { latitude, longitude, altitude },
  }),

  event: (data: {
    summary: string
    startDate: Date
    endDate?: Date
    location?: string
    description?: string
  }): QRDataType => ({
    type: 'event',
    data,
  }),

  phone: (number: string): QRDataType => ({
    type: 'phone',
    data: number,
  }),

  bitcoin: (
    address: string,
    amount?: number,
    label?: string,
    message?: string
  ): QRDataType => ({
    type: 'bitcoin',
    data: { address, amount, label, message },
  }),

  ethereum: (address: string, amount?: number, gas?: number): QRDataType => ({
    type: 'ethereum',
    data: { address, amount, gas },
  }),

  url: (url: string): QRDataType => ({
    type: 'url',
    data: url,
  }),

  text: (text: string): QRDataType => ({
    type: 'text',
    data: text,
  }),
}
