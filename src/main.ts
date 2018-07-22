import * as Electron from 'electron'
import * as path from 'path'
import * as url from 'url'

let electronWindow: Electron.BrowserWindow | null = null

Electron.protocol.registerFileProtocol
Electron.app.on('ready', launchInfo => {
    const mainWindow = new Electron.BrowserWindow({ width: 1016, height: 665, webPreferences: { webSecurity: false } })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }))
    
    mainWindow.on('closed', () => {
        electronWindow = null
    })

    electronWindow = mainWindow
})

Electron.app.on('window-all-closed', () => {
    Electron.app.quit()
})