import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getVideo();
    // getDevices();
  },[]);
  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ 
        video: {
          deviceId: {
            exact: "8772118CA0398C5472E334DF14A5C527F57AE791",
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
