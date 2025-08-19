import * as React from 'react'
import {
  EyeShape,
  EyeFrameShape,
  ColorEffect,
  GradientConfig,
} from '../../types/advanced'

interface EyeRendererProps {
  x: number
  y: number
  size: number
  frameShape: EyeFrameShape
  frameColor: string | GradientConfig
  frameEffect?: ColorEffect
  pupilShape: EyeShape
  pupilColor: string | GradientConfig
  pupilEffect?: ColorEffect
  rotation?: number
  scale?: number
  id: string
}

export class EyeRenderer {
  static render(props: EyeRendererProps): React.JSX.Element {
    const {
      x,
      y,
      size,
      frameShape,
      frameColor,
      frameEffect,
      pupilShape,
      pupilColor,
      pupilEffect,
      rotation = 0,
      scale = 1,
      id,
    } = props

    const frameSize = size
    const pupilSize = size * 0.43 // Inner dot is ~43% of frame
    const pupilOffset = (frameSize - pupilSize) / 2

    // Create filter effects if needed
    const filters: React.JSX.Element[] = []
    const frameFilterId = `${id}_frame_filter`
    const pupilFilterId = `${id}_pupil_filter`

    if (frameEffect) {
      filters.push(this.createEffect(frameEffect, frameFilterId))
    }
    if (pupilEffect) {
      filters.push(this.createEffect(pupilEffect, pupilFilterId))
    }

    const transform = `translate(${x}, ${y}) rotate(${rotation} ${frameSize / 2} ${frameSize / 2}) scale(${scale})`

    return (
      <g transform={transform}>
        {filters.length > 0 && <defs>{filters.map((filter, index) => React.cloneElement(filter, { key: `${id}-filter-${index}` }))}</defs>}

        {/* Outer Frame */}
        {this.renderFrame(
          0,
          0,
          frameSize,
          frameShape,
          typeof frameColor === 'string'
            ? frameColor
            : `url(#${id}_frame_gradient)`,
          frameEffect ? `url(#${frameFilterId})` : undefined
        )}

        {/* Inner Pupil */}
        {this.renderPupil(
          pupilOffset,
          pupilOffset,
          pupilSize,
          pupilShape,
          typeof pupilColor === 'string'
            ? pupilColor
            : `url(#${id}_pupil_gradient)`,
          pupilEffect ? `url(#${pupilFilterId})` : undefined
        )}
      </g>
    )
  }

  private static renderFrame(
    x: number,
    y: number,
    size: number,
    shape: EyeFrameShape,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    const innerSize = size - strokeWidth

    switch (shape) {
      case 'circle':
        return (
          <g>
            <circle
              cx={x + size / 2}
              cy={y + size / 2}
              r={size / 2}
              fill={fill}
              filter={filter}
            />
            <circle
              cx={x + size / 2}
              cy={y + size / 2}
              r={innerSize / 2}
              fill="white"
            />
          </g>
        )

      case 'rounded':
        return (
          <g>
            <rect
              x={x}
              y={y}
              width={size}
              height={size}
              rx={size * 0.25}
              fill={fill}
              filter={filter}
            />
            <rect
              x={x + strokeWidth / 2}
              y={y + strokeWidth / 2}
              width={innerSize}
              height={innerSize}
              rx={innerSize * 0.2}
              fill="white"
            />
          </g>
        )

      case 'leaf':
        return this.renderLeafFrame(x, y, size, fill, filter)

      case 'flower':
        return this.renderFlowerFrame(x, y, size, fill, filter)

      case 'star':
        return this.renderStarFrame(x, y, size, fill, filter)

      case 'diamond':
        return this.renderDiamondFrame(x, y, size, fill, filter)

      case 'heart':
        return this.renderHeartFrame(x, y, size, fill, filter)

      case 'shield':
        return this.renderShieldFrame(x, y, size, fill, filter)

      case 'bubble':
        return this.renderBubbleFrame(x, y, size, fill, filter)

      case 'square':
      default:
        return (
          <g>
            <rect
              x={x}
              y={y}
              width={size}
              height={size}
              fill={fill}
              filter={filter}
            />
            <rect
              x={x + strokeWidth / 2}
              y={y + strokeWidth / 2}
              width={innerSize}
              height={innerSize}
              fill="white"
            />
          </g>
        )
    }
  }

