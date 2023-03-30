import { app, BrowserWindow, Menu, systemPreferences, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import { getMenuConfig } from './menu';

let showNagwareWindow = true;

const createMainWindow = () => {
  const win = new BrowserWindow({
    width: 780,
    height: 550,
    title: "Microscopic",
    minHeight: 300,
    minWidth: 400,
    visualEffectState: "active",
    // vibrancy: 'sidebar',
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

  // win.loadURL(`file://${path.join(__dirname, '../dist/build/index.html')}`); 
  win.loadURL('http://localhost:3000/');

  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });

  return win;    
};


const createNagwareWindow = (mainWindow: BrowserWindow) => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    // title: "Microscopic",
    visualEffectState: "active",
    // vibrancy: 'sidebar',
    titleBarStyle: "hidden",
    trafficLightPosition: {x: 20, y: 20},
    // frame: false,
    parent: mainWindow,
    modal: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // win.loadURL(`file://${path.join(__dirname, '../dist/build/index.html#/nag')}`); 
  win.loadURL('http://localhost:3000#/nag');

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
  const mainWindow = createMainWindow();
  systemPreferences.askForMediaAccess("camera");

  //get persistent data from localStorage
  const localStorage = await mainWindow.webContents.executeJavaScript('({...localStorage});', true);
  if ("width" && "height" in localStorage ) {
    mainWindow.setSize(+localStorage.width, +localStorage.height);
  }
  if ("x" && "y" in localStorage ) {
    mainWindow.setPosition(+localStorage.x, +localStorage.y);
  }

  //register keyboard shortcuts
  globalShortcut.register('CommandOrControl+numadd', () => {});
  globalShortcut.register('CommandOrControl+numsub', () => {});
  globalShortcut.register('CommandOrControl+0', () => {});
  globalShortcut.register('CommandOrControl+L', () => {});
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('Shift+CommandOrControl+L', () => {});

  //saves window position when moved
  mainWindow.on('moved', () => {
    const [x, y] = mainWindow.getPosition();
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("x", "${x}")`, true);
    mainWindow.webContents.executeJavaScript(`localStorage.setItem("y", "${y}")`, true);
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
        click: () => mainWindow.webContents.send('set-device', i),
      });
    });
    
    const menu = Menu.buildFromTemplate(getMenuConfig(mainWindow, deviceMenu));
    Menu.setApplicationMenu(menu);

    //syncs device menu when device is changed
    ipcMain.on('receive-devices', (_, devices) => {
      const deviceList = menu.getMenuItemById('camera-select').submenu.items;
      devices.map((device: any, i: number) => {
        if (device.selected) deviceList[i].checked = true;
      });
    });

  });
  mainWindow.show();
  mainWindow.on('close', (e) => {
    if (showNagwareWindow) {
      e.preventDefault();
      const nagwareWindow = createNagwareWindow(mainWindow);
      nagwareWindow.show();
      ipcMain.on('quit', () => {
        nagwareWindow.close();
      })
      nagwareWindow.on('close', () => {
        showNagwareWindow = false;
        app.quit();
      })
    }
  })

})


app.on('window-all-closed', () => {
    app.quit();
});

