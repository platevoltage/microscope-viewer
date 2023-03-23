import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getVideo();
    getDevices();
  },[]);
  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ 
        video: {
          deviceId: {
            exact: "f6645729ac74f1e32f0c8d7bf2c193a57a08b2d70a48844e686b3a7f73d41aac",
          },
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
  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
  }

  return (
    <div className="App" id="container">
      <video autoPlay={true} id="videoElement" ref={videoElement}>
      
      </video>
    </div>
  );
}

export default App;
