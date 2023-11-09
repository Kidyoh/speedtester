import { useState } from 'react'
import './App.css'
import Speed from './speed'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Speed />
    </div>
  )
}

export default App
