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

/** 
function sleep(ms) {
    let now = new Date();
    let exitTime = now.getTime() + ms;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    };
};
*/

// 获取按钮和容器的DOM节点
var content = document.getElementById('filedata');
var button = document.getElementById('btn');

function resolveAfterXSeconds(ms) {
    console.log('resolveAfterXSeconds begin...');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(ms);
        }, ms);
    });
}

async function sleep2(ms) {
    console.log('sleep2 begin...');
    let x = await resolveAfterXSeconds(ms);

    console.log('sleep2 end.');
    console.log(x); // 10
}


/**
 * 注册按钮点击事件
 * 当按钮点击的时候读取当前目录下的 1.text
 * 之后将里面的内容放到content 之中
 */
button.addEventListener('click', (e) => {
    logger.info(`net processid=${process.pid}dev init....`);
    //sleep(1000);

    console.log('addEventListener begin...');
    sleep2(1000).then(value => {
        let message = {
            id: 'initDev',
            return_code: 'ok',
            message: ''
        };
        ipcRenderer.send('asynchronous-message', message);

        console.log('addEventListener end...');
    });


});


ipcRenderer.on('net', (event, message) => {
    switch (message) {
        case 'sign-in':

            break;
        default:
            break;
    }
});