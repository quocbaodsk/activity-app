const { app, BrowserWindow } = require('electron')
const path = require('path')
const si = require('systeminformation')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile('index.html')

  setInterval(async () => {
    const cpu = await si.currentLoad()
    const mem = await si.mem()
    const net = await si.networkStats()
    const osInfo = await si.time()

    win.webContents.send('system-info', {
      cpu: cpu.currentLoad.toFixed(2),
      ram: ((mem.active / mem.total) * 100).toFixed(2),
      download: (net[0].rx_sec / 1024 / 1024).toFixed(2) + ' MB/s',
      upload: (net[0].tx_sec / 1024 / 1024).toFixed(2) + ' MB/s',
      uptime: formatUptime(osInfo.uptime),
    })
  }, 1000)
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  const secs = Math.floor(seconds % 60)
  return `${days}d ${hours}h ${minutes}m ${secs}s`
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
