const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function testDefaultQR() {
  console.log('Testing default QR code from examples/index.html...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    // Navigate to examples/index.html
    await page.goto('http://localhost:8082/examples/index.html', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Extract all QR codes
    const qrAnalysis = await page.evaluate(() => {
      const results = []

      // Get all divs that might contain QR codes
      const containers = document.querySelectorAll('div')

      containers.forEach((container) => {
        const svg = container.querySelector('svg')
        if (svg && svg.getAttribute('viewBox')) {
          const svgString = new XMLSerializer().serializeToString(svg)

          // Find the title/label near this QR code
          let label = 'Unknown'
          const h4 = container.querySelector('h4')
          if (h4) {
            label = h4.textContent.trim()
          }

          // Get colors
          const rects = svg.querySelectorAll('rect')
          let bgColor = null
          let fgColor = null

          if (rects.length > 0) {
            // First rect is usually background
            bgColor = rects[0].getAttribute('fill')

            // Second rect onwards are modules
            if (rects.length > 1) {
              fgColor = rects[1].getAttribute('fill')
            }
          }

          results.push({
            label,
            width: svg.getAttribute('width'),
            height: svg.getAttribute('height'),
            backgroundColor: bgColor,
            foregroundColor: fgColor,
            totalRects: rects.length,
            svgString,
          })
        }
      })

      return results
    })

    console.log(`Found ${qrAnalysis.length} QR codes:\n`)

    for (let i = 0; i < qrAnalysis.length; i++) {
      const qr = qrAnalysis[i]
      console.log(`${i + 1}. ${qr.label}`)
      console.log(`   Size: ${qr.width}x${qr.height}`)
      console.log(`   Background: ${qr.backgroundColor}`)
      console.log(`   Foreground: ${qr.foregroundColor}`)
      console.log(`   Modules: ${qr.totalRects - 1}`)

      // Check detectability
      const bg = qr.backgroundColor
      const fg = qr.foregroundColor

      if (!bg || !fg) {
        console.log('   ❌ CRITICAL: Missing color values!')
      } else if (bg === fg) {
        console.log(`   ❌ CRITICAL: Same color for bg and fg: ${bg}`)
      } else if (
        (bg === '#ffffff' && fg === '#000000') ||
        (bg === '#000000' && fg === '#ffffff')
      ) {
        console.log('   ✅ Perfect contrast')
      } else {
        // Calculate if there's enough contrast
        console.log(`   ⚠️  Custom colors - check contrast`)
      }

      // Save problematic QR codes
      if (
        qr.label === 'Default' ||
        (!qr.foregroundColor && !qr.backgroundColor)
      ) {
        const filename = `e2e/qr-${qr.label.toLowerCase().replace(/\s+/g, '-')}.svg`
        await fs.writeFile(filename, qr.svgString)
        console.log(`   💾 Saved to: ${filename}`)
      }

      console.log('')
    }

    // Take a screenshot
    await page.screenshot({
      path: 'e2e/examples-page.png',
      fullPage: true,
    })
    console.log('Screenshot saved to: e2e/examples-page.png')
  } catch (error) {
    console.error('Error:', error.message)
    console.error(error.stack)
  } finally {
    await browser.close()
  }
}

testDefaultQR().catch(console.error)
