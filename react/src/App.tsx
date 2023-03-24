import {useState, useEffect, useRef} from 'react';
import './App.css';
import Video from "./components/Video"
import HUD from './components/HUD';

function App() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [angle, setAngle] = useState(0);
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();
  const [showHUD, setShowHUD] = useState<boolean>(false);

  function zoomIn() {
      setHeight(height+10);
      setWidth(width+10);
  }
  function zoomOut() {
    if (height > 100) setHeight(height-10);
    if (width > 100) setWidth(width-10);
  }

  function rotateCCW() {
    setAngle(angle + 45);
  }

  function rotateCW() {
    setAngle(angle - 45);
  }

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  }

  useEffect(() => {
    (async() => {
        const devices = await getDevices();
        setDeviceList(devices.filter(devices => devices.kind === "videoinput"));
    })();
  },[]);

  useEffect(() => {
    if (deviceList) setDevice(deviceList[0]);
  },[deviceList]);
  
  return (
    <div className="App" id="container" onMouseEnter={() => setShowHUD(true)} onMouseLeave={() => setShowHUD(false)}>
      <Video height={height} width={width} angle={angle} device={device} />
      
      <div style={{transition: "opacity .5s", opacity: showHUD ? 1 : 0}}>
        <HUD zoomIn={zoomIn} zoomOut={zoomOut} rotateCCW={rotateCCW} rotateCW={rotateCW} device={device} setDevice={setDevice} deviceList={deviceList} setDeviceList={setDeviceList}/>
      </div>
    </div>
  );
}

export default App;
