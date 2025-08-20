import * as React from 'react'
import { ModuleShape } from '../../types/types'

interface ShapeProps {
  shape: ModuleShape
  x: number
  y: number
  size: number
  fill: string
  key: string
  animated?: boolean
  animationDuration?: number
  animationDelay?: number
}

export class ShapeRenderer {
  static render(props: ShapeProps): React.JSX.Element {
    const {
      shape,
      x,
      y,
      size,
      fill,
      key,
      animated,
      animationDuration,
      animationDelay,
    } = props

    const animationStyle = animated
      ? {
          opacity: 0,
          animation: `fadeIn ${animationDuration}ms ease-in-out ${animationDelay}ms forwards`,
        }
      : undefined

    switch (shape) {
      case 'circle':
        return (
          <circle
            key={key}
            cx={x + size / 2}
            cy={y + size / 2}
            r={size / 2}
            fill={fill}
            style={animationStyle}
          />
        )

      case 'rounded':
        return (
          <rect
            key={key}
            x={x}
            y={y}
            width={size}
            height={size}
            rx={size * 0.2}
            ry={size * 0.2}
            fill={fill}
            style={animationStyle}
          />
        )

      case 'diamond':
        const diamondPath = `
          M ${x + size / 2} ${y}
          L ${x + size} ${y + size / 2}
          L ${x + size / 2} ${y + size}
          L ${x} ${y + size / 2}
          Z
        `
        return (
          <path key={key} d={diamondPath} fill={fill} style={animationStyle} />
        )

      case 'star':
        const starPath = this.createStarPath(
          x + size / 2,
          y + size / 2,
          5,
          size / 2,
          size / 4
        )
        return (
          <path key={key} d={starPath} fill={fill} style={animationStyle} />
        )

      case 'square':
      default:
        return (
          <rect
            key={key}
            x={x}
            y={y}
            width={size}
            height={size}
            fill={fill}
            style={animationStyle}
          />
        )
    }
  }

  private static createStarPath(
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ): string {
    let path = ''
    let rot = (Math.PI / 2) * 3
    const step = Math.PI / spikes

    path += `M ${cx} ${cy - outerRadius}`

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius
      let y = cy + Math.sin(rot) * outerRadius
      path += ` L ${x} ${y}`
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      path += ` L ${x} ${y}`
      rot += step
    }

    path += ` L ${cx} ${cy - outerRadius} Z`
    return path
  }

  static getAnimationCSS(): string {
    return `
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
    `
  }
}
