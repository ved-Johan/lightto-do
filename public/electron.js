const { menubar } = require('menubar');
const { ipcMain, app, protocol, session} = require('electron');
const storage = require('electron-json-storage');

const path = require('path');
var fs = require("fs");
const { join } = require('path');


const sUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;

app.whenReady().then(() => {

    protocol.registerFileProtocol('lltd', (request, callback) => {
        const url = request.url.substring(7,request.url.length-3)    /* all urls start with 'file://' */
        callback({ path: app.getPath('userData')+"\\"+url})
      }, (err) => {
        if (err) console.error('Failed to register protocol')
      })


    //protocol.registerStandardSchemes(['bg']);

const mb = menubar({
    index: sUrl,
    browserWindow: {
        width: 340,
        height: 530,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    },
    tooltip: "lightTo-Do"
});

mb.on('after-create-window', () =>{
    mb.window.setResizable(false);
});

mb.on('ready', () => {
    console.log("ready");
});

//ipc

function writeTasks(objects){
    storage.set('tasks',objects,(err) => {});
}

ipcMain.on('write', (event, tasks) => {
    writeTasks(tasks);
 })
 
ipcMain.on('close', (event, tasks) => {
    app.exit();
 })

 ipcMain.on('getJson', (event, objects) => {
     storage.get('tasks', (err, data) => {
        mb.window.webContents.send("receiveJson", data)}
    );
 })

 
 ipcMain.on('gdp', (event, objects) => {
    mb.window.webContents.send("rdp",   app.getPath('userData'));
})

ipcMain.on('cc', (err) => {
    mb.window.webContents.session.clearCache(
        //() =>
        //mb.window.webContents.session.clearStorageData()
    );
})

ipcMain.on('setBg', (err, data) => {
    mb.window.webContents.session.clearCache(() =>
        mb.window.webContents.session.clearStorageData()
    );
    const picsDir = app.getPath('userData')
    const path = join(picsDir, 'bg.png');
    data.arrayBuffer().then(arrayBuffer => {
        fs.writeFile(path, Buffer.from(arrayBuffer), err => console.log(err));
    })
})

})