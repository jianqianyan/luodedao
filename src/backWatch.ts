import { ipcMain, BrowserWindow } from 'electron';
const fs = require('fs');

export function ipcMainWatch(win: BrowserWindow) {
  ipcMain.on('getLocalToken', () => {
    fs.readFile('config.txt', 'utf8', (err: any, data: any) => {
      if (err) {
        // 如果文件不存在，创建一个新文件
        if (err.code === 'ENOENT') {
          createNewFile('config.txt');
        } else {
          console.error('读取文件时出错:', err);
        }
      } else {
        win.webContents.send("sendLocalToken", data);
      }
    });
  })

  ipcMain.on('setLocalToken', (event, name, token) => {
    fs.writeFile('config.txt', JSON.stringify({name, token}), 'utf8', (err: any) => {
      if (err) {
        console.error('创建文件时出错:', err);
      } else {
        console.log('token保存成功');
      }
    });
  })

  ipcMain.on('savaData', (event, name, data) => {
    console.log(data);
    fs.writeFile(`${name}.txt`, data, 'utf8', (err: any) => {
      if (err) {
        console.error('保存文件出错:', err);
      } else {
        console.log('文件保存成功');
      }
    })
  })

  ipcMain.on('getLocalData', (event, name) => {
    fs.readFile(`${name}.txt`, 'utf8', (err: any, data: any) => {
      if (err) {
        // 如果文件不存在，创建一个新文件
        if (err.code === 'ENOENT') {
          createNewFile(`${name}.txt`);
        } else {
          console.error('读取文件时出错:', err);
        }
      } else {
        win.webContents.send("sendLocalData", data);
      }
    });
  })
}

// 创建一个新文件
function createNewFile(fileName: string) {
  fs.writeFile(fileName, '', 'utf8', (err: any) => {
    if (err) {
      console.error('创建文件时出错:', err);
    } else {
      console.log('文件已成功创建');
    }
  });
}