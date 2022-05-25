import styled from '@emotion/styled'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { post } from '../../utils'
import Header from '../../components/header'
import { useAuth } from '../../context'

const ChangePassword = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const {logout} = useAuth()

  const checkPassword = (_, value) => {
    if (value !== form.getFieldValue('cpassword')) {
      return Promise.reject('前后密码不一致')
    }
    return Promise.resolve()
  }

  const onBack = () => {
    navigate('/user')
  }

  const handleSubmit = async value => {
    const { password, cpassword } = value
    if (password === cpassword) {
      Toast.show('密码没有变化')
      return
    }
    await post('/api/user/modify_password', {
      oldPassword: password,
      newPassword: cpassword,
    })
    Toast.show('修改密码成功')
    logout()
  }
  return (
    <Container>
      <Header title={'修改密码'} onBack={onBack} />
      <Form layout='vertical' mode='card' onFinish={handleSubmit} form={form}>
        <Form.Item
          label={'当前密码'}
          name={'password'}
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input type={'password'} placeholder='请输入当前密码' />
        </Form.Item>
        <Form.Item
          label={'新密码'}
          name={'cpassword'}
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input type={'password'} placeholder='请输入新密码' />
        </Form.Item>
        <Form.Item
          label={'重复新密码'}
          name={'cpassword1'}
          dependencies={['cpassword']}
          rules={[{ validator: checkPassword }]}
        >
          <Input type={'password'} placeholder='请重新输入新密码' />
        </Form.Item>
        <Form.Item style={{ height: '65px' }}>
          <LongBtn type={'submit'} color={'primary'}>
            提交
          </LongBtn>
        </Form.Item>
      </Form>
    </Container>
  )
}
const Container = styled.div`
  width: 100%;
  height: 100%;
`

const LongBtn = styled(Button)`
  width: 77%;
  position: absolute;
  height: 40px;
  left: 50%;
  transform: translateX(-50%);
`

export default ChangePassword
