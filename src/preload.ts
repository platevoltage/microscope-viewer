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
    rotateLeft: (data:any) => {
        ipcRenderer.on('rotate-left',data);
        return () => {
            ipcRenderer.removeListener('rotate-left',data);
        }
    },
    rotateRight: (data:any) => {
        ipcRenderer.on('rotate-right',data);
        return () => {
            ipcRenderer.removeListener('rotate-right',data);
        }
    },
    setDevice: (data:any) => {
        ipcRenderer.on('set-device',data);
        return () => {
            ipcRenderer.removeListener('set-device',data);
        }
    },
    sendDevicesToMain: (devices: any[]) => ipcRenderer.send('receive-devices', devices),
    quit: () => ipcRenderer.send('quit')
    // sendDevicesToMain: (data: any) => console.log(data)

});
