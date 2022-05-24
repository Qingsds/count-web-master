import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/header'
import CustomIcon from '../../components/custom-icon'
import PopupAddBill from '../../components/popup-addbill'
import { get, post, typeMap } from '../../utils'
import { DeleteOutline, EditSOutline } from 'antd-mobile-icons'
import { Modal, Toast } from 'antd-mobile'
import dayjs from 'dayjs'

export default function Detail() {
  const [params] = useSearchParams(window.location.pathname)
  const [billInfo, setBillInfo] = useState(null)
  const navigate = useNavigate()
  const updateRef = useRef()
  const onBack = () => {
    navigate('/')
  }
  const id = params.get('id')
  const isExpense = billInfo?.pay_type === '1'

  // 根据 id 来查询数据
  useEffect(() => {
    const fetchInfo = async () => {
      const res = await get(`api/bill/detail?id=${id}`)
      setBillInfo(res.data)
    }
    fetchInfo()
  }, [id])

  // 删除按钮
  const deleteHandler = async () => {
    const result = await Modal.alert({
      title: '删除',
      cancelText: '确认是否删除账单',
    })
    if (result) {
      await post('/api/bill/delete', { id })
      Toast.show('删除成功')
      onBack()
    } else {
      return
    }
  }

  const updateHandler = () => {
    updateRef.current && updateRef.current.show()
  }

  return (
    billInfo && (
      <>
        <Header title={'账单详情'} onBack={onBack} />
        <Container>
          <Card>
            <CardTitleWrap>
              <Title>
                <Iconfont
                  type={typeMap[billInfo.type_id].icon}
                  // TODO 属性无效
                  isexpense={isExpense ? 1 : 0}
                />
                <span>{billInfo.type_name}</span>
              </Title>
              <Money>
                {isExpense ? '-' : '+'} {parseInt(billInfo.amount).toFixed(2)}
              </Money>
            </CardTitleWrap>
            <InfoWrap>
              <InfoItem>
                <span>记录时间:</span>
                <span>
                  {dayjs(parseInt(billInfo.date)).format('YYYY-MM-DD')}
                </span>
              </InfoItem>
              <InfoItem>
                <span>备注:</span>
                <span>{billInfo.remark || '-'}</span>
              </InfoItem>
            </InfoWrap>
            <Operation>
              <span onClick={deleteHandler}>
                <DeleteOutline style={{ marginRight: '5px' }} />
                删除
              </span>
              <span onClick={updateHandler}>
                <EditSOutline style={{ marginRight: '5px' }} />
                编辑
              </span>
            </Operation>
          </Card>
          <PopupAddBill ref={updateRef} billInfo={billInfo} onReload={onBack} />
        </Container>
      </>
    )
  )
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 12px 24px 0 24px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
  background-color: #fff;
`

const CardTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: center;
  > span {
    line-height: 35px;
    font-size: 10px;
  }
`

const Iconfont = styled(CustomIcon)`
  font-size: 20px;
  line-height: 35px;
  height: 30px;
  width: 30px;
  background-color: ${props => (props.isexpense ? '#007fff' : '#ecbe25')};
  border-radius: 50%;
  color: #fff;
  margin-right: 5px;
`

const Money = styled.div`
  margin-top: 10px;
  display: inline-block;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  line-height: normal;
`

const InfoWrap = styled.div`
  margin: 15px 13px;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  justify-content: space-between;
`

const InfoItem = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 10px;
  span:nth-of-type(1) {
    flex: 3;
    color: rgba(0, 0, 0, 0.5);
  }
  span:nth-of-type(2) {
    flex: 9;
  }
`

const Operation = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  align-items: center;
  font-size: 16px;
  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1;
  }
  span:nth-of-type(1) {
    color: red;
  }
`
