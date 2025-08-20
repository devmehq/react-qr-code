// Advanced QR Code Customization Types

import { ReactQrCodeProps } from './types'

export interface AdvancedQRCodeProps extends Omit<ReactQrCodeProps, 'qrStyle'> {
  advancedStyle?: AdvancedQRStyleOptions
  theme?: keyof typeof PRESET_THEMES
  qrStyle?: ReactQrCodeProps['qrStyle'] // Keep for backwards compatibility
}

// Eye (Position Detection Pattern) Types
export type EyeShape =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'leaf'
  | 'star'
  | 'diamond'
  | 'flower'
  | 'heart'
  | 'octagon'
  | 'hexagon'
  | 'cross'
  | 'gear'

export type EyeFrameShape =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'leaf'
  | 'star'
  | 'diamond'
  | 'flower'
  | 'heart'
  | 'shield'
  | 'bubble'
  | 'hexagon'

export type BodyShape =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'diamond'
  | 'star'
  | 'dot'
  | 'line-vertical'
  | 'line-horizontal'
  | 'plus'
  | 'cross'
  | 'zigzag'
  | 'wave'
  | 'fluid'
  | 'hexagon'
  | 'octagon'
  | 'triangle'
  | 'mosaic'
  | 'pixel'
  | 'bubble'

export type ColorEffect =
  | 'none'
  | 'shadow'
  | 'glow'
  | 'inner-shadow'
  | 'blur'
  | '3d'
  | 'emboss'
  | 'neon'
  | 'metallic'
  | 'glass'
  | 'chrome'
  | 'holographic'

export type BackgroundPattern =
  | 'none'
  | 'dots'
  | 'lines'
  | 'grid'
  | 'waves'
  | 'zigzag'
  | 'checkerboard'
  | 'diagonal'
  | 'triangles'
  | 'hexagons'
  | 'circles'
  | 'stars'
  | 'noise'
  | 'gradient-radial'
  | 'gradient-linear'
  | 'gradient-conic'
  | 'gradient-mesh'

export type AnimationType =
  | 'none'
  | 'fade-in'
  | 'scale-up'
  | 'rotate'
  | 'slide'
  | 'bounce'
  | 'pulse'
  | 'wave'
  | 'ripple'
  | 'morph'
  | 'glitch'
  | 'fluid'
  | 'particle'

export interface EyeCustomization {
  // Outer frame
  frameShape?: EyeFrameShape
  frameColor?: string | GradientConfig
  frameEffect?: ColorEffect
  frameSize?: number
  frameBorderWidth?: number
  frameBorderColor?: string

  // Inner dot
  pupilShape?: EyeShape
  pupilColor?: string | GradientConfig
  pupilEffect?: ColorEffect
  pupilSize?: number

  // Position-specific customization
  topLeft?: Partial<SingleEyeConfig>
  topRight?: Partial<SingleEyeConfig>
  bottomLeft?: Partial<SingleEyeConfig>
}

export interface SingleEyeConfig {
  frameShape: EyeFrameShape
  frameColor: string | GradientConfig
  pupilShape: EyeShape
  pupilColor: string | GradientConfig
  rotation?: number
  scale?: number
}

export interface BodyCustomization {
  shape?: BodyShape
  color?: string | GradientConfig
  effect?: ColorEffect
  pattern?: BodyPattern
  randomize?: boolean
  density?: number // 0-1, controls how many modules are drawn
  size?: number // Size multiplier for body modules
  gap?: number // Gap between modules
  roundness?: number // Corner radius for rounded shapes
  rotation?: number // Rotation angle for patterns
}

export interface BodyPattern {
  type: 'solid' | 'alternating' | 'random' | 'gradient' | 'image' | 'custom'
  colors?: string[]
  frequency?: number
  direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial'
  customPattern?: (row: number, col: number) => string
}

export interface BackgroundCustomization {
  pattern?: BackgroundPattern
  patternColor?: string | GradientConfig
  patternOpacity?: number
  patternSize?: number
  primaryColor?: string | GradientConfig
  secondaryColor?: string
  image?: BackgroundImage
  blur?: number
  rounded?: boolean | number
  border?: BorderConfig
  effects?: BackgroundEffect[]
}

export interface BackgroundImage {
  src: string
  opacity?: number
  blur?: number
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
  position?:
    | 'center'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'cover'
    | 'contain'
}

export interface BorderConfig {
  width?: number
  color?: string | GradientConfig
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge'
  radius?: number
  shadow?: ShadowConfig
}

export interface BackgroundEffect {
  type: 'noise' | 'scan-lines' | 'vignette' | 'grain' | 'bokeh'
  intensity?: number
  color?: string
  blend?: string
}

