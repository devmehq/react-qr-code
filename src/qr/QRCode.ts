import { QRUtil } from './QRUtil'
import { QRRSBlock } from './QRRSBlock'
import { QRBitBuffer } from './QRBitBuffer'
import { QRPolynomial } from './QRPolynomial'
import { QR8BitByte } from './QR8BitByte'
import { ERROR_CORRECTION_LEVELS, DataTooLongError } from '../types'

export class QRCode {
  private typeNumber: number
  private errorCorrectionLevel: number
  private modules: (boolean | null)[][] | null = null
  private moduleCount = 0
  private dataCache: number[] | null = null
  private dataList: QR8BitByte[] = []

  constructor(
    typeNumber: number,
    errorCorrectionLevel: keyof typeof ERROR_CORRECTION_LEVELS
  ) {
    this.typeNumber = typeNumber
    this.errorCorrectionLevel = ERROR_CORRECTION_LEVELS[errorCorrectionLevel]
  }

  addData(data: string): void {
    const newData = new QR8BitByte(data)
    this.dataList.push(newData)
    this.dataCache = null
  }

  isDark(row: number, col: number): boolean {
    if (
      row < 0 ||
      this.moduleCount <= row ||
      col < 0 ||
      this.moduleCount <= col
    ) {
      throw new Error(`Invalid position: ${row},${col}`)
    }
    return this.modules?.[row]?.[col] ?? false
  }

  getModuleCount(): number {
    return this.moduleCount
  }

  getModules(): (boolean | null)[][] | null {
    return this.modules
  }

  make(): void {
    if (this.typeNumber < 1) {
      this.typeNumber = this.calculateTypeNumber()
    }
    this.makeImpl(false, this.getBestMaskPattern())
  }

  private calculateTypeNumber(): number {
    for (let typeNumber = 1; typeNumber < 40; typeNumber++) {
      const rsBlocks = QRRSBlock.getRSBlocks(
        typeNumber,
        this.errorCorrectionLevel
      )
      const buffer = new QRBitBuffer()

      let totalDataCount = 0
      for (const block of rsBlocks) {
        totalDataCount += block.dataCount
      }

      for (const data of this.dataList) {
        buffer.put(data.mode, 4)
        buffer.put(
          data.getLength(),
          QRUtil.getLengthInBits(data.mode, typeNumber)
        )
        data.write(buffer)
      }

      if (buffer.getLengthInBits() <= totalDataCount * 8) {
        return typeNumber
      }
    }

    throw new DataTooLongError('Data too long for QR code')
  }

  private makeImpl(test: boolean, maskPattern: number): void {
    this.moduleCount = this.typeNumber * 4 + 17
    this.modules = Array(this.moduleCount)
      .fill(null)
      .map(() => Array(this.moduleCount).fill(null))

    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)

    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }

    if (this.dataCache === null) {
      this.dataCache = QRCode.createData(
        this.typeNumber,
        this.errorCorrectionLevel,
        this.dataList
      )
    }

    this.mapData(this.dataCache, maskPattern)
  }

  private setupPositionProbePattern(row: number, col: number): void {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue

      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue

        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules![row + r]![col + c] = true
        } else {
          this.modules![row + r]![col + c] = false
        }
      }
    }
  }

  private getBestMaskPattern(): number {
    let minLostPoint = 0
    let pattern = 0

    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i)

      const lostPoint = QRUtil.getLostPoint(this)

      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }

    return pattern
  }

  private setupTimingPattern(): void {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules![r]![6] !== null) continue
      this.modules![r]![6] = r % 2 === 0
    }

    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules![6]![c] !== null) continue
      this.modules![6]![c] = c % 2 === 0
    }
  }

  private setupPositionAdjustPattern(): void {
    const pos = QRUtil.getPatternPosition(this.typeNumber)

    for (const row of pos) {
      for (const col of pos) {
        if (this.modules![row]![col] !== null) continue

        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (
              r === -2 ||
              r === 2 ||
              c === -2 ||
              c === 2 ||
              (r === 0 && c === 0)
            ) {
              this.modules![row + r]![col + c] = true
            } else {
              this.modules![row + r]![col + c] = false
            }
          }
        }
      }
    }
  }

  private setupTypeNumber(test: boolean): void {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber)

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules![Math.floor(i / 3)]![(i % 3) + this.moduleCount - 8 - 3] =
        mod
    }

    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules![(i % 3) + this.moduleCount - 8 - 3]![Math.floor(i / 3)] =
        mod
    }
  }

  private setupTypeInfo(test: boolean, maskPattern: number): void {
    const data = (this.errorCorrectionLevel << 3) | maskPattern
    const bits = QRUtil.getBCHTypeInfo(data)

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1

      if (i < 6) {
        this.modules![i]![8] = mod
      } else if (i < 8) {
        this.modules![i + 1]![8] = mod
      } else {
        this.modules![this.moduleCount - 15 + i]![8] = mod
      }
    }

    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1

      if (i < 8) {
        this.modules![8]![this.moduleCount - i - 1] = mod
      } else if (i < 9) {
        this.modules![8]![15 - i - 1 + 1] = mod
      } else {
        this.modules![8]![15 - i - 1] = mod
      }
    }

    this.modules![this.moduleCount - 8]![8] = !test
  }

  private mapData(data: number[], maskPattern: number): void {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0

    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--

      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules![row]![col - c] === null) {
            let dark = false

            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }

            const mask = QRUtil.getMask(maskPattern, row, col - c)

            if (mask) {
              dark = !dark
            }

            this.modules![row]![col - c] = dark
            bitIndex--

            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }

        row += inc

        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }

  static createData(
    typeNumber: number,
    errorCorrectionLevel: number,
    dataList: QR8BitByte[]
  ): number[] {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel)
    const buffer = new QRBitBuffer()

    for (const data of dataList) {
      buffer.put(data.mode, 4)
      buffer.put(
        data.getLength(),
        QRUtil.getLengthInBits(data.mode, typeNumber)
      )
      data.write(buffer)
    }

    let totalDataCount = 0
    for (const block of rsBlocks) {
      totalDataCount += block.dataCount
    }

    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new DataTooLongError(
        `Code length overflow. (${buffer.getLengthInBits()}>${totalDataCount * 8})`
      )
    }

    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4)
    }

    while (buffer.getLengthInBits() % 8 !== 0) {
      buffer.putBit(false)
    }

    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(0xec, 8)

      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break
      }
      buffer.put(0x11, 8)
    }

    return QRCode.createBytes(buffer, rsBlocks)
  }

  static createBytes(buffer: QRBitBuffer, rsBlocks: QRRSBlock[]): number[] {
    let offset = 0
    let maxDcCount = 0
    let maxEcCount = 0

    const dcdata: number[][] = Array(rsBlocks.length)
    const ecdata: number[][] = Array(rsBlocks.length)

    for (let r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount
      const ecCount = rsBlocks[r].totalCount - dcCount

      maxDcCount = Math.max(maxDcCount, dcCount)
      maxEcCount = Math.max(maxEcCount, ecCount)

      dcdata[r] = Array(dcCount)

      for (let i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset]
      }
      offset += dcCount

      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1)
      const modPoly = rawPoly.mod(rsPoly)

      ecdata[r] = Array(rsPoly.getLength() - 1)
      for (let i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
      }
    }

    const data: number[] = []

    for (let i = 0; i < maxDcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data.push(dcdata[r][i])
        }
      }
    }

    for (let i = 0; i < maxEcCount; i++) {
      for (let r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data.push(ecdata[r][i])
        }
      }
    }

    return data
  }
}
