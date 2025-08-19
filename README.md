# @devmehq/react-qr-code

The most powerful and customizable React component for generating QR codes. Built with TypeScript, offering extensive features including custom shapes, gradients, logos, templates, and more.

[![NPM version](https://badgen.net/npm/v/@devmehq/react-qr-code)](https://npm.im/@devmehq/react-qr-code)
[![Build Status](https://github.com/devmehq/react-qr-code/workflows/CI/badge.svg)](https://github.com/devmehq/react-qr-code/actions)
[![Downloads](https://img.shields.io/npm/dm/@devmehq/react-qr-code.svg)](https://www.npmjs.com/package/@devmehq/react-qr-code)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@devmehq/react-qr-code)](https://bundlephobia.com/package/@devmehq/react-qr-code)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Edit react-qr-code-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-qr-code-demo-ccho5l?fontsize=14&hidenavigation=1&theme=dark)

## ✨ Features

- 🎨 **Custom Shapes** - Square, circle, rounded, diamond, star modules
- 🌈 **Gradient Support** - Linear and radial gradients for modules and backgrounds
- 🖼️ **Logo Embedding** - Add logos/images with excavation support
- 📱 **QR Templates** - WiFi, vCard, SMS, Email, Crypto, and more
- 🎯 **Canvas & SVG** - Both rendering modes supported
- 💾 **Download & Copy** - Built-in download and clipboard functionality
- ♿ **Accessibility** - Full ARIA support and keyboard navigation
- 🚀 **Performance** - Memoization, lazy loading, and debouncing
- 📏 **TypeScript** - Full type safety and IntelliSense
- 🎭 **Animations** - Smooth fade-in animations
- 🛡️ **Error Handling** - Comprehensive validation and error states
- 📦 **Tree-Shakable** - Optimized bundle size with ESM support

## 📦 Installation

```bash
npm install @devmehq/react-qr-code
# or
yarn add @devmehq/react-qr-code
# or
pnpm add @devmehq/react-qr-code
```

## 🚀 Quick Start

```tsx
import React from 'react'
import { ReactQrCode } from '@devmehq/react-qr-code'

function App() {
  return (
    <ReactQrCode
      value="https://github.com/devmehq/react-qr-code"
      size={256}
      level="H"
    />
  )
}
```

## 📖 API Reference

### Props

| Prop              | Type                       | Default     | Description               |
| ----------------- | -------------------------- | ----------- | ------------------------- |
| `value`           | `string \| QRDataType`     | -           | The data to encode        |
| `size`            | `number`                   | `256`       | Size of the QR code       |
| `level`           | `'L' \| 'M' \| 'Q' \| 'H'` | `'L'`       | Error correction level    |
| `bgColor`         | `string`                   | `'#ffffff'` | Background color          |
| `fgColor`         | `string`                   | `'#000000'` | Foreground color          |
| `renderAs`        | `'svg' \| 'canvas'`        | `'svg'`     | Render mode               |
| `marginSize`      | `number`                   | `0`         | Margin around QR code     |
| `qrStyle`         | `QRCodeStyle`              | -           | Advanced styling options  |
| `imageSettings`   | `ImageSettings`            | -           | Logo/image configuration  |
| `style`           | `CSSProperties`            | -           | React style object        |
| `className`       | `string`                   | -           | CSS class name            |
| `title`           | `string`                   | -           | SVG title element         |
| `enableDownload`  | `boolean`                  | `false`     | Enable click to download  |
| `downloadOptions` | `DownloadOptions`          | -           | Download configuration    |
| `animated`        | `boolean`                  | `false`     | Enable animations         |
| `lazy`            | `boolean`                  | `false`     | Enable lazy loading       |
| `onLoad`          | `() => void`               | -           | Called when QR code loads |
| `onError`         | `(error: Error) => void`   | -           | Error handler             |

## 🎨 Advanced Examples

### Custom Shapes and Colors

```tsx
<ReactQrCode
  value="https://example.com"
  size={256}
  qrStyle={{
    module: {
      shape: 'circle',
      color: '#4F46E5',
    },
    corner: {
      shape: 'rounded',
      color: '#7C3AED',
    },
    background: {
      color: '#F3F4F6',
    },
  }}
/>
```

### Gradient QR Code

```tsx
<ReactQrCode
  value="https://example.com"
  qrStyle={{
    module: {
      color: {
        type: 'linear',
        colors: ['#667EEA', '#764BA2'],
        angle: 45,
      },
    },
    background: {
      color: {
        type: 'radial',
        colors: ['#F3F4F6', '#E5E7EB'],
      },
    },
  }}
/>
```

### With Logo

```tsx
<ReactQrCode
  value="https://example.com"
  imageSettings={{
    src: '/logo.png',
    width: 60,
    height: 60,
    excavate: true,
    opacity: 1,
  }}
/>
```

### WiFi QR Code

```tsx
import { ReactQrCode, QRHelpers } from '@devmehq/react-qr-code'

;<ReactQrCode
  value={QRHelpers.wifi('MyNetwork', 'password123', 'WPA2', false)}
  size={256}
/>
```

### vCard Contact

```tsx
<ReactQrCode
  value={QRHelpers.vcard({
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    organization: 'ACME Corp',
    url: 'https://example.com',
  })}
/>
```

### Crypto Payment

```tsx
// Bitcoin
<ReactQrCode
  value={QRHelpers.bitcoin('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 0.001, 'Donation')}
/>

// Ethereum
<ReactQrCode
  value={QRHelpers.ethereum('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8', 0.01)}
/>
```

### Downloadable QR Code

```tsx
<ReactQrCode
  value="https://example.com"
  enableDownload={true}
  downloadOptions={{
    filename: 'my-qr-code',
    format: 'png',
    quality: 0.95,
    scale: 2,
  }}
/>
```

### With Animation

```tsx
<ReactQrCode
  value="https://example.com"
  animated={true}
  animationDuration={500}
  animationDelay={100}
/>
```

### Using Ref Methods

```tsx
import { useRef } from 'react'
import { ReactQrCode, QRCodeRef } from '@devmehq/react-qr-code'

function App() {
  const qrRef = useRef<QRCodeRef>(null)

  const handleDownload = async () => {
    await qrRef.current?.download({
      filename: 'qrcode',
      format: 'png',
      quality: 0.95,
    })
  }

  const handleCopy = async () => {
    await qrRef.current?.copy()
  }

  const getDataURL = async () => {
    const dataURL = await qrRef.current?.getDataURL('png', 0.95)
    console.log(dataURL)
  }

  return (
    <>
      <ReactQrCode ref={qrRef} value="https://example.com" />
      <button onClick={handleDownload}>Download</button>
      <button onClick={handleCopy}>Copy to Clipboard</button>
      <button onClick={getDataURL}>Get Data URL</button>
    </>
  )
}
```

## 📱 QR Code Templates

The library includes helper functions for common QR code types:

```tsx
import { QRHelpers } from '@devmehq/react-qr-code'

// WiFi
QRHelpers.wifi(ssid, password, security, hidden)

// vCard Contact
QRHelpers.vcard({
  firstName,
  lastName,
  phone,
  email,
  organization,
  url,
  address,
})

// SMS
QRHelpers.sms(phone, message)

// Email
QRHelpers.email(to, subject, body, cc, bcc)

// Geo Location
QRHelpers.geo(latitude, longitude, altitude)

// Calendar Event
QRHelpers.event({ summary, startDate, endDate, location, description })

// Phone
QRHelpers.phone(number)

// Bitcoin
QRHelpers.bitcoin(address, amount, label, message)

// Ethereum
QRHelpers.ethereum(address, amount, gas)

// URL
QRHelpers.url(url)

// Plain Text
QRHelpers.text(text)
```

## 🎯 TypeScript Support

The library is fully typed. Import types as needed:

```tsx
import type {
  ReactQrCodeProps,
  QRCodeRef,
  ErrorCorrectionLevel,
  ModuleShape,
  ImageSettings,
  QRCodeStyle,
  WiFiData,
  VCardData,
  // ... and more
} from '@devmehq/react-qr-code'
```

## ⚡ Performance Tips

1. **Use Memoization**: The component uses React.memo and useMemo internally
2. **Lazy Loading**: Enable `lazy={true}` for off-screen QR codes
3. **Debouncing**: Use `debounceMs` for frequently changing values
4. **Canvas for Large QR**: Use `renderAs="canvas"` for better performance with large sizes
5. **Optimize Images**: Use optimized images for logos to reduce load time

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

## 📊 Bundle Size

- **ESM**: ~15KB minified + gzipped
- **Tree-shakable**: Import only what you need
- **Zero dependencies**: Only React as peer dependency

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone the repo
git clone https://github.com/devmehq/react-qr-code.git

# Install dependencies
yarn install

# Run tests
yarn test

# Build
yarn build

# Run in watch mode
yarn build:watch
```

## 📄 License

MIT © [DEV.ME](https://dev.me)

## 🙏 Credits

Built with ❤️ by the [DEV.ME](https://dev.me) team.

## 🔗 Links

- [Documentation](https://github.com/devmehq/react-qr-code#readme)
- [NPM Package](https://www.npmjs.com/package/@devmehq/react-qr-code)
- [GitHub Repository](https://github.com/devmehq/react-qr-code)
- [Bug Reports](https://github.com/devmehq/react-qr-code/issues)
- [Feature Requests](https://github.com/devmehq/react-qr-code/issues)

---

<div align="center">
  <img src="https://github.com/devmehq/react-qr-code/raw/master/examples/qrcode-demo.png" alt="QR Code Demo" width="200">
  
  **Scan to visit our GitHub!**
</div>
