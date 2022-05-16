import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
  const [state, setState] = useState(false)
  const navigate = useNavigate()
  const handleClick = () => {
    setState(!state)
    const route = state ? '/data' : '/user'
    navigate(route)
  }

  return (
    <>
      <button onClick={handleClick}>change</button>
    </>
  )
}
