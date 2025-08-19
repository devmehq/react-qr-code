const { ReactQrCode, AdvancedQRCode, QRHelpers, PRESET_THEMES } = window.ReactQrCode;

// Code highlighting component
const CodeBlock = ({ children, language = 'javascript' }) => (
  <div className="code-section">
    <pre><code className={`language-${language}`}>{children}</code></pre>
  </div>
);

// Demo card component
const DemoCard = ({ title, description, badge, children, code }) => (
  <div className="qr-card fade-in">
    {badge && <div className="feature-badge">{badge}</div>}
    <h4 style={{ marginBottom: '15px', color: '#333' }}>{title}</h4>
    {description && <p style={{ color: '#666', marginBottom: '20px' }}>{description}</p>}
    <div className="qr-display">
      {children}
    </div>
    {code && <CodeBlock>{code}</CodeBlock>}
  </div>
);

// Basic Examples Section
const BasicExamples = () => (
  <div id="basic" className="container">
    <h2 className="section-title">✨ Basic Examples</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="Default QR Code"
        description="Simple QR code with default styling"
        badge="Basic"
        code={`<ReactQrCode 
  value="https://github.com/devmehq/react-qr-code"
  size={200}
/>`}
      >
        <ReactQrCode 
          value="https://github.com/devmehq/react-qr-code"
          size={200}
        />
      </DemoCard>

      <DemoCard 
        title="Custom Colors"
        description="QR code with custom foreground and background colors"
        badge="Colors"
        code={`<ReactQrCode 
  value="Custom Colors Demo"
  size={200}
  bgColor="#667eea"
  fgColor="#ffffff"
/>`}
      >
        <ReactQrCode 
          value="Custom Colors Demo"
          size={200}
          bgColor="#667eea"
          fgColor="#ffffff"
        />
      </DemoCard>

      <DemoCard 
        title="With Logo"
        description="QR code with embedded logo image"
        badge="Logo"
        code={`<ReactQrCode 
  value="https://react.dev"
  size={200}
  imageSettings={{
    src: "https://react.dev/favicon.ico",
    width: 30,
    height: 30,
    excavate: true
  }}
/>`}
      >
        <ReactQrCode 
          value="https://react.dev"
          size={200}
          imageSettings={{
            src: "https://react.dev/favicon.ico",
            width: 30,
            height: 30,
            excavate: true
          }}
        />
      </DemoCard>

    </div>
  </div>
);

