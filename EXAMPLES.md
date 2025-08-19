# Examples & Demos

## 🎮 Live Playground

Try out the library in your browser:

- [**CodeSandbox**](https://codesandbox.io/s/react-qr-code-demo-ccho5l) - Full interactive playground
- [**StackBlitz**](https://stackblitz.com/edit/react-qr-code-demo) - Instant online IDE

## 📂 Local Examples

The `/examples` directory contains comprehensive demonstrations of all features:

### 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/devmehq/react-qr-code.git
cd react-qr-code
yarn install
yarn build

# Serve examples (choose one)
npx http-server examples -o        # Using http-server
python3 -m http.server 8080 -d examples  # Using Python
php -S localhost:8080 -t examples  # Using PHP
```

### 📄 Available Example Pages

#### 1. **Main Interactive Demo** (`index.html`)
- Live customization controls
- Real-time preview
- Export functionality
- All basic options

#### 2. **Advanced Customization** (`advanced-demo.html`)
- 100+ QR code variations
- All shape combinations
- Gradient examples
- Pattern backgrounds
- Theme presets
- Logo integration

#### 3. **Simple Usage** (`simple-usage.html`)
- Basic implementation
- Common use cases
- Template examples (WiFi, vCard, etc.)
- Copy & paste code snippets

#### 4. **API Documentation** (`api-docs.html`)
- Complete props reference
- Method documentation
- TypeScript interfaces
- Hook examples

#### 5. **Detectability Test** (`qr-test.html`)
- Test QR code scanning
- Contrast validation
- Real-time detectability feedback
- Camera scanning test

## 🎨 Featured Examples

### Basic QR Code

```tsx
import { ReactQrCode } from '@devmehq/react-qr-code'

<ReactQrCode 
  value="https://example.com"
  size={256}
/>
```

### With Custom Styling

```tsx
import { AdvancedQRCode } from '@devmehq/react-qr-code'

<AdvancedQRCode
  value="https://example.com"
  size={300}
  eyeShape="rounded"
  bodyShape="circle"
  theme="ocean"
/>
```

### Gradient QR Code

```tsx
<AdvancedQRCode
  value="https://example.com"
  bodyGradient={{
    type: 'linear',
    colors: ['#667EEA', '#764BA2'],
    angle: 45
  }}
/>
```

### With Logo

```tsx
<AdvancedQRCode
  value="https://example.com"
  logo="/path/to/logo.png"
  logoSize={60}
  logoExcavate={true}
/>
```

### WiFi QR Code

```tsx
import { AdvancedQRCode, QRHelpers } from '@devmehq/react-qr-code'

<AdvancedQRCode
  value={QRHelpers.wifi('NetworkName', 'password123', 'WPA2')}
  theme="professional"
/>
```

### vCard Contact

```tsx
<AdvancedQRCode
  value={QRHelpers.vcard({
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    organization: 'ACME Corp'
  })}
  theme="elegant"
/>
```

## 🎭 Preset Themes

The library includes 25+ professionally designed themes:

### Minimal & Clean
- `minimal` - Clean black and white
- `monochrome` - Grayscale elegance
- `elegant` - Sophisticated style
- `professional` - Business ready

### Colorful & Vibrant
- `ocean` - Deep blue waves
- `sunset` - Warm orange/pink
- `forest` - Natural greens
- `rainbow` - Full spectrum
- `aurora` - Northern lights

### Tech & Modern
- `neon` - Bright cyber green
- `cyberpunk` - Tech noir
- `retrowave` - 80s aesthetic
- `gradient` - Modern gradients

### Nature & Earth
- `earth` - Natural browns
- `nature` - Green harmony
- `ice` - Cool blues
- `fire` - Hot reds

### Metallic
- `gold` - Luxurious gold
- `silver` - Sleek silver
- `bronze` - Warm bronze

### Special
- `cosmic` - Space theme
- `pastel` - Soft colors
- `dark` - Dark mode
- `colorful` - Vibrant mix
- `playful` - Fun and bright

## 🔧 Customization Options

### Eye (Finder Pattern) Shapes
- `square` - Classic square
- `circle` - Smooth circles
- `rounded` - Rounded corners
- `leaf` - Organic leaf
- `star` - Star shape
- `diamond` - Diamond cut
- `hexagon` - Six-sided
- `octagon` - Eight-sided
- `flower` - Floral design
- `cat` - Cat eyes

### Body (Data Module) Shapes
- `square` - Traditional pixels
- `circle` - Circular dots
- `rounded` - Soft corners
- `diamond` - Diamond shapes
- `star` - Star modules
- `hexagon` - Hexagonal
- `octagon` - Octagonal
- `triangle` - Triangular
- `cross` - Cross pattern
- `plus` - Plus signs
- `dots` - Dotted style
- `lines` - Linear pattern
- `zigzag` - Zigzag pattern
- `waves` - Wave pattern
- `noise` - Noise texture
- `circuit` - Circuit board
- `organic` - Organic shapes
- `fluid` - Fluid design

### Background Patterns
- `none` - Solid color
- `dots` - Dot pattern
- `lines` - Line pattern
- `grid` - Grid overlay
- `mesh` - Mesh texture
- `circuit` - Circuit design
- `waves` - Wave pattern
- `noise` - Noise texture
- `gradient` - Gradient fill
- `radial` - Radial pattern
- `hexagon` - Hex pattern
- `triangle` - Triangle pattern

## 📊 Performance Tips

1. **Use Canvas for Large QR Codes**
   ```tsx
   <ReactQrCode renderAs="canvas" size={512} />
   ```

2. **Enable Lazy Loading**
   ```tsx
   <AdvancedQRCode lazy={true} />
   ```

3. **Optimize Logo Images**
   - Use WebP or optimized PNG
   - Keep logos under 100KB
   - Use appropriate dimensions

4. **Batch Rendering**
   ```tsx
   // Render multiple QR codes efficiently
   const codes = data.map(item => (
     <AdvancedQRCode
       key={item.id}
       value={item.value}
       lazy={true}
     />
   ))
   ```

## 🧪 Testing Detectability

Use the `qr-test.html` page to:
1. Test QR code scanning with real devices
2. Validate contrast ratios
3. Check error correction levels
4. Verify logo doesn't interfere

### Recommended Contrast Ratios
- **Minimum**: 3:1
- **Recommended**: 7:1
- **Best**: 10:1+

## 📱 Mobile Optimization

```tsx
// Responsive QR codes
<AdvancedQRCode
  value="https://example.com"
  size={window.innerWidth < 768 ? 200 : 300}
/>
```

## 🎯 Common Use Cases

### Event Tickets
```tsx
<AdvancedQRCode
  value={`TICKET:${eventId}:${userId}`}
  theme="elegant"
  enableDownload={true}
/>
```

### Product Labels
```tsx
<AdvancedQRCode
  value={`PRODUCT:${sku}:${batch}`}
  theme="minimal"
  size={150}
/>
```

### Restaurant Menus
```tsx
<AdvancedQRCode
  value="https://restaurant.com/menu"
  theme="professional"
  logo="/restaurant-logo.png"
/>
```

### Social Media
```tsx
<AdvancedQRCode
  value={`instagram://user?username=${username}`}
  theme="gradient"
/>
```

## 🔗 Resources

- [GitHub Repository](https://github.com/devmehq/react-qr-code)
- [NPM Package](https://www.npmjs.com/package/@devmehq/react-qr-code)
- [Issue Tracker](https://github.com/devmehq/react-qr-code/issues)
- [Discussions](https://github.com/devmehq/react-qr-code/discussions)