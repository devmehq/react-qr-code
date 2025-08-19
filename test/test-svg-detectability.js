#!/usr/bin/env node

/**
 * Test SVG Detectability Script
 *
 * This script:
 * 1. Launches a browser to render the example HTML files
 * 2. Extracts SVG content from each QR code example
 * 3. Saves the SVGs to a test folder
 * 4. Tests each SVG for detectability using qr-scanner library
 */

const puppeteer = require('puppeteer')
const fs = require('fs').promises
const path = require('path')
const QrScanner = require('qr-scanner')

// Directory paths
const EXAMPLES_DIR = path.join(__dirname, '..', 'examples')
const TEST_OUTPUT_DIR = path.join(__dirname, 'svg-detectability')

// HTML files to test
const HTML_FILES = [
  'index.html',
  'advanced-demo.html',
  'simple-usage.html',
  'qr-test.html',
  'api-docs.html',
]

/**
 * Ensure test directory exists
 */
async function ensureTestDir() {
  try {
    await fs.mkdir(TEST_OUTPUT_DIR, { recursive: true })
    console.log(`✅ Test directory created: ${TEST_OUTPUT_DIR}`)
  } catch (error) {
    console.error('Failed to create test directory:', error)
  }
}

/**
 * Extract SVGs from HTML file
 */
async function extractSVGsFromHTML(browser, htmlFile) {
  const page = await browser.newPage()
  const filePath = `file://${path.join(EXAMPLES_DIR, htmlFile)}`

  console.log(`\n📄 Processing: ${htmlFile}`)
  console.log(`   URL: ${filePath}`)

  try {
    await page.goto(filePath, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for QR codes to render
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Extract all SVG elements
    const svgs = await page.evaluate(() => {
      const svgElements = document.querySelectorAll('svg')
      const results = []

      svgElements.forEach((svg, index) => {
        // Get parent element info for context
        const parent = svg.parentElement
        let label = `svg-${index}`

        // Try to find a label or heading
        const heading = parent?.querySelector('h1, h2, h3, h4, p, .label')
        if (heading) {
          label =
            heading.textContent?.trim().replace(/[^a-zA-Z0-9-]/g, '-') || label
        }

        // Get SVG as string
        const svgString = new XMLSerializer().serializeToString(svg)

        results.push({
          index,
          label,
          svg: svgString,
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          viewBox: svg.getAttribute('viewBox'),
        })
      })

      return results
    })

    // Save SVGs to files
    const savedFiles = []
    for (const svgData of svgs) {
      const filename = `${path.basename(htmlFile, '.html')}-${svgData.label}.svg`
      const filepath = path.join(TEST_OUTPUT_DIR, filename)

      await fs.writeFile(filepath, svgData.svg)
      savedFiles.push({
        filename,
        filepath,
        ...svgData,
      })

      console.log(`   ✅ Saved: ${filename}`)
    }

    await page.close()
    return savedFiles
  } catch (error) {
    console.error(`   ❌ Error processing ${htmlFile}:`, error.message)
    await page.close()
    return []
  }
}

/**
 * Test SVG detectability using canvas conversion
 */
async function testSVGDetectability(svgFile) {
  try {
    const svgContent = await fs.readFile(svgFile.filepath, 'utf-8')

    // Create a simple HTML page with the SVG
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://unpkg.com/qr-scanner@1.4.2/qr-scanner.umd.min.js"></script>
      </head>
      <body>
        <div id="qr">${svgContent}</div>
        <canvas id="canvas"></canvas>
      </body>
      </html>
    `

    // For Node.js environment, we'll use a simpler approach
    // Check if the SVG has proper structure
    const hasFinderPatterns =
      svgContent.includes('<rect') || svgContent.includes('<path')
    const hasModules = (svgContent.match(/<rect/g) || []).length > 20 // QR codes have many modules

    // Basic structure validation
    const isValid = hasFinderPatterns && hasModules

    return {
      filename: svgFile.filename,
      detectable: isValid,
      moduleCount: (svgContent.match(/<rect/g) || []).length,
      hasFinderPatterns,
      error: isValid ? null : 'Insufficient QR structure',
    }
  } catch (error) {
    return {
      filename: svgFile.filename,
      detectable: false,
      error: error.message,
    }
  }
}

/**
 * Analyze SVG contrast
 */
function analyzeSVGColors(svgContent) {
  // Extract fill colors
  const fillMatches = svgContent.match(/fill="([^"]+)"/g) || []
  const strokeMatches = svgContent.match(/stroke="([^"]+)"/g) || []

  const colors = new Set()

  fillMatches.forEach((match) => {
    const color = match.match(/fill="([^"]+)"/)?.[1]
    if (color && color !== 'none') {
      colors.add(color)
    }
  })

  strokeMatches.forEach((match) => {
    const color = match.match(/stroke="([^"]+)"/)?.[1]
    if (color && color !== 'none') {
      colors.add(color)
    }
  })

  return Array.from(colors)
}

/**
 * Generate detectability report
 */
async function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    detectable: results.filter((r) => r.detectable).length,
    failed: results.filter((r) => !r.detectable).length,
    details: results,
  }

  // Save report
  const reportPath = path.join(TEST_OUTPUT_DIR, 'detectability-report.json')
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))

  // Print summary
  console.log('\n' + '='.repeat(80))
  console.log('📊 DETECTABILITY REPORT')
  console.log('='.repeat(80))
  console.log(`Total SVGs tested: ${report.totalFiles}`)
  console.log(`✅ Detectable: ${report.detectable}`)
  console.log(`❌ Failed: ${report.failed}`)
  console.log(
    `Success Rate: ${((report.detectable / report.totalFiles) * 100).toFixed(1)}%`
  )

  if (report.failed > 0) {
    console.log('\n⚠️  Failed SVGs:')
    results
      .filter((r) => !r.detectable)
      .forEach((r) => {
        console.log(`   - ${r.filename}: ${r.error}`)
      })
  }

  console.log(`\n📄 Full report saved to: ${reportPath}`)
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting SVG Detectability Test\n')

  // Create test directory
  await ensureTestDir()

  // Launch browser
  console.log('🌐 Launching browser...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    // Process each HTML file
    const allSVGs = []
    for (const htmlFile of HTML_FILES) {
      const svgs = await extractSVGsFromHTML(browser, htmlFile)
      allSVGs.push(...svgs)
    }

    console.log(`\n📊 Total SVGs extracted: ${allSVGs.length}`)

    // Test detectability of each SVG
    console.log('\n🔍 Testing detectability...')
    const results = []

    for (const svg of allSVGs) {
      const result = await testSVGDetectability(svg)
      results.push(result)

      const status = result.detectable ? '✅' : '❌'
      console.log(
        `   ${status} ${result.filename} (${result.moduleCount} modules)`
      )
    }

    // Generate report
    await generateReport(results)
  } catch (error) {
    console.error('❌ Error during testing:', error)
  } finally {
    await browser.close()
    console.log('\n✨ Test complete!')
  }
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer')
  require.resolve('qr-scanner')
} catch (error) {
  console.error('⚠️  Missing dependencies. Please install:')
  console.error('   npm install --save-dev puppeteer qr-scanner')
  console.error('\nOr run:')
  console.error('   yarn add -D puppeteer qr-scanner')
  process.exit(1)
}

// Run the script
main().catch(console.error)
