const { app, BrowserWindow, Menu } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        fullscreen: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    win.loadFile('public/title.html');
}

app.on('ready',createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})