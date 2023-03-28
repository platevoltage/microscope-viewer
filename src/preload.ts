import { contextBridge, ipcRenderer } from 'electron';
// import { setZoom } from './menu';




contextBridge.exposeInMainWorld("api", {
    zoomIn: (data:any) => {
        ipcRenderer.on('zoom-in',data);
        return () => {
            ipcRenderer.removeListener('zoom-in',data);
        }
    },
    zoomOut: (data:any) => {
        ipcRenderer.on('zoom-out',data);
        return () => {
            ipcRenderer.removeListener('zoom-out',data);
        }
    }
});


// contextBridge.exposeInMainWorld("api2", {
//     readData: (device: string, force?: boolean) => ipcRenderer.invoke('readData', device, force),
//     writeData: (file: Buffer, device: string, force?: boolean) => ipcRenderer.invoke('writeData', file, device, force),
//     getSupportedDevices: () => ipcRenderer.invoke('getSupportedDevices'),
//     getInfo: (device: string) => ipcRenderer.invoke('getInfo', device),
//     saveFile: (file: Buffer) => ipcRenderer.invoke('saveFile', file),
// });

