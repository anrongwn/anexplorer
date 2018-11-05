'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
const debug = (process.argv.indexOf('--debug')>=0);

function createMainWindow(){
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadFile('index.html');

    //
    if (debug){
        mainWindow.webContents.openDevTools();
    }
        

    mainWindow.on('closed', ()=>{
        mainWindow = null;
    })
};

app.on('ready', ()=>{
    createMainWindow();

    require('electron').powerMonitor.on('on-battery', ()=>{
        console.log('pc on battery work mode');
    });

    require('electron').powerMonitor.on('on-ac', ()=>{
        console.log('pc on ac work mode');
    });

    
})

//app.on('ready', createMainWindow);

app.on('window-all-closed', ()=>{
    if (process.platform!=='darwin'){
        app.quit();
    };
});

/*
app.on('activate', (event, hasVisibleWindows)=>{
    
    if ((hasVisibleWindows===false) || (mainWindow===null)){
        createMainWindow();
    }
    
});
*/

app.on('before-quit', ()=>{
    
});