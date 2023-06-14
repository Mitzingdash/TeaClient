const {contextBridge, ipcRenderer} = require('electron')
function start() {
    ipcRenderer.send('start', err)
  }
  
  contextBridge.exposeInMainWorld('closeApi', () => {
    ipcRenderer.send('close')
  })
    
  
  // 
  // buttons
  contextBridge.getElementById('start').addEventListener('click', start())
  