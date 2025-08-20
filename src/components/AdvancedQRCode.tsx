import * as React from 'react'
import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { QRCode } from '../qr/QRCode'
import { DataEncoder } from '../utils/dataEncoder'
import { validateInput } from '../utils/validation'
import { downloadQRCode, copyQRCode } from '../utils/download'
import { EyeRenderer } from './shapes/EyeRenderer'
import { BodyRenderer } from './shapes/BodyRenderer'
import { BackgroundRenderer } from './shapes/BackgroundRenderer'
import { QRCodeRef, ErrorCorrectionLevel } from '../types/types'
import {
  AdvancedQRCodeProps,
  GradientConfig,
  PRESET_THEMES,
} from '../types/advanced'

export const AdvancedQRCode = forwardRef<QRCodeRef, AdvancedQRCodeProps>(
  (props, ref) => {
    const {
      value = 'https://github.com/devmehq/react-qr-code',
      size = 256,
      level = 'L',
      bgColor = '#ffffff',
      fgColor = '#000000',
      marginSize = 0,
      style,
      className,
      id,
      title,
      advancedStyle,
      theme,
      qrStyle,
      imageSettings,
      onError,
      onClick,
      ariaLabel,
      ariaDescribedBy,
      role = 'img',
      includeMargin = true,
      minVersion,
      enableDownload = false,
      downloadOptions,
      animated = false,
      animationDuration = 300,
      animationDelay = 0,
    } = props

    const svgRef = useRef<SVGSVGElement>(null)
    const [error, setError] = React.useState<Error | null>(null)

    // Merge theme with custom advanced style
    const finalStyle = useMemo(() => {
      if (theme && PRESET_THEMES[theme]) {
        return {
          ...PRESET_THEMES[theme].style,
          ...advancedStyle,
        }
      }
      return advancedStyle || {}
    }, [theme, advancedStyle])

    // Encode the data
    const encodedValue = useMemo(() => {
      try {
        const encoded = DataEncoder.encode(value || '')
        validateInput(encoded)
        return encoded
      } catch (err) {
        const error = err as Error
        setError(error)
        onError?.(error)
        return ''
      }
    }, [value, onError])

    // Generate QR code data
    const qrCodeData = useMemo(() => {
      if (!encodedValue || error) return null

      try {
        const typeNumber = minVersion || -1
        const qrCode = new QRCode(typeNumber, level as ErrorCorrectionLevel)
        qrCode.addData(encodedValue)
        qrCode.make()
        return qrCode
      } catch (err) {
        const error = err as Error
        setError(error)
        onError?.(error)
        return null
      }
    }, [encodedValue, level, minVersion, error, onError])

    // Calculate actual size with margins
    const actualSize = useMemo(() => {
      return includeMargin ? size : size - marginSize * 2
    }, [size, marginSize, includeMargin])

    // Handle download
    const handleDownload = React.useCallback(async () => {
      if (!qrCodeData) return

      await downloadQRCode({
        qrCode: qrCodeData,
        size: actualSize,
        bgColor,
        fgColor,
        marginSize,
        imageSettings,
        qrStyle,
        format: downloadOptions?.format || 'png',
        filename: downloadOptions?.filename || 'qrcode',
        quality: downloadOptions?.quality,
        scale: downloadOptions?.scale,
      })
    }, [
      qrCodeData,
      actualSize,
      bgColor,
      fgColor,
      marginSize,
      imageSettings,
      qrStyle,
      downloadOptions,
    ])

    // Handle copy
    const handleCopy = React.useCallback(async () => {
      if (!qrCodeData) return

      await copyQRCode({
        qrCode: qrCodeData,
        size: actualSize,
        bgColor,
        fgColor,
        marginSize,
        imageSettings,
        qrStyle,
      })
    }, [
      qrCodeData,
      actualSize,
      bgColor,
      fgColor,
      marginSize,
      imageSettings,
      qrStyle,
    ])

    // Get data URL
    const getDataURL = React.useCallback(async (): Promise<string> => {
      if (!svgRef.current) return ''

      const svgString = new XMLSerializer().serializeToString(svgRef.current)
      const base64 = btoa(unescape(encodeURIComponent(svgString)))
      return `data:image/svg+xml;base64,${base64}`
    }, [])

    // Get SVG string
    const getSVGString = React.useCallback((): string => {
      if (!svgRef.current) return ''
      return new XMLSerializer().serializeToString(svgRef.current)
    }, [])

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        download: handleDownload,
        copy: handleCopy,
        getDataURL,
        getSVGString,
      }),
      [handleDownload, handleCopy, getDataURL, getSVGString]
    )

    // Render the advanced QR code
    const renderQRCode = () => {
      if (!qrCodeData) return null

      const modules = qrCodeData.getModules()
      if (!modules) return null

      const moduleCount = modules.length
      const cellSize = actualSize / moduleCount

      // Identify eye positions
      const eyePositions = [
        { row: 0, col: 0, position: 'topLeft' },
        { row: 0, col: moduleCount - 7, position: 'topRight' },
        { row: moduleCount - 7, col: 0, position: 'bottomLeft' },
      ]

      // Check if a module is part of an eye
      const isEyeModule = (row: number, col: number): boolean => {
        for (const eye of eyePositions) {
          if (
            row >= eye.row &&
            row < eye.row + 7 &&
            col >= eye.col &&
            col < eye.col + 7
          ) {
            return true
          }
        }
        return false
      }

      // Check module connections for fluid rendering
      const getConnections = (row: number, col: number) => {
        return {
          top: row > 0 ? !!modules[row - 1][col] : false,
          right: col < moduleCount - 1 ? !!modules[row][col + 1] : false,
          bottom: row < moduleCount - 1 ? !!modules[row + 1][col] : false,
          left: col > 0 ? !!modules[row][col - 1] : false,
        }
      }

      // Create gradient definitions
      const gradients: React.JSX.Element[] = []
      const createGradient = (config: GradientConfig, id: string) => {
        if (config.type === 'linear') {
          const angle = config.angle || 0
          const angleRad = (angle * Math.PI) / 180
          const x1 = 50 - 50 * Math.cos(angleRad)
          const y1 = 50 - 50 * Math.sin(angleRad)
          const x2 = 50 + 50 * Math.cos(angleRad)
          const y2 = 50 + 50 * Math.sin(angleRad)

          return (
            <linearGradient
              key={id}
              id={id}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
            >
              {config.colors.map((stop, index) => (
                <stop
                  key={`${id}-stop-${index}`}
                  offset={`${stop.offset * 100}%`}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity || 1}
                />
              ))}
            </linearGradient>
          )
        } else if (config.type === 'radial') {
          return (
            <radialGradient
              key={id}
              id={id}
              cx={config.center?.x || 50}
              cy={config.center?.y || 50}
            >
              {config.colors.map((stop, index) => (
                <stop
                  key={`${id}-stop-${index}`}
                  offset={`${stop.offset * 100}%`}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity || 1}
                />
              ))}
            </radialGradient>
          )
        }
        return null
      }

      // Add gradients if needed
      if (finalStyle.body?.color && typeof finalStyle.body.color === 'object') {
        const gradient = createGradient(finalStyle.body.color, 'body_gradient')
        if (gradient) gradients.push(gradient)
      }

      if (
        finalStyle.eyes?.frameColor &&
        typeof finalStyle.eyes.frameColor === 'object'
      ) {
        const gradient = createGradient(
          finalStyle.eyes.frameColor,
          'eye_frame_gradient'
        )
        if (gradient) gradients.push(gradient)
      }

      if (
        finalStyle.eyes?.pupilColor &&
        typeof finalStyle.eyes.pupilColor === 'object'
      ) {
        const gradient = createGradient(
          finalStyle.eyes.pupilColor,
          'eye_pupil_gradient'
        )
        if (gradient) gradients.push(gradient)
      }

      // Create global effects
      const globalEffects: React.JSX.Element[] = []
      if (finalStyle.effects?.global) {
        // Add global filter definitions
      }

      return (
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
          onClick={onClick}
          style={{ cursor: enableDownload ? 'pointer' : 'default', ...style }}
          className={className}
          id={id}
          role={role}
          aria-label={ariaLabel || title}
          aria-describedby={ariaDescribedBy}
        >
          {title && <title>{title}</title>}

          {/* Definitions */}
          {(gradients.length > 0 || globalEffects.length > 0) && (
            <defs>
              {gradients}
              {globalEffects}
            </defs>
          )}

          {/* Background */}
          {BackgroundRenderer.render({
            width: size,
            height: size,
            config: finalStyle.background || {},
            defaultColor: bgColor,
          })}

          {/* QR Code Body Modules */}
          <g id="qr-body-modules">
            {modules.reduce<React.JSX.Element[]>((acc, row, rowIndex) => {
              row.forEach((isDark, colIndex) => {
                if (isDark && !isEyeModule(rowIndex, colIndex)) {
                  const x = marginSize + colIndex * cellSize
                  const y = marginSize + rowIndex * cellSize

                  acc.push(
                    <g key={`${rowIndex}-${colIndex}`}>
                      {BodyRenderer.render({
                        x,
                        y,
                        size: cellSize,
                        shape: finalStyle.body?.shape || 'square',
                        color: finalStyle.body?.color || fgColor,
                        effect: finalStyle.body?.effect,
                        pattern: finalStyle.body?.pattern,
                        row: rowIndex,
                        col: colIndex,
                        isConnected:
                          finalStyle.body?.shape === 'fluid'
                            ? getConnections(rowIndex, colIndex)
                            : undefined,
                        density: finalStyle.body?.density,
                        gap: finalStyle.body?.gap,
                        roundness: finalStyle.body?.roundness,
                        rotation: finalStyle.body?.rotation,
                      })}
                    </g>
                  )
                }
              })
              return acc
            }, [])}
          </g>

          {/* QR Code Eyes */}
          {eyePositions.map((eye) => {
            const x = marginSize + eye.col * cellSize
            const y = marginSize + eye.row * cellSize
            const eyeSize = 7 * cellSize

            // Get position-specific customization
            const positionConfig =
              finalStyle.eyes?.[
                eye.position as 'topLeft' | 'topRight' | 'bottomLeft'
              ]

            return (
              <g key={eye.position}>
                {EyeRenderer.render({
                  id: eye.position,
                  x,
                  y,
                  size: eyeSize,
                  frameShape:
                    positionConfig?.frameShape ||
                    finalStyle.eyes?.frameShape ||
                    'square',
                  frameColor:
                    positionConfig?.frameColor ||
                    finalStyle.eyes?.frameColor ||
                    fgColor,
                  frameEffect: finalStyle.eyes?.frameEffect,
                  pupilShape:
                    positionConfig?.pupilShape ||
                    finalStyle.eyes?.pupilShape ||
                    'square',
                  pupilColor:
                    positionConfig?.pupilColor ||
                    finalStyle.eyes?.pupilColor ||
                    fgColor,
                  pupilEffect: finalStyle.eyes?.pupilEffect,
                  rotation: positionConfig?.rotation,
                  scale: positionConfig?.scale,
                })}
              </g>
            )
          })}

          {/* Logo/Image overlay */}
          {imageSettings?.src && (
            <image
              href={imageSettings.src}
              x={imageSettings.x || (size - (imageSettings.width || 60)) / 2}
              y={imageSettings.y || (size - (imageSettings.height || 60)) / 2}
              width={imageSettings.width || 60}
              height={imageSettings.height || 60}
              preserveAspectRatio="xMidYMid meet"
              opacity={imageSettings.opacity || 1}
            />
          )}

          {/* Animation styles */}
          {animated && (
            <style>
              {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              svg > * {
                animation: fadeIn ${animationDuration}ms ease-in-out ${animationDelay}ms forwards;
              }
            `}
            </style>
          )}
        </svg>
      )
    }

    // Error state
    if (error) {
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            color: fgColor,
            ...style,
          }}
          role="alert"
        >
          <div style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>
              QR Code Error
            </div>
            <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
              {error.message}
            </div>
          </div>
        </div>
      )
    }

    return renderQRCode()
  }
)

AdvancedQRCode.displayName = 'AdvancedQRCode'
