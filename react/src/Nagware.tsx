// import {useState, useEffect, useRef} from 'react';
import './Nagware.css';

declare global {
  interface Window {
      api? : any
  }
}

export default function Nagware() {

  function handleQuit() {
    window.api?.quit();
  }

  return (
    <div className="nagware">
      <div className="message">I would really appreciate if you gave me lots of money</div>

      <div className="buttons">
        <button onClick={handleQuit}>Quit</button>
      </div>

    </div>
  )
}
