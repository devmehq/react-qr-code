import { QRBitBuffer } from './QRBitBuffer'

export class QR8BitByte {
  mode = 4 // 8-bit byte mode
  private data: string

  constructor(data: string) {
    this.data = data
  }

  getLength(): number {
    return this.data.length
  }

  write(buffer: QRBitBuffer): void {
    for (let i = 0; i < this.data.length; i++) {
      buffer.put(this.data.charCodeAt(i), 8)
    }
  }
}
