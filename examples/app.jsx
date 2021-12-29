const ReactQrCode = window.ReactQrCode.ReactQrCode;

const Home = () => (
  <div style={{display: 'inline-block'}}>
    <div style={{display: 'inline-block'}}>
      <ReactQrCode
        value={"https://google.com"}
        size={128}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        renderAs={'svg'}
        marginSize={50}
      />
    </div>
    <div style={{display: 'inline-block'}}>
      <ReactQrCode
        value={"https://github.com"}
        size={128}
        bgColor={'#7da5ad'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
      />
    </div>
    <div style={{display: 'inline-block'}}>
      <ReactQrCode
        value={"https://github.com"}
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
  console.log(window.ReactQrCode.ReactQrCode)
  return (
    <Home/>
  )
}


ReactDOM.render((<App/>), document.getElementById('root'))
