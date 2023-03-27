import { app, BrowserWindow, Menu, systemPreferences } from 'electron';
import * as path from 'path';
import { menuConfig } from './menu';


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
  win.loadURL('http://localhost:3000');

  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });

  return win;    
};

app.setAboutPanelOptions({
  applicationName: "Microscope Viewer", 
  applicationVersion: "Version",
  version: "1.0.0",
  // credits: "Credits",
  copyright: "(c) Garrett Corbin 2023"
});

app.whenReady().then(async () => {

  const win = createWindow();
  const localStorage = await win.webContents.executeJavaScript('({...localStorage});', true);
  // console.log(localStorage)

  if ("width" && "height" in localStorage ) {
    win.setSize(+localStorage.width, +localStorage.height);
  }
  if ("x" && "y" in localStorage ) {
    win.setPosition(+localStorage.x, +localStorage.y);
  }

  win.show();
  
  win.on('moved', () => {
    const [x, y] = win.getPosition();
    win.webContents.executeJavaScript(`localStorage.setItem("x", "${x}")`, true);
    win.webContents.executeJavaScript(`localStorage.setItem("y", "${y}")`, true);
  })
  const menu = Menu.buildFromTemplate(menuConfig);
  Menu.setApplicationMenu(menu);

  systemPreferences.askForMediaAccess("camera");
})


app.on('window-all-closed', () => {
    app.quit();
});

