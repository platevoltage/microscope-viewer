import { app, BrowserWindow, Menu, systemPreferences } from 'electron';
import * as path from 'path';

const isMac = process.platform === 'darwin';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 780,
    height: 550,
    title: "Microscope",
    // fullscreen: true,
    // kiosk: true,
    minHeight: 300,
    minWidth: 400,


    visualEffectState: "active",
    vibrancy: 'sidebar',
    // resizable: false,
    // maximizable: false,
    // movable: false,
    titleBarStyle: "hidden",
    trafficLightPosition: {x: 20, y: 20},
    // useContentSize: true,
    // frame: false,
    show: false,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      // preload: path.join(__dirname, 'extensionScript.js')
    }
  });

  // win.loadFile(path.join(__dirname, './build/index.html')) 
  win.loadURL('http://localhost:3000')
  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });
  return win
      
};


app.whenReady().then(async () => {

  const win = createWindow();
  const localStorage = await win.webContents.executeJavaScript('({...localStorage});', true);

  if ("width" && "height" in localStorage ) {
    win.setSize(+localStorage.width, +localStorage.height);
  }

  win.show();
  
  // note: your contextMenu, Tooltip and Title code will go here!
  const template: any = [
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
        // { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
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
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template);
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: app.name, 
  //     submenu: [
  //      { label: "Quit", role: 'quit' }
  //     ]
  //   }
  // ]);
  Menu.setApplicationMenu(menu);
  systemPreferences.askForMediaAccess("camera");
})


app.on('window-all-closed', () => {
    app.quit();
});

