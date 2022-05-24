/**
 * @description 弹出层, 后续使用 antd-mobile-icons + css in js
 * @author qingsds
 */
import React, { useEffect, useImperativeHandle, useReducer } from 'react'
import { get } from '../../utils'
import { CloseOutline } from 'antd-mobile-icons'
import { Popup } from 'antd-mobile'
import styled from '@emotion/styled'

// forwardRef 用于拿到父组件的 ref 属性
export default React.forwardRef(({ onselect }, ref) => {
  const [state, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      show: false,
      active: 'all',
      expenses: [],
      incomes: [],
    }
  )
  // 首次加载时渲染
  useEffect(() => {
    const fetch = async () => {
      const res = await get('/api/type/list')
      const list = res.data.typeList

      const expenses = list.filter(item => +item.type === 1)
      const incomes = list.filter(item => +item.type === 2)
      dispatch({ expenses, incomes })
    }
    fetch()
  }, [])
  // 为传进来的 ref 设置方法
  useImperativeHandle(ref, () => ({
    show: () => {
      dispatch({ show: true })
    },
    close: () => {
      dispatch({ show: false })
    },
  }))

  const chooseType = item => {
    dispatch({ active: item.id, show: false })
    // 改变父组件的状态
    onselect(item)
  }

  const { show, active, expenses, incomes } = state

  return (
    <Popup
      visible={show}
      onMaskClick={() => {
        dispatch({ show: false })
      }}
      destroyOnClose={true}
    >
      <Container>
        <Header>
          请选择类型
          <CrossIcon type='wrong' onClick={() => dispatch({ show: false })} />
        </Header>
        <ContentWrap>
          <TypeItem
            active={active === 'all'}
            style={{ height: '42px' }}
            onClick={() => chooseType({ id: 'all' })}
          >
            全部类型
          </TypeItem>
          <Title>支出</Title>

          <TypeListWrap>
            {expenses.map((item, index) => (
              <TypeItem
                key={index}
                onClick={() => chooseType(item)}
                active={active === item.id}
              >
                {item.name}
              </TypeItem>
            ))}
          </TypeListWrap>

          <Title>收入</Title>
          <TypeListWrap>
            {incomes.map((item, index) => (
              <TypeItem
                key={index}
                onClick={() => chooseType(item)}
                active={active === item.id}
              >
                {item.name}
              </TypeItem>
            ))}
          </TypeListWrap>
        </ContentWrap>
      </Container>
    </Popup>
  )
})

const Container = styled.div`
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

const ContentWrap = styled.div`
  padding: 10px;
`

const Title = styled.div`
  color: rgba(0, 0, 0, 0.9);
  margin: 10px 0;
  font-size: 14px;
`

export const CrossIcon = styled(CloseOutline)`
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 20px;
  transform: translateY(-50%);
`

const TypeListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

export const TypeItem = styled.p`
  padding: 12px 0;
  margin-bottom: 10px;
  text-align: center;
  width: calc((100% - 20px) / 3);
  background-color: ${props => (props.active ? '#007fff' : '#fff')};
  font-size: 16px;
  height: 42px;
  color: ${props => (props.active ? '#fff' : 'black')};
`
