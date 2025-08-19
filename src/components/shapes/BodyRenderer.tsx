import * as React from 'react'
import {
  BodyShape,
  BodyPattern,
  ColorEffect,
  GradientConfig,
} from '../../types/advanced'

interface BodyRendererProps {
  x: number
  y: number
  size: number
  shape: BodyShape
  color: string | GradientConfig
  effect?: ColorEffect
  pattern?: BodyPattern
  row: number
  col: number
  isConnected?: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
  randomSeed?: number
  density?: number
  gap?: number
  roundness?: number
  rotation?: number
}

export class BodyRenderer {
  static render(props: BodyRendererProps): React.JSX.Element | null {
    const {
      x,
      y,
      size,
      shape,
      color,
      effect,
      pattern,
      row,
      col,
      isConnected,
      density = 1,
      gap = 0,
      roundness = 0.2,
      rotation = 0,
    } = props

    // Apply density filter
    if (density < 1 && Math.random() > density) {
      return null
    }

    // Calculate actual size with gap
    const actualSize = size - gap
    const actualX = x + gap / 2
    const actualY = y + gap / 2

    // Determine color based on pattern
    const fillColor = this.getPatternColor(color, pattern, row, col)

    // Create filter if effect is specified
    const filterId = effect ? `body_${row}_${col}_filter` : undefined
    const filter = effect ? this.createEffect(effect, filterId!) : null

    const transform =
      rotation !== 0
        ? `rotate(${rotation} ${actualX + actualSize / 2} ${actualY + actualSize / 2})`
        : undefined

    return (
      <g>
        {filter}
        {this.renderShape(
          actualX,
          actualY,
          actualSize,
          shape,
          fillColor,
          filterId ? `url(#${filterId})` : undefined,
          isConnected,
          roundness,
          transform
        )}
      </g>
    )
  }

