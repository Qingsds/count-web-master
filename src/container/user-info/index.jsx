import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/header'
import { Input, Avatar, Button, Card, Toast } from 'antd-mobile'
import { UploadOutline } from 'antd-mobile-icons'
import { useAuth } from '../../context'
import { useEffect, useState } from 'react'
import FullPageLoading from '../../components/fullpage-loading'
import { imgUrlTrans } from '../../utils'
import axios from 'axios'

const UserInfo = () => {
  const navigate = useNavigate()
  const { userInfo, update } = useAuth()
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')

  // 根据 userInfo 来获取页面信息
  useEffect(() => {
    setAvatar(userInfo.avatar)
    setSignature(userInfo.signature)
  }, [userInfo])

  const onBack = () => {
    navigate('/user')
  }
  // 处理文件
  const handleFile = event => {
    const files = event.target.files
    const currentFile = files[0]
    // 1024 * 1024 = 1MB
    if (currentFile.size > 1024 * 1024) {
      Toast.show('图片过大,请重试')
      return
    }
    let formData = new FormData()
    // form-data 数据类型
    formData.append('file', currentFile)
    axios({
      method: 'post',
      url: '/api/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: window.localStorage.getItem('token'),
      },
    }).then(res => {
      const img = imgUrlTrans(res.data.img)
      console.log(img)
      setAvatar(img)
    })
  }

  const handleSubmit = async () => {
    await update({ avatar, signature })
    Toast.show('修改成功')
    onBack()
  }

  if (!userInfo) {
    return <FullPageLoading />
  }
  return (
    <Container>
      <Header title='修改信息' onBack={onBack} />
      <Content>
        <AvatarWrapper>
          <Avatar
            src={avatar}
            style={{ '--size': '70px', marginBottom: '4px' }}
          />
          <FileUpload>
            <FakeBtn>
              <UploadOutline />
              上传文件
            </FakeBtn>
            <input type='file' style={{ opacity: 0 }} onChange={handleFile} />
          </FileUpload>
          <Description>支持jpg,png,格式大小 200kb 以内的图片</Description>
        </AvatarWrapper>
      </Content>
      <MyCard title='修改个性签名'>
        <Input
          value={signature}
          onChange={value => setSignature(value)}
          clearable
        />
      </MyCard>
      <LongBtn size='mini' color='primary' onClick={handleSubmit}>
        提交
      </LongBtn>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  align-items: center;
`
const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const FileUpload = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
`

const FakeBtn = styled.label`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 4px;
  color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`

const Description = styled.span`
  font-size: 3px;
  margin-top: 5px;
  color: rgba(0, 0, 0, 0.5);
`
const MyCard = styled(Card)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const LongBtn = styled(Button)`
  margin-top: 250px;
  width: 70%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

export default UserInfo
