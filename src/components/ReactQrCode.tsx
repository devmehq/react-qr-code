import * as React from 'react'
import {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { QRCode } from '../qr/QRCode'
import { DataEncoder } from '../utils/dataEncoder'
import {
  ReactQrCodeProps,
  QRCodeRef,
  ErrorCorrectionLevel,
} from '../types/types'
import { QRCodeCanvas } from './QRCodeCanvas'
import { QRCodeSVG } from './QRCodeSVG'
import { downloadQRCode, copyQRCode } from '../utils/download'
import { validateInput } from '../utils/validation'

export const ReactQrCode = forwardRef<QRCodeRef, ReactQrCodeProps>(
  (props, ref) => {
    const {
      value = 'https://github.com/devmehq/react-qr-code',
      size = 256,
      level = 'L',
      bgColor = '#ffffff',
      fgColor = '#000000',
      renderAs = 'svg',
      marginSize = 0,
      style,
      className,
      id,
      title,
      qrStyle,
      imageSettings,
      onLoad,
      onError,
      onClick,
      ariaLabel,
      ariaDescribedBy,
      role = 'img',
      lazy = false,
      debounceMs = 100,
      includeMargin = true,
      minVersion,
      maskPattern,
      enableDownload = false,
      downloadOptions,
      animated = false,
      animationDuration = 300,
      animationDelay = 0,
    } = props

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined
    )
    const [isVisible, setIsVisible] = React.useState(!lazy)
    const [error, setError] = React.useState<Error | null>(null)

    // Encode the data based on type
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

        if (maskPattern !== undefined) {
          qrCode.make()
        } else {
          qrCode.make()
        }

        return qrCode
      } catch (err) {
        const error = err as Error
        setError(error)
        onError?.(error)
        return null
      }
    }, [encodedValue, level, minVersion, maskPattern, error, onError])

    // Calculate actual size with margins
    const actualSize = useMemo(() => {
      return includeMargin ? size : size - marginSize * 2
    }, [size, marginSize, includeMargin])

    // Handle lazy loading
    useEffect(() => {
      if (!lazy) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
            }
          })
        },
        { threshold: 0.1 }
      )

      const element = renderAs === 'canvas' ? canvasRef.current : svgRef.current
      if (element) {
        observer.observe(element)
      }

      return () => {
        if (element) {
          observer.unobserve(element)
        }
      }
    }, [lazy, renderAs])

    // Debounced rendering
    useEffect(() => {
      if (debounceMs > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          onLoad?.()
        }, debounceMs)

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
        }
      } else {
        onLoad?.()
        return () => {} // Always return a cleanup function
      }
    }, [qrCodeData, debounceMs, onLoad])

    // Download handler
    const handleDownload = useCallback(
      async (options = downloadOptions) => {
        if (!qrCodeData) return

        try {
          await downloadQRCode({
            qrCode: qrCodeData,
            size: actualSize,
            bgColor,
            fgColor,
            marginSize,
            imageSettings,
            qrStyle,
            format: options?.format || 'png',
            filename: options?.filename || 'qrcode',
            quality: options?.quality,
            scale: options?.scale,
          })
        } catch (err) {
          console.error('Failed to download QR code:', err)
        }
      },
      [
        qrCodeData,
        actualSize,
        bgColor,
        fgColor,
        marginSize,
        imageSettings,
        qrStyle,
        downloadOptions,
      ]
    )

    // Copy handler
    const handleCopy = useCallback(async () => {
      if (!qrCodeData) return

      try {
        await copyQRCode({
          qrCode: qrCodeData,
          size: actualSize,
          bgColor,
          fgColor,
          marginSize,
          imageSettings,
          qrStyle,
        })
      } catch (err) {
        console.error('Failed to copy QR code:', err)
      }
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
    const getDataURL = useCallback(
      async (format = 'png', quality = 0.92): Promise<string> => {
        if (!qrCodeData) return ''

        if (renderAs === 'canvas' && canvasRef.current) {
          return canvasRef.current.toDataURL(`image/${format}`, quality)
        } else if (renderAs === 'svg' && svgRef.current) {
          const svgString = new XMLSerializer().serializeToString(
            svgRef.current
          )
          const base64 = btoa(unescape(encodeURIComponent(svgString)))
          return `data:image/svg+xml;base64,${base64}`
        }

        return ''
      },
      [qrCodeData, renderAs]
    )

    // Get SVG string
    const getSVGString = useCallback((): string => {
      if (renderAs === 'svg' && svgRef.current) {
        return new XMLSerializer().serializeToString(svgRef.current)
      }
      return ''
    }, [renderAs])

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
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
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

    // Loading state for lazy loading
    if (lazy && !isVisible) {
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            backgroundColor: bgColor,
            ...style,
          }}
          role="img"
          aria-label="Loading QR code"
        />
      )
    }

    // No data to render
    if (!qrCodeData) {
      return null
    }

    // Common props
    const commonProps = {
      qrCode: qrCodeData,
      size: actualSize,
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
      animationDuration,
      animationDelay,
      enableDownload,
      onDownload: handleDownload,
    }

    // Render based on type
    if (renderAs === 'canvas') {
      return (
        <div className={className} id={id} style={style}>
          <QRCodeCanvas {...commonProps} ref={canvasRef} />
        </div>
      )
    }

    return (
      <div className={className} id={id} style={style}>
        <QRCodeSVG {...commonProps} ref={svgRef} />
      </div>
    )
  }
)

ReactQrCode.displayName = 'ReactQrCode'

export default ReactQrCode
