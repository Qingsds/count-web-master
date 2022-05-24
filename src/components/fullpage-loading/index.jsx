import styled from '@emotion/styled'
import { SpinLoading } from 'antd-mobile'
export default function FullPageLoading() {
  return (
    <Container>
      <SpinLoading color={'primary'} style={{ '--size': '36px' }} />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
