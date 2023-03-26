import {useState, useEffect, useRef} from 'react';
import './Video.css';

interface Props {

    zoom: number;
    angle: number;
    device?: MediaDeviceInfo;
    addImage: (dataURL: string) => void;
    takeSnapshot: {};
    snapshotToShow?: string;
}

export default function Video({zoom, angle, device, addImage, takeSnapshot, snapshotToShow}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const [ratio, setRatio] = useState<number>(4/3);
    // const [transitionDuration, setTransitionDuration] = useState<string>("0s");
    let transitionDuration = ".2s";
  
    useEffect(() => {
      getVideo();  
    },[device]);

    useEffect(() => {
      // transitionDuration = ".2s";    
    },[zoom, angle]);

    const video = videoElement.current;
    const canvas = canvasElement.current;
    const context = canvas?.getContext("2d");

    async function getVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              deviceId: {
                exact: device ? device.deviceId : "",
              },
            }
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
    //makes sure video always fills window and is scrollable
    if (width < height/ratio) {
      width = height/ratio;
    }
    if (height < width*ratio) {
      height = width*ratio;
    }


    const heightString = `${height}px`;
    const widthString = `${width}px`;

    function isPortrait() {
      return angle%180;
    }

    const transformString = `rotate(${angle}deg) scale(${isPortrait() ? 1/ratio : 1})`;


    return (
      <div style={{transform: transformString, position: "relative", overflow: "scroll", height: heightString, width: widthString, transitionDuration}}>

          <video autoPlay={true} id="videoElement" ref={videoElement} ></video>

          <img style={{objectFit: "fill", position: "absolute"}} src={snapshotToShow} alt={""} onDragStart={(e) => e.preventDefault()}></img>

          <canvas id="canvas" ref={canvasElement} style={{display: "none"}}> </canvas>
          
      </div>
    )
}
