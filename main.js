
const { app, BrowserWindow, ipcMain } = require('electron');

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('use-gl','swiftshader');
app.commandLine.appendSwitch('enable-webgl');

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
