const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('system-info', (event, data) => {
    document.getElementById('cpu').innerText = data.cpu + '%'
    document.getElementById('ram').innerText = data.ram + '%'
    document.getElementById('download').innerText = data.download
    document.getElementById('upload').innerText = data.upload
    document.getElementById('uptime').innerText = data.uptime
  })
})
