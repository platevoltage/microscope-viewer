import { app, BrowserWindow, Menu, systemPreferences } from 'electron';
import * as path from 'path';

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
  const menu = Menu.buildFromTemplate([
    {
      label: app.name, 
      submenu: [
       { label: "Quit", role: 'quit' }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
  systemPreferences.askForMediaAccess("camera");
})


app.on('window-all-closed', () => {
    app.quit();
});

