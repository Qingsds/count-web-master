import routes from './router'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import NavBar from './components/nav-bar'
import { useEffect, useState } from 'react'

function App() {
  const location = useLocation()
  const { pathname } = location
  const [showNav, setShowNav] = useState(false)
  const needNav = ['/', '/data', '/user']
  // navBar 会根据 pathname 来判断是否显示
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname])

  return (
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
        <NavBar showNav={showNav} />
      </>
    </ConfigProvider>
  )
}

export default App
