import {useState, useEffect, useRef} from 'react';
import './HUD.css'

interface Props {
    zoomIn: () => void;
    zoomOut: () => void;
    device?: MediaDeviceInfo;
    setDevice(device: MediaDeviceInfo): void;
    deviceList?: MediaDeviceInfo[];
    setDeviceList(deviceList: MediaDeviceInfo[]): void;
}

async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
}


export default function HUD({zoomIn, zoomOut, device, setDevice, deviceList, setDeviceList}: Props) {
    // const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>();
    // const [device, setDevice] = useState<string>();

    function handleChange(e: any) {
        const index: number = e.target.value;
        console.log(deviceList);
        if (deviceList) setDevice(deviceList[index]);
    }


    return (
        <div className="HUD">
            <button onClick={zoomIn}>+</button>
            <button onClick={zoomOut}>-</button>
            <select name="device-select" id="device-select" onChange={handleChange}>

            {deviceList?.map((device, i) =>
                <option key={i} value={i}>
                    {device.label}
                </option>    
            )}
            </select>
        </div>
    )
}
