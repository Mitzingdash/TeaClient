let settings = null;
        if(!localStorage.settings) {
            settings = {
                ram: 4,
                keepLauncherOpen: false,
                directory: "C:\\Users\\jedij\\AppData\\Roaming\\.minecraft",
                resolution: {
                    width: 1920,
                    height: 1080
                }
            };
        } else {
            settings = JSON.parse(localStorage.settings);
            document.getElementById('ram').value = settings.ram;
            document.getElementById('allocatedMemory').innerHTML = settings.ram+`Gb Allocated`
            document.getElementById('resWidth').value = settings.resolution.width;
            document.getElementById('resHeight').value = settings.resolution.height;
        }
        document.getElementById('resHeight').oninput = (e)=>{
            settings.resolution.height = document.getElementById('resHeight').value;
            saveSettings();
        }
        document.getElementById('resWidth').oninput = (e)=>{
            settings.resolution.width = document.getElementById('resWidth').value;
            saveSettings();
        }

        document.getElementById('changeDirectory').onclick = (e)=>{
            console.log("A")
           window.electron.openDirectory(send)
        }

        document.getElementById('ram').oninput = (e)=>{
            document.getElementById('allocatedMemory').innerHTML = document.getElementById('ram').value+`Gb Allocated`
            settings.ram = document.getElementById('ram').value;
            saveSettings();
        }
        console.log(document.getElementById('keepLauncherOpen').value)
        localStorage.settings = JSON.stringify(settings);
        function saveSettings() {
            localStorage.settings = JSON.stringify(settings);
        }

       