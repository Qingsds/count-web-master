/**
 * @description 二次封装 axios
 * @author qingsds
 */
import axios from 'axios'
import { Toast } from 'zarm'

export const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL =
  MODE === 'development' ? '/api' : 'http://api.chennick.wang'

axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${
  localStorage.getItem('token') || null
}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务器异常')
    return Promise.reject(res)
  }
  //处理已定义的错误
  if (res.data.errno !== 0) {
    if (res.data.message) Toast.show(res.data.message)
    if (res.data.errno === 10005) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
