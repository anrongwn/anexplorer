'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;


//
const log4js = require('log4js');
const log4js_config = require('./logs/log4js.json');
log4js.configure(log4js_config);
let logger = log4js.getLogger('date_log');
let sleep = require('./sleep');

let customerWindow = null; //客户屏进程
let maintenanceWindow = null; //维护屏进程
let netWindow = null; //报文通信进程
let devWindow = null; //设备进程
const debug = (process.argv.indexOf('--debug') >= 0);

function createCustomerWindow() {
    //console.log('main process createcustomerWindow.');
    logger.info(`[${process.pid}] main process createcustomerWindow.`);

    let Screen = electron.screen;
    let size = Screen.getPrimaryDisplay().workArea;
    customerWindow = new BrowserWindow({
        width: size.width,
        height: size.height,
        title: 'anExplorer Customer process',
        show: true
    });

    customerWindow.loadFile('customer.html');
    //customerWindow.show();

    //
    if (debug) {
        //customerWindow.webContents.openDevTools();
        //customerWindow.setAlwaysOnTop(true);
        //customerWindow.setKiosk(true);
    };

    customerWindow.webContents.on('did-finish-load', () => {
        customerWindow.webContents.send('init', 'initUI');
    });

    customerWindow.on('closed', () => {
        //
        if ((null !== netWindow) && (false === netWindow.isVisible())) {
            netWindow.close();
        }

        customerWindow = null;
        logger.info(`[${process.pid}] main process customerWindow closed.`);

    });
};



function createNetWindow() {
    let Screen = electron.screen;

    let displays = Screen.getAllDisplays();
    let externalDisplay = null;
    for (let i in displays) {
        logger.info(`[${process.pid}] display id = ${displays[i].id}`);
    }
    netWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'anExplorer net process',
        show: false
    });

    netWindow.loadFile('netWindow.html');

    if (debug) {
        netWindow.show();
    }


    //
    if (debug) {
        netWindow.webContents.openDevTools();
    }

    netWindow.webContents.on('did-finish-load', () => {
        netWindow.webContents.send('net', 'sign-in');
    });

    netWindow.on('page-title-updated', (event, title) => {
        console.log(`new title=${title}`);
    });

    netWindow.on('closed', () => {
        netWindow = null;
    });
};

//app.on('ready', createcustomerWindow);
app.on('ready', () => {
    createCustomerWindow();
    
    createNetWindow();

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
    
    if ((hasVisibleWindows===false) || (customerWindow===null)){
        createcustomerWindow();
    }
    
});
*/

app.on('before-quit', () => {

});


ipcMain.on('net-sign-in', (event, message) => {
    logger.info(`[${process.pid}] ipcMain recv [net-sign-in] event, message=${message}`);
    switch (message) {
        case 'ok':
            customerWindow.webContents.send('init', 'sign-in-ok');
            break;
        default:
            break;
    }
})