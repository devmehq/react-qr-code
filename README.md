# @devmehq/react-qr-code

🎯 Simple & Advanced React component to generate [QR codes](http://en.wikipedia.org/wiki/QR_code) with custom styling, multiple render formats, and image embedding support.

[![NPM version](https://badgen.net/npm/v/@devmehq/react-qr-code)](https://npm.im/@devmehq/react-qr-code)
[![Build Status](https://github.com/devmehq/react-qr-code/workflows/CI/badge.svg)](https://github.com/devmehq/react-qr-code/actions)
[![Downloads](https://img.shields.io/npm/dm/@devmehq/react-qr-code.svg)](https://www.npmjs.com/package/@devmehq/react-qr-code)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/@devmehq/react-qr-code)](https://bundlephobia.com/package/@devmehq/react-qr-code)
[![License](https://badgen.net/npm/license/@devmehq/react-qr-code)](https://github.com/devmehq/react-qr-code/blob/master/LICENSE.md)
[![UNPKG](https://img.shields.io/badge/UNPKG-OK-179BD7.svg)](https://unpkg.com/browse/@devmehq/react-qr-code@latest/)

[![Edit react-qr-code-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-qr-code-demo-ccho5l?fontsize=14&hidenavigation=1&theme=dark)

## ✨ Features

- 🎨 **Customizable**: Colors, sizes, margins, and styles
- 🖼️ **Multiple Formats**: Render as SVG or Canvas
- 📱 **Responsive**: Scales perfectly on all devices
- 🏞️ **Image Embedding**: Add logos or images to QR codes
- 🛡️ **Error Correction**: Four levels (L, M, Q, H)
- 📦 **Lightweight**: Zero dependencies, small bundle size
- 🔧 **TypeScript**: Full TypeScript support
- ⚡ **Performance**: Optimized rendering with React hooks
## 📦 Installation

```bash
# Using npm
npm install @devmehq/react-qr-code

# Using yarn
yarn add @devmehq/react-qr-code

# Using pnpm
pnpm add @devmehq/react-qr-code
```

## 🚀 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function App() {
  return (
    <ReactQrCode value="https://github.com/devmehq/react-qr-code" />
  );
}
```

### With Custom Styling

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function StyledQRCode() {
  return (
    <ReactQrCode
      value="https://your-website.com"
      size={300}
      bgColor="#f3f4f6"
      fgColor="#1f2937"
      level="H"
      marginSize={4}
      style={{ borderRadius: '8px' }}
      className="shadow-lg"
    />
  );
}
```

### Canvas Rendering

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function CanvasQRCode() {
  return (
    <ReactQrCode
      value="https://your-website.com"
      renderAs="canvas"
      size={256}
    />
  );
}
```

### With Logo/Image

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function QRCodeWithLogo() {
  return (
    <ReactQrCode
      value="https://your-website.com"
      size={256}
      images={[
        {
          src: '/logo.png',
          height: 50,
          width: 50,
          excavate: true,
        },
      ]}
    />
  );
}
```

## 📖 API Reference

### ReactQrCode Props

| Prop         | Type                         | Default       | Description                                          |
|--------------|------------------------------|---------------|------------------------------------------------------|
| `value`      | `string`                     | **Required**  | The value to encode in the QR code                  |
| `renderAs`   | `'svg' \| 'canvas'`          | `'svg'`       | Render format (SVG or Canvas)                       |
| `size`       | `number`                     | `256`         | Size of the QR code in pixels                       |
| `bgColor`    | `string`                     | `'#ffffff'`   | Background color (CSS color value)                  |
| `fgColor`    | `string`                     | `'#000000'`   | Foreground color (CSS color value)                  |
| `level`      | `'L' \| 'M' \| 'Q' \| 'H'`   | `'L'`         | Error correction level                              |
| `marginSize` | `number`                     | `0`           | Margin around the QR code in pixels                 |
| `style`      | `CSSProperties`              | `undefined`   | React style object                                  |
| `className`  | `string`                     | `undefined`   | CSS class name                                      |
| `title`      | `string`                     | `undefined`   | Title for SVG accessibility                         |
| `id`         | `string`                     | `undefined`   | HTML id attribute                                   |
| `images`     | `ReactQrCodeImageProps[]`    | `undefined`   | Array of images to embed in the QR code             |

### ReactQrCodeImageProps

| Property   | Type      | Default           | Description                                    |
|------------|-----------|-------------------|------------------------------------------------|
| `src`      | `string`  | **Required**      | Image source URL                              |
| `x`        | `number`  | Auto-centered     | X position of the image                       |
| `y`        | `number`  | Auto-centered     | Y position of the image                       |
| `height`   | `number`  | 10% of QR size    | Height of the image                           |
| `width`    | `number`  | 10% of QR size    | Width of the image                            |
| `excavate` | `boolean` | `false`           | Whether to clear QR modules behind the image  |

### Error Correction Levels

| Level | Error Correction | Data Capacity |
|-------|-----------------|---------------|
| `L`   | ~7%             | High          |
| `M`   | ~15%            | Medium        |
| `Q`   | ~25%            | Medium-Low    |
| `H`   | ~30%            | Low           |

## 🎨 Styling & Customization

### Responsive Design

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function ResponsiveQRCode() {
  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <ReactQrCode
        value="https://your-website.com"
        size={256}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
```

### Dark Mode Support

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';

function DarkModeQRCode({ isDarkMode }) {
  return (
    <ReactQrCode
      value="https://your-website.com"
      bgColor={isDarkMode ? '#1f2937' : '#ffffff'}
      fgColor={isDarkMode ? '#f3f4f6' : '#000000'}
    />
  );
}
```

### Custom CSS Classes

```tsx
import React from 'react';
import { ReactQrCode } from '@devmehq/react-qr-code';
import './styles.css';

function CustomStyledQRCode() {
  return (
    <ReactQrCode
      value="https://your-website.com"
      className="qr-code-custom"
      size={300}
    />
  );
}
```

```css
/* styles.css */
.qr-code-custom {
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Note:** When using `renderAs="canvas"` on high-density displays, the canvas is scaled for pixel-perfect rendering. Custom styles are merged with internal scaling styles.

## 💡 Use Cases

### WiFi Password Sharing

```tsx
function WiFiQRCode({ ssid, password, security = 'WPA' }) {
  const wifiString = `WIFI:T:${security};S:${ssid};P:${password};;`;
  
  return (
    <ReactQrCode
      value={wifiString}
      size={256}
      level="H"
    />
  );
}
```

### Contact Information (vCard)

```tsx
function ContactQRCode({ name, phone, email }) {
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;
  
  return (
    <ReactQrCode
      value={vCard}
      size={256}
      level="M"
    />
  );
}
```

### Two-Factor Authentication

```tsx
function TwoFactorQRCode({ secret, issuer, accountName }) {
  const otpauth = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
  
  return (
    <ReactQrCode
      value={otpauth}
      size={256}
      level="H"
      images={[
        {
          src: '/logo.png',
          height: 40,
          width: 40,
          excavate: true,
        },
      ]}
    />
  );
}
```

### Payment Links

```tsx
function PaymentQRCode({ amount, recipient, currency = 'USD' }) {
  const paymentLink = `https://pay.example.com/?to=${recipient}&amount=${amount}&currency=${currency}`;
  
  return (
    <ReactQrCode
      value={paymentLink}
      size={300}
      level="H"
      marginSize={4}
    />
  );
}
```

<img src="https://github.com/devmehq/react-qr-code/raw/master/examples/qrcode-demo.png" alt="qrcode-demo">


## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

## 🔧 Development

```bash
# Install dependencies
yarn install

# Build the library
yarn build

# Run linting
yarn lint-js

# Format code
yarn prettier
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Roadmap

- [ ] Download QR code as image (PNG/JPEG/SVG)
- [ ] Share QR code functionality
- [ ] Server-side rendering (SSR) support
- [ ] Corner dot customization
- [ ] Gradient color support
- [ ] Custom shape modules (dots, rounded, etc.)
- [ ] Animation support
- [ ] Batch QR code generation
- [ ] QR code scanner component

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgments

- QR Code is a registered trademark of DENSO WAVE INCORPORATED
- Built with ❤️ by the [DEV.ME](https://dev.me) team
- Inspired by the QR code specification and community feedback

## 📧 Support

For support, email support@dev.me or open an issue on [GitHub](https://github.com/devmehq/react-qr-code/issues).

---

<div align="center">
  Made with ❤️ by <a href="https://dev.me">DEV.ME</a>
</div>
