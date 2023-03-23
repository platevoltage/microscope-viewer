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
  return (
    <div className="App" id="container" onClick={zoomIn}>
      <Video height={height} width={width}/>
      <HUD />
    </div>
  );
}

export default App;
