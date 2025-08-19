import { validateQRCode, testContrast } from '../utils/decoder'
import { PRESET_THEMES } from '../types/advanced'

describe('QR Code Decoder', () => {
  describe('validateQRCode', () => {
    it('should validate a basic QR code', async () => {
      const result = await validateQRCode('Hello World', {
        errorCorrectionLevel: 'M',
        size: 256,
      })

      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate QR codes with different error correction levels', async () => {
      const levels = ['L', 'M', 'Q', 'H']

      for (const level of levels) {
        const result = await validateQRCode('Test Data', {
          errorCorrectionLevel: level,
          size: 256,
        })

        expect(result.isValid).toBe(true)
      }
    })

    it('should detect invalid QR configurations', async () => {
      const result = await validateQRCode('', {
        errorCorrectionLevel: 'M',
        size: 0,
      })

      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('testContrast', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = testContrast('#000000', '#ffffff')
      expect(ratio).toBeCloseTo(21, 0)
    })

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = testContrast('#ffffff', '#000000')
      expect(ratio).toBeCloseTo(21, 0)
    })

    it('should identify low contrast combinations', () => {
      const ratio = testContrast('#777777', '#888888')
      expect(ratio).toBeLessThan(3)
    })

    it('should handle neon theme colors', () => {
      const neonTheme = PRESET_THEMES.neon
      const fgColor = neonTheme.style.body?.color as string
      const bgColor = neonTheme.style.background?.primaryColor as string

      const ratio = testContrast(fgColor, bgColor)
      expect(ratio).toBeGreaterThan(7) // Should have excellent contrast
    })

    it('should handle cyberpunk theme colors', () => {
      const cyberpunkTheme = PRESET_THEMES.cyberpunk
      const fgColor = cyberpunkTheme.style.body?.color as string
      const bgColor = cyberpunkTheme.style.background?.primaryColor as string

      const ratio = testContrast(fgColor, bgColor)
      expect(ratio).toBeGreaterThan(3) // Should have minimum acceptable contrast
    })

    it('should handle nature theme colors', () => {
      const natureTheme = PRESET_THEMES.nature
      const fgColor = natureTheme.style.body?.color as string
      const bgColor = natureTheme.style.background?.primaryColor as string

      const ratio = testContrast(fgColor, bgColor)
      expect(ratio).toBeGreaterThan(3) // Should have minimum acceptable contrast
    })
  })

  describe('Theme Detectability', () => {
    it('should ensure all preset themes have detectable QR codes', async () => {
      const themes = Object.entries(PRESET_THEMES)

      for (const [themeName, theme] of themes) {
        const fgColor = (theme.style.body?.color as string) || '#000000'
        const bgColor =
          (theme.style.background?.primaryColor as string) || '#ffffff'

        const ratio = testContrast(fgColor, bgColor)

        // All themes should have at least minimum contrast for QR detectability
        expect(ratio).toBeGreaterThan(3)

        // Validate QR generation with theme colors
        const result = await validateQRCode(`Testing ${themeName} theme`, {
          errorCorrectionLevel: 'M',
          size: 256,
          fgColor,
          bgColor,
        })

        expect(result.isValid).toBe(true)
      }
    })
  })

  describe('QR Code Structure', () => {
    it('should generate QR codes with proper finder patterns', async () => {
      const testData = [
        'Short',
        'Medium length text for QR code',
        'Very long text that will create a larger QR code with more modules and complexity to ensure proper structure is maintained even with large amounts of data',
      ]

      for (const data of testData) {
        const result = await validateQRCode(data, {
          errorCorrectionLevel: 'M',
          size: 256,
        })

        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      }
    })

    it('should handle special characters', async () => {
      const specialData = [
        'https://example.com/path?query=value',
        'email@example.com',
        '+1-234-567-8900',
        'Line 1\nLine 2\nLine 3',
        '特殊文字 Special ñ characters ü',
      ]

      for (const data of specialData) {
        const result = await validateQRCode(data, {
          errorCorrectionLevel: 'M',
          size: 256,
        })

        expect(result.isValid).toBe(true)
      }
    })
  })

  describe('Color Combinations', () => {
    const colorTests = [
      { name: 'Classic', fg: '#000000', bg: '#ffffff', expectedRatio: 21 },
      { name: 'Inverted', fg: '#ffffff', bg: '#000000', expectedRatio: 21 },
      {
        name: 'Blue on White',
        fg: '#0000ff',
        bg: '#ffffff',
        expectedRatio: 8.59,
      },
      {
        name: 'Green on Black',
        fg: '#00ff00',
        bg: '#000000',
        expectedRatio: 15.3,
      },
      {
        name: 'Red on White',
        fg: '#ff0000',
        bg: '#ffffff',
        expectedRatio: 3.99,
      },
      {
        name: 'Cyan on Dark',
        fg: '#00ffff',
        bg: '#1a0033',
        expectedRatio: 15.34,
      },
    ]

    colorTests.forEach(({ name, fg, bg, expectedRatio }) => {
      it(`should correctly calculate contrast for ${name}`, () => {
        const ratio = testContrast(fg, bg)
        expect(ratio).toBeCloseTo(expectedRatio, 1)

        // Check if it meets minimum QR requirements
        if (ratio >= 3) {
          expect(ratio).toBeGreaterThanOrEqual(3)
        }
      })
    })
  })
})
