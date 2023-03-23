import {useState, useEffect, useRef} from 'react';

interface Props {
    height: number;
    width: number;
}

export default function Video({height, width}: Props) {
    const videoElement = useRef<HTMLVideoElement>(null);

  
  
    useEffect(() => {
      getVideo();
      // getDevices();
  
      // let mouseDown = false;
      // let startX = 0;
      // let startY = 0;
      // let scrollLeft = 0;
      // let scrollTop = 0;
      
      // let startDragging = function (e: any) {
      //   mouseDown = true;
      //   startX = e.clientX - window.scrollX;
      //   startY = e.clientY - window.scrollY;
      //   scrollLeft = window.scrollX;
      //   scrollTop = window.scrollY;
      // };
      // let stopDragging = function (event:any) {
      //   mouseDown = false;
      // };
      
      // window.addEventListener('mousemove', (e) => {
      //   e.preventDefault();
      //   if(!mouseDown) return; 
  
      //   const x = e.clientX - window.scrollX;
      //   const y = e.clientY - window.scrollY;
      //   let scrollX = x - startX;
      //   let scrollY = y - startY;
      //   // console.log(scrollLeft, scrollTop);
      //   console.log(y);
      //   window.scrollTo({
      //     // left: scrollLeft - scrollX,
      //     top: y,
      //     behavior: "smooth"
          
      //   });
      // });
      
      // // Add the event listeners
      // window.addEventListener('mousedown', startDragging);
      // window.addEventListener('mouseup', stopDragging);
      // window.addEventListener('mouseleave', stopDragging);
  
  
      // return () => {
      //   window.removeEventListener('mousedown', startDragging);
      //   window.removeEventListener('mouseup', stopDragging);
      //   window.removeEventListener('mouseleave', stopDragging);
  
      // }
  
  
  
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

  
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
    }
  return (
    <div>
        <video autoPlay={true} id="videoElement" ref={videoElement} style={{height: `${height}vh`, width: `${width}vw`}}>
      
      </video>
    </div>
  )
}
