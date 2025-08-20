#!/usr/bin/env node

/**
 * E2E SVG Detectability Test Script
 *
 * This script:
 * 1. Launches a browser to render the example HTML files
 * 2. Extracts SVG content from each QR code example
 * 3. Saves the SVGs to the e2e/svgs folder
 * 4. Tests each SVG for detectability
 * 5. Generates a comprehensive report
 */

const puppeteer = require('puppeteer')
const fs = require('fs').promises
const path = require('path')

// Directory paths
const EXAMPLES_DIR = path.join(__dirname, '..', 'examples')
const E2E_DIR = __dirname
const SVG_OUTPUT_DIR = path.join(E2E_DIR, 'svgs')
const REPORTS_DIR = path.join(E2E_DIR, 'reports')

// HTML files to test
const HTML_FILES = [
  'index.html',
  'advanced-demo.html',
  'simple-usage.html',
  'qr-test.html',
  'api-docs.html',
]

/**
 * Ensure directories exist
 */
async function ensureDirectories() {
  const dirs = [SVG_OUTPUT_DIR, REPORTS_DIR]
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true })
  }
  console.log(`✅ E2E directories ready`)
  console.log(`   📁 SVGs: ${SVG_OUTPUT_DIR}`)
  console.log(`   📁 Reports: ${REPORTS_DIR}`)
}

/**
 * Start local server for examples
 */
function startServer() {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process')
    const server = exec(
      `cd ${EXAMPLES_DIR} && npx http-server . -p 8090`,
      (error) => {
        if (error) reject(error)
      }
    )

    // Wait for server to start
    setTimeout(() => {
      resolve(server)
    }, 3000)
  })
}

/**
 * Extract SVGs from HTML file
 */
async function extractSVGsFromHTML(browser, htmlFile, serverUrl) {
  const page = await browser.newPage()
  const url = `${serverUrl}/${htmlFile}`

  console.log(`\n📄 Processing: ${htmlFile}`)
  console.log(`   URL: ${url}`)

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for QR codes to render
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Extract all SVG elements
    const svgs = await page.evaluate(() => {
      const svgElements = document.querySelectorAll('svg')
      const results = []

      svgElements.forEach((svg, index) => {
        // Skip non-QR SVGs (check for viewBox)
        if (!svg.getAttribute('viewBox')) return

        // Get parent element info for context
        const parent = svg.parentElement
        let label = `qr-${index}`

        // Try to find a label or heading
        const heading = parent?.querySelector('h1, h2, h3, h4, h5, p, .label')
        if (heading) {
          label =
            heading.textContent
              ?.trim()
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '-')
              .replace(/-+/g, '-') || label
        }

        // Get SVG as string
        const svgString = new XMLSerializer().serializeToString(svg)

        // Extract colors
        const rects = svg.querySelectorAll('rect')
        let bgColor = null
        let fgColor = null

        if (rects.length > 0) {
          bgColor = rects[0].getAttribute('fill')
          if (rects.length > 1) {
            fgColor = rects[1].getAttribute('fill')
          }
        }

        results.push({
          index,
          label,
          svg: svgString,
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height'),
          viewBox: svg.getAttribute('viewBox'),
          bgColor,
          fgColor,
          rectCount: rects.length,
        })
      })

      return results
    })

    // Save SVGs to files
    const savedFiles = []
    for (const svgData of svgs) {
      const filename = `${path.basename(htmlFile, '.html')}-${svgData.label}.svg`
      const filepath = path.join(SVG_OUTPUT_DIR, filename)

      await fs.writeFile(filepath, svgData.svg)
      savedFiles.push({
        filename,
        filepath,
        ...svgData,
      })

      console.log(`   ✅ Saved: ${filename}`)
      console.log(`      Colors: ${svgData.fgColor} on ${svgData.bgColor}`)
      console.log(`      Modules: ${svgData.rectCount}`)
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
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1, color2) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const rsRGB = rgb.r / 255
    const gsRGB = rgb.g / 255
    const bsRGB = rgb.b / 255

    const r =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const g =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const b =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 0

  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Test SVG detectability
 */
