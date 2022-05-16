import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TabBar } from 'zarm'

const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState(() => '/')
  const navigate = useNavigate()

  const handleChange = path => {
    setActiveKey(path)
    navigate(path)
  }

  return (
    <TabBar visible={showNav} activeKey={activeKey} onChange={handleChange}>
      <TabBar.Item title='账单' itemKey='/' />
      <TabBar.Item title='统计' itemKey='/data' />
      <TabBar.Item title='我的' itemKey='/user' />
    </TabBar>
  )
}

export default NavBar
