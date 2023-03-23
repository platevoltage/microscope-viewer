import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getVideo();
  },[]);
  function getVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
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
  return (
    <div className="App" id="container">
      <video autoPlay={true} id="videoElement" ref={videoElement}>
      
      </video>
    </div>
  );
}

export default App;
