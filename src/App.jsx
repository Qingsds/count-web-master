import routes from './router'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import NavBar from './components/nav-bar'
import Test from './test'

function App() {
  return (
    <Router>
      <ConfigProvider primaryColor='#007fff' locale={zhCN}>
        <>
          <Routes>
            {routes.map(route => (
              <Route
                exact
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
          <NavBar showNav={true} />
        </>
      </ConfigProvider>
      <Test />
    </Router>
  )
}

export default App
