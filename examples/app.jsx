const ReactQrCode = window.ReactQrCode.ReactQrCode;

const Home = () => (
  <div>
    <div>
      <ReactQrCode
        value={"https://google.com"}
        size={128}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        renderAs={'canvas'}
      />
    </div>
    <div>
      <ReactQrCode
        value={"https://github.com"}
        size={128}
        bgColor={'#7da5ad'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
      />
    </div>
    <div>
      <ReactQrCode
        value={"https://github.com"}
        size={128}
        bgColor={'#cb1212'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
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
