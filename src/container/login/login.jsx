/**
 * @description 登录页面
 * @author qingsds
 */
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import CustomIcon from '../../components/custom-icon'
import Captcha from 'react-captcha-code'
import style from './style.module.less'
import { post } from '../../utils/index'
import { useReducer } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  // 这里由于需要的变量太多,由 useState 改为 useReducer
  const [state, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      type: 'login',
      username: '',
      password: '',
      verify: '',
      captcha: '',
      agree: false,
    }
  )
  const navigate = useNavigate()
  const { type, username, password, verify, captcha, agree } = state
  const isRegister = type === 'register'
  const isLogin = type === 'login'
  // 点击变更验证码时调用
  const handleCaptchaChange = verify => {
    dispatch({ captcha: verify })
  }

  const handleSubmit = async () => {
    if (!username || username.length < 3) {
      Toast.show('用户名格式不正确')
      return
    }
    if (!password || password.length < 3) {
      Toast.show('密码格式不正确')
      return
    }
    // 登录的逻辑
    if (isLogin) {
      try {
        const res = await post('/api/user/login', { username, password })
        Toast.show('登录成功')
        // 设置 token
        window.localStorage.setItem('token', res.data.token)
        navigate('/')
      } catch (error) {
        Toast.show(error.message)
      }
      return
    }

    //这里是注册的逻辑
    if (!verify || verify !== captcha) {
      Toast.show('验证码不正确')
      return
    }
    if (!agree) {
      Toast.show('不同意,无法注册')
      return
    }
    try {
      await post('/api/user/register', { username, password })
      Toast.show('注册成功')
      dispatch({ type: 'login' })
    } catch (error) {
      Toast.show(error.message)
    }
  }
  return (
    <div className={style.auth}>
      <div className={style.head} />
      <div className={style.tab}>
        <span
          className={classNames({ [style.active]: type === 'login' })}
          onClick={() => {
            dispatch({ type: 'login', username: '', password: '' })
          }}
        >
          登录
        </span>
        <span
          className={classNames({ [style.active]: type === 'register' })}
          onClick={() =>
            dispatch({ type: 'register', username: '', password: '' })
          }
        >
          注册
        </span>
      </div>
      <div className={style.form}>
        <Cell icon={<CustomIcon type='zhanghao' />}>
          <Input
            type='text'
            clearable
            value={username || ''}
            placeholder='请输入账号'
            onChange={value => dispatch({ username: value })}
          />
        </Cell>
        <Cell icon={<CustomIcon type='mima' />}>
          <Input
            type='password'
            clearable
            placeholder='请输入密码'
            value={password || ''}
            onChange={value => dispatch({ password: value })}
          />
        </Cell>
        {isRegister ? (
          <Cell icon={<CustomIcon type='mima' />}>
            <Input
              type='text'
              clearable
              placeholder='请输入验证码'
              value={verify || ''}
              onChange={value => dispatch({ verify: value })}
            />
            <Captcha charNum={4} onChange={handleCaptchaChange} />
          </Cell>
        ) : null}
      </div>
      <div className={style.operation}>
        {isRegister ? (
          <div className={style.agree}>
            <Checkbox
              value={agree}
              onChange={e => dispatch({ agree: e.target.checked })}
            />
            <label className='text-light'>
              阅读并同意<a>《掘掘手札条款》</a>
            </label>
          </div>
        ) : null}
        <Button block theme={'primary'} onClick={handleSubmit}>
          {isRegister ? '注册' : '登录'}
        </Button>
      </div>
    </div>
  )
}
