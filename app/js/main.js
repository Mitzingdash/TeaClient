console.time("Launched In:")
// Imports 
const { BrowserWindow, Menu, app, ipcMain, dialog} = require('electron')
const path = require('path')
const os = require('os')
const { autoUpdater } = require('electron-updater');
const {Client, Authenticator} = require('minecraft-launcher-core')
const launcher = new Client();
const {download} = require('electron-dl')


//===============================================================
// Window
function Createwindow() {
    const win = new BrowserWindow({
        height: 800, 
        width: 1300, 
        maximizable: false,
        titleBarStyle: 'customButtonsOnHover',
        icon: './app/assets/icon/Logo.png',
        title: "Teaclient",
        darkTheme: true,
        fullscreenable: false,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './scripts/preload.js'),
            // Make sure to set Devtools to debug
            devTools: true
        }
        
    });
    win.loadFile('../html/pages/index.html');
    win.openDevTools();
    

    if (os.platform === 'win32' || os.platform === 'linux') {
        win.setMenu(null)
    }
  
    
    ipcMain.on('openDirectory', (event, message) => {
        console.log(message)

        dialog.showOpenDialog({
            properties: ['openDirectory'],
            title: 'Select a directory',
            buttonLabel: 'Select',
        }).then(result => {
            if (!result.canceled) {
                const selectedDirectory = result.filePaths[0];
                // Perform actions with the selected directory
                console.log('Selected directory:', selectedDirectory);

            } else {
                // User canceled the dialog
                console.log('Dialog canceled');
            }
        }).catch(err => {
            // Handle any errors
            console.error(err);
        });
    })
    
}




// let opts = {
//   // For production launchers, I recommend not passing
//   // the getAuth function through the authorization field and instead
//   // handling authentication outside before you initialize
//   // MCLC so you can handle auth based errors and validation!
//   authorization: Authenticator.getAuth("username", "password"),
//   root: "./minecraft",
//   version: {
//     number: `Version`,
//     type: "release",
//   },
//   memory: {
//     max: `${Ram}`,
//     min: "0.5G",
//   },
// };










// Create an HTTP server

  
// reads from login and 
 
  
//===============================================================
// Ipc


    ipcMain.on('Start', () => {
        
        function startMinecraft() {
            console.time('Started Minecraft in')
            const { spawn } = require("child_process");
            const minecraftProcess = spawn('C:/Program Files/Java/jre-1.8/bin/javaw.exe', ['-jar', 'C:/Users/eveeg/AppData/Roaming/.minecraft/versions/1.8.9/1.8.9.jar']);
            console.log("123")

            minecraftProcess.on('error', (error) => {
                console.error('Failed to start Minecraft:', error);
              });
              
              minecraftProcess.on('close', (code) => {
                console.log(`Minecraft process exited with code ${code}`);
              });
        }
        startMinecraft()
        console.timeEnd("Started Minecraft in");
    })


    ipcMain.on('switchProfile', (event, name) => {
        console.time("Swwapped profile in")
        console.log(`Swapping profiles to ${name}`);
        console.timeEnd("Swwapped profile in");
    });


const startLoginServer = require("../js/scripts/script-login/login-Java");

startLoginServer();


    ipcMain.on('login', (event, name) => {
       const startLoginServer = require('../js/scripts/script-login/login-Java')

       startLoginServer()
    })
//===============================================================
// Menu
    const template = ([
        {
            label: app.name,
            submenu: [
                {
                    label: 'Close',
                    click() {
                        app.quit()
                    }
                },
                {
                    label: 'Hide',
                    click() {
                        win.hide()
                    }
                },
                {
                    label: 'Show All',
                    click() {
                        win.show()
                    }
                },
                {
                    label: 'About',
                    click() {
                        dialog.showMessageBox({
                            message: 'Teaclient is a Minecraft Launcher made for all minecraft players',
                            title: 'About',
                            buttons: ['Close']
                        })
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'Cmd+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+Cmd+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'Cmd+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'Cmd+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'Cmd+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'Cmd+A',
                    role: 'selectall'
                },
                {
                    type: 'separator'
                },
                {
                  label: 'Start Dictation',
                  accelerator: '🌐+D',
                  role: 'startDictation'
                },
                {
                    label: 'Emoji & Symbols',
                    accelerator: '🌐',
                    role: 'emojiandSymbols'
                }
            ]
        }
    ])

if (os.platform === 'darwin') {
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
}





// App
app.whenReady().then(() => {
console.log('Opening Launcher Now')
  Createwindow()
  console.timeEnd("Launched In:")
  //server.listen(50505);
  autoUpdater.checkForUpdatesAndNotify("Update avalible to update restart your launcher");
  autoUpdater.on('update-available', () => {
      console.log('Update avalible to update restart your launcher');
  })
      })


app.on('activate' , () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Createwindow()
    }
})


app.on('window-all-closed', () => {
    if (process.platform) {
        console.log('Closing Launcher Now')
        // server.close()
        // if (server.off) {
        //     console.log('Server is off')
        // }
        process.exit()
    }
  })
//===============================================================
