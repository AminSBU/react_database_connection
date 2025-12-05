import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
