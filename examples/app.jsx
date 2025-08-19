const { ReactQrCode, AdvancedQRCode } = window.ReactQrCode;

const Home = () => (
  <div style={{
    padding: '40px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: 'white'
  }}>
    <h1 style={{ marginBottom: '40px', fontSize: '3rem' }}>🎨 React QR Code</h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '50px', opacity: 0.9 }}>
      The most powerful QR code generator for React
    </p>
    
    {/* Basic Examples */}
    <div style={{ marginBottom: '60px' }}>
      <h2 style={{ marginBottom: '30px' }}>Basic Examples</h2>
      <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px'}}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>Default</h4>
          <ReactQrCode
            value={"https://github.com/devmehq/react-qr-code"}
            size={140}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
          />
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>Colored</h4>
          <ReactQrCode
            value={"Colored QR Code"}
            size={140}
            bgColor={'#2c3e50'}
            fgColor={'#ecf0f1'}
          />
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>With Logo</h4>
          <ReactQrCode
            value={"https://react.dev"}
            size={140}
            imageSettings={{
              src: "https://react.dev/favicon.ico",
              width: 25,
              height: 25,
              excavate: true
            }}
          />
        </div>
      </div>
    </div>

    {/* Advanced Examples */}
    <div style={{ marginBottom: '60px' }}>
      <h2 style={{ marginBottom: '30px' }}>Advanced Examples</h2>
      <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px'}}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>Modern Theme</h4>
          <AdvancedQRCode
            value={"Modern Theme"}
            size={140}
            theme="modern"
          />
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>Neon Theme</h4>
          <AdvancedQRCode
            value={"Neon Theme"}
            size={140}
            theme="neon"
          />
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ marginBottom: '20px' }}>Custom Style</h4>
          <AdvancedQRCode
            value={"Custom Style"}
            size={140}
            advancedStyle={{
              eyes: {
                frameShape: 'circle',
                pupilShape: 'circle',
                frameColor: '#e74c3c',
                pupilColor: '#f39c12'
              },
              body: {
                shape: 'rounded',
                color: '#3498db'
              }
            }}
          />
        </div>
      </div>
    </div>

    {/* Links to more examples */}
    <div style={{ marginTop: '80px' }}>
      <h2 style={{ marginBottom: '30px' }}>Explore More</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <a href="advanced-demo.html" style={{
          display: 'inline-block',
          padding: '15px 30px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          🎨 Advanced Demo (100+ Examples)
        </a>
        <a href="simple-usage.html" style={{
          display: 'inline-block',
          padding: '15px 30px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          📚 Simple Usage Guide
        </a>
        <a href="api-docs.html" style={{
          display: 'inline-block',
          padding: '15px 30px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          📖 API Documentation
        </a>
      </div>
    </div>
  </div>
)


function App() {
  return (
    <Home/>
  )
}


const container = document.getElementById('root')
const root = ReactDOM.createRoot(container);
root.render(<App tab="home" />);