// Eye Customization Examples
const EyeExamples = () => (
  <div id="eyes" className="container">
    <h2 className="section-title">👁️ Eye Customization</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="Circle Eyes"
        description="Rounded eye shapes with custom colors"
        badge="Shapes"
        code={`<AdvancedQRCode 
  value="Circle Eyes Demo"
  size={200}
  advancedStyle={{
    eyes: {
      frameShape: 'circle',
      pupilShape: 'circle',
      frameColor: '#ff6b6b',
      pupilColor: '#4ecdc4'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Circle Eyes Demo"
          size={200}
          advancedStyle={{
            eyes: {
              frameShape: 'circle',
              pupilShape: 'circle',
              frameColor: '#ff6b6b',
              pupilColor: '#4ecdc4'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Star Eyes"
        description="Star-shaped eyes with glow effects"
        badge="Effects"
        code={`<AdvancedQRCode 
  value="Star Eyes Demo"
  size={200}
  advancedStyle={{
    eyes: {
      frameShape: 'star',
      pupilShape: 'star',
      frameColor: '#f39c12',
      pupilColor: '#e74c3c',
      frameEffect: 'glow',
      pupilEffect: 'shadow'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Star Eyes Demo"
          size={200}
          advancedStyle={{
            eyes: {
              frameShape: 'star',
              pupilShape: 'star',
              frameColor: '#f39c12',
              pupilColor: '#e74c3c',
              frameEffect: 'glow',
              pupilEffect: 'shadow'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Gradient Eyes"
        description="Eyes with linear gradient colors"
        badge="Gradients"
        code={`<AdvancedQRCode 
  value="Gradient Eyes Demo"
  size={200}
  advancedStyle={{
    eyes: {
      frameShape: 'flower',
      pupilShape: 'heart',
      frameColor: {
        type: 'linear',
        colors: [
          { color: '#667eea', offset: 0 },
          { color: '#764ba2', offset: 1 }
        ],
        angle: 45
      },
      pupilColor: '#fff'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Gradient Eyes Demo"
          size={200}
          advancedStyle={{
            eyes: {
              frameShape: 'flower',
              pupilShape: 'heart',
              frameColor: {
                type: 'linear',
                colors: [
                  { color: '#667eea', offset: 0 },
                  { color: '#764ba2', offset: 1 }
                ],
                angle: 45
              },
              pupilColor: '#fff'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Position-Specific Eyes"
        description="Different eye design for each position"
        badge="Advanced"
        code={`<AdvancedQRCode 
  value="Position-Specific Eyes"
  size={200}
  advancedStyle={{
    eyes: {
      topLeft: {
        frameShape: 'leaf',
        pupilShape: 'circle',
        frameColor: '#27ae60',
        pupilColor: '#2ecc71'
      },
      topRight: {
        frameShape: 'diamond',
        pupilShape: 'diamond',
        frameColor: '#3498db',
        pupilColor: '#2980b9'
      },
      bottomLeft: {
        frameShape: 'hexagon',
        pupilShape: 'hexagon',
        frameColor: '#9b59b6',
        pupilColor: '#8e44ad'
      }
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Position-Specific Eyes"
          size={200}
          advancedStyle={{
            eyes: {
              topLeft: {
                frameShape: 'leaf',
                pupilShape: 'circle',
                frameColor: '#27ae60',
                pupilColor: '#2ecc71'
              },
              topRight: {
                frameShape: 'diamond',
                pupilShape: 'diamond',
                frameColor: '#3498db',
                pupilColor: '#2980b9'
              },
              bottomLeft: {
                frameShape: 'hexagon',
                pupilShape: 'hexagon',
                frameColor: '#9b59b6',
                pupilColor: '#8e44ad'
              }
            }
          }}
        />
      </DemoCard>

    </div>
  </div>
);

// Body Customization Examples
const BodyExamples = () => (
  <div id="body" className="container">
    <h2 className="section-title">🎯 Body Customization</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="Circle Body"
        description="Circular body modules with reduced density"
        badge="Shapes"
        code={`<AdvancedQRCode 
  value="Circle Body Demo"
  size={200}
  advancedStyle={{
    body: {
      shape: 'circle',
      color: '#e74c3c',
      density: 0.9
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Circle Body Demo"
          size={200}
          advancedStyle={{
            body: {
              shape: 'circle',
              color: '#e74c3c',
              density: 0.9
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Diamond Pattern"
        description="Diamond-shaped modules with alternating colors"
        badge="Patterns"
        code={`<AdvancedQRCode 
  value="Diamond Pattern Demo"
  size={200}
  advancedStyle={{
    body: {
      shape: 'diamond',
      pattern: {
        type: 'alternating',
        colors: ['#3498db', '#2ecc71', '#e74c3c']
      },
      gap: 1
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Diamond Pattern Demo"
          size={200}
          advancedStyle={{
            body: {
              shape: 'diamond',
              pattern: {
                type: 'alternating',
                colors: ['#3498db', '#2ecc71', '#e74c3c']
              },
              gap: 1
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Fluid Connection"
        description="Organic flowing connections between modules"
        badge="Fluid"
        code={`<AdvancedQRCode 
  value="Fluid Connection Demo"
  size={200}
  advancedStyle={{
    body: {
      shape: 'fluid',
      color: {
        type: 'linear',
        colors: [
          { color: '#667eea', offset: 0 },
          { color: '#764ba2', offset: 1 }
        ],
        angle: 90
      }
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Fluid Connection Demo"
          size={200}
          advancedStyle={{
            body: {
              shape: 'fluid',
              color: {
                type: 'linear',
                colors: [
                  { color: '#667eea', offset: 0 },
                  { color: '#764ba2', offset: 1 }
                ],
                angle: 90
              }
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Hexagon Mosaic"
        description="Hexagonal modules with mosaic effect"
        badge="Complex"
        code={`<AdvancedQRCode 
  value="Hexagon Mosaic Demo"
  size={200}
  advancedStyle={{
    body: {
      shape: 'hexagon',
      color: '#f39c12',
      effect: 'emboss',
      density: 0.85,
      rotation: 15
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Hexagon Mosaic Demo"
          size={200}
          advancedStyle={{
            body: {
              shape: 'hexagon',
              color: '#f39c12',
              effect: 'emboss',
              density: 0.85,
              rotation: 15
            }
          }}
        />
      </DemoCard>

    </div>
  </div>
);

// Background Examples
const BackgroundExamples = () => (
  <div id="backgrounds" className="container">
    <h2 className="section-title">🎨 Background Patterns</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="Dots Pattern"
        description="Subtle dot pattern background"
        badge="Patterns"
        code={`<AdvancedQRCode 
  value="Dots Pattern Demo"
  size={200}
  advancedStyle={{
    background: {
      pattern: 'dots',
      patternColor: '#3498db',
      patternOpacity: 0.1,
      primaryColor: '#ecf0f1'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Dots Pattern Demo"
          size={200}
          advancedStyle={{
            background: {
              pattern: 'dots',
              patternColor: '#3498db',
              patternOpacity: 0.1,
              primaryColor: '#ecf0f1'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Wave Pattern"
        description="Flowing wave pattern with gradient"
        badge="Waves"
        code={`<AdvancedQRCode 
  value="Wave Pattern Demo"
  size={200}
  advancedStyle={{
    background: {
      pattern: 'waves',
      patternColor: '#e74c3c',
      patternOpacity: 0.15,
      primaryColor: {
        type: 'linear',
        colors: [
          { color: '#ffecd2', offset: 0 },
          { color: '#fcb69f', offset: 1 }
        ],
        angle: 45
      }
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Wave Pattern Demo"
          size={200}
          advancedStyle={{
            background: {
              pattern: 'waves',
              patternColor: '#e74c3c',
              patternOpacity: 0.15,
              primaryColor: {
                type: 'linear',
                colors: [
                  { color: '#ffecd2', offset: 0 },
                  { color: '#fcb69f', offset: 1 }
                ],
                angle: 45
              }
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Grid with Border"
        description="Grid pattern with styled border and shadow"
        badge="Bordered"
        code={`<AdvancedQRCode 
  value="Grid Border Demo"
  size={200}
  advancedStyle={{
    background: {
      pattern: 'grid',
      patternColor: '#95a5a6',
      patternOpacity: 0.2,
      border: {
        width: 4,
        color: '#2c3e50',
        style: 'solid',
        radius: 12,
        shadow: {
          color: '#34495e',
          blur: 8,
          offsetX: 3,
          offsetY: 3
        }
      }
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Grid Border Demo"
          size={200}
          advancedStyle={{
            background: {
              pattern: 'grid',
              patternColor: '#95a5a6',
              patternOpacity: 0.2,
              border: {
                width: 4,
                color: '#2c3e50',
                style: 'solid',
                radius: 12,
                shadow: {
                  color: '#34495e',
                  blur: 8,
                  offsetX: 3,
                  offsetY: 3
                }
              }
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Hexagon Pattern"
        description="Complex hexagonal pattern with effects"
        badge="Complex"
        code={`<AdvancedQRCode 
  value="Hexagon Effects Demo"
  size={200}
  advancedStyle={{
    background: {
      pattern: 'hexagons',
      patternColor: '#9b59b6',
      patternOpacity: 0.12,
      effects: [
        { type: 'vignette', intensity: 0.3 },
        { type: 'grain', intensity: 0.05 }
      ],
      rounded: 16
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Hexagon Effects Demo"
          size={200}
          advancedStyle={{
            background: {
              pattern: 'hexagons',
              patternColor: '#9b59b6',
              patternOpacity: 0.12,
              effects: [
                { type: 'vignette', intensity: 0.3 },
                { type: 'grain', intensity: 0.05 }
              ],
              rounded: 16
            }
          }}
        />
      </DemoCard>

    </div>
  </div>
);

// Preset Themes
const ThemeExamples = () => (
  <div id="themes" className="container">
    <h2 className="section-title">🎭 Preset Themes</h2>
    <div className="demo-grid">
      
      {Object.entries(PRESET_THEMES).map(([themeName, theme]) => (
        <DemoCard 
          key={themeName}
          title={`${theme.name} Theme`}
          description={theme.description}
          badge="Theme"
          code={`<AdvancedQRCode 
  value="${theme.name} Theme Demo"
  size={200}
  theme="${themeName}"
/>`}
        >
          <AdvancedQRCode 
            value={`${theme.name} Theme Demo`}
            size={200}
            theme={themeName}
          />
        </DemoCard>
      ))}

    </div>
  </div>
);

// Data Type Examples
const DataTypeExamples = () => (
  <div id="data-types" className="container">
    <h2 className="section-title">📱 Data Types</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="WiFi QR Code"
        description="Connect to WiFi network automatically"
        badge="WiFi"
        code={`<ReactQrCode 
  value={QRHelpers.wifi(
    'MyWiFi',
    'password123',
    'WPA2',
    false
  )}
  size={200}
  theme="modern"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.wifi('MyWiFi', 'password123', 'WPA2', false)}
          size={200}
          theme="modern"
        />
      </DemoCard>

      <DemoCard 
        title="Contact vCard"
        description="Save contact information to phone"
        badge="vCard"
        code={`<ReactQrCode 
  value={QRHelpers.vcard({
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    organization: 'React Corp'
  })}
  size={200}
  theme="vintage"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.vcard({
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            email: 'john@example.com',
            organization: 'React Corp'
          })}
          size={200}
          theme="vintage"
        />
      </DemoCard>

      <DemoCard 
        title="SMS Message"
        description="Pre-filled SMS message"
        badge="SMS"
        code={`<ReactQrCode 
  value={QRHelpers.sms(
    '+1234567890',
    'Hello from QR Code!'
  )}
  size={200}
  theme="neon"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.sms('+1234567890', 'Hello from QR Code!')}
          size={200}
          theme="neon"
        />
      </DemoCard>

      <DemoCard 
        title="Email Message"
        description="Pre-filled email with subject and body"
        badge="Email"
        code={`<ReactQrCode 
  value={QRHelpers.email(
    'support@example.com',
    'QR Code Inquiry',
    'Hi, I scanned your QR code!'
  )}
  size={200}
  theme="nature"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.email(
            'support@example.com',
            'QR Code Inquiry',
            'Hi, I scanned your QR code!'
          )}
          size={200}
          theme="nature"
        />
      </DemoCard>

      <DemoCard 
        title="Geo Location"
        description="Open maps at specific coordinates"
        badge="Location"
        code={`<ReactQrCode 
  value={QRHelpers.geo(
    37.7749,
    -122.4194
  )}
  size={200}
  theme="cyberpunk"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.geo(37.7749, -122.4194)}
          size={200}
          theme="cyberpunk"
        />
      </DemoCard>

      <DemoCard 
        title="Calendar Event"
        description="Add event to calendar"
        badge="Event"
        code={`<ReactQrCode 
  value={QRHelpers.event({
    summary: 'React Conference',
    startDate: new Date('2024-03-15T10:00:00'),
    endDate: new Date('2024-03-15T17:00:00'),
    location: 'San Francisco, CA',
    description: 'Annual React developers conference'
  })}
  size={200}
  theme="modern"
/>`}
      >
        <AdvancedQRCode 
          value={QRHelpers.event({
            summary: 'React Conference',
            startDate: new Date('2024-03-15T10:00:00'),
            endDate: new Date('2024-03-15T17:00:00'),
            location: 'San Francisco, CA',
            description: 'Annual React developers conference'
          })}
          size={200}
          theme="modern"
        />
      </DemoCard>

    </div>
  </div>
);

// Animation Examples
const AnimationExamples = () => (
  <div id="animations" className="container">
    <h2 className="section-title">🎬 Animations & Effects</h2>
    <div className="demo-grid">
      
      <DemoCard 
        title="Fade In Animation"
        description="Smooth fade-in effect on load"
        badge="Animation"
        code={`<AdvancedQRCode 
  value="Fade Animation Demo"
  size={200}
  animated={true}
  animationDuration={1000}
  animationDelay={200}
  theme="neon"
/>`}
      >
        <AdvancedQRCode 
          value="Fade Animation Demo"
          size={200}
          animated={true}
          animationDuration={1000}
          animationDelay={200}
          theme="neon"
        />
      </DemoCard>

      <DemoCard 
        title="Glow Effect"
        description="Animated glow effect around QR code"
        badge="Effects"
        code={`<AdvancedQRCode 
  value="Glow Effect Demo"
  size={200}
  advancedStyle={{
    effects: {
      glow: {
        color: '#00ff00',
        size: 15,
        intensity: 1.2,
        animated: true
      }
    },
    body: {
      shape: 'circle',
      color: '#2ecc71'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Glow Effect Demo"
          size={200}
          advancedStyle={{
            effects: {
              glow: {
                color: '#00ff00',
                size: 15,
                intensity: 1.2,
                animated: true
              }
            },
            body: {
              shape: 'circle',
              color: '#2ecc71'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Holographic Effect"
        description="Futuristic holographic body effect"
        badge="Holographic"
        code={`<AdvancedQRCode 
  value="Holographic Demo"
  size={200}
  advancedStyle={{
    body: {
      shape: 'hexagon',
      effect: 'holographic',
      color: '#9b59b6'
    },
    eyes: {
      frameShape: 'hexagon',
      pupilShape: 'hexagon',
      frameEffect: 'chrome'
    }
  }}
/>`}
      >
        <AdvancedQRCode 
          value="Holographic Demo"
          size={200}
          advancedStyle={{
            body: {
              shape: 'hexagon',
              effect: 'holographic',
              color: '#9b59b6'
            },
            eyes: {
              frameShape: 'hexagon',
              pupilShape: 'hexagon',
              frameEffect: 'chrome'
            }
          }}
        />
      </DemoCard>

      <DemoCard 
        title="Complex Showcase"
        description="Ultimate customization showcase"
        badge="Ultimate"
        code={`<AdvancedQRCode 
  value="Ultimate Showcase"
  size={240}
  theme="cyberpunk"
  advancedStyle={{
    eyes: {
      frameShape: 'flower',
      frameEffect: 'neon',
      pupilShape: 'star',
      pupilEffect: 'glow'
    },
    body: {
      shape: 'fluid',
      effect: 'holographic',
      density: 0.95
    },
    background: {
      pattern: 'grid',
      effects: [
        { type: 'vignette', intensity: 0.2 },
        { type: 'scan-lines', intensity: 0.03 }
      ],
      border: {
        width: 3,
        color: '#00ffff',
        style: 'solid',
        radius: 20
      }
    }
  }}
  animated={true}
/>`}
      >
        <AdvancedQRCode 
          value="Ultimate Showcase"
          size={240}
          theme="cyberpunk"
          advancedStyle={{
            eyes: {
              frameShape: 'flower',
              frameEffect: 'neon',
              pupilShape: 'star',
              pupilEffect: 'glow'
            },
            body: {
              shape: 'fluid',
              effect: 'holographic',
              density: 0.95
            },
            background: {
              pattern: 'grid',
              effects: [
                { type: 'vignette', intensity: 0.2 },
                { type: 'scan-lines', intensity: 0.03 }
              ],
              border: {
                width: 3,
                color: '#00ffff',
                style: 'solid',
                radius: 20
              }
            }
          }}
          animated={true}
        />
      </DemoCard>

    </div>
  </div>
);

// Main App Component
function AdvancedDemo() {
  return (
    <div>
      <BasicExamples />
      <EyeExamples />
      <BodyExamples />
      <BackgroundExamples />
      <ThemeExamples />
      <DataTypeExamples />
      <AnimationExamples />
      
      {/* Footer */}
      <div className="container" style={{ marginTop: '80px', marginBottom: '40px' }}>
        <div className="qr-card" style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
          <h3 style={{ marginBottom: '20px' }}>🚀 Get Started</h3>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Start creating amazing QR codes with react-qr-code
          </p>
          <CodeBlock language="bash">
            npm install @devmehq/react-qr-code
          </CodeBlock>
          <div style={{ marginTop: '30px' }}>
            <a href="https://github.com/devmehq/react-qr-code" 
               style={{ 
                 color: 'white', 
                 textDecoration: 'none', 
                 padding: '12px 24px',
                 background: 'linear-gradient(45deg, #667eea, #764ba2)',
                 borderRadius: '25px',
                 fontWeight: 'bold',
                 display: 'inline-block',
                 marginRight: '15px'
               }}>
              ⭐ Star on GitHub
            </a>
            <a href="https://www.npmjs.com/package/@devmehq/react-qr-code" 
               style={{ 
                 color: 'white', 
                 textDecoration: 'none', 
                 padding: '12px 24px',
                 background: 'rgba(255, 255, 255, 0.2)',
                 borderRadius: '25px',
                 fontWeight: 'bold',
                 display: 'inline-block'
               }}>
              📦 View on NPM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container);
root.render(<AdvancedDemo />);