import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 780,
    height: 550,
    title: "Stella Invoice",
    // fullscreen: true,
    // kiosk: true,
    // visualEffectState: "active",
    // vibrancy: 'sidebar',
    resizable: false,
    // maximizable: false,
    // movable: false,
    titleBarStyle: "hiddenInset",
    // useContentSize: true,
    // frame: false,
    // show: false,
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      // preload: path.join(__dirname, 'extensionScript.js')
    }
  });

  win.loadFile(path.join(__dirname, './build/index.html')) 

  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });
  return win
      
};


app.whenReady().then(async () => {

  const win = createWindow();
  win.webContents.executeJavaScript('console.log("test")')
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
})


app.on('window-all-closed', () => {
    app.quit();
});

