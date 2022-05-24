import { Icon } from 'zarm'
import { ProgressBar, Divider } from 'antd-mobile'
import PopupDate from '../../components/popup-data'
import FullPageLoading from '../../components/fullpage-loading'
import CustomIcon from '../../components/custom-icon'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { get, typeMap } from '../../utils'

// 用于存放 eChart 初始化返回的实例
let proportionChart = null

export default function Data() {
  const [state, dispatch] = useReducer(
    (state, action) => ({
      ...state,
      ...action,
    }),
    {
      // 1 表示是支出
      // 2 表示是收入
      totalType: '1',
      currentMonth: dayjs().format('YYYY-MM'),
      sumExpense: 0,
      sumIncome: 0,
      list: [],
      loading: false,
      pieType: '1',
    }
  )
  const dateRef = useRef()
  const {
    totalType,
    currentMonth,
    sumExpense,
    sumIncome,
    loading,
    list,
    pieType,
  } = state

  useEffect(() => {
    const fetch = async () => {
      dispatch({ loading: true })
      const res = await get(`/api/bill/data?date=${currentMonth}`)
      const { sumExpense, sumIncome, sumDate } = res.data
      // 根据pay_type 删选数据
      // 修改数据
      dispatch({
        sumExpense,
        sumIncome,
        list: sumDate,
        loading: false,
      })
    }
    fetch()
  }, [currentMonth])

  // 设置饼图
  const setPieChart = useCallback(
    data => {
      if (window.echarts) {
        const currentList = data.filter(item => item.pay_type === pieType)
        proportionChart = window.echarts.init(
          document.getElementById('proportion')
        )
        proportionChart.setOption({
          title: {
            text: `Referer of ${pieType === '1' ? 'Expense' : 'Income'}`,
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top: '7%',
            left: 'center',
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              data: currentList.map(item => {
                return {
                  value: item.number,
                  name: item.type_name,
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        })
      }
    },
    [pieType]
  )

  useEffect(() => {
    setPieChart(list)
  }, [setPieChart, list])

  // 根据支付方式来筛选
  const currentList = list.filter(item => item.pay_type === totalType)
  const currentSum = totalType === '1' ? sumExpense : sumIncome

  const choosePieType = value => {
    return () => {
      dispatch({ pieType: value })
    }
  }
  const chooseType = value => {
    return () => {
      dispatch({ totalType: value })
    }
  }

  // 日期弹窗和修改日期
  const showDatePopup = () => {
    dateRef.current && dateRef.current.show()
  }
  const onDateSelect = value => {
    value = dayjs(value).format('YYYY-MM')
    dispatch({ currentMonth: value })
  }

  if (loading) {
    return <FullPageLoading />
  }

  return (
    <Container>
      <Header>
        <Timer onClick={showDatePopup}>
          <span>{currentMonth}</span>
          <Icon type={'date'} style={{ fontSize: '16px' }} />
        </Timer>
        <Expense>
          支出总额
          <span>¥ {sumExpense}</span>
        </Expense>
        <Income>
          <span>收入总额</span>
          <span>¥ {sumIncome}</span>
        </Income>
      </Header>
      <BillStructure>
        <StructureHeader>
          <span className='title'>收支构成</span>
          <Tab>
            <span
              onClick={chooseType('1')}
              className={classNames({ active: totalType === '1' })}
            >
              支出
            </span>
            <span
              onClick={chooseType('2')}
              className={classNames({ active: totalType === '2' })}
            >
              收入
            </span>
          </Tab>
        </StructureHeader>
        <Content>
          {currentList.map(item => {
            // 求出百分比
            const percentage =
              (Number(item.number) / currentSum).toFixed(2) * 100
            return (
              <Item key={item.pay_type + item.number}>
                <Left>
                  <div className='type'>
                    <span className={totalType === '1' ? 'expense' : 'income'}>
                      <CustomIcon type={typeMap[item.type_id].icon} />
                    </span>
                    <span className='name'>{item.type_name}</span>
                    <div style={{ fontWeight: 'bold' }}>¥{item.number}</div>
                  </div>
                </Left>
                <Right>
                  <ProgressBar
                    className='percent'
                    percent={percentage}
                    style={{
                      '--track-width': '8px',
                      '--track-color': 'rgba(0,0,0,0)',
                      '--fill-color': `${
                        totalType === '1' ? '#007fff' : 'rgb(236, 190, 37)'
                      }`,
                    }}
                  />
                  <div>{percentage}%</div>
                </Right>
              </Item>
            )
          })}
        </Content>
        <Divider />
        <Proportion>
          <div className='head'>
            <span>图表展示</span>
            <Tab>
              <span
                onClick={choosePieType('1')}
                className={classNames({ active: pieType === '1' })}
              >
                支出
              </span>
              <span
                onClick={choosePieType('2')}
                className={classNames({ active: pieType === '2' })}
              >
                收入
              </span>
            </Tab>
          </div>
        </Proportion>
        <div id='proportion'></div>
      </BillStructure>
      <PopupDate ref={dateRef} onselect={onDateSelect} />
      <Global
        styles={css`
          #proportion {
            width: 100%;
            height: 400px;
          }
        `}
      />
    </Container>
  )
}

const Container = styled.div`
  min-height: 100%;
  background-color: #f5f5f5;
`
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  margin-bottom: 10px;
  background-color: #fff;
`
const Timer = styled.div`
  display: flex;
  position: relative;
  width: 96px;
  padding: 6px;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 16px;
  span:nth-of-type(1)::after {
    content: '';
    position: absolute;
    top: 9px;
    bottom: 8px;
    right: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    width: 1px;
  }
`
const Expense = styled.div`
  color: #007fff;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  > span {
    margin-top: 7px;
    font-size: 24px;
    font-weight: 600;
  }
`
const Income = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  span:nth-of-type(2) {
    padding-left: 6px;
  }
`
// 账单构成
const BillStructure = styled.div`
  padding: 0 10px;
  background-color: #fff;
  margin-bottom: 10px;
  .active {
    background-color: rgba(0, 127, 255, 0.2);
    color: #007fff;
  }
`
const StructureHeader = styled.div`
  display: flex;
  padding: 12px 0;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.8);
  }
`
const Content = styled.div`
  background-color: #fff;
`
const Item = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
`
const Left = styled.div`
  flex: 4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .type {
    display: flex;
    align-items: center;
    margin-right: 10px;
    span:nth-of-type(1) {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      color: #fff;
      flex-shrink: 0;
    }
    .name {
      width: 30px;
      font-weight: bold;
    }
    .expense {
      background-color: #007fff;
    }
    .income {
      background-color: rgb(236, 190, 37);
    }
  }
`
const Right = styled.div`
  flex: 8;
  display: flex;
  align-items: center;
  .percent {
    flex: 1;
  }
  .money {
    width: 100px;
  }
`
const Proportion = styled.div`
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    > span {
      font-size: 18px;
      color: rgba(0, 0, 0, 0.9);
    }
  }
`
const Tab = styled.div`
  span {
    display: inline-block;
    width: 40px;
    height: 24px;
    background-color: #f5f5f5;
    text-align: center;
    line-height: 24px;
    border-radius: 4px;
    margin-left: 10px;
  }
`
