import { NavBar } from 'antd-mobile'
export default function Header({ title, onBack }) {
  return (
    <div>
      <NavBar
        style={{ '--border-bottom': '1px #eee solid', backgroundColor: '#fff' }}
        onBack={onBack}
      >
        {title}
      </NavBar>
    </div>
  )
}
