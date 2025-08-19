import '@testing-library/jest-dom'

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock canvas for tests
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  quadraticCurveTo: jest.fn(),
  rect: jest.fn(),
  drawImage: jest.fn(),
  scale: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  globalAlpha: 1,
})

HTMLCanvasElement.prototype.toDataURL = jest
  .fn()
  .mockReturnValue('data:image/png;base64,')
HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
  callback(new Blob([''], { type: 'image/png' }))
})

// Mock IntersectionObserver
;(global as any).IntersectionObserver = class IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    write: jest.fn(),
    writeText: jest.fn(),
  },
})

// Mock document.createElement for anchor elements
const originalCreateElement = document.createElement.bind(document)
document.createElement = jest.fn((tagName: string) => {
  if (tagName === 'a') {
    const anchor = originalCreateElement('a')
    // Mock click method
    anchor.click = jest.fn()
    return anchor
  }
  return originalCreateElement(tagName)
}) as any
;(global as any).ClipboardItem = class ClipboardItem {
  constructor(items: Record<string, Blob>) {
    Object.assign(this, items)
  }
  static supports(_type: string): boolean {
    return true
  }
}
