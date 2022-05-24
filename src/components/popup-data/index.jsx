/**
 * @description 日期选择器
 * @author qingsds
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { DatePicker } from 'antd-mobile'
export default forwardRef(({ onselect, mode='month' }, ref) => {
  const [visible, setVisible] = useState(false)
  const now = useMemo(() => new Date(), [])

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
    },
    close: () => {
      setVisible(false)
    },
  }))
  return (
    <DatePicker
      visible={visible}
      title={'请选择日期'}
      onClose={() => setVisible(false)}
      max={now}
      precision={mode}
      onConfirm={value => onselect(value)}
    />
  )
})
