import React, { useEffect, useRef, CSSProperties } from 'react'
import { JsQrCode } from './qr-js/js-qr-code'
import { qrErrorCorrectLevel } from './qr-js/qr-error-correct-level'

interface QRCodePathProps {
  d: string
  fill: string
  transformX: number
  transformY: number
}

function QRCodePath({
  d,
  fill,
  transformX,
  transformY,
}: QRCodePathProps): React.ReactElement {
  return (
    <path
      d={d}
      fill={fill}
      transform={`matrix(${[1, 0, 0, 1, transformX, transformY]})`}
    />
  )
}

interface QRCodeSvgProps {
  children: React.ReactNode
  size: number
  title?: string
  xmlns?: string
  style?: CSSProperties
  className?: string
}

function QRCodeSvg({
  children,
  size,
  title,
  xmlns = 'http://www.w3.org/2000/svg',
  ...props
}: QRCodeSvgProps): React.ReactElement {
  return (
    <svg {...props} height={size} width={size} xmlns={xmlns}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export interface ReactQrCodeImageProps {
  src: string
  height?: number
  width?: number
  excavate?: boolean
  x?: number
  y?: number
}

export interface ReactQrCodeProps {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  marginSize?: number
  style?: CSSProperties
  renderAs?: 'svg' | 'canvas'
  images?: ReactQrCodeImageProps[]
  title?: string
  className?: string
  id?: string
}

function drawQRCodeCanvas(
  canvas: HTMLCanvasElement,
  cells: boolean[][],
  size: number,
  marginSize: number,
  bgColor: string,
  fgColor: string,
  images?: ReactQrCodeImageProps[]
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const scale = window.devicePixelRatio || 1
  canvas.width = size * scale
  canvas.height = size * scale
  ctx.scale(scale, scale)

  const actualSize = size - marginSize * 2
  const tileSize = actualSize / cells.length

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  cells.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell) {
        ctx.fillStyle = fgColor
        const x = marginSize + cellIndex * tileSize
        const y = marginSize + rowIndex * tileSize
        ctx.fillRect(
          Math.round(x),
          Math.round(y),
          Math.ceil(tileSize),
          Math.ceil(tileSize)
        )
      }
    })
  })

  if (images && images.length > 0) {
    images.forEach((imageProps) => {
      const img = new Image()
      img.onload = () => {
        const imgWidth = imageProps.width || size * 0.1
        const imgHeight = imageProps.height || size * 0.1
        const imgX =
          imageProps.x !== undefined ? imageProps.x : (size - imgWidth) / 2
        const imgY =
          imageProps.y !== undefined ? imageProps.y : (size - imgHeight) / 2

        if (imageProps.excavate) {
          ctx.fillStyle = bgColor
          ctx.fillRect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10)
        }

        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight)
      }
      img.src = imageProps.src
    })
  }
}

export function ReactQrCode(props: ReactQrCodeProps): React.ReactElement {
  const {
    bgColor = '#ffffff',
    fgColor = '#000000',
    level = 'L',
    size = 256,
    value = 'https://github.com/devmehq/react-qr-code',
    marginSize = 0,
    renderAs = 'svg',
    images,
    title,
    style,
    className,
    id,
    ...rest
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const qrcode = new JsQrCode(-1, qrErrorCorrectLevel[level])
  qrcode.addData(value)
  qrcode.make()
  const cells = qrcode.modules

  useEffect(() => {
    if (renderAs === 'canvas' && canvasRef.current) {
      drawQRCodeCanvas(
        canvasRef.current,
        cells,
        size,
        marginSize,
        bgColor,
        fgColor,
        images
      )
    }
  }, [renderAs, cells, size, marginSize, bgColor, fgColor, images])

  if (renderAs === 'canvas') {
    return (
      <canvas
        ref={canvasRef}
        style={{
          height: size,
          width: size,
          ...style,
        }}
        className={className}
        id={id}
        {...rest}
      />
    )
  }

  const actualSize = size - marginSize * 2
  const tileSize = actualSize / cells.length

  return (
    <QRCodeSvg
      {...rest}
      size={size}
      title={title}
      style={style}
      className={className}
    >
      {marginSize > 0 && (
        <rect x="0" y="0" width={size} height={size} fill={bgColor} />
      )}
      {cells.map((row: boolean[], rowIndex: number) =>
        row.map((cell, cellIndex) => {
          const fill = cell ? fgColor : bgColor
          const transformX = marginSize + Math.round(cellIndex * tileSize)
          const transformY = marginSize + Math.round(rowIndex * tileSize)
          const qrItemWidth =
            Math.round((cellIndex + 1) * tileSize) -
            Math.round(cellIndex * tileSize)
          const qrItemHeight =
            Math.round((rowIndex + 1) * tileSize) -
            Math.round(rowIndex * tileSize)
          const d = `M 0 0 L ${qrItemWidth} 0 L ${qrItemWidth} ${qrItemHeight} L 0 ${qrItemHeight} Z`
          return cell ? (
            <QRCodePath
              key={`rectangle-${rowIndex}-${cellIndex}`}
              d={d}
              fill={fill}
              transformX={transformX}
              transformY={transformY}
            />
          ) : null
        })
      )}
      {images?.map((imageProps, index) => {
        const imgWidth = imageProps.width || size * 0.1
        const imgHeight = imageProps.height || size * 0.1
        const imgX =
          imageProps.x !== undefined ? imageProps.x : (size - imgWidth) / 2
        const imgY =
          imageProps.y !== undefined ? imageProps.y : (size - imgHeight) / 2

        return (
          <g key={`image-${index}`}>
            {imageProps.excavate && (
              <rect
                x={imgX - 5}
                y={imgY - 5}
                width={imgWidth + 10}
                height={imgHeight + 10}
                fill={bgColor}
              />
            )}
            <image
              href={imageProps.src}
              x={imgX}
              y={imgY}
              width={imgWidth}
              height={imgHeight}
            />
          </g>
        )
      })}
    </QRCodeSvg>
  )
}
export default ReactQrCode
