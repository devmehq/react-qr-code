const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function extractQRCodes() {
  console.log('Extracting QR codes from examples/index.html...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Add console logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('Browser error:', msg.text())
      }
    })

    // Navigate to examples/index.html
    await page.goto('http://localhost:8082/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Extract all QR codes
    const qrCodes = await page.evaluate(() => {
      const results = []

      // Find all SVG QR codes
      const svgs = document.querySelectorAll('svg')
      svgs.forEach((svg, index) => {
        const svgString = new XMLSerializer().serializeToString(svg)

        // Get background rect
        const bgRect = svg.querySelector('rect')
        const bgColor = bgRect ? bgRect.getAttribute('fill') : null

        // Get module elements (skip first rect which is background)
        const modules = Array.from(svg.querySelectorAll('rect')).slice(1)
        const paths = svg.querySelectorAll('path')
        const allModules = [...modules, ...paths]

        // Get unique colors
        const colors = new Set()
        allModules.forEach((m) => {
          const fill = m.getAttribute('fill')
          if (fill) colors.add(fill)
        })

        results.push({
          type: 'svg',
          index,
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          backgroundColor: bgColor,
          moduleColors: Array.from(colors),
          moduleCount: allModules.length,
          svgPreview: svgString.substring(0, 200) + '...',
        })
      })

      // Find all Canvas QR codes
      const canvases = document.querySelectorAll('canvas')
      canvases.forEach((canvas, index) => {
        results.push({
          type: 'canvas',
          index,
          width: canvas.width,
          height: canvas.height,
        })
      })

      return results
    })

    console.log(`Found ${qrCodes.length} QR codes\n`)

    for (const qr of qrCodes) {
      console.log(`QR Code #${qr.index + 1} (${qr.type}):`)
      console.log('  Size:', qr.width + 'x' + qr.height)
      console.log('  Background:', qr.backgroundColor)
      console.log('  Module Colors:', qr.moduleColors)
      console.log('  Module Count:', qr.moduleCount)

      // Check detectability
      if (qr.type === 'svg') {
        const bg = qr.backgroundColor
        const fg = qr.moduleColors?.[0]

        if (!bg || !fg) {
          console.log('  ❌ ISSUE: Missing colors!')
        } else if (bg === fg) {
          console.log('  ❌ CRITICAL: Same background and foreground color!')
        } else if (bg === '#ffffff' && fg === '#000000') {
          console.log('  ✅ Perfect: Black on white')
        } else if (bg === '#000000' && fg === '#ffffff') {
          console.log('  ✅ Perfect: White on black')
        } else {
          console.log(`  ⚠️  Custom colors: ${fg} on ${bg}`)
        }
      }
      console.log('')
    }

    // Extract the first SVG for detailed analysis
    const firstSvg = await page.evaluate(() => {
      const svg = document.querySelector('svg')
      if (!svg) return null
      return new XMLSerializer().serializeToString(svg)
    })

    if (firstSvg) {
      await fs.writeFile('e2e/index-first-qr.svg', firstSvg)
      console.log('First QR code saved to: e2e/index-first-qr.svg')
    }

    // Take screenshot
    await page.screenshot({
      path: 'e2e/index-full-page.png',
      fullPage: true,
    })
    console.log('Full page screenshot: e2e/index-full-page.png')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await browser.close()
  }
}

extractQRCodes().catch(console.error)
