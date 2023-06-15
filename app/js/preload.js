const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('startMC', ()=>{
    ipcRenderer.send('Start')
})

contextBridge.exposeInMainWorld('switchProfile', (name) => {
  ipcRenderer.send('switchProfile', name);
});

contextBridge.exposeInMainWorld('login', ()=>{
  ipcRenderer.send('login')
})