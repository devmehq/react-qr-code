import * as React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AdvancedQRCode } from '../components/AdvancedQRCode'
import { PRESET_THEMES } from '../types/advanced'

describe('AdvancedQRCode', () => {
  describe('Eye Customization', () => {
    it('should render with custom eye shapes', () => {
      const { container } = render(
        <AdvancedQRCode
          value="https://example.com"
          advancedStyle={{
            eyes: {
              frameShape: 'circle',
              pupilShape: 'star',
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should apply different eye colors', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            eyes: {
              frameColor: '#ff0000',
              pupilColor: '#00ff00',
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should support position-specific eye customization', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            eyes: {
              topLeft: {
                frameShape: 'leaf',
                pupilShape: 'heart',
              },
              topRight: {
                frameShape: 'flower',
                pupilShape: 'star',
              },
              bottomLeft: {
                frameShape: 'shield',
                pupilShape: 'diamond',
              },
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should apply eye effects', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            eyes: {
              frameEffect: 'glow',
              pupilEffect: 'shadow',
            },
          }}
        />
      )

      const filters = container.querySelectorAll('filter')
      expect(filters.length).toBeGreaterThan(0)
    })
  })

  describe('Body Customization', () => {
    const bodyShapes = [
      'square',
      'circle',
      'rounded',
      'diamond',
      'star',
      'dot',
      'hexagon',
      'octagon',
      'triangle',
      'bubble',
      'pixel',
      'mosaic',
    ]

    bodyShapes.forEach((shape) => {
      it(`should render body with ${shape} shape`, () => {
        const { container } = render(
          <AdvancedQRCode
            value="test"
            advancedStyle={{
              body: {
                shape: shape as any,
              },
            }}
          />
        )

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })

    it('should apply body patterns', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            body: {
              pattern: {
                type: 'alternating',
                colors: ['#ff0000', '#00ff00', '#0000ff'],
              },
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should support body gradients', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            body: {
              color: {
                type: 'linear',
                colors: [
                  { color: '#ff0000', offset: 0 },
                  { color: '#00ff00', offset: 1 },
                ],
                angle: 45,
              },
            },
          }}
        />
      )

      const gradients = container.querySelectorAll('linearGradient')
      expect(gradients.length).toBeGreaterThan(0)
    })

    it('should apply body effects', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            body: {
              effect: 'shadow',
              density: 0.9,
              gap: 1,
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render fluid body connections', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            body: {
              shape: 'fluid',
            },
          }}
        />
      )

      const paths = container.querySelectorAll('path')
      expect(paths.length).toBeGreaterThan(0)
    })
  })

  describe('Background Customization', () => {
    const patterns = [
      'dots',
      'lines',
      'grid',
      'waves',
      'zigzag',
      'checkerboard',
      'diagonal',
      'triangles',
      'hexagons',
      'circles',
      'stars',
      'noise',
    ]

    patterns.forEach((pattern) => {
      it(`should render ${pattern} background pattern`, () => {
        const { container } = render(
          <AdvancedQRCode
            value="test"
            advancedStyle={{
              background: {
                pattern: pattern as any,
                patternColor: '#000000',
                patternOpacity: 0.2,
              },
            }}
          />
        )

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })

    it('should apply background image', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            background: {
              image: {
                src: 'https://example.com/bg.jpg',
                opacity: 0.3,
                blur: 5,
                blend: 'overlay',
              },
            },
          }}
        />
      )

      const image = container.querySelector('image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('href', 'https://example.com/bg.jpg')
    })

    it('should apply background effects', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            background: {
              effects: [
                { type: 'vignette', intensity: 0.5 },
                { type: 'scan-lines', intensity: 0.1 },
                { type: 'grain', intensity: 0.05 },
              ],
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should apply background border', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            background: {
              border: {
                width: 4,
                color: '#000000',
                style: 'dashed',
                radius: 10,
                shadow: {
                  color: '#000000',
                  blur: 5,
                  offsetX: 2,
                  offsetY: 2,
                },
              },
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Preset Themes', () => {
    Object.keys(PRESET_THEMES).forEach((theme) => {
      it(`should apply ${theme} theme`, () => {
        const { container } = render(
          <AdvancedQRCode
            value="test"
            theme={theme as keyof typeof PRESET_THEMES}
          />
        )

        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })

    it('should merge theme with custom styles', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          theme="modern"
          advancedStyle={{
            body: {
              color: '#ff0000',
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Animation', () => {
    it('should apply animation styles', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          animated={true}
          animationDuration={500}
          animationDelay={100}
        />
      )

      const style = container.querySelector('style')
      expect(style).toBeInTheDocument()
      expect(style?.textContent).toContain('fadeIn')
    })

    it('should support animation config', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            animation: {
              type: 'ripple',
              duration: 1000,
              repeat: 'infinite',
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Global Effects', () => {
    it('should apply global color effects', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            effects: {
              global: 'glow',
              shadow: {
                color: '#000000',
                blur: 5,
                offsetX: 2,
                offsetY: 2,
              },
              glow: {
                color: '#00ff00',
                size: 10,
                intensity: 0.8,
              },
              brightness: 1.2,
              contrast: 1.1,
              saturation: 0.9,
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should apply sepia and invert effects', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            effects: {
              sepia: true,
              invert: true,
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    it('should support high contrast mode', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            accessibility: {
              highContrast: true,
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    describe('color blind modes', () => {
      const modes = [
        'protanopia',
        'deuteranopia',
        'tritanopia',
        'monochrome',
      ] as const

      modes.forEach((mode) => {
        it(`should support ${mode} mode`, () => {
          const { container } = render(
            <AdvancedQRCode
              value="test"
              advancedStyle={{
                accessibility: {
                  colorBlindMode: mode,
                },
              }}
            />
          )

          const svg = container.querySelector('svg')
          expect(svg).toBeInTheDocument()
        })
      })
    })

    it('should add accessibility description', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            accessibility: {
              description: 'QR code for example website',
            },
          }}
          ariaLabel="Scan to visit example.com"
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label', 'Scan to visit example.com')
    })
  })

  describe('Responsive Features', () => {
    it('should support responsive breakpoints', () => {
      const { container } = render(
        <AdvancedQRCode
          value="test"
          advancedStyle={{
            responsive: {
              breakpoints: {
                mobile: {
                  body: { shape: 'circle' },
                },
                tablet: {
                  body: { shape: 'rounded' },
                },
                desktop: {
                  body: { shape: 'square' },
                },
              },
              scale: true,
              maintainAspectRatio: true,
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Complex Combinations', () => {
    it('should handle complex style combinations', () => {
      const { container } = render(
        <AdvancedQRCode
          value="Complex QR Code Test"
          size={512}
          level="H"
          theme="cyberpunk"
          advancedStyle={{
            eyes: {
              frameShape: 'flower',
              frameColor: {
                type: 'radial',
                colors: [
                  { color: '#ff00ff', offset: 0 },
                  { color: '#00ffff', offset: 1 },
                ],
              },
              frameEffect: 'neon',
              pupilShape: 'star',
              pupilEffect: 'glow',
            },
            body: {
              shape: 'hexagon',
              color: {
                type: 'linear',
                colors: [
                  { color: '#ff00ff', offset: 0 },
                  { color: '#00ffff', offset: 0.5 },
                  { color: '#ffff00', offset: 1 },
                ],
                angle: 135,
              },
              effect: 'holographic',
              pattern: {
                type: 'alternating',
                colors: ['#ff00ff', '#00ffff'],
              },
              density: 0.95,
              gap: 0.5,
            },
            background: {
              pattern: 'grid',
              patternColor: '#00ffff',
              patternOpacity: 0.2,
              primaryColor: {
                type: 'linear',
                colors: [
                  { color: '#1a0033', offset: 0 },
                  { color: '#000000', offset: 1 },
                ],
                angle: 45,
              },
              effects: [
                { type: 'vignette', intensity: 0.3 },
                { type: 'scan-lines', intensity: 0.05 },
                { type: 'bokeh', intensity: 0.2, color: '#00ffff' },
              ],
              border: {
                width: 3,
                color: '#00ffff',
                style: 'solid',
                radius: 20,
                shadow: {
                  color: '#00ffff',
                  blur: 10,
                  spread: 2,
                },
              },
            },
            animation: {
              type: 'glitch',
              duration: 3000,
              repeat: 'infinite',
            },
            effects: {
              global: 'chrome',
              glow: {
                color: '#00ffff',
                size: 15,
                intensity: 1,
                animated: true,
              },
              brightness: 1.1,
              contrast: 1.2,
              saturation: 1.5,
            },
          }}
          imageSettings={{
            src: 'https://example.com/logo.png',
            width: 80,
            height: 80,
            excavate: true,
            opacity: 0.9,
          }}
          animated={true}
          animationDuration={1000}
          enableDownload={true}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '512')

      // Check for various elements
      const gradients = container.querySelectorAll(
        'linearGradient, radialGradient'
      )
      expect(gradients.length).toBeGreaterThan(0)

      const filters = container.querySelectorAll('filter')
      expect(filters.length).toBeGreaterThan(0)

      const patterns = container.querySelectorAll('pattern')
      expect(patterns.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid configurations gracefully', () => {
      const { container } = render(
        <AdvancedQRCode
          value=""
          advancedStyle={{
            eyes: {
              frameShape: 'invalid' as any,
            },
            body: {
              shape: 'invalid' as any,
            },
          }}
        />
      )

      // Should show error state
      const errorDiv = container.querySelector('div[role="alert"]')
      expect(errorDiv).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should render large QR codes efficiently', () => {
      const { container } = render(
        <AdvancedQRCode
          value={'A'.repeat(2000)} // Large data
          size={1024}
          level="L"
          advancedStyle={{
            body: {
              shape: 'circle',
              density: 0.5, // Reduce density for performance
            },
          }}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should handle rapid prop changes', async () => {
      const { rerender } = render(<AdvancedQRCode value="test1" />)

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<AdvancedQRCode value={`test${i}`} />)
      }

      await waitFor(() => {
        const svg = document.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })
})
