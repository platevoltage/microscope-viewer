import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(150);

  useEffect(() => {
    getVideo();
    // getDevices();


    let mouseDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    // const windowEl = window as unknown as HTMLElement;
    
    let startDragging = function (e: any) {
      mouseDown = true;
      startX = e.pageX - window.pageXOffset;
      startY = e.pageY - window.pageYOffset;
      scrollLeft = window.scrollX;
      scrollTop = window.scrollY;
    };
    let stopDragging = function (event:any) {
      mouseDown = false;
    };
    
    window.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if(!mouseDown) { return; }
      console.log(e);
      const x = e.pageX - window.pageXOffset;
      const y = e.pageY - window.pageYOffset;
      const scrollX = x - startX;
      const scrollY = y - startY;
      window.scrollTo(scrollLeft - scrollX, scrollTop - scrollY);
    });
    
    // Add the event listeners
    window.addEventListener('mousedown', startDragging, false);
    window.addEventListener('mouseup', stopDragging, false);
    window.addEventListener('mouseleave', stopDragging, false);






  },[]);

  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ 
        video: {
          deviceId: {
            exact: "8772118CA0398C5472E334DF14A5C527F57AE791",
            // exact: "f6645729ac74f1e32f0c8d7bf2c193a57a08b2d70a48844e686b3a7f73d41aac"
          },
        },
        
      })
      .then(stream => {
        let video = videoElement.current;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("error:", err);
      });
  };
  function zoomIn() {
    // setHeight(height+10);
    // setWidth(width+10);
  }

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
  }

  return (
    <div className="App" id="container" onClick={zoomIn}>
      <video autoPlay={true} id="videoElement" ref={videoElement} style={{height: `${height}vh`, width: `${width}vw`}}>
      
      </video>
    </div>
  );
}

export default App;
