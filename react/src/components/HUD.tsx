import React from 'react'
import './HUD.css'

interface Props {
    zoomIn: () => void;
    zoomOut: () => void;
}
export default function HUD({zoomIn, zoomOut}: Props) {
  return (
    <div className="HUD">
      <button onClick={zoomIn}>+</button>
      <button onClick={zoomOut}>-</button>
    </div>
  )
}
