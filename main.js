// Imports 
const { BrowserWindow, Menu, app, ipcMain } = require('electron')
const path = require('path')
const process = require('node:process')
const os = require('os')
const config = require('./config.json')
const nodemon = require('nodemon')
const {Howl, Howler} = require('howler');
//-




// Window
function Createwindow() {
    const win = new BrowserWindow({
        height: config.window.height,
        width: config.window.width,
        maximizable: false,
        titleBarStyle: 'customButtonsOnHover',
        icon: './Logo.png',
        icon: __dirname + './Logo (2).icns',
        webPreferences: {
        }
    });
    win.loadFile('index.html');
    win.fullScreenable = false;

}

//-



// Audio 

const sound = new Howl({
src: ['/Launcher.mp3']
})






app.whenReady().then(() => {
 sound.on('play')
  Createwindow()
      })


ipcMain.handle('play', (err) => {
  
});


ipcMain.on('stop', (err) => {
});



app.on('activate' , () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Createwindow()
    }
})


app.on('window-all-closed', () => {
    if (process.platform) {
    }
  })


app.on('window-all-closed', () => {
    if (process.platform === 'darwin')

    app.quit()
    
  })

