const {ipcRenderer} = require('electron');
const fs = require('fs');
const configFile = 'config.js';
const configContent = fs.readFileSync(configFile, 'utf8');



const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.startApi.setTitle(title)
})



// Minecraft starting
const start = document.getElementById('Start')
start.addEventListener('click', function() {
const mc = require('minecraft-protocol')
const client = mc.createClient({
  host: localhost,
  port: 25565, 
  username: '',
  password: '', 
  auth: 'microsoft'
})
}) 







const toggleButton = document.getElementById('toggleButton');

let isPlaying = true;


toggleButton.addEventListener('click', () => {
  if (isPlaying) {
    ipcRenderer.invoke('stop', err)
    isPlaying = !isPlaying;
    
  } else {
    ipcRenderer.invoke('stop', err)
    isPlaying = isPlaying;
  }
});



