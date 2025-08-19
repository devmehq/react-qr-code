import * as React from 'react'
import {
  BackgroundCustomization,
  BackgroundPattern,
  GradientConfig,
  BorderConfig,
  BackgroundEffect,
} from '../../types/advanced'

interface BackgroundRendererProps {
  width: number
  height: number
  config: BackgroundCustomization
  defaultColor: string
}

export class BackgroundRenderer {
  static render(props: BackgroundRendererProps): React.JSX.Element {
    const { width, height, config, defaultColor } = props

    const elements: React.JSX.Element[] = []

    // Base background
    const bgColor = config.primaryColor || defaultColor
    const fillColor =
      typeof bgColor === 'string'
        ? bgColor
        : this.createGradientFill(bgColor, 'bg_gradient')

    // Main background rectangle
    elements.push(
      <rect
        key="bg-main"
        x={0}
        y={0}
        width={width}
        height={height}
        fill={fillColor}
        rx={config.rounded === true ? width * 0.05 : config.rounded || 0}
      />
    )

    // Background image
    if (config.image) {
      elements.push(
        <image
          key="bg-image"
          href={config.image.src}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio={
            config.image.position === 'cover'
              ? 'xMidYMid slice'
              : config.image.position === 'contain'
                ? 'xMidYMid meet'
                : 'xMidYMid meet'
          }
          opacity={config.image.opacity || 0.3}
          style={{
            filter: config.image.blur
              ? `blur(${config.image.blur}px)`
              : undefined,
            mixBlendMode: config.image.blend || 'normal',
          }}
        />
      )
    }

    // Pattern overlay
    if (config.pattern && config.pattern !== 'none') {
      elements.push(
        this.renderPattern(
          config.pattern,
          width,
          height,
          config.patternColor || '#000000',
          config.patternOpacity || 0.1,
          config.patternSize || 10
        )
      )
    }

    // Effects
    if (config.effects) {
      config.effects.forEach((effect, index) => {
        const effectElement = this.renderEffect(
          effect,
          width,
          height,
          `effect-${index}`
        )
        if (effectElement) elements.push(effectElement)
      })
    }

    // Border
    if (config.border) {
      elements.push(this.renderBorder(config.border, width, height))
    }

    return <g key="background">{elements}</g>
  }

  private static createGradientFill(
    _gradient: GradientConfig,
    id: string
  ): string {
    // This would need to be handled in the parent component to create actual gradient definitions
    return `url(#${id})`
  }

