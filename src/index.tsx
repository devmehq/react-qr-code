// @ts-ignore
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel'
// thus, the deep require.
// @ts-ignore
import QRCodeImpl from 'qr.js/lib/QRCode'
import React from 'react'

export function QRCodePath({
  d,
  fill,
  transformX,
  transformY,
}: {
  d: string
  fill: string
  transformX: number
  transformY: number
}) {
  return (
    <path
      d={d}
      fill={fill}
      transform={`matrix(${[1, 0, 0, 1, transformX, transformY]})`}
    />
  )
}

export function QRCodeSvg({
  children,
  size,
  title,
  xmlns,
  ...props
}: {
  children: any
  size: number
  title?: string
  xmlns?: string
}) {
  return (
    <svg {...props} height={size} width={size} xmlns={xmlns}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

type QRProps = {
  value: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  marginSize?: number // todo implement
  style?: Record<string, string> // todo implement
  renderAs?: 'svg' | 'canvas' // todo implement
  imageSettings?: {
    // todo implement
    src: string
    height: number
    width: number
    excavate?: boolean
    x?: number
    y?: number
  }
}

export function ReactQrCode(props: QRProps) {
  const {
    bgColor = '#ffffff',
    fgColor = '#000000',
    level = 'L',
    size = 256,
    value = 'https://github.com/devmehq/react-qr-code',
    ...rest
  } = props
  // We'll use type === -1 to force QRCode to automatically pick the best type.
  const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level])
  qrcode.addData(value)
  qrcode.make()
  const cells = qrcode.modules
  const tileSize = size / cells.length
  return (
    <QRCodeSvg {...rest} size={size}>
      {cells.map((row: any[], rowIndex: number) =>
        row.map((cell, cellIndex) => {
          const fill = cell ? fgColor : bgColor
          const transformX = Math.round(cellIndex * tileSize)
          const transformY = Math.round(rowIndex * tileSize)
          const qrItemWidth =
            Math.round((cellIndex + 1) * tileSize) - transformX
          const qrItemHeight =
            Math.round((rowIndex + 1) * tileSize) - transformY
          const d = `M 0 0 L ${qrItemWidth} 0 L ${qrItemWidth} ${qrItemHeight} L 0 ${qrItemHeight} Z`
          return (
            <QRCodePath
              key={`rectangle-${rowIndex}-${cellIndex}`}
              d={d}
              fill={fill}
              transformX={transformX}
              transformY={transformY}
            />
          )
        })
      )}
    </QRCodeSvg>
  )
}
