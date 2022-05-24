import { DownOutline, AddOutline } from 'antd-mobile-icons'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import BillItem from '../../components/bill-item'
import PopupType from '../../components/popup-type'
import PopupData from '../../components/popup-data'
import PopupAddBill from '../../components/popup-addbill'
import InfiniteScrollContent from '../../components/infinite-scroll-content'
import dayjs from 'dayjs'
import { get, REFRESH_STATE } from '../../utils'
import { Empty, InfiniteScroll, PullToRefresh } from 'antd-mobile'
import styled from '@emotion/styled'

export default function Home() {
  const [state, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      currentTime: dayjs().format('YYYY-MM'),
      page: 1,
      income: 0,
      expense: 0,
      typeSelect: {},
      hasMore: true,
    }
  )
  const [list, setList] = useState([])
  const typeRef = useRef()
  const dateRef = useRef()
  const addRef = useRef()

  const { currentTime, page, hasMore, income, expense, typeSelect } = state
  /**
   * handleLoad
   * 处理下拉加载时的函数
   */
  const handleLoad = useCallback(async () => {
    const { data } = await get(
      `/api/bill/list?page=${page}&date=${currentTime}&&type_id=${
        typeSelect?.id || 'all'
      }`
    )
    setList(list => [...list, ...data.list])
    // 设置总页数 加载状态
    dispatch({
      totalPage: data.totalPage,
      income: data.sumIncome,
      expense: data.sumExpense,
      refreshData: REFRESH_STATE.complete,
      hasMore: page < data.totalPage,
    })
  }, [page, currentTime, typeSelect?.id])
  /**
   * handleRefresh
   * 处理上拉刷新或依赖变更是更新的函数
   */
  const handleRefresh = useCallback(async () => {
    const { data } = await get(
      `/api/bill/list?page=1&date=${currentTime}&&type_id=${
        typeSelect?.id || 'all'
      }`
    )
    setList(data.list)
    dispatch({
      totalPage: data.totalPage,
      income: data.sumIncome,
      expense: data.sumExpense,
      refreshData: REFRESH_STATE.complete,
    })
  }, [currentTime, typeSelect?.id])

  // 初始化数据
  useEffect(() => {
    handleRefresh()
  }, [handleRefresh])

  // 下拉刷新
  const refreshData = async () => {
    await handleRefresh()
  }

  // 上拉加载 触发的回调
  const loadData = async () => {
    dispatch({ page: page + 1 })
    await handleLoad()
  }
  // 类型和日期筛选的触发开关
  const typeToggle = () => {
    typeRef.current && typeRef.current.show()
  }
  const dateToggle = () => {
    dateRef.current && dateRef.current.show()
  }
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }
  // 类型和日期筛选的逻辑
  const onTypeSelect = item => {
    dispatch({ refreshing: true, page: 1, typeSelect: item })
  }
  const onDateSelect = date => {
    dispatch({
      refreshing: true,
      page: 1,
      currentTime: dayjs(date).format('YYYY-MM'),
    })
  }
  return (
    <HomeWrap>
      <Header>
        <DataWrap>
          <span>
            总支出: <b>¥ {expense?.toFixed(2)}</b>
          </span>
          <span style={{ marginLeft: '10px' }}>
            总收入: <b>¥ {income?.toFixed(2)}</b>
          </span>
        </DataWrap>
        <TypeWrap>
          <div style={{ marginRight: '6px' }}>
            <span onClick={typeToggle}>
              {typeSelect?.name || '选择全部'}
              <Arrow />
            </span>
          </div>
          <div>
            <span onClick={dateToggle}>
              {currentTime} <Arrow />
            </span>
          </div>
        </TypeWrap>
      </Header>
      <Content>
        {list.length ? (
          <PullToRefresh onRefresh={refreshData}>
            {list.map((item, index) => (
              <BillItem key={index} bill={item} />
            ))}
          </PullToRefresh>
        ) : (
          <Empty />
        )}
        <InfiniteScroll hasMore={hasMore} loadMore={loadData} threshold={250}>
          {list?.length ? <InfiniteScrollContent hasMore={hasMore} /> : null}
        </InfiniteScroll>
      </Content>
      <PopupType onselect={onTypeSelect} ref={typeRef} />
      <PopupData ref={dateRef} onselect={onDateSelect} mode={'month'} />
      <PopupAddBill ref={addRef} onReload={refreshData} />
      <Add onClick={addToggle}>
        <AddOutline />
      </Add>
    </HomeWrap>
  )
}

const HomeWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  padding-bottom: 30px;
`

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  background-color: #007fff;
  color: #fff;
  font-size: 14px;
  z-index: 100;
  padding: 10px;
`

const DataWrap = styled.div`
  font-size: 14px;
  > span {
    font-size: 12px;
    > b {
      font-size: 26px;
      font-family: DINCondensed-Bold, DINCondensed;
      margin-left: 4px;
    }
  }
`

const TypeWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  > div {
    align-self: flex-start;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    padding: 3px 8px;
    font-size: 12px;
  }
`

export const Arrow = styled(DownOutline)`
  font-size: 12px;
  margin-left: 4px;
`

const Content = styled.div`
  height: calc('(100% - 50px)');
  overflow: hidden;
  overflow-y: scroll;
  background-color: #f5f5f5;
  padding: 10px;
  :global {
    .za-pull {
      overflow: unset;
    }
  }
`

const Add = styled.div`
  position: fixed;
  height: 60px;
  width: 60px;
  right: 30px;
  bottom: 100px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #e9e9e9;
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
`