  private static renderPattern(
    pattern: BackgroundPattern,
    width: number,
    height: number,
    color: string | GradientConfig,
    opacity: number,
    size: number
  ): React.JSX.Element {
    const patternId = `pattern-${pattern}`
    const fillColor = typeof color === 'string' ? color : '#000000'

    switch (pattern) {
      case 'dots':
        return (
          <g key="pattern-dots">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 2}
                height={size * 2}
                patternUnits="userSpaceOnUse"
              >
                <circle cx={size} cy={size} r={size / 4} fill={fillColor} />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'lines':
        return (
          <g key="pattern-lines">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={size}
                  stroke={fillColor}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'grid':
        return (
          <g key="pattern-grid">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${size} 0 L 0 0 0 ${size}`}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'waves':
        return (
          <g key="pattern-waves">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 4}
                height={size * 2}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M 0 ${size} Q ${size} 0, ${size * 2} ${size} T ${size * 4} ${size}`}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'zigzag':
        return (
          <g key="pattern-zigzag">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 2}
                height={size}
                patternUnits="userSpaceOnUse"
              >
                <polyline
                  points={`0,${size} ${size / 2},0 ${size},${size} ${size * 1.5},0 ${size * 2},${size}`}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'checkerboard':
        return (
          <g key="pattern-checkerboard">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 2}
                height={size * 2}
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width={size} height={size} fill={fillColor} />
                <rect
                  x={size}
                  y={size}
                  width={size}
                  height={size}
                  fill={fillColor}
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'diagonal':
        return (
          <g key="pattern-diagonal">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2={size}
                  y2={size}
                  stroke={fillColor}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'triangles':
        return (
          <g key="pattern-triangles">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size}
                height={size}
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points={`${size / 2},0 ${size},${size} 0,${size}`}
                  fill={fillColor}
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'hexagons':
        return (
          <g key="pattern-hexagons">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 3}
                height={size * 2.6}
                patternUnits="userSpaceOnUse"
              >
                {this.createHexagonPattern(size, fillColor)}
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'circles':
        return (
          <g key="pattern-circles">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 2}
                height={size * 2}
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx={size}
                  cy={size}
                  r={size / 2}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'stars':
        return (
          <g key="pattern-stars">
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width={size * 3}
                height={size * 3}
                patternUnits="userSpaceOnUse"
              >
                {this.createStarPattern(size, fillColor)}
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${patternId})`}
              opacity={opacity}
            />
          </g>
        )

      case 'noise':
        return (
          <g key="pattern-noise">
            <defs>
              <filter id="noise-filter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="4"
                  seed="5"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              filter="url(#noise-filter)"
              opacity={opacity * 0.3}
            />
          </g>
        )

      default:
        return <g key="pattern-none" />
    }
  }

  private static renderEffect(
    effect: BackgroundEffect,
    width: number,
    height: number,
    key: string
  ): React.JSX.Element | null {
    switch (effect.type) {
      case 'vignette':
        return (
          <g key={key}>
            <defs>
              <radialGradient id={`${key}-gradient`}>
                <stop
                  offset="0%"
                  stopColor={effect.color || '#000000'}
                  stopOpacity="0"
                />
                <stop
                  offset="70%"
                  stopColor={effect.color || '#000000'}
                  stopOpacity="0"
                />
                <stop
                  offset="100%"
                  stopColor={effect.color || '#000000'}
                  stopOpacity={effect.intensity || 0.5}
                />
              </radialGradient>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${key}-gradient)`}
            />
          </g>
        )

      case 'scan-lines':
        return (
          <g key={key}>
            <defs>
              <pattern
                id={`${key}-pattern`}
                x="0"
                y="0"
                width="1"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                  stroke={effect.color || '#000000'}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${key}-pattern)`}
              opacity={effect.intensity || 0.1}
              style={{ mixBlendMode: (effect.blend || 'multiply') as any }}
            />
          </g>
        )

      case 'grain':
        return (
          <g key={key}>
            <defs>
              <filter id={`${key}-filter`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="5"
                  numOctaves="1"
                />
                <feColorMatrix type="saturate" values="0" />
                <feBlend mode="multiply" />
              </filter>
            </defs>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              filter={`url(#${key}-filter)`}
              opacity={effect.intensity || 0.1}
            />
          </g>
        )

      case 'bokeh':
        const bokehCircles = Array.from({ length: 10 }).map((_, i) => {
          const cx = Math.random() * width
          const cy = Math.random() * height
          const r = Math.random() * 50 + 20
          const opacity = Math.random() * (effect.intensity || 0.3)

          return (
            <circle
              key={`bokeh-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={effect.color || '#ffffff'}
              opacity={opacity}
              style={{ mixBlendMode: 'screen' }}
            />
          )
        })

        return <g key={key}>{bokehCircles}</g>

      default:
        return null
    }
  }

  private static renderBorder(
    border: BorderConfig,
    width: number,
    height: number
  ): React.JSX.Element {
    const strokeWidth = border.width || 2
    const strokeColor =
      typeof border.color === 'string' ? border.color : '#000000'

    let strokeDasharray: string | undefined
    switch (border.style) {
      case 'dashed':
        strokeDasharray = `${strokeWidth * 3} ${strokeWidth * 2}`
        break
      case 'dotted':
        strokeDasharray = `${strokeWidth} ${strokeWidth}`
        break
      default:
        strokeDasharray = undefined
    }

    const borderElement = (
      <rect
        key="border"
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={width - strokeWidth}
        height={height - strokeWidth}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        rx={border.radius || 0}
      />
    )

    if (border.shadow) {
      const shadowId = 'border-shadow'
      return (
        <g key="border-group">
          <defs>
            <filter id={shadowId}>
              <feDropShadow
                dx={border.shadow.offsetX || 0}
                dy={border.shadow.offsetY || 0}
                stdDeviation={border.shadow.blur || 2}
                floodColor={border.shadow.color || '#000000'}
                floodOpacity="0.3"
              />
            </filter>
          </defs>
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width - strokeWidth}
            height={height - strokeWidth}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            rx={border.radius || 0}
            filter={`url(#${shadowId})`}
          />
        </g>
      )
    }

    return borderElement
  }

  private static createHexagonPattern(
    size: number,
    color: string
  ): React.JSX.Element[] {
    const hexagons: React.JSX.Element[] = []
    const hexHeight = size * 0.866 // Height of equilateral triangle

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        const x = col * size * 1.5
        const y = row * hexHeight * 2 + (col % 2) * hexHeight

        hexagons.push(
          <polygon
            key={`hex-${row}-${col}`}
            points={this.getHexagonPoints(
              x + size / 2,
              y + hexHeight,
              size / 2
            )}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
          />
        )
      }
    }

    return hexagons
  }

  private static getHexagonPoints(cx: number, cy: number, r: number): string {
    const points: string[] = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }

  private static createStarPattern(
    size: number,
    color: string
  ): React.JSX.Element[] {
    const stars: React.JSX.Element[] = []

    for (let i = 0; i < 4; i++) {
      const x = Math.random() * size * 3
      const y = Math.random() * size * 3
      const scale = Math.random() * 0.5 + 0.5

      stars.push(
        <path
          key={`star-${i}`}
          d={this.getStarPath(x, y, 5, size * 0.2 * scale, size * 0.1 * scale)}
          fill={color}
        />
      )
    }

    return stars
  }

  private static getStarPath(
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
}
