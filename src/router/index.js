/**
 * @description 路由
 * @author qingsds
 */

import Data from '../container/data'
import Detail from '../container/detail'
import Home from '../container/home'
import Login from '../container/login/login'
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
  {
    path: '/detail',
    component: Detail,
  },
  {
    path: '/login',
    component: Login,
  },
]

export default routes