  private static renderPupil(
    x: number,
    y: number,
    size: number,
    shape: EyeShape,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2

    switch (shape) {
      case 'circle':
        return (
          <circle cx={cx} cy={cy} r={size / 2} fill={fill} filter={filter} />
        )

      case 'rounded':
        return (
          <rect
            x={x}
            y={y}
            width={size}
            height={size}
            rx={size * 0.3}
            fill={fill}
            filter={filter}
          />
        )

      case 'star':
        return (
          <path
            d={this.createStarPath(cx, cy, 5, size / 2, size / 4)}
            fill={fill}
            filter={filter}
          />
        )

      case 'diamond':
        return (
          <path
            d={`M ${cx} ${y} L ${x + size} ${cy} L ${cx} ${y + size} L ${x} ${cy} Z`}
            fill={fill}
            filter={filter}
          />
        )

      case 'leaf':
        return (
          <path
            d={this.createLeafPath(cx, cy, size)}
            fill={fill}
            filter={filter}
          />
        )

      case 'heart':
        return (
          <path
            d={this.createHeartPath(x, y, size)}
            fill={fill}
            filter={filter}
          />
        )

      case 'flower':
        return this.renderFlowerPupil(cx, cy, size / 2, fill, filter)

      case 'hexagon':
        return (
          <path
            d={this.createHexagonPath(cx, cy, size / 2)}
            fill={fill}
            filter={filter}
          />
        )

      case 'octagon':
        return (
          <path
            d={this.createOctagonPath(cx, cy, size / 2)}
            fill={fill}
            filter={filter}
          />
        )

      case 'cross':
        return (
          <path
            d={this.createCrossPath(cx, cy, size)}
            fill={fill}
            filter={filter}
          />
        )

      case 'gear':
        return (
          <path
            d={this.createGearPath(cx, cy, size / 2)}
            fill={fill}
            filter={filter}
          />
        )

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
          />
        )
    }
  }

  private static createEffect(
    effect: ColorEffect,
    id: string
  ): React.JSX.Element {
    switch (effect) {
      case 'shadow':
        return (
          <filter id={id} key={id}>
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        )

      case 'glow':
        return (
          <filter id={id} key={id}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )

      case 'inner-shadow':
        return (
          <filter id={id} key={id}>
            <feOffset dx="1" dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite operator="out" in="SourceGraphic" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="SourceGraphic" />
          </filter>
        )

      case '3d':
        return (
          <filter id={id} key={id}>
            <feConvolveMatrix
              kernelMatrix="1 0 0 0 0 0 0 0 -1"
              divisor="1"
              bias="0.5"
            />
            <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        )

      case 'neon':
        return (
          <filter id={id} key={id}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feColorMatrix in="coloredBlur" type="saturate" values="2" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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

  private static createLeafPath(cx: number, cy: number, size: number): string {
    const r = size / 2
    return `
      M ${cx} ${cy - r}
      Q ${cx + r * 0.5} ${cy - r * 0.5}, ${cx + r} ${cy}
      Q ${cx + r * 0.5} ${cy + r * 0.5}, ${cx} ${cy + r}
      Q ${cx - r * 0.5} ${cy + r * 0.5}, ${cx - r} ${cy}
      Q ${cx - r * 0.5} ${cy - r * 0.5}, ${cx} ${cy - r}
      Z
    `
  }

  private static createHeartPath(x: number, y: number, size: number): string {
    const w = size
    const h = size
    return `
      M ${x + w / 2} ${y + h / 4}
      C ${x + w / 2} ${y}, ${x} ${y}, ${x} ${y + h / 3}
      C ${x} ${y + h / 2}, ${x + w / 2} ${y + h}, ${x + w / 2} ${y + h}
      C ${x + w / 2} ${y + h}, ${x + w} ${y + h / 2}, ${x + w} ${y + h / 3}
      C ${x + w} ${y}, ${x + w / 2} ${y}, ${x + w / 2} ${y + h / 4}
      Z
    `
  }

  private static createHexagonPath(cx: number, cy: number, r: number): string {
    const points: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')} Z`
  }

  private static createOctagonPath(cx: number, cy: number, r: number): string {
    const points: string[] = []
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i - Math.PI / 8
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')} Z`
  }

  private static createCrossPath(cx: number, cy: number, size: number): string {
    const w = size * 0.3
    const h = size
    return `
      M ${cx - w / 2} ${cy - h / 2 + w}
      L ${cx - w / 2} ${cy - w / 2}
      L ${cx - h / 2 + w} ${cy - w / 2}
      L ${cx - h / 2 + w} ${cy + w / 2}
      L ${cx - w / 2} ${cy + w / 2}
      L ${cx - w / 2} ${cy + h / 2 - w}
      L ${cx + w / 2} ${cy + h / 2 - w}
      L ${cx + w / 2} ${cy + w / 2}
      L ${cx + h / 2 - w} ${cy + w / 2}
      L ${cx + h / 2 - w} ${cy - w / 2}
      L ${cx + w / 2} ${cy - w / 2}
      L ${cx + w / 2} ${cy - h / 2 + w}
      Z
    `
  }

  private static createGearPath(cx: number, cy: number, r: number): string {
    const teeth = 8
    const innerRadius = r * 0.7
    const toothHeight = r * 0.15
    let path = ''

    for (let i = 0; i < teeth; i++) {
      const angle = ((Math.PI * 2) / teeth) * i
      const nextAngle = ((Math.PI * 2) / teeth) * (i + 1)

      // Tooth peak
      const peakX =
        cx + (r + toothHeight) * Math.cos(angle - Math.PI / teeth / 2)
      const peakY =
        cy + (r + toothHeight) * Math.sin(angle - Math.PI / teeth / 2)

      // Tooth valley
      const valleyX =
        cx + innerRadius * Math.cos(nextAngle - Math.PI / teeth / 2)
      const valleyY =
        cy + innerRadius * Math.sin(nextAngle - Math.PI / teeth / 2)

      if (i === 0) {
        path += `M ${peakX} ${peakY}`
      } else {
        path += ` L ${peakX} ${peakY}`
      }

      path += ` L ${valleyX} ${valleyY}`
    }

    return path + ' Z'
  }

  private static renderLeafFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    return (
      <g>
        <path
          d={this.createLeafPath(x + size / 2, y + size / 2, size)}
          fill={fill}
          filter={filter}
        />
        <path
          d={this.createLeafPath(
            x + size / 2,
            y + size / 2,
            size - strokeWidth
          )}
          fill="white"
        />
      </g>
    )
  }

  private static renderFlowerFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2
    const petalCount = 8
    const petalSize = size * 0.25
    const strokeWidth = size * 0.15

    return (
      <g>
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = ((Math.PI * 2) / petalCount) * i
          const px = cx + size * 0.35 * Math.cos(angle)
          const py = cy + size * 0.35 * Math.sin(angle)
          return (
            <circle
              key={`petal-${i}`}
              cx={px}
              cy={py}
              r={petalSize}
              fill={fill}
              filter={filter}
            />
          )
        })}
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = ((Math.PI * 2) / petalCount) * i
          const px = cx + (size * 0.35 - strokeWidth / 2) * Math.cos(angle)
          const py = cy + (size * 0.35 - strokeWidth / 2) * Math.sin(angle)
          return (
            <circle
              key={`petal-inner-${i}`}
              cx={px}
              cy={py}
              r={petalSize - strokeWidth / 2}
              fill="white"
            />
          )
        })}
      </g>
    )
  }

  private static renderStarFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    return (
      <g>
        <path
          d={this.createStarPath(
            x + size / 2,
            y + size / 2,
            5,
            size / 2,
            size / 4
          )}
          fill={fill}
          filter={filter}
        />
        <path
          d={this.createStarPath(
            x + size / 2,
            y + size / 2,
            5,
            (size - strokeWidth) / 2,
            (size - strokeWidth) / 4
          )}
          fill="white"
        />
      </g>
    )
  }

  private static renderDiamondFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const cx = x + size / 2
    const cy = y + size / 2
    const strokeWidth = size * 0.15

    return (
      <g>
        <path
          d={`M ${cx} ${y} L ${x + size} ${cy} L ${cx} ${y + size} L ${x} ${cy} Z`}
          fill={fill}
          filter={filter}
        />
        <path
          d={`M ${cx} ${y + strokeWidth} L ${x + size - strokeWidth} ${cy} L ${cx} ${y + size - strokeWidth} L ${x + strokeWidth} ${cy} Z`}
          fill="white"
        />
      </g>
    )
  }

  private static renderHeartFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    return (
      <g>
        <path
          d={this.createHeartPath(x, y, size)}
          fill={fill}
          filter={filter}
        />
        <path
          d={this.createHeartPath(
            x + strokeWidth / 2,
            y + strokeWidth / 2,
            size - strokeWidth
          )}
          fill="white"
        />
      </g>
    )
  }

  private static renderShieldFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    const shieldPath = `
      M ${x + size / 2} ${y}
      L ${x + size} ${y + size * 0.3}
      L ${x + size} ${y + size * 0.6}
      Q ${x + size / 2} ${y + size}, ${x} ${y + size * 0.6}
      L ${x} ${y + size * 0.3}
      Z
    `

    const innerShieldPath = `
      M ${x + size / 2} ${y + strokeWidth}
      L ${x + size - strokeWidth} ${y + size * 0.3}
      L ${x + size - strokeWidth} ${y + size * 0.6}
      Q ${x + size / 2} ${y + size - strokeWidth}, ${x + strokeWidth} ${y + size * 0.6}
      L ${x + strokeWidth} ${y + size * 0.3}
      Z
    `

    return (
      <g>
        <path d={shieldPath} fill={fill} filter={filter} />
        <path d={innerShieldPath} fill="white" />
      </g>
    )
  }

  private static renderBubbleFrame(
    x: number,
    y: number,
    size: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const strokeWidth = size * 0.15
    return (
      <g>
        <ellipse
          cx={x + size / 2}
          cy={y + size / 2}
          rx={size / 2}
          ry={size / 2.2}
          fill={fill}
          filter={filter}
        />
        <ellipse
          cx={x + size / 2}
          cy={y + size / 2}
          rx={(size - strokeWidth) / 2}
          ry={(size - strokeWidth) / 2.2}
          fill="white"
        />
      </g>
    )
  }

  private static renderFlowerPupil(
    cx: number,
    cy: number,
    r: number,
    fill: string,
    filter?: string
  ): React.JSX.Element {
    const petalCount = 6
    const petalSize = r * 0.5

    return (
      <g>
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = ((Math.PI * 2) / petalCount) * i
          const px = cx + r * 0.5 * Math.cos(angle)
          const py = cy + r * 0.5 * Math.sin(angle)
          return (
            <ellipse
              key={`pupil-petal-${i}`}
              cx={px}
              cy={py}
              rx={petalSize}
              ry={petalSize * 0.6}
              fill={fill}
              filter={filter}
              transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            />
          )
        })}
        <circle cx={cx} cy={cy} r={r * 0.3} fill={fill} filter={filter} />
      </g>
    )
  }
}
