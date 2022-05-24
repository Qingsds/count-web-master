import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomIcon from '../../components/custom-icon'
import { Cell } from 'zarm'
import { typeMap } from '../../utils/index'
import dayjs from 'dayjs'

import style from './style.module.less'

export default function BillItem({ bill }) {
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const navigate = useNavigate()
  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算
  useEffect(() => {
    // pay_type：1 为支出；2 为收入
    let _income = 0
    let _expense = 0
    // 遍历 累加支出和收入
    bill.bills?.forEach(item => {
      // 支出
      if (+item.pay_type === 1) {
        _expense += Number(item.amount)
      }
      // 收入
      if (+item.pay_type === 2) {
        _income += Number(item.amount)
      }
    })

    // 设置支出和输入和合计
    setIncome(_income)
    setExpense(_expense)
  }, [bill.bills])

  const { bills } = bill
  // 跳转路由
  const toDetail = item => {
    navigate(`/detail?id=${item.id}`)
  }

  // icon
  const icon = item => {
    return (
      <>
        {/* 这里图标type-map关联了消费类型的 id */}
        <CustomIcon
          className={style.itemIcon}
          type={item.type_id ? typeMap[item.type_id].icon : 1}
        />
        <span>{item.type_name}</span>
      </>
    )
  }

  // description 用来显示收入和支出的金额
  const description = item => {
    // 标记是否是收入
    const isIncome = +item.pay_type === 2
    return (
      <span style={{ color: isIncome ? 'red' : '#39be77' }}>
        {`${isIncome ? '+' : '-'} ${item.amount}`}
      </span>
    )
  }

  // 显示日期和备注
  const help = item => {
    return (
      <div>
        {dayjs(Number(item.date)).format('HH:mm')}
        {item.remark ? `| ${item.remark}` : ''}
      </div>
    )
  }

  return (
    <div className={style.item}>
      <div className={style.headerDate}>
        <div className={style.date}>{bill.date}</div>
        <div className={style.money}>
          <span>
            <img src='//s.yezgea02.com/1615953405599/zhi%402x.png' alt='支' />
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src='//s.yezgea02.com/1615953405599/shou%402x.png' alt='收' />
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {bills &&
        bills.map(item => (
          <Cell
            className={style.bill}
            key={item.id}
            onClick={() => toDetail(item)}
            title={icon(item)}
            description={description(item)}
            help={help(item)}
          />
        ))}
    </div>
  )
}
