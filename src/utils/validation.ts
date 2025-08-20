import { InvalidDataError, DataTooLongError } from '../types/types'

const MAX_LENGTH = {
  L: { 1: 25, 10: 172, 27: 702, 40: 2953 },
  M: { 1: 20, 10: 134, 27: 546, 40: 2331 },
  Q: { 1: 16, 10: 106, 27: 422, 40: 1817 },
  H: { 1: 10, 10: 82, 27: 318, 40: 1273 },
}

export function validateInput(data: string): void {
  if (!data) {
    throw new InvalidDataError('QR code data cannot be empty')
  }

  if (typeof data !== 'string') {
    throw new InvalidDataError('QR code data must be a string')
  }

  // Check for maximum length (version 40, low error correction)
  if (data.length > MAX_LENGTH.L[40]) {
    throw new DataTooLongError(
      `Data is too long. Maximum length is ${MAX_LENGTH.L[40]} characters`
    )
  }

  // Check for invalid characters in certain formats
  if (data.startsWith('WIFI:')) {
    validateWiFiFormat(data)
  } else if (data.startsWith('BEGIN:VCARD')) {
    validateVCardFormat(data)
  } else if (data.startsWith('SMSTO:')) {
    validateSMSFormat(data)
  } else if (data.startsWith('mailto:')) {
    validateEmailFormat(data)
  } else if (data.startsWith('tel:')) {
    validatePhoneFormat(data)
  } else if (data.startsWith('geo:')) {
    validateGeoFormat(data)
  } else if (data.startsWith('bitcoin:') || data.startsWith('ethereum:')) {
    validateCryptoFormat(data)
  }
}

function validateWiFiFormat(data: string): void {
  const requiredFields = ['T:', 'S:']
  for (const field of requiredFields) {
    if (!data.includes(field)) {
      throw new InvalidDataError(`Invalid WiFi format: missing ${field} field`)
    }
  }

  // Check security type
  const securityMatch = data.match(/T:([^;]+);/)
  if (securityMatch) {
    const validTypes = ['WEP', 'WPA', 'WPA2', 'nopass']
    if (!validTypes.includes(securityMatch[1])) {
      throw new InvalidDataError(
        `Invalid WiFi security type: ${securityMatch[1]}. Must be one of: ${validTypes.join(', ')}`
      )
    }
  }
}

function validateVCardFormat(data: string): void {
  if (!data.includes('END:VCARD')) {
    throw new InvalidDataError('Invalid vCard format: missing END:VCARD')
  }

  if (!data.includes('VERSION:')) {
    throw new InvalidDataError('Invalid vCard format: missing VERSION field')
  }
}

function validateSMSFormat(data: string): void {
  const phoneMatch = data.match(/SMSTO:([^:]+)/)
  if (!phoneMatch || !phoneMatch[1]) {
    throw new InvalidDataError('Invalid SMS format: missing phone number')
  }

  validatePhoneNumber(phoneMatch[1])
}

function validateEmailFormat(data: string): void {
  const emailMatch = data.match(/mailto:([^?]+)/)
  if (!emailMatch || !emailMatch[1]) {
    throw new InvalidDataError('Invalid email format: missing email address')
  }

  if (!isValidEmail(emailMatch[1])) {
    throw new InvalidDataError(`Invalid email address: ${emailMatch[1]}`)
  }
}

function validatePhoneFormat(data: string): void {
  const phoneMatch = data.match(/tel:(.+)/)
  if (!phoneMatch || !phoneMatch[1]) {
    throw new InvalidDataError('Invalid phone format: missing phone number')
  }

  validatePhoneNumber(phoneMatch[1])
}

function validateGeoFormat(data: string): void {
  const geoMatch = data.match(/geo:([^,]+),([^,]+)/)
  if (!geoMatch) {
    throw new InvalidDataError(
      'Invalid geo format: must be geo:latitude,longitude'
    )
  }

  const lat = parseFloat(geoMatch[1])
  const lng = parseFloat(geoMatch[2])

  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw new InvalidDataError(
      `Invalid latitude: ${geoMatch[1]}. Must be between -90 and 90`
    )
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    throw new InvalidDataError(
      `Invalid longitude: ${geoMatch[2]}. Must be between -180 and 180`
    )
  }
}

function validateCryptoFormat(data: string): void {
  if (data.startsWith('bitcoin:')) {
    const addressMatch = data.match(/bitcoin:([^?]+)/)
    if (!addressMatch || !addressMatch[1]) {
      throw new InvalidDataError('Invalid Bitcoin format: missing address')
    }

    // Basic Bitcoin address validation (simplified)
    const address = addressMatch[1]
    if (
      !/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) &&
      !/^bc1[a-z0-9]{39,59}$/.test(address)
    ) {
      throw new InvalidDataError(`Invalid Bitcoin address format: ${address}`)
    }
  } else if (data.startsWith('ethereum:')) {
    const addressMatch = data.match(/ethereum:([^?]+)/)
    if (!addressMatch || !addressMatch[1]) {
      throw new InvalidDataError('Invalid Ethereum format: missing address')
    }

    // Ethereum address validation
    const address = addressMatch[1]
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new InvalidDataError(`Invalid Ethereum address format: ${address}`)
    }
  }
}

function validatePhoneNumber(phone: string): void {
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

  // Check if it's a valid phone number format
  if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
    throw new InvalidDataError(
      `Invalid phone number format: ${phone}. Must contain 7-15 digits, optionally starting with +`
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function estimateVersion(
  data: string,
  errorCorrection: keyof typeof MAX_LENGTH
): number {
  const length = data.length

  for (const [version, maxLength] of Object.entries(
    MAX_LENGTH[errorCorrection]
  )) {
    if (length <= maxLength) {
      return parseInt(version)
    }
  }

  return 40 // Maximum version
}
