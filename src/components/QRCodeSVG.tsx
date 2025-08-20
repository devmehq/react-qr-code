import * as React from 'react'
import { forwardRef, useMemo } from 'react'
import { QRCode } from '../qr/QRCode'
import {
  ImageSettings,
  QRCodeStyle,
  ModuleShape,
  GradientSettings,
} from '../types/types'
import { ShapeRenderer } from './shapes/ShapeRenderer'

interface QRCodeSVGProps {
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

export const QRCodeSVG = forwardRef<SVGSVGElement, QRCodeSVGProps>(
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

    const modules = qrCode.getModules()
    if (!modules) return null

    const moduleCount = modules.length
    const actualSize = size - marginSize * 2
    const cellSize = actualSize / moduleCount

    // Create gradient definitions if needed
    const gradients = useMemo(() => {
      const defs: React.JSX.Element[] = []
      let gradientIdCounter = 0

      const addGradient = (gradient: GradientSettings, prefix: string) => {
        const id = `${prefix}_gradient_${gradientIdCounter++}`

        if (gradient.type === 'linear') {
          const angle = gradient.angle || 0
          const angleRad = (angle * Math.PI) / 180
          const x1 = 50 - 50 * Math.cos(angleRad)
          const y1 = 50 - 50 * Math.sin(angleRad)
          const x2 = 50 + 50 * Math.cos(angleRad)
          const y2 = 50 + 50 * Math.sin(angleRad)

          defs.push(
            <linearGradient
              key={id}
              id={id}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
            >
              {gradient.colors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index * 100) / (gradient.colors.length - 1)}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          )
        } else {
          defs.push(
            <radialGradient key={id} id={id}>
              {gradient.colors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index * 100) / (gradient.colors.length - 1)}%`}
                  stopColor={color}
                />
              ))}
            </radialGradient>
          )
        }

        return id
      }

      const gradientMap: Record<string, string> = {}

      if (qrStyle?.module?.color && typeof qrStyle.module.color === 'object') {
        gradientMap.module = addGradient(qrStyle.module.color, 'module')
      }

      if (
        qrStyle?.background?.color &&
        typeof qrStyle.background.color === 'object'
      ) {
        gradientMap.background = addGradient(qrStyle.background.color, 'bg')
      }

      return { defs, map: gradientMap }
    }, [qrStyle])

    // Determine fill colors
    const moduleFillColor = useMemo(() => {
      if (qrStyle?.module?.color) {
        if (typeof qrStyle.module.color === 'string') {
          return qrStyle.module.color
        } else {
          return `url(#${gradients.map.module})`
        }
      }
      return fgColor
    }, [qrStyle, fgColor, gradients])

    const backgroundFillColor = useMemo(() => {
      if (qrStyle?.background?.color) {
        if (typeof qrStyle.background.color === 'string') {
          return qrStyle.background.color
        } else {
          return `url(#${gradients.map.background})`
        }
      }
      return bgColor
    }, [qrStyle, bgColor, gradients])

    // Identify corner modules
    const isCornerModule = (row: number, col: number): boolean => {
      // Top-left corner
      if (row < 7 && col < 7) return true
      // Top-right corner
      if (row < 7 && col >= moduleCount - 7) return true
      // Bottom-left corner
      if (row >= moduleCount - 7 && col < 7) return true

      return false
    }

    // Render modules
    const renderModules = () => {
      const moduleElements: React.JSX.Element[] = []
      const shape = qrStyle?.module?.shape || 'square'

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (modules[row][col]) {
            const x = marginSize + col * cellSize
            const y = marginSize + row * cellSize
            const isCorner = isCornerModule(row, col)
            const cornerShape = qrStyle?.corner?.shape
            const finalShape = isCorner && cornerShape ? 'square' : shape
            const finalColor =
              isCorner && qrStyle?.corner?.color
                ? qrStyle.corner.color
                : moduleFillColor

            const shapeElement = ShapeRenderer.render({
              shape: finalShape as ModuleShape,
              x,
              y,
              size: cellSize,
              fill: finalColor,
              key: `${row}-${col}`,
              animated,
              animationDuration,
              animationDelay: animationDelay + (row + col) * 10,
            })

            moduleElements.push(shapeElement)
          }
        }
      }

      return moduleElements
    }

    // Render image/logo if provided
    const renderImage = () => {
      if (!imageSettings?.src) return null

      const imgSize = imageSettings.width || size * 0.2
      const imgHeight = imageSettings.height || imgSize
      const imgX =
        imageSettings.x !== undefined ? imageSettings.x : (size - imgSize) / 2
      const imgY =
        imageSettings.y !== undefined ? imageSettings.y : (size - imgHeight) / 2

      // If excavate is true, we need to clear the area behind the image
      if (imageSettings.excavate) {
        const excavateSize = imgSize * 1.1
        const excavateX = (size - excavateSize) / 2
        const excavateY = (size - excavateSize) / 2

        return (
          <>
            <rect
              x={excavateX}
              y={excavateY}
              width={excavateSize}
              height={excavateSize}
              fill={backgroundFillColor}
              rx={8}
            />
            <image
              href={imageSettings.src}
              x={imgX}
              y={imgY}
              width={imgSize}
              height={imgHeight}
              preserveAspectRatio="xMidYMid meet"
              opacity={imageSettings.opacity || 1}
              crossOrigin={imageSettings.crossOrigin}
            />
          </>
        )
      }

      return (
        <image
          href={imageSettings.src}
          x={imgX}
          y={imgY}
          width={imgSize}
          height={imgHeight}
          preserveAspectRatio="xMidYMid meet"
          opacity={imageSettings.opacity || 1}
          crossOrigin={imageSettings.crossOrigin}
        />
      )
    }

    // Handle download
    const handleClick = (e: React.MouseEvent) => {
      if (enableDownload && onDownload) {
        onDownload()
      }
      onClick?.(e)
    }

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
        style={{ cursor: enableDownload ? 'pointer' : 'default' }}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && <title>{title}</title>}

        {/* Gradient definitions */}
        {gradients.defs.length > 0 && <defs>{gradients.defs}</defs>}

        {/* Background */}
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill={backgroundFillColor}
          opacity={qrStyle?.background?.opacity || 1}
        />

        {/* Background image if provided */}
        {qrStyle?.background?.image && (
          <image
            href={qrStyle.background.image}
            x={0}
            y={0}
            width={size}
            height={size}
            preserveAspectRatio="xMidYMid slice"
            opacity={qrStyle.background.opacity || 0.1}
          />
        )}

        {/* QR Code modules */}
        <g>{renderModules()}</g>

        {/* Logo/Image overlay */}
        {renderImage()}

        {/* Download hint */}
        {enableDownload && (
          <text
            x={size / 2}
            y={size - 5}
            textAnchor="middle"
            fontSize="10"
            fill={fgColor}
            opacity={0.5}
          >
            Click to download
          </text>
        )}
      </svg>
    )
  }
)

QRCodeSVG.displayName = 'QRCodeSVG'
