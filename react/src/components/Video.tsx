import {useState, useEffect, useRef} from 'react';

interface Props {
    height: number;
    width: number;
    angle: number;
    device?: MediaDeviceInfo;
}

export default function Video({height, width, angle, device}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const photoElement = useRef<HTMLImageElement>(null);

  
  
    useEffect(() => {
      getVideo();  
    },[device]);



  
    async function getVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              deviceId: {
                exact: device ? device.deviceId : "",
              },
              // height: 200,
              // width: 200
            },
        })
        const {height, width} = stream.getTracks()[0].getSettings();
        const video = videoElement.current;
        const canvas = canvasElement.current;
        
        
        const photo = photoElement.current;
        if (video && canvas) {
          canvas.height = height || 100;
          canvas.width = width || 100;
          canvas.style.width = "1000px";
          canvas.style.height = "1000px";
          video.srcObject = stream;
          const context = canvas.getContext("2d");
          setTimeout(() => {

            if (context && photo) {
              console.log(stream.getTracks()[0].getSettings());
              // context.fillStyle = "#0000ff";
              // context.fillRect(0, 0, 5000, 5000);  
              context.drawImage(video, 0, 0);
              const data = canvas.toDataURL("image/png");
              photo.setAttribute("src", data);
            }
          },2000)
        }
      }
      catch(err) {
        console.error("error:", err);
      };
    };

  
  return (
    <div style={{position: "relative"}}>
        <div className="output" style={{position: "absolute", backgroundColor: "#ffffff", zIndex: "10", right: 0, top: 0}}>
          <img id="photo" ref={photoElement} alt="The screen capture will appear in this box." />
        </div>
        {/* <div className="output" style={{position: "absolute", backgroundColor: "#ffffff", width: "100px", height: "100px", zIndex: "10", right: 100, bottom: 0}}>
        </div> */}
        <video autoPlay={true} id="videoElement" ref={videoElement} style={{height: `${height}vh`, width: `${width}vw`, transform: `rotate(${angle}deg)`}}></video>
        <canvas id="canvas" ref={canvasElement} style={{display: "none"}}> </canvas>
    </div>
  )
}
