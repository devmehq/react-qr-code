import React from 'react'
import { render, screen } from '@testing-library/react'
import { ReactQrCode } from './index'

describe('ReactQrCode', () => {
  describe('SVG rendering', () => {
    it('should render SVG QR code by default', () => {
      const { container } = render(<ReactQrCode value="test" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '256')
      expect(svg).toHaveAttribute('height', '256')
    })

    it('should render with custom size', () => {
      const { container } = render(<ReactQrCode value="test" size={512} />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '512')
      expect(svg).toHaveAttribute('height', '512')
    })

    it('should apply custom colors', () => {
      const { container } = render(
        <ReactQrCode value="test" fgColor="#FF0000" bgColor="#00FF00" />
      )
      const paths = container.querySelectorAll('path')
      const hasRedPath = Array.from(paths).some(
        (path) => path.getAttribute('fill') === '#FF0000'
      )
      expect(hasRedPath).toBe(true)
    })

    it('should apply margin size', () => {
      const { container } = render(<ReactQrCode value="test" marginSize={10} />)
      const rect = container.querySelector('rect')
      expect(rect).toBeInTheDocument()
    })

    it('should render with title', () => {
      const { container } = render(
        <ReactQrCode value="test" title="QR Code Title" />
      )
      const title = container.querySelector('title')
      expect(title).toBeInTheDocument()
      expect(title?.textContent).toBe('QR Code Title')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <ReactQrCode value="test" className="custom-qr" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-qr')
    })

    it('should apply custom styles', () => {
      const { container } = render(
        <ReactQrCode value="test" style={{ border: '1px solid red' }} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toHaveStyle('border: 1px solid red')
    })

    it('should render images in SVG', () => {
      const { container } = render(
        <ReactQrCode
          value="test"
          images={[
            {
              src: 'https://example.com/logo.png',
              height: 24,
              width: 24,
            },
          ]}
        />
      )
      const image = container.querySelector('image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('href', 'https://example.com/logo.png')
      expect(image).toHaveAttribute('width', '24')
      expect(image).toHaveAttribute('height', '24')
    })

    it('should render images with excavate', () => {
      const { container } = render(
        <ReactQrCode
          value="test"
          images={[
            {
              src: 'https://example.com/logo.png',
              height: 24,
              width: 24,
              excavate: true,
            },
          ]}
        />
      )
      const g = container.querySelector('g')
      const rect = g?.querySelector('rect')
      expect(rect).toBeInTheDocument()
    })

    it('should position images with custom x and y', () => {
      const { container } = render(
        <ReactQrCode
          value="test"
          images={[
            {
              src: 'https://example.com/logo.png',
              x: 50,
              y: 50,
              height: 24,
              width: 24,
            },
          ]}
        />
      )
      const image = container.querySelector('image')
      expect(image).toHaveAttribute('x', '50')
      expect(image).toHaveAttribute('y', '50')
    })
  })

  describe('Canvas rendering', () => {
    it('should render canvas when renderAs is canvas', () => {
      const { container } = render(
        <ReactQrCode value="test" renderAs="canvas" />
      )
      const canvas = container.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveStyle('width: 256px')
      expect(canvas).toHaveStyle('height: 256px')
    })

    it('should apply custom size to canvas', () => {
      const { container } = render(
        <ReactQrCode value="test" renderAs="canvas" size={512} />
      )
      const canvas = container.querySelector('canvas')
      expect(canvas).toHaveStyle('width: 512px')
      expect(canvas).toHaveStyle('height: 512px')
    })

    it('should apply custom className to canvas', () => {
      const { container } = render(
        <ReactQrCode value="test" renderAs="canvas" className="canvas-qr" />
      )
      const canvas = container.querySelector('canvas')
      expect(canvas).toHaveClass('canvas-qr')
    })

    it('should apply custom id to canvas', () => {
      const { container } = render(
        <ReactQrCode value="test" renderAs="canvas" id="qr-canvas" />
      )
      const canvas = container.querySelector('canvas')
      expect(canvas).toHaveAttribute('id', 'qr-canvas')
    })
  })

  describe('Error correction levels', () => {
    const levels: Array<'L' | 'M' | 'Q' | 'H'> = ['L', 'M', 'Q', 'H']

    levels.forEach((level) => {
      it(`should render with error correction level ${level}`, () => {
        const { container } = render(<ReactQrCode value="test" level={level} />)
        const svg = container.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })
  })

  describe('Value encoding', () => {
    it('should encode URLs', () => {
      const { container } = render(
        <ReactQrCode value="https://github.com/devmehq/react-qr-code" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should encode plain text', () => {
      const { container } = render(<ReactQrCode value="Hello, World!" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should encode numbers', () => {
      const { container } = render(<ReactQrCode value="1234567890" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should encode special characters', () => {
      const { container } = render(
        <ReactQrCode value="!@#$%^&*()_+-=[]{}|;:,.<>?" />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should encode long text', () => {
      const longText = 'A'.repeat(1000)
      const { container } = render(<ReactQrCode value={longText} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Default props', () => {
    it('should use default value when no value provided', () => {
      const { container } = render(<ReactQrCode value="" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should use default colors', () => {
      const { container } = render(<ReactQrCode value="test" />)
      const paths = container.querySelectorAll('path')
      const hasBlackPath = Array.from(paths).some(
        (path) => path.getAttribute('fill') === '#000000'
      )
      expect(hasBlackPath).toBe(true)
    })

    it('should use default size', () => {
      const { container } = render(<ReactQrCode value="test" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '256')
    })

    it('should use default error correction level', () => {
      const { container } = render(<ReactQrCode value="test" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })
})
