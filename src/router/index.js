/**
 * @description 路由
 * @author qingsds
 */

import ChangePassword from '../container/change-password'
import Data from '../container/data'
import Detail from '../container/detail'
import Home from '../container/home'
import Login from '../container/login/login'
import User from '../container/user'
import UserInfo from '../container/user-info'

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
  {
    path: '/user/user-info',
    component: UserInfo,
  },
  {
    path: '/user/cpassword',
    component: ChangePassword,
  },
]

export default routes
