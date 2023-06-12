// Imports 
const { BrowserWindow, Menu, app, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const process = require('node:process')
const os = require('os')
const config = require('./app/config/config.json')
const nodemon = require('nodemon')
//-




// Window
function Createwindow() {
    const win = new BrowserWindow({
        height: config.window.height, 
        width: config.window.width, 
        maximizable: false,
        titleBarStyle: 'customButtonsOnHover',
        icon: './app/assets/icon/Logo.png',
        webPreferences: {
        }
    });
    win.loadFile('./app/html/index.html');
    win.fullScreenable = false;

    // To enable Developer console mode for launcher Uncomment below
    //win.openDevTools()
}








app.whenReady().then(() => {
console.log('Opening Launcher Now')
  Createwindow()
      })


app.on('activate' , () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Createwindow()
    }
})


app.on('window-all-closed', () => {
    if (process.platform) {
        console.log('Closing Launcher Now')
        process.exit()
    }
  })


app.on('window-all-closed', () => {
    if (process.platform === 'darwin')
    console.log('Closing Launcher Now')
    app.quit()
  })

