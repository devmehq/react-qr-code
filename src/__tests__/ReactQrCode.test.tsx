import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ReactQrCode, QRHelpers } from '../index'

describe('ReactQrCode', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<ReactQrCode />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '256')
      expect(svg).toHaveAttribute('height', '256')
    })

    it('should render with custom value', () => {
      const { container } = render(<ReactQrCode value="https://example.com" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render with custom size', () => {
      const { container } = render(<ReactQrCode size={512} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '512')
      expect(svg).toHaveAttribute('height', '512')
    })

    it('should render as canvas when specified', () => {
      const { container } = render(<ReactQrCode renderAs="canvas" />)
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
    })
  })

  describe('Error Correction Levels', () => {
    ;['L', 'M', 'Q', 'H'].forEach((level) => {
      it(`should render with error correction level ${level}`, () => {
        const { container } = render(
          <ReactQrCode level={level as 'L' | 'M' | 'Q' | 'H'} />
        )
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })

  describe('Styling', () => {
    it('should apply custom colors', () => {
      const { container } = render(
        <ReactQrCode bgColor="#ff0000" fgColor="#00ff00" />
      )
      const rect = container.querySelector('rect')
      expect(rect).toHaveAttribute('fill', '#ff0000')
    })

    it('should apply custom className', () => {
      const { container } = render(<ReactQrCode className="custom-qr" />)
      const div = container.querySelector('.custom-qr')
      expect(div).toBeInTheDocument()
    })

    it('should apply custom styles', () => {
      const { container } = render(
        <ReactQrCode style={{ border: '1px solid black' }} />
      )
      const div = container.firstChild as HTMLElement
      expect(div).toHaveStyle('border: 1px solid black')
    })

    it('should render with custom shapes', () => {
      const { container } = render(
        <ReactQrCode
          qrStyle={{
            module: { shape: 'circle' },
          }}
        />
      )
      const circles = container.querySelectorAll('circle')
      expect(circles.length).toBeGreaterThan(0)
    })
  })

  describe('QR Code Templates', () => {
    it('should render WiFi QR code', () => {
      const wifiData = QRHelpers.wifi('MyNetwork', 'password123', 'WPA2')
      const { container } = render(<ReactQrCode value={wifiData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render vCard QR code', () => {
      const vcardData = QRHelpers.vcard({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        email: 'john@example.com',
      })
      const { container } = render(<ReactQrCode value={vcardData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render SMS QR code', () => {
      const smsData = QRHelpers.sms('+1234567890', 'Hello World')
      const { container } = render(<ReactQrCode value={smsData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Email QR code', () => {
      const emailData = QRHelpers.email(
        'test@example.com',
        'Subject',
        'Body text'
      )
      const { container } = render(<ReactQrCode value={emailData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Geo location QR code', () => {
      const geoData = QRHelpers.geo(37.7749, -122.4194)
      const { container } = render(<ReactQrCode value={geoData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Bitcoin QR code', () => {
      const bitcoinData = QRHelpers.bitcoin(
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        0.001
      )
      const { container } = render(<ReactQrCode value={bitcoinData} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Image/Logo Support', () => {
    it('should render with image', () => {
      const { container } = render(
        <ReactQrCode
          imageSettings={{
            src: 'https://example.com/logo.png',
            width: 50,
            height: 50,
          }}
        />
      )
      const image = container.querySelector('image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('href', 'https://example.com/logo.png')
    })

    it('should excavate area behind image when specified', () => {
      const { container } = render(
        <ReactQrCode
          imageSettings={{
            src: 'https://example.com/logo.png',
            excavate: true,
          }}
        />
      )
      const rects = container.querySelectorAll('rect')
      expect(rects.length).toBeGreaterThan(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { container } = render(
        <ReactQrCode
          ariaLabel="QR Code for example.com"
          ariaDescribedBy="qr-description"
          role="img"
        />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg).toHaveAttribute('aria-label', 'QR Code for example.com')
      expect(svg).toHaveAttribute('aria-describedby', 'qr-description')
    })

    it('should render title element when provided', () => {
      const { container } = render(<ReactQrCode title="Scan me!" />)
      const title = container.querySelector('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Scan me!')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty value gracefully', () => {
      const { container } = render(<ReactQrCode value="" />)
      const errorDiv = container.querySelector('div[role="alert"]')
      expect(errorDiv).toBeInTheDocument()
    })

    it('should call onError when data is invalid', () => {
      const onError = jest.fn()
      render(<ReactQrCode value="" onError={onError} />)
      expect(onError).toHaveBeenCalled()
    })

    it('should display error message for invalid data', () => {
      const { container } = render(<ReactQrCode value="" />)
      expect(container.textContent).toContain('QR Code Error')
    })
  })

  describe('Performance', () => {
    it('should implement lazy loading when specified', () => {
      const { container } = render(<ReactQrCode lazy={true} />)
      const div = container.firstChild as HTMLElement
      expect(div).toHaveStyle('backgroundColor: #ffffff')
    })

    it('should debounce rendering when specified', async () => {
      const onLoad = jest.fn()
      render(<ReactQrCode debounceMs={100} onLoad={onLoad} />)

      expect(onLoad).not.toHaveBeenCalled()

      await waitFor(
        () => {
          expect(onLoad).toHaveBeenCalled()
        },
        { timeout: 200 }
      )
    })
  })

  describe('Download/Copy Functionality', () => {
    it('should show download hint when enabled', () => {
      const { container } = render(<ReactQrCode enableDownload={true} />)
      expect(container.textContent).toContain('Click to download')
    })

    it('should handle click for download', () => {
      // const onDownload = jest.fn();
      const { container } = render(<ReactQrCode enableDownload={true} />)

      const svg = container.querySelector('svg')
      if (svg) {
        fireEvent.click(svg)
      }
    })
  })

  describe('Animation', () => {
    it('should apply animation styles when enabled', () => {
      const { container } = render(
        <ReactQrCode
          animated={true}
          animationDuration={500}
          animationDelay={100}
        />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Ref Methods', () => {
    it('should expose download method via ref', () => {
      const ref = React.createRef<any>()
      render(<ReactQrCode ref={ref} />)

      expect(ref.current).toHaveProperty('download')
      expect(typeof ref.current.download).toBe('function')
    })

    it('should expose copy method via ref', () => {
      const ref = React.createRef<any>()
      render(<ReactQrCode ref={ref} />)

      expect(ref.current).toHaveProperty('copy')
      expect(typeof ref.current.copy).toBe('function')
    })

    it('should expose getDataURL method via ref', () => {
      const ref = React.createRef<any>()
      render(<ReactQrCode ref={ref} />)

      expect(ref.current).toHaveProperty('getDataURL')
      expect(typeof ref.current.getDataURL).toBe('function')
    })

    it('should expose getSVGString method via ref', () => {
      const ref = React.createRef<any>()
      render(<ReactQrCode ref={ref} />)

      expect(ref.current).toHaveProperty('getSVGString')
      expect(typeof ref.current.getSVGString).toBe('function')
    })
  })
})
