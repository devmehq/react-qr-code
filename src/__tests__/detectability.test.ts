import { PRESET_THEMES } from '../index'

// Color contrast calculation functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

const QR_MINIMUM_CONTRAST = 3.0

describe('QR Code Detectability', () => {
  describe('Basic Color Combinations', () => {
    it('should have high contrast for basic black on white', () => {
      const contrast = getContrastRatio('#000000', '#ffffff')
      expect(contrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
      expect(contrast).toBeCloseTo(21, 0)
    })

    it('should have high contrast for white on black', () => {
      const contrast = getContrastRatio('#ffffff', '#000000')
      expect(contrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
      expect(contrast).toBeCloseTo(21, 0)
    })

    it('should detect low contrast combinations', () => {
      const contrast = getContrastRatio('#777777', '#888888')
      expect(contrast).toBeLessThan(QR_MINIMUM_CONTRAST)
    })
  })

  describe('Theme Contrast Validation', () => {
    it('should have adequate contrast for neon theme', () => {
      const neonTheme = PRESET_THEMES.neon

      // Test eye colors against background
      const eyeFrameColor = neonTheme.style.eyes?.frameColor as string
      const eyePupilColor = neonTheme.style.eyes?.pupilColor as string
      const bgColor = neonTheme.style.background?.primaryColor as string

      expect(eyeFrameColor).toBeDefined()
      expect(eyePupilColor).toBeDefined()
      expect(bgColor).toBeDefined()

      const frameContrast = getContrastRatio(eyeFrameColor, bgColor)
      const pupilContrast = getContrastRatio(eyePupilColor, bgColor)

      expect(frameContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
      expect(pupilContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
    })

    it('should have adequate contrast for cyberpunk theme', () => {
      const cyberpunkTheme = PRESET_THEMES.cyberpunk

      const eyeFrameColor = cyberpunkTheme.style.eyes?.frameColor as string
      const bodyColor = cyberpunkTheme.style.body?.color as string
      const bgColor = cyberpunkTheme.style.background?.primaryColor as string

      expect(eyeFrameColor).toBeDefined()
      expect(bodyColor).toBeDefined()
      expect(bgColor).toBeDefined()

      const frameContrast = getContrastRatio(eyeFrameColor, bgColor)
      const bodyContrast = getContrastRatio(bodyColor, bgColor)

      expect(frameContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
      expect(bodyContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
    })

    it('should have adequate contrast for nature theme', () => {
      const natureTheme = PRESET_THEMES.nature

      const eyeFrameColor = natureTheme.style.eyes?.frameColor as string
      const bodyColor = natureTheme.style.body?.color as string
      const bgColor = natureTheme.style.background?.primaryColor as string

      expect(eyeFrameColor).toBeDefined()
      expect(bodyColor).toBeDefined()
      expect(bgColor).toBeDefined()

      const frameContrast = getContrastRatio(eyeFrameColor, bgColor)
      const bodyContrast = getContrastRatio(bodyColor, bgColor)

      expect(frameContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
      expect(bodyContrast).toBeGreaterThan(QR_MINIMUM_CONTRAST)
    })
  })

  describe('Theme Validation', () => {
    it('should have all required theme properties', () => {
      Object.entries(PRESET_THEMES).forEach(([, theme]) => {
        expect(theme.name).toBeDefined()
        expect(theme.style).toBeDefined()
        expect(typeof theme.name).toBe('string')
      })
    })
  })

  describe('Contrast Recommendations', () => {
    const testCases = [
      {
        name: 'Excellent',
        fg: '#000000',
        bg: '#ffffff',
        expected: 'excellent',
      },
      { name: 'Good', fg: '#5a5a5a', bg: '#ffffff', expected: 'good' },
      {
        name: 'Borderline',
        fg: '#777777',
        bg: '#ffffff',
        expected: 'borderline',
      },
      { name: 'Poor', fg: '#bbbbbb', bg: '#ffffff', expected: 'poor' },
    ]

    testCases.forEach(({ name, fg, bg, expected }) => {
      it(`should classify ${name.toLowerCase()} contrast correctly`, () => {
        const contrast = getContrastRatio(fg, bg)

        if (expected === 'excellent') {
          expect(contrast).toBeGreaterThan(7)
        } else if (expected === 'good') {
          expect(contrast).toBeGreaterThan(4.5)
          expect(contrast).toBeLessThanOrEqual(7)
        } else if (expected === 'borderline') {
          expect(contrast).toBeGreaterThan(3)
          expect(contrast).toBeLessThanOrEqual(4.5)
        } else if (expected === 'poor') {
          expect(contrast).toBeLessThanOrEqual(3)
        }
      })
    })
  })
})
