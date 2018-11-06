'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

//
const log4js = require('log4js');
const log4js_config = require('./logs/log4js.json');
log4js.configure(log4js_config);
let logger = log4js.getLogger('date_log');


let mainWindow = null;
let netWindow = null;
const debug = (process.argv.indexOf('--debug') >= 0);

function createMainWindow() {
    //console.log('main process createMainWindow.');
    logger.info(`[${process.pid}] main process createMainWindow.`);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title:'anExplorer UI process',
        show:true
    });

    mainWindow.loadFile('index.html');
    //mainWindow.show();


    //
    if (debug) {
        //mainWindow.webContents.openDevTools();
        //mainWindow.setAlwaysOnTop(true);
        //mainWindow.setKiosk(true);
    }

    
    mainWindow.on('closed', () => {
        //
        if ((null!==netWindow)&&(false===netWindow.isVisible())){
            netWindow.close();
        }

        mainWindow = null;
        logger.info(`[${process.pid}] main process mainWindow closed.`);
        
    })
};



function createNetWindow() {
    netWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title:'anExplorer net process',
        show:false
    });

    netWindow.loadFile('loadfile.html');

    if (debug){
        netWindow.show();
    }
    

    //
    if (debug) {
        netWindow.webContents.openDevTools();
    }

    netWindow.on('page-title-updated', (event, title)=>{
        console.log(`new title=${title}`);
    });

    netWindow.on('closed', () => {
        netWindow = null;
    });
};

//app.on('ready', createMainWindow);
app.on('ready', () => {
    createMainWindow();
    
    //createNetWindow();

    /*
    require('electron').powerMonitor.on('on-battery', () => {
        console.log('pc on battery work mode');
    });

    require('electron').powerMonitor.on('on-ac', () => {
        console.log('pc on ac work mode');
    });
    */


});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };

    logger.info(`[${process.pid}] main process anExplorer app quit.`);
});

/*
app.on('activate', (event, hasVisibleWindows)=>{
    
    if ((hasVisibleWindows===false) || (mainWindow===null)){
        createMainWindow();
    }
    
});
*/

app.on('before-quit', () => {

});