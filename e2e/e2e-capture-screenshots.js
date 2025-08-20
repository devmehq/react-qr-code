#!/usr/bin/env node

const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs').promises

const SERVER_URL = 'http://127.0.0.1:8080'
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')
const EXAMPLES_DIR = path.join(__dirname, '..', 'examples')

const PAGES_TO_CAPTURE = [
  {
    url: 'index.html',
    name: 'main-demo',
    selectors: ['#root'],
    description: 'Main demo with interactive controls',
  },
  {
    url: 'advanced-demo.html',
    name: 'advanced-demo',
    selectors: ['body'],
    viewport: { width: 1920, height: 1080 },
    description: 'Advanced customization examples',
  },
  {
    url: 'simple-usage.html',
    name: 'simple-usage',
    selectors: ['body'],
    description: 'Simple usage examples',
  },
  {
    url: 'qr-test.html',
    name: 'qr-test',
    selectors: ['body'],
    description: 'QR code detectability test',
  },
  {
    url: 'api-docs.html',
    name: 'api-docs',
    selectors: ['body'],
    viewport: { width: 1920, height: 1080 },
    description: 'API documentation',
  },
]

async function captureScreenshots() {
  console.log('📸 E2E Screenshot Capture Tool')
  console.log('==============================\n')

  // Create screenshots directory in e2e folder
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true })
  console.log(`📁 Created screenshots directory: ${SCREENSHOTS_DIR}\n`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    // Start a local server from examples directory
    console.log('🌐 Starting local server...')
    const { exec } = require('child_process')
    const serverProcess = exec(
      `cd ${EXAMPLES_DIR} && npx http-server . -p 8080`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Server error: ${error}`)
        }
      }
    )

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('✅ Server started on http://127.0.0.1:8080\n')

    // Capture each page
    for (const pageConfig of PAGES_TO_CAPTURE) {
      const page = await browser.newPage()

      if (pageConfig.viewport) {
        await page.setViewport(pageConfig.viewport)
      } else {
        await page.setViewport({ width: 1280, height: 800 })
      }

      const url = `${SERVER_URL}/${pageConfig.url}`
      console.log(`📸 Capturing: ${pageConfig.name}`)
      console.log(`   URL: ${url}`)
      console.log(`   Description: ${pageConfig.description}`)

      await page.goto(url, { waitUntil: 'networkidle2' })
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Capture full page
      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        `${pageConfig.name}.png`
      )
      await page.screenshot({ path: screenshotPath, fullPage: true })
      console.log(`   ✅ Full page saved: ${screenshotPath}`)

      // Also capture specific elements if provided
      if (pageConfig.selectors) {
        for (const selector of pageConfig.selectors) {
          try {
            const element = await page.$(selector)
            if (element) {
              const elementScreenshotPath = path.join(
                SCREENSHOTS_DIR,
                `${pageConfig.name}-element.png`
              )
              await element.screenshot({ path: elementScreenshotPath })
              console.log(`   ✅ Element saved: ${elementScreenshotPath}`)
            }
          } catch (err) {
            console.log(`   ⚠️  Could not capture ${selector}`)
          }
        }
      }

      console.log('')
      await page.close()
    }

    // Capture individual QR code examples
    console.log('📸 Capturing individual QR code examples...')
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(`${SERVER_URL}/advanced-demo.html`, {
      waitUntil: 'networkidle2',
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Capture specific QR code examples
    const examples = [
      { selector: '#basic-example svg', name: 'qr-basic' },
      { selector: '#gradient-example svg', name: 'qr-gradient' },
      { selector: '#circle-modules svg', name: 'qr-circle' },
      { selector: '#diamond-modules svg', name: 'qr-diamond' },
      { selector: '#rounded-modules svg', name: 'qr-rounded' },
      { selector: '#logo-example svg', name: 'qr-logo' },
      { selector: '#neon-example svg', name: 'qr-neon' },
      { selector: '#ocean-example svg', name: 'qr-ocean' },
    ]

    for (const example of examples) {
      try {
        const element = await page.$(example.selector)
        if (element) {
          const screenshotPath = path.join(
            SCREENSHOTS_DIR,
            `${example.name}.png`
          )
          await element.screenshot({ path: screenshotPath })
          console.log(`   ✅ Saved QR: ${screenshotPath}`)
        }
      } catch (err) {
        console.log(`   ⚠️  Could not capture ${example.name}`)
      }
    }

    await page.close()

    // Kill the server process
    serverProcess.kill()

    console.log('\n✨ Screenshots captured successfully!')
    console.log(`📁 All screenshots saved to: ${SCREENSHOTS_DIR}`)

    // Generate summary
    const files = await fs.readdir(SCREENSHOTS_DIR)
    console.log(`\n📊 Summary:`)
    console.log(`   Total files: ${files.length}`)
    console.log(`   Pages captured: ${PAGES_TO_CAPTURE.length}`)
    console.log(`   QR examples: ${examples.length}`)
  } finally {
    await browser.close()
  }
}

// Run if called directly
if (require.main === module) {
  captureScreenshots().catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
}

module.exports = { captureScreenshots }
