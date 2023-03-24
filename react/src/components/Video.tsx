import {useState, useEffect, useRef} from 'react';
import './Video.css';

interface Props {
    height: number;
    width: number;
    angle: number;
    device?: MediaDeviceInfo;
    addImage: (dataURL: string) => void;
    takeSnapshot: {};
}

export default function Video({height, width, angle, device, addImage, takeSnapshot}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const photoElement = useRef<HTMLImageElement>(null);

  
  
    useEffect(() => {
      getVideo();  
    },[device]);



    const video = videoElement.current;
    const canvas = canvasElement.current;
    const photo = photoElement.current;
    const context = canvas?.getContext("2d");
    let stream: MediaStream;
    async function getVideo() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              deviceId: {
                exact: device ? device.deviceId : "",
              },
              // height: 200,
              // width: 200
            },
        })
        const {height, width} = stream.getTracks()[0].getSettings();
        // const video = videoElement.current;
        // const canvas = canvasElement.current;
        // const photo = photoElement.current;

        if (video && canvas) {
          canvas.height = height || 100;
          canvas.width = width || 100;
          canvas.style.width = "1000px";
          canvas.style.height = "1000px";
          video.srcObject = stream;
          // const context = canvas.getContext("2d");
          // setTimeout(() => {

          //   if (context) {
          //     console.log(stream.getTracks()[0].getSettings()); 
          //     context.drawImage(video, 0, 0);
          //     const data = canvas.toDataURL("image/png");
          //     addImage(data);
          //     // photo.setAttribute("src", data);
          //   }
          // },2000)
        }
      }
      catch(err) {
        console.error("error:", err);
      };
    };
    
    useEffect(() => {
      if (context) {
        context.drawImage(video as CanvasImageSource, 0, 0);
        const data = canvas?.toDataURL("image/png");
        if (data) addImage(data);
      }
    },[takeSnapshot])
  
  return (
    <div style={{position: "relative"}}>
        <video autoPlay={true} id="videoElement" ref={videoElement} style={{height: `${height}vh`, width: `${width}vw`, transform: `rotate(${angle}deg)`}}></video>
        <canvas id="canvas" ref={canvasElement} style={{display: "none"}}> </canvas>
    </div>
  )
}
