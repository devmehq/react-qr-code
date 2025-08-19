import { QRMath } from './QRMath'

export class QRPolynomial {
  private num: number[]

  constructor(num: number[], shift: number) {
    if (num.length === undefined) {
      throw new Error(`Invalid number array: ${num}`)
    }

    let offset = 0
    while (offset < num.length && num[offset] === 0) {
      offset++
    }

    this.num = Array(num.length - offset + shift)
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset]
    }
  }

  get(index: number): number {
    return this.num[index]
  }

  getLength(): number {
    return this.num.length
  }

  multiply(e: QRPolynomial): QRPolynomial {
    const num = Array(this.getLength() + e.getLength() - 1).fill(0)

    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(
          QRMath.glog(this.get(i)) + QRMath.glog(e.get(j))
        )
      }
    }

    return new QRPolynomial(num, 0)
  }

  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) {
      return this
    }

    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0))
    const num = [...this.num]

    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio)
    }

    return new QRPolynomial(num, 0).mod(e)
  }
}
