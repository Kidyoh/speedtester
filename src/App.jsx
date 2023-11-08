import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Speed from './spped'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Speed />
    </div>
  )
}

export default App