export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic' | 'mesh'
  colors: GradientStop[]
  angle?: number // For linear gradients
  center?: { x: number; y: number } // For radial/conic
  meshPoints?: MeshPoint[] // For mesh gradients
}

export interface GradientStop {
  color: string
  offset: number // 0-1
  opacity?: number
}

export interface MeshPoint {
  x: number
  y: number
  color: string
  radius: number
}

export interface ShadowConfig {
  color?: string
  blur?: number
  offsetX?: number
  offsetY?: number
  spread?: number
  inset?: boolean
}

export interface GlowConfig {
  color?: string
  size?: number
  intensity?: number
  animated?: boolean
}

export interface AnimationConfig {
  type: AnimationType
  duration?: number
  delay?: number
  easing?:
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'bounce'
    | 'elastic'
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  // Specific animation properties
  amplitude?: number // For wave, ripple
  frequency?: number // For pulse, wave
  particles?: ParticleConfig // For particle animation
}

export interface ParticleConfig {
  count?: number
  size?: number
  color?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'random'
  shape?: 'circle' | 'square' | 'star' | 'triangle'
}

export interface FluidConfig {
  viscosity?: number // 0-1
  turbulence?: number // 0-1
  speed?: number
  colors?: string[]
  blend?: boolean
}

export interface AdvancedQRStyleOptions {
  eyes?: EyeCustomization
  body?: BodyCustomization
  background?: BackgroundCustomization
  animation?: AnimationConfig
  fluid?: FluidConfig
  effects?: {
    global?: ColorEffect
    shadow?: ShadowConfig
    glow?: GlowConfig
    blur?: number
    brightness?: number
    contrast?: number
    saturation?: number
    hue?: number
    invert?: boolean
    sepia?: boolean
  }
  responsive?: {
    breakpoints?: { [key: string]: Partial<AdvancedQRStyleOptions> }
    scale?: boolean
    maintainAspectRatio?: boolean
  }
  accessibility?: {
    highContrast?: boolean
    colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome'
    description?: string
  }
}

// Preset Themes
export interface QRTheme {
  name: string
  description?: string
  style: AdvancedQRStyleOptions
}

export const PRESET_THEMES: Record<string, QRTheme> = {
  modern: {
    name: 'Modern',
    description: 'Clean and minimal design',
    style: {
      eyes: {
        frameShape: 'rounded',
        pupilShape: 'circle',
      },
      body: {
        shape: 'rounded',
      },
      background: {
        rounded: true,
      },
    },
  },
  neon: {
    name: 'Neon',
    description: 'Glowing neon effect',
    style: {
      eyes: {
        frameShape: 'circle',
        frameColor: '#00ff41',
        frameEffect: 'glow',
        pupilShape: 'circle',
        pupilColor: '#00ff41',
        pupilEffect: 'neon',
      },
      body: {
        shape: 'circle',
        color: '#00ff41',
        effect: 'neon',
      },
      background: {
        primaryColor: '#000000',
      },
      effects: {
        glow: {
          color: '#00ff41',
          size: 10,
          intensity: 0.8,
        },
      },
    },
  },
  vintage: {
    name: 'Vintage',
    description: 'Retro style with sepia tones',
    style: {
      eyes: {
        frameShape: 'square',
        pupilShape: 'square',
      },
      body: {
        shape: 'square',
        pattern: {
          type: 'solid',
        },
      },
      effects: {
        sepia: true,
        contrast: 1.2,
      },
    },
  },
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Futuristic tech aesthetic',
    style: {
      eyes: {
        frameShape: 'hexagon',
        frameColor: '#00ffff',
        frameEffect: 'chrome',
        pupilShape: 'hexagon',
        pupilColor: '#ff00ff',
      },
      body: {
        shape: 'hexagon',
        color: '#00ffff',
        effect: 'holographic',
      },
      background: {
        pattern: 'grid',
        patternColor: '#00ffff',
        patternOpacity: 0.1,
        primaryColor: '#1a0033',
      },
      animation: {
        type: 'glitch',
        duration: 3000,
      },
    },
  },
  nature: {
    name: 'Nature',
    description: 'Organic shapes and earth tones',
    style: {
      eyes: {
        frameShape: 'leaf',
        frameColor: '#1b5e20',
        pupilShape: 'leaf',
        pupilColor: '#2e7d32',
      },
      body: {
        shape: 'bubble',
        color: '#1b5e20',
      },
      background: {
        pattern: 'waves',
        patternColor: '#c8e6c9',
        patternOpacity: 0.3,
        primaryColor: '#f1f8e9',
      },
    },
  },
}
