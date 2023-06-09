import {useState, useEffect, useCallback} from 'react';
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
  const [, setWidth] = useState(0);
  const [, setHeight] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [angle, setAngle] = useState(0);
  const [device, setDevice] = useState<MediaDeviceInfo>();
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>();
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [takeSnapshot, setTakeSnapshot] = useState({});
  const [snapshotToShow, setSnapshotToShow] = useState(-1);
  const [framerate, setFramerate] = useState(0);

  const zoomIn = useCallback(() => {
    setZoom(zoom + 10);
  },[zoom]);

  const zoomOut = useCallback(() => {
    setZoom(zoom > 10 ? zoom - 10 : 0);
  }, [zoom])

  function zoomActual() {
    setZoom(0);
    setAngle(0);
  }

  const rotateCCW = useCallback(() => {
    setAngle(angle - 45);
  },[angle])

  const rotateCW = useCallback(() => {
    setAngle(angle + 45);
  },[angle])


  useEffect(() => {
    const removeEventListenerZoomReset = window.api?.zoomReset(() => setZoom(0)); 
    const removeEventListenerZoomIn = window.api?.zoomIn(zoomIn); 
    const removeEventListenerZoomOut = window.api?.zoomOut(zoomOut); 
    const removeEventListenerRotateLeft = window.api?.rotateLeft(rotateCCW); 
    const removeEventListenerRotateRight = window.api?.rotateRight(rotateCW); 
    return () => {
      if (window.api) {
        removeEventListenerZoomReset();
        removeEventListenerZoomIn();
        removeEventListenerZoomOut();
        removeEventListenerRotateLeft();
        removeEventListenerRotateRight();
      }
    }
  },[zoom, angle, setZoom, zoomIn, zoomOut, rotateCCW, rotateCW])
  


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

    (async () => {
      const devices = await getDevices();
      // console.log(devices);
      setDeviceList(devices.filter(device => device.kind === "videoinput"));
    })();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  },[]);

  useEffect(() => {
    //if no device stored in localStorage
    if (deviceList && !device) {
      let _device = deviceList[0];
      for (let i in deviceList) {
        if (deviceList[i].label.includes("Microscope")) {
          _device = deviceList[i];
          break;
        }
      }
      setDevice(_device);
    }
    //

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

  const toggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  },[showSidebar])


  useEffect(() => {
    if (typeof showSidebar === "boolean") localStorage.setItem("showSidebar", (+showSidebar).toString());
    const removeEventListenerToggleSidebar = window.api?.toggleSidebar(() => {
      toggleSidebar();
    }); 
    return () => {
      if (window.api) removeEventListenerToggleSidebar();
    }
  },[showSidebar, toggleSidebar]);

  function handleResize() {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
    localStorage.setItem("height", window.innerHeight.toString());
    localStorage.setItem("width", window.innerWidth.toString());
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
    // await navigator.mediaDevices.getUserMedia({video: true}); 
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
    return devices;
  }
  
  return (

    <div className="App" onMouseEnter={() => setShowHUD(true)} onMouseLeave={() => setShowHUD(false)}>
      
      <div className="drag"></div>

      <div>
        <Video zoom={zoom} angle={angle} device={device} addImage={addImage} takeSnapshot={takeSnapshot} snapshotToShow={snapshots[snapshotToShow]} setFramerate={setFramerate}/>
      </div>

      {snapshotToShow > -1 && <div style={{width: "100vw", height: "100vh", position: "fixed", top: 0, border: "10px solid black", pointerEvents: "none"}}></div>}

      <div style={{position: "absolute", transitionProperty: "opacity, left", transitionDuration: ".5s, .1s", opacity: showHUD ? 1 : 0, left: `${showSidebar ? 11 : 1}em`, zIndex: "2"}}>
        <HUD zoomIn={zoomIn} zoomOut={zoomOut} zoomActual={zoomActual} rotateCCW={rotateCCW} rotateCW={rotateCW} device={device} setDevice={setDevice} deviceList={deviceList} setDeviceList={setDeviceList} takeSnapshot={snapshot} closeSnapshot={closeSnapshot} showSnapshot={snapshotToShow > -1} framerate={framerate}/>
        {!showSidebar && <SidebarIcon toggleSidebar={toggleSidebar} />}
      </div>


      <div style={{position: "absolute", transition: "left .1s", left: `${showSidebar ? 0 : -10}em`}}>
        <Sidebar snapshots={snapshots} deleteSnapshot={deleteSnapshot} saveSnapshot={saveSnapshot} snapshotToShow={snapshotToShow} setSnapshotToShow={setSnapshotToShow}/>
        {showSidebar && <SidebarIcon toggleSidebar={toggleSidebar} />}
      </div>


    </div>

  );
}

export default App;
