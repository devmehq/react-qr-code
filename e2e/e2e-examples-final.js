const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function testExamples() {
  console.log('Testing QR codes from examples/index.html...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Log console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('Browser error:', msg.text())
      }
    })

    // Navigate to examples
    console.log('Loading http://localhost:8083/examples/index.html...')
    await page.goto('http://localhost:8083/examples/index.html', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for React to render
    console.log('Waiting for React to render...')
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Check if React loaded
    const hasReact = await page.evaluate(() => {
      return typeof React !== 'undefined' && typeof ReactDOM !== 'undefined'
    })
    console.log('React loaded:', hasReact)

    // Check if our library loaded
    const hasLib = await page.evaluate(() => {
      return typeof window.ReactQrCode !== 'undefined'
    })
    console.log('ReactQrCode library loaded:', hasLib)

    // Extract QR codes
    const qrData = await page.evaluate(() => {
      const results = []

      // Find all SVGs
      const svgs = document.querySelectorAll('svg')

      svgs.forEach((svg, index) => {
        // Get the parent container to find the label
        let parent = svg.parentElement
        while (parent && !parent.querySelector('h4')) {
          parent = parent.parentElement
        }

        const label =
          parent?.querySelector('h4')?.textContent || `QR #${index + 1}`

        // Analyze the SVG
        const svgString = new XMLSerializer().serializeToString(svg)
        const rects = svg.querySelectorAll('rect')

        let bgColor = null
        let fgColor = null

        // First rect is background
        if (rects.length > 0) {
          bgColor = rects[0].getAttribute('fill')
        }

        // Find a module rect (not the background)
        for (let i = 1; i < rects.length && i < 10; i++) {
          const color = rects[i].getAttribute('fill')
          if (color && color !== bgColor) {
            fgColor = color
            break
          }
        }

        // If no different color found, they might all be the same
        if (!fgColor && rects.length > 1) {
          fgColor = rects[1].getAttribute('fill')
        }

        results.push({
          label,
          bgColor,
          fgColor,
          rectCount: rects.length,
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          svgString,
        })
      })

      return results
    })

    console.log(`\nFound ${qrData.length} QR codes:\n`)
    console.log('='.repeat(60))

    for (const qr of qrData) {
      console.log(`\n📱 ${qr.label}`)
      console.log(`   Size: ${qr.width}x${qr.height}`)
      console.log(`   Background: ${qr.bgColor || 'NOT SET'}`)
      console.log(`   Foreground: ${qr.fgColor || 'NOT SET'}`)
      console.log(`   Rect count: ${qr.rectCount}`)

      // Detectability check
      if (!qr.bgColor || !qr.fgColor) {
        console.log('   ❌ CRITICAL: Missing colors - NOT DETECTABLE!')

        // Save this problematic QR
        const filename = `e2e/problematic-${qr.label.toLowerCase().replace(/\s+/g, '-')}.svg`
        await fs.writeFile(filename, qr.svgString)
        console.log(`   💾 Saved problematic QR to: ${filename}`)
      } else if (qr.bgColor === qr.fgColor) {
        console.log(
          `   ❌ CRITICAL: Same color (${qr.bgColor}) - NOT DETECTABLE!`
        )
      } else {
        console.log('   ✅ Has contrast - should be detectable')
      }
    }

    console.log('\n' + '='.repeat(60))

    // Take screenshot
    await page.screenshot({
      path: 'e2e/full-examples-page.png',
      fullPage: true,
    })
    console.log('\n📸 Screenshot saved: e2e/full-examples-page.png')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await browser.close()
  }
}

testExamples().catch(console.error)
