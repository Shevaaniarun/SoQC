import { useState } from 'react'
import './App.css'
import Lightfall from '../components/Home/Lightfall'

function App() {
  return (

    <div
  style={{
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000"
  }}
>
  <div
    style={{
      width: "380px",
      height: "100%",
    }}
  >
  <Lightfall
    speed={2}
    streakCount={0.02}
    streakWidth={0.5}
    streakLength={1}
    glow={1}
    density={0.6}
    twinkle={1}
    zoom={3}
    backgroundGlow={0.5}
    opacity={1}
    mouseInteraction
    mouseStrength={0.1}
    mouseRadius={1}
    />
    </div>
    </div>
)
}

export default App
