import {useState, useEffect, useRef} from 'react';
import './Video.css';

interface Props {

    zoom: number;
    angle: number;
    device?: MediaDeviceInfo;
    addImage: (dataURL: string) => void;
    takeSnapshot: {};
    snapshotToShow?: string;
    setFramerate: (value: number) => void;
}

export default function Video({zoom, angle, device, addImage, takeSnapshot, snapshotToShow, setFramerate}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);
    const canvasElement = useRef<HTMLCanvasElement>(null);
    const [ratio, setRatio] = useState<number>(4/3);
    // const [transitionDuration, setTransitionDuration] = useState<string>("0s");
    let transitionDuration = ".2s";
    const [flashOpacity, setFlashOpacity] = useState<number>(0);
    const [flashTransition, setFlashTransition] = useState<string>("opacity 0s");
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  
    const video = videoElement.current;
    const canvas = canvasElement.current;
    const context = canvas?.getContext("2d");

    useEffect(() => {
      return () => clearInterval(intervalId);
    },[])

    useEffect(() => {
      getVideo();
      return () => clearInterval(intervalId);
    },[device]);

    useEffect(() => {
      // transitionDuration = ".2s";    
    },[zoom, angle]);





    async function getVideo() {
      clearInterval(intervalId);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: {
              deviceId: {
                exact: device ? device.deviceId : "",
              },
            }
        })
        if (video && canvas) {
          const track = stream.getTracks()[0];
          const constraints = track.getConstraints();
          const { height, width } = track.getCapabilities();
          
          //FPS
          let count = 0;
          const frameCb = () => {
            count++;
            video.requestVideoFrameCallback(frameCb);
          }
          frameCb();

          setIntervalId(
              setInterval(() => {
              setFramerate(count);
              count = 0;
            },1000)
          );
          //
          
          if (height && width) {
            const actualHeight = height.max||480;
            const actualWidth = width.max||640;
            canvas.height = actualHeight;
            canvas.width = actualWidth;
            constraints.height = actualHeight;
            constraints.width = actualWidth;
            setRatio(actualHeight / actualWidth);
            stream.getTracks()[0].applyConstraints(constraints);
          }
          video.srcObject = stream;
        }
      }
      catch(err) {
        console.error("error:", err);
      };
    };
    
    useEffect(() => {
      if (context) {
        setFlashTransition("opacity 0s");
        setFlashOpacity(.5);
        setTimeout(() => {
          setFlashTransition("opacity .5s");
          setFlashOpacity(0);
        },50);
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

          { snapshotToShow && 
              <img style={{objectFit: "fill", position: "absolute"}} src={snapshotToShow} alt={""} onDragStart={(e) => e.preventDefault()}></img>
          }

          <div style={{objectFit: "fill", position: "absolute", backgroundColor: "white", width: "100%", height: "100%", opacity: flashOpacity, transition: flashTransition}}></div>
          <canvas id="canvas" ref={canvasElement} style={{display: "none"}}> </canvas>

      </div>
    )
}
