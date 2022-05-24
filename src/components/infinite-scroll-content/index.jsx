import { DotLoading } from 'antd-mobile'

const InfiniteScrollContent = ({ hasMore }) => {
  return (
    <>
      {hasMore ? (
        <>
          <span>Loading</span>
          <DotLoading />
        </>
      ) : (
        <span>--- 我是有底线的 ---</span>
      )}
    </>
  )
}

export default InfiniteScrollContent