async function testSVGDetectability(svgFile) {
  try {
    const svgContent = await fs.readFile(svgFile.filepath, 'utf-8')

    // Check basic QR structure
    const hasFinderPatterns =
      svgContent.includes('<rect') || svgContent.includes('<path')
    const moduleCount = (svgContent.match(/<rect|<path|<circle/g) || []).length
    const hasEnoughModules = moduleCount > 20 // QR codes have many modules

    // Check contrast
    let contrastRatio = 0
    let contrastStatus = 'unknown'

    if (svgFile.bgColor && svgFile.fgColor) {
      contrastRatio = getContrastRatio(svgFile.bgColor, svgFile.fgColor)

      if (contrastRatio >= 7) {
        contrastStatus = 'excellent'
      } else if (contrastRatio >= 4.5) {
        contrastStatus = 'good'
      } else if (contrastRatio >= 3) {
        contrastStatus = 'minimum'
      } else {
        contrastStatus = 'poor'
      }
    }

    // Determine detectability
    const isDetectable =
      hasFinderPatterns &&
      hasEnoughModules &&
      contrastRatio >= 3 &&
      svgFile.bgColor !== svgFile.fgColor

    return {
      filename: svgFile.filename,
      detectable: isDetectable,
      moduleCount,
      hasFinderPatterns,
      bgColor: svgFile.bgColor,
      fgColor: svgFile.fgColor,
      contrastRatio: contrastRatio.toFixed(2),
      contrastStatus,
      error: isDetectable
        ? null
        : contrastRatio < 3
          ? 'Insufficient contrast'
          : !hasEnoughModules
            ? 'Too few modules'
            : 'Invalid QR structure',
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
 * Generate HTML report
 */
async function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>E2E SVG Detectability Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      margin-top: 5px;
    }
    table {
      width: 100%;
      background: white;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .status-success {
      color: #10b981;
      font-weight: bold;
    }
    .status-error {
      color: #ef4444;
      font-weight: bold;
    }
    .contrast-excellent { color: #10b981; }
    .contrast-good { color: #3b82f6; }
    .contrast-minimum { color: #f59e0b; }
    .contrast-poor { color: #ef4444; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 E2E SVG Detectability Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="stat">
      <div class="stat-value">${results.length}</div>
      <div class="stat-label">Total QR Codes</div>
    </div>
    <div class="stat">
      <div class="stat-value">${results.filter((r) => r.detectable).length}</div>
      <div class="stat-label">Detectable</div>
    </div>
    <div class="stat">
      <div class="stat-value">${results.filter((r) => !r.detectable).length}</div>
      <div class="stat-label">Failed</div>
    </div>
    <div class="stat">
      <div class="stat-value">${(
        (results.filter((r) => r.detectable).length / results.length) *
        100
      ).toFixed(1)}%</div>
      <div class="stat-label">Success Rate</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>Status</th>
        <th>Modules</th>
        <th>Colors</th>
        <th>Contrast</th>
        <th>Error</th>
      </tr>
    </thead>
    <tbody>
      ${results
        .map(
          (r) => `
        <tr>
          <td>${r.filename}</td>
          <td class="${r.detectable ? 'status-success' : 'status-error'}">
            ${r.detectable ? '✅ Detectable' : '❌ Failed'}
          </td>
          <td>${r.moduleCount || '-'}</td>
          <td>${r.fgColor || '-'} / ${r.bgColor || '-'}</td>
          <td class="contrast-${r.contrastStatus}">
            ${r.contrastRatio || '-'} (${r.contrastStatus || '-'})
          </td>
          <td>${r.error || '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>
  `

  const reportPath = path.join(REPORTS_DIR, 'detectability-report.html')
  await fs.writeFile(reportPath, html)
  return reportPath
}

/**
 * Generate JSON report
 */
async function generateJSONReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    detectable: results.filter((r) => r.detectable).length,
    failed: results.filter((r) => !r.detectable).length,
    successRate: (
      (results.filter((r) => r.detectable).length / results.length) *
      100
    ).toFixed(1),
    details: results,
  }

  const reportPath = path.join(REPORTS_DIR, 'detectability-report.json')
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
  return reportPath
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 E2E SVG Detectability Test\n')
  console.log('='.repeat(60))

  // Create directories
  await ensureDirectories()

  // Start server
  console.log('\n🌐 Starting local server...')
  const server = await startServer()
  const serverUrl = 'http://localhost:8090'
  console.log(`✅ Server running at ${serverUrl}`)

  // Launch browser
  console.log('\n🌐 Launching browser...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    // Process each HTML file
    const allSVGs = []
    for (const htmlFile of HTML_FILES) {
      const svgs = await extractSVGsFromHTML(browser, htmlFile, serverUrl)
      allSVGs.push(...svgs)
    }

    console.log(`\n📊 Total SVGs extracted: ${allSVGs.length}`)

    // Test detectability of each SVG
    console.log('\n🔍 Testing detectability...')
    console.log('-'.repeat(60))

    const results = []
    for (const svg of allSVGs) {
      const result = await testSVGDetectability(svg)
      results.push(result)

      const status = result.detectable ? '✅' : '❌'
      const contrast = result.contrastRatio ? `(${result.contrastRatio}:1)` : ''
      console.log(
        `${status} ${result.filename.padEnd(40)} ${contrast.padEnd(10)} ${
          result.error || 'OK'
        }`
      )
    }

    // Generate reports
    console.log('\n📄 Generating reports...')
    const htmlReport = await generateHTMLReport(results)
    const jsonReport = await generateJSONReport(results)

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total SVGs tested: ${results.length}`)
    console.log(`✅ Detectable: ${results.filter((r) => r.detectable).length}`)
    console.log(`❌ Failed: ${results.filter((r) => !r.detectable).length}`)
    console.log(
      `Success Rate: ${(
        (results.filter((r) => r.detectable).length / results.length) *
        100
      ).toFixed(1)}%`
    )

    if (results.filter((r) => !r.detectable).length > 0) {
      console.log('\n⚠️  Failed SVGs:')
      results
        .filter((r) => !r.detectable)
        .forEach((r) => {
          console.log(`   - ${r.filename}: ${r.error}`)
        })
    }

    console.log('\n📁 Reports saved:')
    console.log(`   - ${htmlReport}`)
    console.log(`   - ${jsonReport}`)
  } catch (error) {
    console.error('❌ Error during testing:', error)
  } finally {
    // Cleanup
    await browser.close()
    server.kill()
    console.log('\n✨ Test complete!')
  }
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer')
} catch (error) {
  console.error('⚠️  Missing dependency: puppeteer')
  console.error('   Install with: npm install --save-dev puppeteer')
  process.exit(1)
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main }
