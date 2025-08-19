import {
  QRDataType,
  WiFiData,
  VCardData,
  SMSData,
  EmailData,
  GeoLocationData,
  EventData,
} from '../types'

export class DataEncoder {
  static encode(data: string | QRDataType): string {
    if (typeof data === 'string') {
      return data
    }

    switch (data.type) {
      case 'text':
        return data.data

      case 'url':
        return this.validateUrl(data.data)

      case 'wifi':
        return this.encodeWiFi(data.data)

      case 'vcard':
        return this.encodeVCard(data.data)

      case 'sms':
        return this.encodeSMS(data.data)

      case 'email':
        return this.encodeEmail(data.data)

      case 'geo':
        return this.encodeGeoLocation(data.data)

      case 'event':
        return this.encodeEvent(data.data)

      case 'phone':
        return `tel:${data.data}`

      case 'bitcoin':
        return this.encodeBitcoin(data.data)

      case 'ethereum':
        return this.encodeEthereum(data.data)

      default:
        throw new Error(`Unknown QR data type`)
    }
  }

  private static validateUrl(url: string): string {
    try {
      new URL(url)
      return url
    } catch {
      // If not a valid URL, prepend https://
      return `https://${url}`
    }
  }

  private static encodeWiFi(data: WiFiData): string {
    const security = data.security || 'WPA'
    const hidden = data.hidden ? 'true' : 'false'

    let wifi = `WIFI:T:${security};S:${this.escapeString(data.ssid)};`

    if (data.password) {
      wifi += `P:${this.escapeString(data.password)};`
    }

    wifi += `H:${hidden};;`

    return wifi
  }

  private static encodeVCard(data: VCardData): string {
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'

    if (data.firstName || data.lastName) {
      vcard += `FN:${data.firstName || ''} ${data.lastName || ''}\n`
      vcard += `N:${data.lastName || ''};${data.firstName || ''};;;\n`
    }

    if (data.organization) {
      vcard += `ORG:${data.organization}\n`
    }

    if (data.phone) {
      vcard += `TEL:${data.phone}\n`
    }

    if (data.email) {
      vcard += `EMAIL:${data.email}\n`
    }

    if (data.url) {
      vcard += `URL:${data.url}\n`
    }

    if (data.address) {
      vcard += `ADR:;;${data.address};;;;\n`
    }

    vcard += 'END:VCARD'

    return vcard
  }

  private static encodeSMS(data: SMSData): string {
    let sms = `SMSTO:${data.phone}`

    if (data.message) {
      sms += `:${data.message}`
    }

    return sms
  }

  private static encodeEmail(data: EmailData): string {
    let email = `mailto:${data.to}`
    const params: string[] = []

    if (data.subject) {
      params.push(`subject=${encodeURIComponent(data.subject)}`)
    }

    if (data.body) {
      params.push(`body=${encodeURIComponent(data.body)}`)
    }

    if (data.cc) {
      params.push(`cc=${data.cc}`)
    }

    if (data.bcc) {
      params.push(`bcc=${data.bcc}`)
    }

    if (params.length > 0) {
      email += `?${params.join('&')}`
    }

    return email
  }

  private static encodeGeoLocation(data: GeoLocationData): string {
    let geo = `geo:${data.latitude},${data.longitude}`

    if (data.altitude !== undefined) {
      geo += `,${data.altitude}`
    }

    return geo
  }

  private static encodeEvent(data: EventData): string {
    let event = 'BEGIN:VEVENT\n'
    event += `SUMMARY:${data.summary}\n`
    event += `DTSTART:${this.formatDate(data.startDate)}\n`

    if (data.endDate) {
      event += `DTEND:${this.formatDate(data.endDate)}\n`
    }

    if (data.location) {
      event += `LOCATION:${data.location}\n`
    }

    if (data.description) {
      event += `DESCRIPTION:${data.description}\n`
    }

    event += 'END:VEVENT'

    return event
  }

  private static encodeBitcoin(data: {
    address: string
    amount?: number
    label?: string
    message?: string
  }): string {
    let bitcoin = `bitcoin:${data.address}`
    const params: string[] = []

    if (data.amount !== undefined) {
      params.push(`amount=${data.amount}`)
    }

    if (data.label) {
      params.push(`label=${encodeURIComponent(data.label)}`)
    }

    if (data.message) {
      params.push(`message=${encodeURIComponent(data.message)}`)
    }

    if (params.length > 0) {
      bitcoin += `?${params.join('&')}`
    }

    return bitcoin
  }

  private static encodeEthereum(data: {
    address: string
    amount?: number
    gas?: number
  }): string {
    let ethereum = `ethereum:${data.address}`
    const params: string[] = []

    if (data.amount !== undefined) {
      params.push(`value=${data.amount}e18`) // Convert to wei
    }

    if (data.gas !== undefined) {
      params.push(`gas=${data.gas}`)
    }

    if (params.length > 0) {
      ethereum += `?${params.join('&')}`
    }

    return ethereum
  }

  private static escapeString(str: string): string {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/:/g, '\\:')
  }

  private static formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }
}
