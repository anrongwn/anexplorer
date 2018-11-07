'use strict';

var fs = require('fs');
var net = require('net');
const stick = require('./lib/core');
const msgCenter = require('./lib/msgCenter');
const msgBuffer = new msgCenter();

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

//
const log4js = require('log4js');
const log4js_config = require('./logs/log4js.json');
log4js.configure(log4js_config);
let logger = log4js.getLogger('date_log');

function sleep(ms) {
    let now = new Date();
    let exitTime = now.getTime() + ms;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    };
};

// 获取按钮和容器的DOM节点
var content = document.getElementById('filedata');
var button = document.getElementById('btn');

/**
 * 注册按钮点击事件
 * 当按钮点击的时候读取当前目录下的 1.text
 * 之后将里面的内容放到content 之中
 */
let devStatus = 'ok';
button.addEventListener('click', (e) => {
    logger.info(`net processid=${process.pid} ${button.innerText} dev status : ${devStatus}`);
    sleep(1000);

    let message={
        id: (devStatus==='ok'?'run0':'run1'),
        return_code:'ok',
        message:''
    };

    let reply = ipcRenderer.sendSync('synchronous-message', message);
    if (reply){
        if('ok'===reply.return_code){
            button.innerText='enter mantenance mode';
            devStatus='ok';
        }else{
            button.innerText='enter run mode';
            devStatus='mantenance';
        }

        content.innerText=`dev status : ${devStatus}`;
    }
   
});

ipcRenderer.on('asynchronous-message', (event, message) => {
    switch (message.id) {
        case 'initStatus':
            devStatus=message.return_code;
            
            content.innerText=`dev status : ${devStatus}`;
            if ('ok'===devStatus){
                button.innerText='enter mantenance mode';
            }else{
                button.innerText='enter run mode'
            }
            break;
        case 'sign-in':
            if(message.return_code==='error'){
                content.innerText=`net Communication timeout`;
                devStatus='mantenance';
                button.hidden=true;
            }else{
                
                devStatus='ok';
                button.hidden=false;
                content.innerText=`dev status : ${devStatus}`;
            }
        default:
            break;
    }
});