// Imports 
const { BrowserWindow, Menu, app, ipcMain, dialog} = require('electron')
const path = require('path')
const os = require('os')
const config = require('./app/config/config.json')
const { spawn } = require('child_process');
const http = require('http');
const axios = require('axios');

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
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, './app/js/preload.js')
        }
    });
    win.loadFile('./app/html/index.html');
    win.fullScreenable = false;
    if (os.platform === 'win32' || os.platform === 'linux') {
        win.setMenu(null)
    }
    // To enable Developer console mode for launcher Uncomment below
    // win.openDevTools()
}

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    if (req.url.startsWith('/?code=')) {
        const urlParams = new URLSearchParams(req.url.slice(2));
        const code = urlParams.get('code');
        console.log('Code:', code);
        let accessToken = await getAccessToken(code);
        let xboxToken = await xboxAuthenticate(accessToken);
        let xstsResponse = await getXSTSToken(xboxToken)
        let xstsToken = xstsResponse[0];
        let userHash = xstsResponse[1];
        getBearerToken(userHash,xstsToken);

    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <html>
          <head></head>
          <body>
          <h1>If you are seeing this, you have failed to login and something has been currupted if you experience this please summit a issue</h1>
          <h1>
            <script>
                window.onload = ()=>{window.close()}
            </script>
          </body>
        </html>
    `);
});

function getBearerToken(userhash,xstsToken) {
    const url = 'https://api.minecraftservices.com/authentication/login_with_xbox';
    const body = {
      "identityToken": `XBL3.0 x=${userhash};${xstsToken}`,
      "ensureLegacyEnabled": true
    };
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    };
    
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        // Handle the response data
        console.log(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
}

async function getXSTSToken(token) {
    const url = 'https://xsts.auth.xboxlive.com/xsts/authorize';
    const body = {
    "Properties": {
        "SandboxId": "RETAIL",
        "UserTokens": [
            token
        ]
    },
    "RelyingParty": "rp://api.minecraftservices.com/",
    "TokenType": "JWT"
    };

    const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    };

    const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
    };

    return await fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
        // Handle the response data
        console.log("Got XSTS Token");
        return [data.Token,data.DisplayClaims.xui[0].uhs];
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
    });
}

async function getAccessToken(code) {
    const url = 'https://login.live.com/oauth20_token.srf';
    const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams();
    body.append('client_id', '6a6bf548-5a82-41f5-9451-88b334cdc77f');
    body.append('client_secret', 'nwC8Q~rBtW.hFgXjPPSLRQeuuSd7dkWr4Vg-Sdve');
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', 'http://localhost:50505');

    return await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => response.json())
    .then(data => {
        console.log("Got Access Token")
        return data.access_token;
    })
    .catch(error => {
        console.error(error);
    });
}

async function xboxAuthenticate(authToken) {
    return await axios.post(
        "https://user.auth.xboxlive.com/user/authenticate",
        {
            Properties: {
                AuthMethod: "RPS",
                SiteName: "user.auth.xboxlive.com",
                RpsTicket: "d=" + authToken, // the token
            },
            RelyingParty: "http://auth.xboxlive.com",
            TokenType: "JWT",
         },
         {
             headers: {
                 "Content-Type": "application/json",
                 Accept: "application/json",
             },
          }
     )
     .then((json) => {
        console.log("Got XBOX Token")
        return json.data.Token;
     })
     .catch((e) => console.error("error", e));
}
  
  

  
//===============================================================
// Ipc
    ipcMain.on('Start', () => {
        
        function startMinecraft() {
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
    })


    ipcMain.on('switchProfile', (event, name) => {
        console.log(`Swapping profiles to ${name}`);
    });


    ipcMain.on('login', (event, name) => {
       
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
  server.listen(50505);
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
//===============================================================
