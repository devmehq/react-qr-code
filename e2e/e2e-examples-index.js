const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function testExamplesIndex() {
  console.log('Testing examples/index.html QR code detectability...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Navigate to examples/index.html
    await page.goto('http://localhost:8082/index.html', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Extract QR code information
    const qrInfo = await page.evaluate(() => {
      // Find the QR code SVG
      const svg = document.querySelector('#root svg')
      const canvas = document.querySelector('#root canvas')

      if (!svg && !canvas) {
        return { error: 'No QR code found' }
      }

      if (svg) {
        const svgString = new XMLSerializer().serializeToString(svg)

        // Extract colors from SVG
        const bgRect = svg.querySelector('rect')
        const bgColor = bgRect ? bgRect.getAttribute('fill') : null

        // Get module colors
        const modules = svg.querySelectorAll('rect:not(:first-child), path')
        const moduleColors = new Set()
        modules.forEach((m) => {
          const fill = m.getAttribute('fill')
          if (fill && fill !== bgColor) {
            moduleColors.add(fill)
          }
        })

        return {
          type: 'svg',
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          backgroundColor: bgColor,
          moduleColors: Array.from(moduleColors),
          moduleCount: modules.length,
          svgLength: svgString.length,
          svgString: svgString,
        }
      }

      if (canvas) {
        return {
          type: 'canvas',
          width: canvas.width,
          height: canvas.height,
          note: 'Canvas QR code detected',
        }
      }
    })

    console.log('QR Code Analysis:')
    console.log('================')
    console.log('Type:', qrInfo.type)
    console.log('Size:', qrInfo.width + 'x' + qrInfo.height)
    console.log('Background Color:', qrInfo.backgroundColor)
    console.log('Module Colors:', qrInfo.moduleColors)
    console.log('Module Count:', qrInfo.moduleCount)

    // Save SVG for inspection
    if (qrInfo.svgString) {
      await fs.writeFile('e2e/examples-index-qr.svg', qrInfo.svgString)
      console.log('\nSVG saved to: e2e/examples-index-qr.svg')
    }

    // Check for detectability issues
    console.log('\nDetectability Check:')
    console.log('====================')

    if (
      !qrInfo.backgroundColor ||
      !qrInfo.moduleColors ||
      qrInfo.moduleColors.length === 0
    ) {
      console.log('❌ ISSUE: Missing colors - QR code may not be visible')
    } else {
      // Calculate contrast ratio
      const bg = qrInfo.backgroundColor
      const fg = qrInfo.moduleColors[0]

      console.log(`Background: ${bg}`)
      console.log(`Foreground: ${fg}`)

      if (bg === fg) {
        console.log(
          '❌ CRITICAL: Background and foreground are the same color!'
        )
      } else if (!bg || !fg) {
        console.log('❌ CRITICAL: Missing color values!')
      } else if (bg === '#ffffff' && fg === '#000000') {
        console.log('✅ Perfect contrast (black on white)')
      } else if (bg === '#000000' && fg === '#ffffff') {
        console.log('✅ Perfect contrast (white on black)')
      } else {
        console.log('⚠️  Non-standard colors - may affect detectability')
      }
    }

    // Take a screenshot
    await page.screenshot({
      path: 'e2e/examples-index-screenshot.png',
      fullPage: true,
    })
    console.log('\nScreenshot saved to: e2e/examples-index-screenshot.png')

    // Check the actual React props being used
    const propsInfo = await page.evaluate(() => {
      // Try to get the props from React DevTools or window
      const rootElement = document.querySelector('#root')
      if (rootElement && rootElement._reactRootContainer) {
        // Try to access React fiber
        const fiber = rootElement._reactRootContainer._internalRoot?.current
        if (fiber) {
          return {
            note: 'React fiber found',
            props: JSON.stringify(fiber.memoizedProps || {}),
          }
        }
      }

      // Check if props are exposed in window
      if (window.qrProps) {
        return window.qrProps
      }

      return { note: 'Unable to extract React props' }
    })

    console.log('\nReact Props Info:', propsInfo)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await browser.close()
  }
}

// Create e2e directory if it doesn't exist
async function setup() {
  try {
    await fs.mkdir('e2e', { recursive: true })
  } catch (err) {
    // Directory might already exist
  }

  await testExamplesIndex()
}

setup().catch(console.error)
