import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TabBar } from 'zarm'
import CustomIcon from '../custom-icon'
import style from './style.module.less'

const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState(window.location.pathname)
  const navigate = useNavigate()

  const handleChange = path => {
    setActiveKey(path)
    navigate(path)
  }

  return (
    <TabBar
      visible={showNav}
      className={style.tab}
      activeKey={activeKey}
      onChange={handleChange}
    >
      <TabBar.Item
        title='账单'
        itemKey='/'
        icon={<CustomIcon type='zhangdan' />}
      />
      <TabBar.Item
        title='统计'
        itemKey='/data'
        icon={<CustomIcon type='tongji' />}
      />
      <TabBar.Item
        title='我的'
        itemKey='/user'
        icon={<CustomIcon type='wode' />}
      />
    </TabBar>
  )
}

export default NavBar
