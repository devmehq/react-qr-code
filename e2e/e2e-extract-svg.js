const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function extractSVG() {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.goto('http://localhost:8081/test-simple-qr.html', {
    waitUntil: 'networkidle2',
  })
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Extract SVG from test1
  const svgContent = await page.evaluate(() => {
    const svg = document.querySelector('#test1 svg')
    if (!svg) return null
    return new XMLSerializer().serializeToString(svg)
  })

  if (svgContent) {
    await fs.writeFile('test-simple-output.svg', svgContent)
    console.log('SVG extracted to test-simple-output.svg')

    // Analyze the SVG
    console.log('\nSVG Analysis:')
    console.log('- Has viewBox:', svgContent.includes('viewBox'))
    console.log('- Has background rect:', svgContent.includes('<rect'))
    console.log(
      '- Background fill:',
      svgContent.match(/fill="(#[a-fA-F0-9]{6})"/)?.[1]
    )

    // Count module elements
    const pathCount = (svgContent.match(/<path/g) || []).length
    const rectCount = (svgContent.match(/<rect/g) || []).length
    console.log(`- Path elements: ${pathCount}`)
    console.log(`- Rect elements: ${rectCount}`)
  }

  await browser.close()
}

extractSVG().catch(console.error)
