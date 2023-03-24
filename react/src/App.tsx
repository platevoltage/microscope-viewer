import {useState, useEffect, useRef} from 'react';
import './App.css';
import Video from "./components/Video"
import HUD from './components/HUD';
import Sidebar from './components/Sidebar';
import SidebarIcon from './components/SidebarIcon';

function App() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [angle, setAngle] = useState(0);
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [snapshots, setSnapshots] = useState<string[]>([]);

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

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  function addImage(dataURL: string) {
    setSnapshots([...snapshots, dataURL]);
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

  useEffect(() => {
    console.log(snapshots);
  },[snapshots]);
  
  return (
    <div className="App" onMouseEnter={() => setShowHUD(true)} onMouseLeave={() => setShowHUD(false)}>
      <div>
        <Video height={height} width={width} angle={angle} device={device} addImage={addImage}/>
      </div>
      <div style={{position: "absolute", transitionProperty: "opacity, left", transitionDuration: ".5s, .1s", opacity: showHUD ? 1 : 0, left: `${showSidebar ? 11 : 1}em`, zIndex: "1"}}>
        <HUD zoomIn={zoomIn} zoomOut={zoomOut} rotateCCW={rotateCCW} rotateCW={rotateCW} device={device} setDevice={setDevice} deviceList={deviceList} setDeviceList={setDeviceList} />
      </div>
      <div style={{position: "absolute", transition: "left .1s", left: `${showSidebar ? 0 : -10}em`}}>
        <Sidebar snapshots={snapshots}/>
        <SidebarIcon toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}

export default App;
