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



/*
let message={
    id:'initDev',
    return_code:'ok',
    message:''
};
*/

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
        let message = {
            id: 'initUI',
            return_code: 'ok',
            message: ''
        };

        customerWindow.webContents.send('asynchronous-message', message);

        createDevWindow();
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

function createDevWindow() {
    //console.log('main process createcustomerWindow.');
    logger.info(`[${process.pid}] main process createDevWindow.`);

    let Screen = electron.screen;
    let size = Screen.getPrimaryDisplay().workArea;
    devWindow = new BrowserWindow({
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        title: 'anExplorer Dev process',
        show: true
    });

    devWindow.loadFile('devWindow.html');
    //customerWindow.show();

    //
    if (debug) {
        devWindow.webContents.openDevTools();
        //devWindow.setAlwaysOnTop(true);
        //devWindow.setKiosk(true);
    };

    devWindow.webContents.on('did-finish-load', () => {
        //devWindow.webContents.send('init', 'initUI');
    });

    devWindow.on('closed', () => {

        devWindow = null;
        logger.info(`[${process.pid}] main process devWindow closed.`);

    });
};


function createMantenanceWindow() {
    let Screen = electron.screen;

    let displays = Screen.getAllDisplays();
    let externalDisplay = null;
    for (let i in displays) {
        logger.info(`[${process.pid}] display id = ${displays[i].id}`);
    }
    maintenanceWindow = new BrowserWindow({
        x: 50,
        y: 50,
        width: 800,
        height: 600,
        title: 'anExplorer Mantenance process',
    });

    maintenanceWindow.loadFile('mantenanceWindow.html');

    //
    if (debug) {
        maintenanceWindow.webContents.openDevTools();
    }

    maintenanceWindow.webContents.on('did-finish-load', () => {
        //maintenanceWindow.webContents.send('net', 'sign-in');
    });

    maintenanceWindow.on('page-title-updated', (event, title) => {
        console.log(`new title=${title}`);
    });

    maintenanceWindow.on('closed', () => {
        netWindow = null;
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
        x: 150,
        y: 150,
        width: 800,
        height: 600,
        title: 'anExplorer net process',
        //show: false
    });

    netWindow.loadFile('netWindow.html');

    if (debug) {
        //netWindow.show();
    }

    //
    if (debug) {
        netWindow.webContents.openDevTools();
    }

    netWindow.webContents.on('did-finish-load', () => {
        let status = {
            id:'netInit',
            return_code: 'ok',
            message: ''
        };

        netWindow.webContents.send('asynchronous-message', status);
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
    createMantenanceWindow();

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

ipcMain.on('asynchronous-message', (event, message) => {
    logger.info(`[${process.pid}] ipcMain recv [asynchronous-message] event, message=${message.id}`);
    switch (message.id) {
        case 'initDev':
            if ('ok' === message.return_code) {
                createNetWindow();

                let status = {
                    id: 'initStatus',
                    return_code: 'ok',
                    message: ''
                };

                maintenanceWindow.webContents.send('asynchronous-message', status);
            }
            break;
        
        case 'sign-in':
            //if('ok'=== message.return_code){
            customerWindow.webContents.send('asynchronous-message', message);
            maintenanceWindow.webContents.send('asynchronous-message', message);
            //}
            break;
        default:
            break;
    }

    //reply
    //event.sender.send('asynchronous-reply', 'pong')
});


ipcMain.on('synchronous-message', (event, message) => {
    logger.info(`[${process.pid}] ipcMain recv [synchronous-message] event, message=${message}`);

    switch (message.id) {
        case 'run0':
            let run = {
                id: 'run0',
                return_code: 'mantenace mode',
                message: ''
            };

            event.returnValue = {
                id: 'run0',
                return_code: 'mantenance',
                message: ''
            };

            customerWindow.webContents.send('asynchronous-message', run);
            break;
        case 'run1':
            let run1 = {
                id: 'run1',
                return_code: 'run mode',
                message: ''
            };

            event.returnValue = {
                id: 'run1',
                return_code: 'ok',
                message: ''
            };

            customerWindow.webContents.send('asynchronous-message', run1);
            break;
        default:
            break;
    }

    //reply
    //event.returnValue = 'pong'
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