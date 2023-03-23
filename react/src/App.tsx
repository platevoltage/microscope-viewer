import {useState, useEffect, useRef} from 'react';
import './App.css';
import Video from "./components/Video"
import HUD from './components/HUD';

function App() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  function zoomIn() {
      setHeight(height+10);
      setWidth(width+10);
  }
  function zoomOut() {
    if (height > 100) setHeight(height-10);
    if (width > 100) setWidth(width-10);
}
  return (
    <div className="App" id="container">
      <Video height={height} width={width}/>
      <HUD zoomIn={zoomIn} zoomOut={zoomOut}/>
    </div>
  );
}

export default App;
