import {useState, useEffect, useRef} from 'react';
import './App.css';
import Video from "./components/Video"
import HUD from './components/HUD';
import Sidebar from './components/Sidebar';
import SidebarIcon from './components/SidebarIcon';

declare global {
  interface Window {
      api? : any
  }
}

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [zoom, setZoom] = useState(0);
  const [angle, setAngle] = useState(0);
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>();
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [takeSnapshot, setTakeSnapshot] = useState({});
  const [snapshotToShow, setSnapshotToShow] = useState(-1);

  useEffect(() => {
    console.log(snapshots);
    // localStorage.setItem("snapshots", JSON.stringify(snapshots));
  },[snapshots]);

  useEffect(() => {
    const removeEventListenerZoomReset = window.api?.zoomReset(() => {
      setZoom(0);
    }); 
    const removeEventListenerZoomIn = window.api?.zoomIn(() => {
      zoomIn();
    }); 
    const removeEventListenerZoomOut = window.api?.zoomOut(() => {
      zoomOut();
    }); 

    return () => {
      if (window.api) {
        removeEventListenerZoomReset();
        removeEventListenerZoomIn();
        removeEventListenerZoomOut();
      }
    }
  },[zoom])
  


  useEffect(() => {

    const savedDeviceString = localStorage.getItem("device");
    const savedSidebarString = localStorage.getItem("showSidebar");
    if (savedSidebarString) {
      const savedSidebar = +savedSidebarString;
      setShowSidebar(!!savedSidebar);
    }
    if (savedDeviceString) {
      const savedDevice = JSON.parse( savedDeviceString );
      setDevice(savedDevice);
    }

    (async() => {
        const devices = await getDevices();
        // console.log(devices);
        setDeviceList(devices.filter(devices => devices.kind === "videoinput"));
    })();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  },[]);

  useEffect(() => {
    if (deviceList && !device) {
      setDevice(deviceList[0]);
    }
    if (deviceList) {
      const _deviceList = [];
      for (let _device of deviceList) {
        _deviceList.push({
          label: _device.label,
          selected: _device.deviceId === device?.deviceId
        });
      }
      window.api?.sendDevicesToMain(_deviceList);
      const removeEventListenerSetDevice = window.api?.setDevice((_:never, id: number) => {
        setDevice(deviceList[id]);
      }); 
      return () => {
        if (window.api) removeEventListenerSetDevice();
      }
    }
  },[deviceList, device]);

  useEffect(() => {
    if (device) localStorage.setItem("device", JSON.stringify(device));
  },[device]);

  useEffect(() => {
    if (typeof showSidebar === "boolean") localStorage.setItem("showSidebar", (+showSidebar).toString());
    const removeEventListenerToggleSidebar = window.api?.toggleSidebar(() => {
      toggleSidebar();
    }); 
    return () => {
      if (window.api) removeEventListenerToggleSidebar();
    }
  },[showSidebar]);

  function handleResize() {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
    localStorage.setItem("height", window.innerHeight.toString());
    localStorage.setItem("width", window.innerWidth.toString());
  }

  function zoomIn() {
      const _zoom = zoom+10;
      setZoom(_zoom);
  }
  function zoomOut() {
    let _zoom = zoom-10;
    if (_zoom < 0) _zoom = 0;
    setZoom(_zoom);;
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
    setSnapshots([dataURL, ...snapshots]);
  }

  function snapshot() {
    setTakeSnapshot({});
  }

  function deleteSnapshot(i: number) {
    setSnapshots(snapshots.filter((_, index) => index !== i));
    setTimeout(() => {
      setSnapshotToShow(-1);
    },10);
  }

  function saveSnapshot(i: number) {
    const link = document.createElement("a");
    link.download = "snapshot.png";
    link.href = snapshots[i]; 
    link.click();
  }

  function closeSnapshot() {
    setSnapshotToShow(-1);
  }

  async function getDevices() {
    await navigator.mediaDevices.getUserMedia({video: true}); 
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  }
  
  return (
    <div className="App" onMouseEnter={() => setShowHUD(true)} onMouseLeave={() => setShowHUD(false)}>
      
      <div className="drag"></div>


      <div>
        <Video zoom={zoom} angle={angle} device={device} addImage={addImage} takeSnapshot={takeSnapshot} snapshotToShow={snapshots[snapshotToShow]} />
      </div>

      {snapshotToShow > -1 && <div style={{width: "100vw", height: "100vh", position: "fixed", top: 0, border: "10px solid black", pointerEvents: "none"}}></div>}

      <div style={{position: "absolute", transitionProperty: "opacity, left", transitionDuration: ".5s, .1s", opacity: showHUD ? 1 : 0, left: `${showSidebar ? 11 : 1}em`, zIndex: "2"}}>
        <HUD zoomIn={zoomIn} zoomOut={zoomOut} rotateCCW={rotateCCW} rotateCW={rotateCW} device={device} setDevice={setDevice} deviceList={deviceList} setDeviceList={setDeviceList} takeSnapshot={snapshot} closeSnapshot={closeSnapshot} showSnapshot={snapshotToShow > -1}/>
        {!showSidebar && <SidebarIcon toggleSidebar={toggleSidebar} />}
      </div>


      <div style={{position: "absolute", transition: "left .1s", left: `${showSidebar ? 0 : -10}em`}}>
        <Sidebar snapshots={snapshots} deleteSnapshot={deleteSnapshot} saveSnapshot={saveSnapshot} setSnapshotToShow={setSnapshotToShow}/>
        {showSidebar && <SidebarIcon toggleSidebar={toggleSidebar} />}
      </div>


    </div>
  );
}

export default App;
