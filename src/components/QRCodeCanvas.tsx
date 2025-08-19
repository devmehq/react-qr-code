import * as React from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { QRCode } from '../qr/QRCode'
import { ImageSettings, QRCodeStyle, ModuleShape } from '../types'

interface QRCodeCanvasProps {
  qrCode: QRCode
  size: number
  bgColor: string
  fgColor: string
  marginSize: number
  title?: string
  qrStyle?: QRCodeStyle
  imageSettings?: ImageSettings
  onClick?: (event: React.MouseEvent) => void
  ariaLabel?: string
  ariaDescribedBy?: string
  role?: string
  animated?: boolean
  animationDuration?: number
  animationDelay?: number
  enableDownload?: boolean
  onDownload?: () => void
}

export const QRCodeCanvas = forwardRef<HTMLCanvasElement, QRCodeCanvasProps>(
  (props, ref) => {
    const {
      qrCode,
      size,
      bgColor,
      fgColor,
      marginSize,
      title,
      qrStyle,
      imageSettings,
      onClick,
      ariaLabel,
      ariaDescribedBy,
      role,
      animated,
      animationDuration = 300,
      animationDelay = 0,
      enableDownload,
      onDownload,
    } = props

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = ref || canvasRef
      if (!canvas || !('current' in canvas) || !canvas.current) return

      const ctx = canvas.current.getContext('2d')
      if (!ctx) return

      const modules = qrCode.getModules()
      if (!modules) return

      const moduleCount = modules.length
      const devicePixelRatio = window.devicePixelRatio || 1
      const actualSize = size - marginSize * 2
      const cellSize = actualSize / moduleCount

      // Set canvas size accounting for device pixel ratio
      canvas.current.width = size * devicePixelRatio
      canvas.current.height = size * devicePixelRatio
      canvas.current.style.width = `${size}px`
      canvas.current.style.height = `${size}px`

      // Scale for device pixel ratio
      ctx.scale(devicePixelRatio, devicePixelRatio)

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, size, size)

      // Draw background image if provided
      if (qrStyle?.background?.image) {
        const bgImage = new Image()
        bgImage.onload = () => {
          ctx.globalAlpha = qrStyle.background?.opacity || 0.1
          ctx.drawImage(bgImage, 0, 0, size, size)
          ctx.globalAlpha = 1
          drawModules()
        }
        bgImage.src = qrStyle.background.image
      } else {
        drawModules()
      }

      function drawModules() {
        if (!ctx || !modules) return

        // Set fill style for modules
        ctx.fillStyle =
          qrStyle?.module?.color && typeof qrStyle.module.color === 'string'
            ? qrStyle.module.color
            : fgColor

        const shape = qrStyle?.module?.shape || 'square'

        // Draw each module
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (modules[row][col]) {
              const x = marginSize + col * cellSize
              const y = marginSize + row * cellSize

              // Check if this is a corner module
              const isCorner = isCornerModule(row, col, moduleCount)
              if (isCorner && qrStyle?.corner?.color) {
                ctx.fillStyle = qrStyle.corner.color
              }

              drawModule(
                ctx,
                x,
                y,
                cellSize,
                shape as ModuleShape,
                animated || false,
                row + col
              )

              // Reset fill style if it was changed for corner
              if (isCorner && qrStyle?.corner?.color) {
                ctx.fillStyle =
                  qrStyle?.module?.color &&
                  typeof qrStyle.module.color === 'string'
                    ? qrStyle.module.color
                    : fgColor
              }
            }
          }
        }

        // Draw image/logo if provided
        if (imageSettings?.src) {
          const img = new Image()
          img.crossOrigin = imageSettings.crossOrigin || 'anonymous'

          img.onload = () => {
            const imgSize = imageSettings.width || size * 0.2
            const imgHeight = imageSettings.height || imgSize
            const imgX =
              imageSettings.x !== undefined
                ? imageSettings.x
                : (size - imgSize) / 2
            const imgY =
              imageSettings.y !== undefined
                ? imageSettings.y
                : (size - imgHeight) / 2

            // If excavate is true, clear the area behind the image
            if (imageSettings.excavate) {
              const excavateSize = imgSize * 1.1
              const excavateX = (size - excavateSize) / 2
              const excavateY = (size - excavateSize) / 2

              ctx.fillStyle = bgColor
              roundRect(
                ctx,
                excavateX,
                excavateY,
                excavateSize,
                excavateSize,
                8
              )
              ctx.fill()
            }

            ctx.globalAlpha = imageSettings.opacity || 1
            ctx.drawImage(img, imgX, imgY, imgSize, imgHeight)
            ctx.globalAlpha = 1
          }

          img.src = imageSettings.src
        }
      }

      function drawModule(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        shape: ModuleShape,
        animated: boolean,
        index: number
      ) {
        if (animated) {
          const delay = animationDelay + index * 10
          setTimeout(() => {
            drawShape(ctx, x, y, size, shape)
          }, delay)
        } else {
          drawShape(ctx, x, y, size, shape)
        }
      }

      function drawShape(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        shape: ModuleShape
      ) {
        ctx.beginPath()

        switch (shape) {
          case 'circle':
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
            break

          case 'rounded':
            roundRect(ctx, x, y, size, size, size * 0.2)
            break

          case 'diamond':
            ctx.moveTo(x + size / 2, y)
            ctx.lineTo(x + size, y + size / 2)
            ctx.lineTo(x + size / 2, y + size)
            ctx.lineTo(x, y + size / 2)
            ctx.closePath()
            break

          case 'star':
            drawStar(ctx, x + size / 2, y + size / 2, 5, size / 2, size / 4)
            break

          case 'square':
          default:
            ctx.rect(x, y, size, size)
            break
        }

        ctx.fill()
      }

      function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) {
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        )
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
      }

      function drawStar(
        ctx: CanvasRenderingContext2D,
        cx: number,
        cy: number,
        spikes: number,
        outerRadius: number,
        innerRadius: number
      ) {
        let rot = (Math.PI / 2) * 3
        let x = cx
        let y = cy
        const step = Math.PI / spikes

        ctx.moveTo(cx, cy - outerRadius)

        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerRadius
          y = cy + Math.sin(rot) * outerRadius
          ctx.lineTo(x, y)
          rot += step

          x = cx + Math.cos(rot) * innerRadius
          y = cy + Math.sin(rot) * innerRadius
          ctx.lineTo(x, y)
          rot += step
        }

        ctx.lineTo(cx, cy - outerRadius)
        ctx.closePath()
      }

      function isCornerModule(
        row: number,
        col: number,
        moduleCount: number
      ): boolean {
        // Top-left corner
        if (row < 7 && col < 7) return true
        // Top-right corner
        if (row < 7 && col >= moduleCount - 7) return true
        // Bottom-left corner
        if (row >= moduleCount - 7 && col < 7) return true

        return false
      }
    }, [
      qrCode,
      size,
      bgColor,
      fgColor,
      marginSize,
      qrStyle,
      imageSettings,
      animated,
      animationDuration,
      animationDelay,
      ref,
    ])

    const handleClick = (e: React.MouseEvent) => {
      if (enableDownload && onDownload) {
        onDownload()
      }
      onClick?.(e)
    }

    return (
      <canvas
        ref={ref || canvasRef}
        onClick={handleClick}
        style={{ cursor: enableDownload ? 'pointer' : 'default' }}
        role={role}
        aria-label={ariaLabel || title}
        aria-describedby={ariaDescribedBy}
      />
    )
  }
)

QRCodeCanvas.displayName = 'QRCodeCanvas'
