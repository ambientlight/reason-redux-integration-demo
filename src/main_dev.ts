import * as Electron from 'electron'
import * as path from 'path'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

declare var __PROCESS__: {
    env: string
};

let electronWindow: Electron.BrowserWindow | null = null

Electron.protocol.registerFileProtocol
Electron.app.on('ready', launchInfo => {
    const mainWindow = new Electron.BrowserWindow({ width: 1016, height: 665 })

    Electron.protocol.interceptFileProtocol('file', (request, callback) => {
        const url = request.url.substr(7)
        callback(path.normalize(`${__dirname}/${url}`))
    }, (err) => {
        if(err){
            console.error('Failed to register protocol')
            console.error(err)
        }
    })
    mainWindow.loadURL("http://localhost:8080")
    
    //mainWindow.webContents.openDevTools()
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    mainWindow.on('closed', () => {
        electronWindow = null
    })

    electronWindow = mainWindow
})

Electron.app.on('window-all-closed', () => {
    Electron.app.quit()
})