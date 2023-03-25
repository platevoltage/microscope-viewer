import {useState, useEffect, useRef} from 'react';
import './Video.css';

interface Props {

    zoom: number;
    angle: number;
    device?: MediaDeviceInfo;
    addImage: (dataURL: string) => void;
    takeSnapshot: {};
}

export default function Video({zoom, angle, device, addImage, takeSnapshot}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const [ratio, setRatio] = useState<number>(4/3);
    

  
  
    useEffect(() => {
      getVideo();  
    },[device]);



    const video = videoElement.current;
    const canvas = canvasElement.current;
    const context = canvas?.getContext("2d");
    // let streamSettings;
    let stream: MediaStream;
    async function getVideo() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              deviceId: {
                exact: device ? device.deviceId : "",
              },
            },
        })
        if (video && canvas) {
          const { height, width } = stream.getTracks()[0].getSettings();
          canvas.height = height || 100;
          canvas.width = width || 100;
          setRatio((height||4) / (width||3));
          canvas.style.width = "1000px";
          canvas.style.height = "1000px";
          video.srcObject = stream;
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


    let width = window.innerWidth + window.innerWidth*(zoom/100);
    let height = window.innerHeight + window.innerHeight*(zoom/100);
    if (width < height/ratio) {
      width = height/ratio;
    }
    if (height < width*ratio) {
      height = width*ratio;
    }

    const heightString = `${height}px`;
    const widthString = `${width}px`;


    return (
      <div style={{position: "relative", overflow: "scroll"}}>
          <video autoPlay={true} id="videoElement" ref={videoElement} style={{ transform: `rotate(${angle}deg)`, height: heightString, width: widthString}}></video>
          <canvas id="canvas" ref={canvasElement} style={{display: "none"}}> </canvas>
      </div>
    )
}
