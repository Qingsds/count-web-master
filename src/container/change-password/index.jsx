import styled from '@emotion/styled'
import { Form, Input } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

import Header from '../../components/header'

const ChangePassword = () => {
  const navigate = useNavigate()


  const onBack = () => {
    navigate('/user')
  }
  return (
    <Container>
      <Header title={'修改密码'} onBack={onBack} />
      <Form layout='vertical' >
        <Form.Item
          label={'当前密码'}
          name={'password'}
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={'新密码'} name={'cpassword'}>
          <Input />
        </Form.Item>
        <Form.Item label={'重复新密码'} name={'cpassword1'} dependencies={['cpassword']}>
          <Input />
        </Form.Item>
      </Form>
    </Container>
  )
}
const Container = styled.div`
  width: 100%;
  height: 100%;
`

export default ChangePassword
