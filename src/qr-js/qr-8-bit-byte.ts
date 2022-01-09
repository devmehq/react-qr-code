import { qrModeEnum } from './qr-mode-enum'

function QR8bitByte(data) {
  this.mode = qrModeEnum.MODE_8BIT_BYTE
  this.data = data
}

QR8bitByte.prototype = {
  getLength: function (buffer) {
    return this.data.length
  },

  write: function (buffer) {
    for (let i = 0; i < this.data.length; i++) {
      // not JIS ...
      buffer.put(this.data.charCodeAt(i), 8)
    }
  },
}

export { QR8bitByte }
