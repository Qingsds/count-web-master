import { Avatar, Card, List, Button, Modal } from 'antd-mobile'
import {
  CheckShieldOutline,
  UnorderedListOutline,
  ContentOutline,
} from 'antd-mobile-icons'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'

export default function User() {
  const { userInfo: user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Modal.confirm({
      title: '退出登录',
      cancelText: '取消',
    })
    if (result) {
      logout()
    }
  }


  return (
    user && (
      <Container>
        <Header>
          <UserInfoWrapper>
            <Avatar src={user.avatar} />
            <UserInfo>
              <span className='name'>{user.username}</span>
              <code className='description'>{user.signature}</code>
            </UserInfo>
          </UserInfoWrapper>
        </Header>
        <CustomCard>
          <List mode='card'>
            <List.Item
              arrow
              clickable
              prefix={<UnorderedListOutline />}
              onClick={() => navigate('/user/user-info')}
            >
              修改用户信息
            </List.Item>
            <List.Item
              arrow
              clickable
              prefix={<CheckShieldOutline />}
              onClick={() => navigate('/user/cpassword')}
            >
              修改密码
            </List.Item>
            <List.Item arrow clickable prefix={<ContentOutline />}>
              关于我们
            </List.Item>
          </List>
        </CustomCard>
        <LogoutButton color={'danger'} onClick={handleLogout}>
          退出登录
        </LogoutButton>
        <Modal />
      </Container>
    )
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5 !important;
  position: relative;
  align-items: center;
`
const Header = styled.div`
  height: 150px;
  width: 100%;
  background-color: #007fff;
  padding: 10px 15px;
  display: flex;
`
const UserInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
`

const UserInfo = styled.div`
  padding-top: 5px;
  text-align: center;
  margin-left: 6px;
  color: #fff;
  .name {
    font-weight: 400;
    font-size: 15px;
    display: block;
    margin-bottom: 5px;
  }
  .description {
    font-size: 4px;
    color: #cbc7c7;
  }
`
const CustomCard = styled(Card)`
  width: 90%;
  top: 120px;
  position: absolute;
  background-color: #fff;
  box-shadow: 3px 2px 20px 10px rgba(0, 0, 0, 0.1);
`

const LogoutButton = styled(Button)`
  position: absolute;
  width: 80%;
  bottom: 9%;
`
