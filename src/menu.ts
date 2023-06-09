import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';
const isMac = process.platform === 'darwin';


export function getMenuConfig(win: BrowserWindow, deviceMenu: any[]): any {
  return [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        // { role: 'reload' },
        // { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { 
          label: 'Toggle Sidebar' , 
          click: () => win.webContents.send('toggle-sidebar'),
          accelerator: 'Shift+CommandOrControl+L',
        },
        { type: 'separator' },
        { 
          label: 'Actual Size' , 
          click: () => win.webContents.send('zoom-reset'),
          accelerator: 'CommandOrControl+0',
        },
        { 
          label: 'Zoom In' , 
          click: () => win.webContents.send('zoom-in'),
          accelerator: 'CommandOrControl+numadd',
        },
        { 
          label: 'Zoom Out', 
          click: () => win.webContents.send('zoom-out'),
          accelerator: 'CommandOrControl+numsub',
        },
        { 
          label: 'Rotate Left', 
          click: () => win.webContents.send('rotate-left'),
          accelerator: 'CommandOrControl+L',
        },
        { 
          label: 'Rotate Right', 
          click: () => win.webContents.send('rotate-right'),
          accelerator: 'CommandOrControl+R',
        },
        { type: 'separator' },
        {
          label: 'Camera Select',
          id: 'camera-select',
          submenu: [
            ...deviceMenu
          ]
        }

        // { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          id: 'test',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        },
      ]
    },
  ]
}