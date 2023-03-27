import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld("api", {
    login: () => ipcRenderer.send('log-in-button-clicked'),
    zoomIn: (data:any) => ipcRenderer.on('zoom-in',data),
    zoomOut: (data:any) => ipcRenderer.on('zoom-out',data),
});

// contextBridge.exposeInMainWorld("api2", {
//     readData: (device: string, force?: boolean) => ipcRenderer.invoke('readData', device, force),
//     writeData: (file: Buffer, device: string, force?: boolean) => ipcRenderer.invoke('writeData', file, device, force),
//     getSupportedDevices: () => ipcRenderer.invoke('getSupportedDevices'),
//     getInfo: (device: string) => ipcRenderer.invoke('getInfo', device),
//     saveFile: (file: Buffer) => ipcRenderer.invoke('saveFile', file),
// });

