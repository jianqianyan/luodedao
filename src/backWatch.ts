import { ipcMain, BrowserWindow } from 'electron';
const fs = require('fs');

export function ipcMainWatch(win: BrowserWindow) {
  ipcMain.on('getLocalToken', () => {
    fs.readFile('token.txt', 'utf8', (err: any, data: any) => {
      if (err) {
        // 如果文件不存在，创建一个新文件
        if (err.code === 'ENOENT') {
          createNewFile();
        } else {
          console.error('读取文件时出错:', err);
        }
      } else {
        win.webContents.send("sendLocalToken", data);
      }
    });
  })
}

// 创建一个新文件
function createNewFile() {
  fs.writeFile('token.txt', '', 'utf8', (err: any) => {
    if (err) {
      console.error('创建文件时出错:', err);
    } else {
      console.log('文件已成功创建');
    }
  });
}