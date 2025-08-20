# Release Notes - v2.0.0

## 🚀 React QR Code v2.0 - The Most Advanced QR Code Generator for React

We're thrilled to announce the release of React QR Code v2.0, a complete reimagination of what a QR code library can be. This major release transforms the library into the most powerful and customizable QR code generator available for React applications.

## 🎯 Key Highlights

### 🎨 100+ Customization Options

Transform boring black and white QR codes into stunning visual elements that match your brand:

- **25+ professionally designed preset themes**
- **12+ eye shapes** and **18+ body shapes**
- **Advanced gradients** including linear, radial, conic, and mesh
- **Animated effects** with particle systems

### 🧩 New Advanced Component

```tsx
<AdvancedQRCode
  value="https://your-site.com"
  theme="ocean"
  eyeShape="rounded"
  bodyShape="circle"
  enableDownload={true}
/>
```

### 📱 QR Code Templates

Generate specialized QR codes with built-in helpers:

```tsx
// WiFi auto-connect
<AdvancedQRCode value={QRHelpers.wifi('Network', 'pass123', 'WPA2')} />

// Contact card
<AdvancedQRCode value={QRHelpers.vcard({ name: 'John', phone: '+1234567890' })} />

// Calendar event
<AdvancedQRCode value={QRHelpers.event({ summary: 'Meeting', startDate: new Date() })} />
```

### ♿ Accessibility First

- **Color blind modes** for all types of color vision deficiency
- **High contrast mode** ensuring 7:1+ contrast ratios
- **Full ARIA support** with keyboard navigation

### 🚀 Performance Improvements

- **50% faster** generation with optimized algorithms
- **30% smaller** bundle size with tree-shaking
- **React 18** concurrent features support
- **Lazy loading** for advanced features

## 📦 Installation

```bash
npm install @devmehq/react-qr-code@2.0.0
# or
yarn add @devmehq/react-qr-code@2.0.0
```

## 🔄 Migration from v1.x

### No Breaking Changes for Basic Usage

```tsx
// This still works exactly as before!
<ReactQrCode value="https://example.com" />
```

### Enhanced with New Features

```tsx
// Use the new advanced component for more options
<AdvancedQRCode
  value="https://example.com"
  theme="gradient"
  eyeShape="star"
  bodyShape="diamond"
/>
```

## 🎮 Try It Now

- **[Live Demo on CodeSandbox](https://codesandbox.io/s/react-qr-code-demo)**
- **[Interactive Playground](https://stackblitz.com/edit/react-qr-code-demo)**
- **[Examples Gallery](https://github.com/devmehq/react-qr-code/tree/main/examples)**

## 📸 Visual Examples

### Preset Themes

| Minimal   | Ocean      | Sunset         | Neon        |
| --------- | ---------- | -------------- | ----------- |
| Clean B&W | Deep blues | Warm gradients | Cyber green |

### Custom Shapes

| Circle      | Diamond      | Star           | Fluid        |
| ----------- | ------------ | -------------- | ------------ |
| Smooth dots | Sharp angles | Stellar design | Organic flow |

## 🧪 What's Been Tested

- ✅ **119 unit tests** with 100% coverage
- ✅ **E2E detectability tests** with real QR scanners
- ✅ **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile scanning** (iOS Camera, Android Camera, QR apps)
- ✅ **Accessibility testing** with screen readers

## 🎉 Community Contributions

This release wouldn't have been possible without the amazing feedback from our community:

- Special thanks for detectability testing and contrast ratio feedback
- UI/UX suggestions that shaped the preset themes
- Performance optimization ideas
- Accessibility requirements and testing

## 📚 Resources

- **[Full Documentation](https://github.com/devmehq/react-qr-code#readme)**
- **[API Reference](https://github.com/devmehq/react-qr-code/blob/main/API.md)**
- **[Migration Guide](https://github.com/devmehq/react-qr-code/blob/main/MIGRATION.md)**
- **[Examples](https://github.com/devmehq/react-qr-code/tree/main/examples)**

## 🐛 Report Issues

Found a bug or have a feature request? Please let us know:

- **[GitHub Issues](https://github.com/devmehq/react-qr-code/issues)**
- **[Discussions](https://github.com/devmehq/react-qr-code/discussions)**

## 🙏 Thank You

Thank you for using React QR Code! We're excited to see what amazing QR codes you'll create with v2.0.

Happy coding! 🎨✨

---

**The React QR Code Team**  
[DEV.ME](https://dev.me)
