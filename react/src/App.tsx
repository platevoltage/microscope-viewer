import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  useEffect(() => {
    getVideo();
    getDevices();
    // setTimeout(() => {
    //   navigator.mediaDevices.
    // },2000)
  },[]);
  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ 
        video: {
          deviceId: {
            exact: "8772118CA0398C5472E334DF14A5C527F57AE791",
            // exact: "f6645729ac74f1e32f0c8d7bf2c193a57a08b2d70a48844e686b3a7f73d41aac"
          },
          // width: { min: 1280 },
          // height: { min: 720 },
        },
        
      })
      .then(stream => {
        let video = videoElement.current;
        if (video) {
          video.srcObject = stream;
          // video.play();
        }
      })
      .catch(err => {
        console.error("error:", err);
      });
  };
  function zoomIn() {
    setHeight(height+10);
    setWidth(width+10);
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
