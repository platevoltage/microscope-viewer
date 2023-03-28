import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("api", {
    toggleSidebar: (data:any) => {
        ipcRenderer.on('toggle-sidebar',data);
        return () => {
            ipcRenderer.removeListener('toggle-sidebar',data);
        }
    },
    zoomReset: (data:any) => {
        ipcRenderer.on('zoom-reset',data);
        return () => {
            ipcRenderer.removeListener('zoom-reset',data);
        }
    },
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
    },
    setDevice: (data:any) => {
        ipcRenderer.on('set-device',data);
        return () => {
            ipcRenderer.removeListener('set-device',data);
        }
    },
    sendDevicesToMain: (devices: any[]) => ipcRenderer.send('receive-devices', devices)
    // sendDevicesToMain: (data: any) => console.log(data)

});


// contextBridge.exposeInMainWorld("api2", {
//     readData: (device: string, force?: boolean) => ipcRenderer.invoke('readData', device, force),
//     writeData: (file: Buffer, device: string, force?: boolean) => ipcRenderer.invoke('writeData', file, device, force),
//     getSupportedDevices: () => ipcRenderer.invoke('getSupportedDevices'),
//     getInfo: (device: string) => ipcRenderer.invoke('getInfo', device),
//     saveFile: (file: Buffer) => ipcRenderer.invoke('saveFile', file),
// });

