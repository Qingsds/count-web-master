import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FullPageLoading from '../components/fullpage-loading'
import { get, post } from '../utils'

const UserContext = React.createContext()

export const ContextProvider = ({ children }) => {
  const [userInfo, setInfo] = useState()
  const navigate = useNavigate()
  const token = window.localStorage.getItem('token')
  // 加载用户信息
  const fetch = useCallback(async () => {
    try {
      const res = await get('/api/user/user_info')
      const { userInfo } = res.data
      setInfo(userInfo)
    } catch (error) {
      console.log(error)
    }
  }, [])

  //处理首次渲染的家长
  useEffect(() => {
    //存在 token 时 fetch data
    if (token) {
      fetch()
    } else {
      console.log('else')
      navigate('/login')
    }
  }, [fetch, navigate, token])

  const logout = useCallback(() => {
    window.localStorage.removeItem('token')
    navigate('/login')
  }, [navigate])

  const update = useCallback(
    async params => {
      await post('/api/user/edit_user_info', { ...params })
      fetch()
    },
    [fetch]
  )
  const updatePassword = useCallback(
    async params => {
      await post('/api/user/modify_password', { ...params })
      logout()
    },
    [logout]
  )
  // 存在 token 时 loading
  if (!userInfo && token) {
    return <FullPageLoading />
  }

  return (
    <UserContext.Provider
      children={children}
      value={{ update, logout, updatePassword, setInfo, userInfo }}
    />
  )
}

export const useAuth = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useAuth must use in Provider')
  }
  return context
}
