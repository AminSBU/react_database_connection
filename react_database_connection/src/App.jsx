import { useState } from 'react'
import './App.css'
import SendPosts from './SendPosts.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SendPosts />
    </>
  )
}

export default App
