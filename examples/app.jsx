const ReactQrCode = window.ReactQrCode.ReactQrCode;

const Home = () => (
  <div style={{display: 'inline-block', padding: '30px'}}>
    <div style={{display: 'inline-block', margin: '10px'}}>
      <ReactQrCode
        value={"https://github.com/devmehq/react-qr-code"}
        size={128}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        renderAs={'svg'}
        marginSize={50}
      />
    </div>
    <div style={{display: 'inline-block', margin: '10px'}}>
      <ReactQrCode
        value={"https://github.com/devmehq/react-qr-code"}
        size={128}
        bgColor={'#7da5ad'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
      />
    </div>
    <div style={{display: 'inline-block', margin: '10px'}}>
      <ReactQrCode
        value={"https://github.com/devmehq/react-qr-code"}
        size={128}
        bgColor={'#cb1212'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
        marginSize={10}
      />
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
