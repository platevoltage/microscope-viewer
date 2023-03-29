import { app, BrowserWindow, Menu, systemPreferences, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import { getMenuConfig } from './menu';


const createWindow = () => {
  const win = new BrowserWindow({
    width: 780,
    height: 550,
    title: "Microscopic",
    minHeight: 300,
    minWidth: 400,
    visualEffectState: "active",
    vibrancy: 'sidebar',
    titleBarStyle: "hidden",
    trafficLightPosition: {x: 20, y: 20},
    // frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
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
  applicationName: "Microscopic", 
  applicationVersion: "Version",
  version: "1.0.0",
  // credits: "Credits",
  copyright: "(c) Garrett Corbin 2023"
});

app.whenReady().then(async () => {
  const win = createWindow();
  systemPreferences.askForMediaAccess("camera");

  //get persistent data from localStorage
  const localStorage = await win.webContents.executeJavaScript('({...localStorage});', true);
  if ("width" && "height" in localStorage ) {
    win.setSize(+localStorage.width, +localStorage.height);
  }
  if ("x" && "y" in localStorage ) {
    win.setPosition(+localStorage.x, +localStorage.y);
  }

  //register keyboard shortcuts
  globalShortcut.register('CommandOrControl+numadd', () => {});
  globalShortcut.register('CommandOrControl+numsub', () => {});
  globalShortcut.register('CommandOrControl+0', () => {});
  globalShortcut.register('CommandOrControl+L', () => {});
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('Shift+CommandOrControl+L', () => {});

  //saves window position when moved
  win.on('moved', () => {
    const [x, y] = win.getPosition();
    win.webContents.executeJavaScript(`localStorage.setItem("x", "${x}")`, true);
    win.webContents.executeJavaScript(`localStorage.setItem("y", "${y}")`, true);
  })
  
  //waits for device list
  ipcMain.once('receive-devices', (_, devices) => {

    //adds device list to menu
    const deviceMenu = [];
    devices.map((device: any, i: number) => {
      deviceMenu.push({
        label: device.label,
        type: "radio",
        checked: device.selected,
        id: i,
        click: () => win.webContents.send('set-device', i),
      });
    });
    
    const menu = Menu.buildFromTemplate(getMenuConfig(win, deviceMenu));
    Menu.setApplicationMenu(menu);

    //syncs device menu when device is changed
    ipcMain.on('receive-devices', (_, devices) => {
      const deviceList = menu.getMenuItemById('camera-select').submenu.items;
      devices.map((device: any, i: number) => {
        if (device.selected) deviceList[i].checked = true;
      });
    });

  });

  win.show();

})


app.on('window-all-closed', () => {
    app.quit();
});

