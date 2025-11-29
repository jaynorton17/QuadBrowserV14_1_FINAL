
const path = require('path');
const os = require('os');
const { app, BrowserWindow, ipcMain } = require('electron');

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('use-gl','swiftshader');
app.commandLine.appendSwitch('enable-webgl');
// Using the legacy network stack avoids noisy D-Bus lookups for NetworkManager
// on environments where it is not installed (e.g. minimal containers).
app.commandLine.appendSwitch('disable-features','NetworkService');

// Point user data at a dedicated, writable directory to prevent service worker
// storage errors caused by stale or read-only default profiles.
app.setPath('userData', path.join(os.homedir(), '.config', 'quadbrowser'));

let mainWin, remoteWin;

function createMain() {
  mainWin = new BrowserWindow({
    width:1920, height:1080,
    frame:false,
    backgroundColor:"#000",
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false,
      webviewTag:true,
      sandbox:false,
      allowRunningInsecureContent:true,
      javascript:true
    }
  });
  mainWin.loadFile("main.html");
}

function createRemote(){
  remoteWin = new BrowserWindow({
    width:260, height:500,
    frame:false,
    backgroundColor:"#111",
    alwaysOnTop:true,
    webPreferences:{nodeIntegration:true,contextIsolation:false}
  });
  remoteWin.loadFile("remote.html");
}

app.whenReady().then(()=>{createMain();createRemote();});

ipcMain.on('set-screens-count',(e,c)=>mainWin.webContents.send('set-screens-count',c));
ipcMain.on('set-screen-url',(e,p)=>mainWin.webContents.send('set-screen-url',p));
ipcMain.on('zoom-action',(e,a)=>mainWin.webContents.send('zoom-action',a));
ipcMain.on('zoom-updated',(e,v)=>remoteWin.webContents.send('zoom-updated',v));
ipcMain.on('start-clicker',(e,p)=>mainWin.webContents.send('start-clicker',p));
ipcMain.on('stop-clicker',(e,i)=>mainWin.webContents.send('stop-clicker',i));
