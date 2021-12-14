
const Home = () => (
  <React.Fragment>
    <div>
    <React.ReactQrCode
      value={"https://google.com"}
      size={128}
      bgColor={'#ffffff'}
      fgColor={'#000000'}
      renderAs={'canvas'}
    />
    </div>
    <div>
      <React.ReactQrCode
        value={"https://github.com"}
        size={128}
        bgColor={'#7da5ad'}
        fgColor={'#ffffff'}
        renderAs={'svg'}
      />
    </div>
  </React.Fragment>
)


class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Home/>
      </React.Fragment>
    )
  }
}


ReactDOM.render((<App/>), document.getElementById('root'))
