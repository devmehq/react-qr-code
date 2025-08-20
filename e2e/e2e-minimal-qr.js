// Test script to verify QR code generation
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const { ReactQrCode } = require('./dist/index.cjs.js')

// Create a simple QR code
const qrElement = React.createElement(ReactQrCode, {
  value: 'TEST',
  size: 256,
  fgColor: '#000000',
  bgColor: '#ffffff',
  level: 'L',
  renderAs: 'svg',
})

// Render to string
const svgString = ReactDOMServer.renderToString(qrElement)

// Analyze the output
console.log('SVG Output Analysis:')
console.log('===================')
console.log('Length:', svgString.length)
console.log('Has viewBox:', svgString.includes('viewBox'))
console.log(
  'Background color:',
  svgString.match(/fill="#([a-fA-F0-9]{6})"/)?.[1]
)

// Check for opacity issues
const opacityMatches = svgString.match(/opacity="([^"]*)"/g)
if (opacityMatches) {
  console.log('Opacity values found:', opacityMatches)
}

// Check for animation styles
if (svgString.includes('animation')) {
  console.log(
    'WARNING: Animation styles found - this might affect detectability!'
  )
}

// Count modules
const rectCount = (svgString.match(/<rect/g) || []).length
const pathCount = (svgString.match(/<path/g) || []).length
console.log('Rect elements:', rectCount)
console.log('Path elements:', pathCount)

// Save to file for inspection
const fs = require('fs')
fs.writeFileSync('test-minimal-output.svg', svgString)
console.log('\nSVG saved to test-minimal-output.svg')
