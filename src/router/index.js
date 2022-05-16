/**
 * @description 路由
 * @author qingsds
 */

import Data from '../container/data'
import Home from '../container/home'
import User from '../container/user'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/data',
    component: Data,
  },
  {
    path: '/user',
    component: User,
  },
]

export default routes
