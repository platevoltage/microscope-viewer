import {useState, useEffect, useRef} from 'react';
import './App.css';
import Video from "./components/Video"
import HUD from './components/HUD';

function App() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();

  function zoomIn() {
      setHeight(height+10);
      setWidth(width+10);
  }
  function zoomOut() {
    if (height > 100) setHeight(height-10);
    if (width > 100) setWidth(width-10);
  }
  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  }

  useEffect(() => {
    ( async() => setDeviceList(await getDevices()) )();
  },[]);

  useEffect(() => {
    if (deviceList) setDevice(deviceList[0]);
  },[deviceList]);
  
  return (
    <div className="App" id="container">
      <Video height={height} width={width} device={device} />
      <HUD zoomIn={zoomIn} zoomOut={zoomOut} device={device} setDevice={setDevice} deviceList={deviceList} setDeviceList={setDeviceList}/>
    </div>
  );
}

export default App;