  private static renderShape(
    x: number,
    y: number,
    size: number,
    shape: BodyShape,
    fill: string,
    filter?: string,
    isConnected?: {
      top: boolean
      right: boolean
      bottom: boolean
      left: boolean
    },
    roundness?: number,
    transform?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2

    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={cx}
            cy={cy}
            r={size / 2}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'dot':
        return (
          <circle
            cx={cx}
            cy={cy}
            r={size / 3}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'rounded':
        return (
          <rect
            x={x}
            y={y}
            width={size}
            height={size}
            rx={size * roundness!}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'diamond':
        return (
          <path
            d={`M ${cx} ${y} L ${x + size} ${cy} L ${cx} ${y + size} L ${x} ${cy} Z`}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'star':
        return (
          <path
            d={this.createStarPath(cx, cy, 5, size / 2, size / 4)}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'line-vertical':
        return (
          <rect
            x={cx - size / 6}
            y={y}
            width={size / 3}
            height={size}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'line-horizontal':
        return (
          <rect
            x={x}
            y={cy - size / 6}
            width={size}
            height={size / 3}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'plus':
        return (
          <path
            d={`
              M ${cx - size / 6} ${y}
              L ${cx + size / 6} ${y}
              L ${cx + size / 6} ${cy - size / 6}
              L ${x + size} ${cy - size / 6}
              L ${x + size} ${cy + size / 6}
              L ${cx + size / 6} ${cy + size / 6}
              L ${cx + size / 6} ${y + size}
              L ${cx - size / 6} ${y + size}
              L ${cx - size / 6} ${cy + size / 6}
              L ${x} ${cy + size / 6}
              L ${x} ${cy - size / 6}
              L ${cx - size / 6} ${cy - size / 6}
              Z
            `}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'cross':
        return (
          <g transform={transform}>
            <rect
              x={cx - size / 6}
              y={y}
              width={size / 3}
              height={size}
              fill={fill}
              filter={filter}
            />
            <rect
              x={x}
              y={cy - size / 6}
              width={size}
              height={size / 3}
              fill={fill}
              filter={filter}
            />
          </g>
        )

      case 'zigzag':
        return this.renderZigzag(x, y, size, fill, filter, transform)

      case 'wave':
        return this.renderWave(x, y, size, fill, filter, transform)

      case 'fluid':
        return this.renderFluid(
          x,
          y,
          size,
          fill,
          filter,
          isConnected,
          transform
        )

      case 'hexagon':
        return (
          <path
            d={this.createHexagonPath(cx, cy, size / 2)}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'octagon':
        return (
          <path
            d={this.createOctagonPath(cx, cy, size / 2)}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'triangle':
        return (
          <path
            d={`M ${cx} ${y} L ${x + size} ${y + size} L ${x} ${y + size} Z`}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )

      case 'mosaic':
        return this.renderMosaic(x, y, size, fill, filter, transform)

      case 'pixel':
        return this.renderPixel(x, y, size, fill, filter, transform)

      case 'bubble':
        return this.renderBubble(x, y, size, fill, filter, transform)

      case 'square':
      default:
        return (
          <rect
            x={x}
            y={y}
            width={size}
            height={size}
            fill={fill}
            filter={filter}
            transform={transform}
          />
        )
    }
  }

  private static getPatternColor(
    baseColor: string | GradientConfig,
    pattern?: BodyPattern,
    row?: number,
    col?: number
  ): string {
    if (!pattern || pattern.type === 'solid') {
      return typeof baseColor === 'string' ? baseColor : `url(#body_gradient)`
    }

    if (pattern.customPattern) {
      return pattern.customPattern(row!, col!)
    }

    if (pattern.colors && pattern.colors.length > 0) {
      switch (pattern.type) {
        case 'alternating':
          const index = (row! + col!) % pattern.colors.length
          return pattern.colors[index]

        case 'random':
          return pattern.colors[
            Math.floor(Math.random() * pattern.colors.length)
          ]

        case 'gradient':
          // This would need to create a gradient definition
          return typeof baseColor === 'string'
            ? baseColor
            : `url(#body_gradient)`

        default:
          return typeof baseColor === 'string'
            ? baseColor
            : `url(#body_gradient)`
      }
    }

    return typeof baseColor === 'string' ? baseColor : `url(#body_gradient)`
  }

  private static createEffect(
    effect: ColorEffect,
    id: string
  ): React.JSX.Element {
    switch (effect) {
      case 'shadow':
        return (
          <defs key={id}>
            <filter id={id}>
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.2" />
            </filter>
          </defs>
        )

      case 'glow':
        return (
          <defs key={id}>
            <filter id={id}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )

      case 'emboss':
        return (
          <defs key={id}>
            <filter id={id}>
              <feConvolveMatrix
                kernelMatrix="-2 -1 0 -1 1 1 0 1 2"
                divisor="1"
              />
            </filter>
          </defs>
        )

      case 'blur':
        return (
          <defs key={id}>
            <filter id={id}>
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
        )

      default:
        return <></>
    }
  }

  private static createStarPath(
    cx: number,
    cy: number,
    points: number,
    outer: number,
    inner: number
  ): string {
    let path = ''
    const angle = Math.PI / points

    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner
      const a = i * angle - Math.PI / 2
      const x = cx + r * Math.cos(a)
      const y = cy + r * Math.sin(a)
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    }

    return path + ' Z'
  }

  private static createHexagonPath(cx: number, cy: number, r: number): string {
    const points: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')} Z`
  }

  private static createOctagonPath(cx: number, cy: number, r: number): string {
    const points: string[] = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')} Z`
  }

  private static renderZigzag(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    transform?: string
  ): React.JSX.Element {
    const points = 4
    let path = `M ${x} ${y + size / 2}`

    for (let i = 1; i <= points; i++) {
      const px = x + (size / points) * i
      const py = i % 2 === 0 ? y + size / 2 + size / 4 : y + size / 2 - size / 4
      path += ` L ${px} ${py}`
    }

    return (
      <path
        d={path}
        stroke={fill}
        strokeWidth={size / 4}
        fill="none"
        strokeLinecap="round"
        filter={filter}
        transform={transform}
      />
    )
  }

  private static renderWave(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    transform?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2
    const amplitude = size / 4

    const path = `
      M ${x} ${cy}
      Q ${x + size / 4} ${cy - amplitude}, ${cx} ${cy}
      Q ${x + (size * 3) / 4} ${cy + amplitude}, ${x + size} ${cy}
    `

    return (
      <path
        d={path}
        stroke={fill}
        strokeWidth={size / 3}
        fill="none"
        strokeLinecap="round"
        filter={filter}
        transform={transform}
      />
    )
  }

  private static renderFluid(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    isConnected?: {
      top: boolean
      right: boolean
      bottom: boolean
      left: boolean
    },
    transform?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2
    const r = size / 2

    // Create organic shape based on connections
    let path = ''
    const control = r * 0.552 // Magic number for circle approximation

    if (isConnected?.top) {
      path += `M ${cx} ${y} `
    } else {
      path += `M ${cx - r} ${cy} C ${cx - r} ${cy - control}, ${cx - control} ${y}, ${cx} ${y} `
    }

    if (isConnected?.right) {
      path += `L ${x + size} ${cy} `
    } else {
      path += `C ${cx + control} ${y}, ${x + size} ${cy - control}, ${x + size} ${cy} `
    }

    if (isConnected?.bottom) {
      path += `L ${cx} ${y + size} `
    } else {
      path += `C ${x + size} ${cy + control}, ${cx + control} ${y + size}, ${cx} ${y + size} `
    }

    if (isConnected?.left) {
      path += `L ${x} ${cy} `
    } else {
      path += `C ${cx - control} ${y + size}, ${x} ${cy + control}, ${x} ${cy} `
    }

    path += 'Z'

    return <path d={path} fill={fill} filter={filter} transform={transform} />
  }

  private static renderMosaic(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    transform?: string
  ): React.JSX.Element {
    const tiles = 2
    const tileSize = size / tiles
    const gap = tileSize * 0.1

    return (
      <g transform={transform}>
        {Array.from({ length: tiles * tiles }).map((_, i) => {
          const row = Math.floor(i / tiles)
          const col = i % tiles
          const tx = x + col * tileSize + gap / 2
          const ty = y + row * tileSize + gap / 2

          return (
            <rect
              key={i}
              x={tx}
              y={ty}
              width={tileSize - gap}
              height={tileSize - gap}
              fill={fill}
              filter={filter}
              opacity={0.8 + Math.random() * 0.2}
            />
          )
        })}
      </g>
    )
  }

  private static renderPixel(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    transform?: string
  ): React.JSX.Element {
    const pixelSize = size * 0.8
    const offset = (size - pixelSize) / 2

    return (
      <g transform={transform}>
        <rect
          x={x + offset}
          y={y + offset}
          width={pixelSize}
          height={pixelSize}
          fill={fill}
          filter={filter}
        />
        <rect
          x={x + offset + pixelSize * 0.1}
          y={y + offset + pixelSize * 0.1}
          width={pixelSize * 0.3}
          height={pixelSize * 0.3}
          fill="white"
          opacity="0.3"
        />
      </g>
    )
  }

  private static renderBubble(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string,
    transform?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2
    const r = (size / 2) * 0.9

    return (
      <g transform={transform}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          filter={filter}
          opacity="0.8"
        />
        <ellipse
          cx={cx - r * 0.3}
          cy={cy - r * 0.3}
          rx={r * 0.2}
          ry={r * 0.15}
          fill="white"
          opacity="0.4"
        />
      </g>
    )
  }
}
