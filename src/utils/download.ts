import { QRCode } from '../qr/QRCode'
import { ImageSettings, QRCodeStyle } from '../types'

interface DownloadOptions {
  qrCode: QRCode
  size: number
  bgColor: string
  fgColor: string
  marginSize: number
  imageSettings?: ImageSettings
  qrStyle?: QRCodeStyle
  format: string
  filename: string
  quality?: number
  scale?: number
}

export async function downloadQRCode(options: DownloadOptions): Promise<void> {
  const {
    qrCode,
    size,
    bgColor,
    fgColor,
    marginSize,
    imageSettings,
    qrStyle,
    format,
    filename,
    quality = 0.92,
    scale = 1,
  } = options

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  const actualSize = size * scale
  canvas.width = actualSize
  canvas.height = actualSize

  // Scale the context
  ctx.scale(scale, scale)

  // Draw QR code on canvas
  await drawQRCodeOnCanvas(
    ctx,
    qrCode,
    size,
    bgColor,
    fgColor,
    marginSize,
    imageSettings,
    qrStyle
  )

  // Convert to blob and download
  if (format === 'svg') {
    const svgString = await generateSVGString(
      qrCode,
      size,
      bgColor,
      fgColor,
      marginSize,
      imageSettings,
      qrStyle
    )
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    downloadBlob(blob, `${filename}.svg`)
  } else {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, `${filename}.${format}`)
        }
      },
      `image/${format}`,
      quality
    )
  }
}

export async function copyQRCode(
  options: Omit<DownloadOptions, 'format' | 'filename' | 'quality' | 'scale'>
): Promise<void> {
  const { qrCode, size, bgColor, fgColor, marginSize, imageSettings, qrStyle } =
    options

  // Check if Clipboard API is available
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard API not supported')
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  canvas.width = size
  canvas.height = size

  // Draw QR code on canvas
  await drawQRCodeOnCanvas(
    ctx,
    qrCode,
    size,
    bgColor,
    fgColor,
    marginSize,
    imageSettings,
    qrStyle
  )

  // Convert to blob and copy to clipboard
  canvas.toBlob(async (blob) => {
    if (blob) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ])
      } catch (error) {
        throw new Error('Failed to copy to clipboard')
      }
    }
  }, 'image/png')
}

async function drawQRCodeOnCanvas(
  ctx: CanvasRenderingContext2D,
  qrCode: QRCode,
  size: number,
  bgColor: string,
  fgColor: string,
  marginSize: number,
  imageSettings?: ImageSettings,
  qrStyle?: QRCodeStyle
): Promise<void> {
  const modules = qrCode.getModules()
  if (!modules) return

  const moduleCount = modules.length
  const actualSize = size - marginSize * 2
  const cellSize = actualSize / moduleCount

  // Draw background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // Draw modules
  ctx.fillStyle = fgColor
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        const x = marginSize + col * cellSize
        const y = marginSize + row * cellSize

        if (qrStyle?.module?.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(
            x + cellSize / 2,
            y + cellSize / 2,
            cellSize / 2,
            0,
            Math.PI * 2
          )
          ctx.fill()
        } else if (qrStyle?.module?.shape === 'rounded') {
          drawRoundedRect(ctx, x, y, cellSize, cellSize, cellSize * 0.2)
          ctx.fill()
        } else {
          ctx.fillRect(x, y, cellSize, cellSize)
        }
      }
    }
  }

  // Draw image if provided
  if (imageSettings?.src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        const imgSize = imageSettings.width || size * 0.2
        const imgHeight = imageSettings.height || imgSize
        const imgX =
          imageSettings.x !== undefined ? imageSettings.x : (size - imgSize) / 2
        const imgY =
          imageSettings.y !== undefined
            ? imageSettings.y
            : (size - imgHeight) / 2

        if (imageSettings.excavate) {
          const excavateSize = imgSize * 1.1
          const excavateX = (size - excavateSize) / 2
          const excavateY = (size - excavateSize) / 2

          ctx.fillStyle = bgColor
          drawRoundedRect(
            ctx,
            excavateX,
            excavateY,
            excavateSize,
            excavateSize,
            8
          )
          ctx.fill()
        }

        ctx.drawImage(img, imgX, imgY, imgSize, imgHeight)
        resolve()
      }

      img.onerror = () => resolve()
      img.src = imageSettings.src
    })
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

async function generateSVGString(
  qrCode: QRCode,
  size: number,
  bgColor: string,
  fgColor: string,
  marginSize: number,
  imageSettings?: ImageSettings,
  qrStyle?: QRCodeStyle
): Promise<string> {
  const modules = qrCode.getModules()
  if (!modules) return ''

  const moduleCount = modules.length
  const actualSize = size - marginSize * 2
  const cellSize = actualSize / moduleCount

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`

  // Background
  svg += `<rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}"/>`

  // Modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        const x = marginSize + col * cellSize
        const y = marginSize + row * cellSize

        if (qrStyle?.module?.shape === 'circle') {
          svg += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize / 2}" fill="${fgColor}"/>`
        } else if (qrStyle?.module?.shape === 'rounded') {
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.2}" fill="${fgColor}"/>`
        } else {
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>`
        }
      }
    }
  }

  // Image
  if (imageSettings?.src) {
    const imgSize = imageSettings.width || size * 0.2
    const imgHeight = imageSettings.height || imgSize
    const imgX =
      imageSettings.x !== undefined ? imageSettings.x : (size - imgSize) / 2
    const imgY =
      imageSettings.y !== undefined ? imageSettings.y : (size - imgHeight) / 2

    if (imageSettings.excavate) {
      const excavateSize = imgSize * 1.1
      const excavateX = (size - excavateSize) / 2
      const excavateY = (size - excavateSize) / 2
      svg += `<rect x="${excavateX}" y="${excavateY}" width="${excavateSize}" height="${excavateSize}" rx="8" fill="${bgColor}"/>`
    }

    svg += `<image href="${imageSettings.src}" x="${imgX}" y="${imgY}" width="${imgSize}" height="${imgHeight}" preserveAspectRatio="xMidYMid meet"/>`
  }

  svg += '</svg>'
  return svg
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
