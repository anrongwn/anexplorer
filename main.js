'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

function createMainWindow(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadFile('index.html');

    mainWindow.on('closed', ()=>{
        mainWindow = null;
    })
};

app.on('ready', createMainWindow);

app.on('window-all-closed', ()=>{
    if (process.platform!=='darwin'){
        app.quit();
    };
});

app.on('activate', (event, hasVisibleWindows)=>{
    if ((hasVisibleWindows===false) || (mainWindow===null)){
        createMainWindow();
    }
});