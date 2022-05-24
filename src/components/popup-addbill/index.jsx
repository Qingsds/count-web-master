import styled from '@emotion/styled'
import { Popup, TextArea, Toast } from 'antd-mobile'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { CrossIcon, TypeItem } from '../popup-type'
import { Keyboard } from 'zarm'
import PopupData from '../popup-data'
import CustomIcon from '../custom-icon'
import dayjs from 'dayjs'
import { get, post, typeMap } from '../../utils'

const PopupAddBill = (props, ref) => {
  const temp =
    props.billInfo && props.billInfo.pay_type === '1' ? 'expense' : 'income'
  const [type, setType] = useState(temp)
  const [date, setDate] = useState(new Date())
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState([])
  const [money, setMoney] = useState('')
  const [currentType, setCurrentType] = useState()
  const [remark, setRemark] = useState('')

  const { onReload, billInfo } = props
  useEffect(() => {
    ;(async () => {
      // 获取数据
      const res = await get('/api/type/list')
      const list = res.data.typeList
      // 如果是修改 就初始化数据
      if (billInfo) {
        setDate(new Date(parseInt(billInfo.date)))
        setRemark(billInfo.remark)
        setMoney(billInfo.amount)
        // 筛选当前的类型
        const current = list.find(item => item.id === billInfo.type_id)
        // 删选当前支付类型的数组
        const currentType = type === 'expense' ? '1' : '2'
        const filter = list.filter(item => item.type === currentType)
        setCurrentType(current)
        setList(filter)
        return
      }
      const currentType = type === 'expense' ? '1' : '2'
      const filter = list.filter(item => item.type === currentType)
      setList(filter)
      setCurrentType(filter[0])
    })()
  }, [type, billInfo])

  const dateRef = useRef()

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
    },
    close: () => {
      setVisible(false)
    },
  }))
  // 控制日期的弹出
  const toggle = () => {
    dateRef.current && dateRef.current.show()
  }
  const onselect = date => {
    setDate(date)
  }

  const handleClick = value => {
    value = String(value)
    if (value === 'close') {
      return
    }
    if (value === 'delete') {
      if (!money.length) {
        return
      }
      let _m = money.slice(0, money.length - 1)
      setMoney(_m)
      return
    }
    // 输入确认键
    if (value === 'ok') {
      addBill()
      return
    }
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value === '.' && money?.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (
      value !== '.' &&
      money?.includes('.') &&
      money.split('.')[1].length >= 2
    ) {
      return
    }
    setMoney(money => money + value)
  }
  // 点击遮罩层触发的回调
  const handleMaskClick = () => {
    setVisible(false)
  }

  const addBill = async () => {
    if (!money) {
      Toast.show('请输入具体的金额ლ(′◉❥◉｀ლ)')
      return
    }
    const params = {
      amount: Number(money).toFixed(2) + '',
      type_id: currentType.id + '',
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000 + '',
      remark: remark || '',
      pay_type: type === 'expense' ? '1' : '2',
    }
    if (billInfo?.id) {
      params.id = billInfo.id
      await post('/api/bill/update', params)
      Toast.show('修改成功')
    } else {
      await post('/api/bill/add', params)
      Toast.show('添加成功')
    }
    // 重置数据
    setCurrentType(null)
    setDate(null)
    setList(null)
    setMoney('')
    setRemark('')
    setType('')
    setVisible(false)
    onReload && onReload()
    return
  }

  return (
    <Popup
      visible={visible}
      onMaskClick={handleMaskClick}
      destroyOnClose={true}
    >
      <AddBillContainer>
        <Header>
          添加账单
          <CrossIcon onClick={handleMaskClick} />
        </Header>
        <Content>
          <TypeWrap>
            <div style={{ display: 'flex', width: '60%' }}>
              <TypeItem
                active={type === 'expense'}
                onClick={() => setType('expense')}
              >
                支出
              </TypeItem>
              <TypeItem
                active={type === 'income'}
                onClick={() => setType('income')}
              >
                收入
              </TypeItem>
            </div>
            <TypeItem onClick={toggle}>
              {dayjs(date).format('MM-DD')} 日
            </TypeItem>
          </TypeWrap>
          <Money>¥: {money}</Money>
          <PayTypeContainer>
            <PayTypeBody>
              {list?.map(item => (
                <IconFontItem key={item.id}>
                  <IconFontWrap onClick={() => setCurrentType(item)}>
                    <IconFont
                      type={item.id ? typeMap[item.id].icon : 1}
                      choose={currentType?.id === item.id ? 1 : 0}
                    />
                  </IconFontWrap>
                  <span>{item.name}</span>
                </IconFontItem>
              ))}
            </PayTypeBody>
          </PayTypeContainer>
          <TextArea
            placeholder='这里可以输入备注内容'
            value={remark}
            onChange={value => setRemark(value)}
          />
          <Keyboard onKeyClick={value => handleClick(value)} type={'price'} />
        </Content>
        <PopupData ref={dateRef} mode={'day'} onselect={onselect} />
      </AddBillContainer>
    </Popup>
  )
}

const AddBillContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`

const Header = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  text-align: center;
  font-size: 16px;
  line-height: 56px;
  color: rgba(0, 0, 0, 0.9);
  background-color: #fff;
`
const Content = styled.div`
  padding: 0 10px;
`
const TypeWrap = styled.div`
  width: 100%;
  display: flex;
  height: 50px;
  margin-top: 10px;
  justify-content: space-between;
`

const Money = styled.span`
  display: inline-block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1);
`

const PayTypeContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 20px;
  * {
    touch-action: pan-x;
  }
`

const PayTypeBody = styled.div`
  display: flex;
  white-space: nowrap;
`

const IconFontItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 13px;
`

const IconFontWrap = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
`

const IconFont = styled(CustomIcon)`
  font-size: 25px;
  padding: 3px;
  color: ${props => (props.choose ? '#fff' : 'rgba(0,0,0,0.5)')};
  background-color: ${props => (props.choose ? '#007fff' : void 0)};
`

export default forwardRef(PopupAddBill)
