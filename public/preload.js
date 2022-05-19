const {
    contextBridge,
    ipcRenderer,
} = require("electron");
var fs = require("fs");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["write","close","getJson","gdp","setBg"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["receiveJson","rdp",'rd'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        saveImg: async function(data, url) {
            const buffer = Buffer.from(await data.arrayBuffer());
            //console.log(buffer);
            fs.writeFileSync(url, buffer, 'binary', err => console.log(err));
        }
    }
);
