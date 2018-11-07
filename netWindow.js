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

// 获取按钮和容器的DOM节点
var content = document.getElementById('filedata');
var button = document.getElementById('btn');

/**
 * 注册按钮点击事件
 * 当按钮点击的时候读取当前目录下的 1.text
 * 之后将里面的内容放到content 之中
 */
let send_count = 0;
button.addEventListener('click', (e) => {
    logger.info(`net processid=${process.pid} button click event.`);

    let message = {
        id: 'sign-in',
        return_code: 'ok',
        message: ''
    };

    sender(message.message).then(value=>{
        if(value.rc===-1){
            message.return_code = 'error';
            console.log(`message.return_code=${message.return_code}`)
            ipcRenderer.send('asynchronous-message', message);
        }
    });
    
});

function sleep(ms) {
    let now = new Date();
    let exitTime = now.getTime() + ms;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    };
};

const sendData = function (data) {
    return new Promise((resolve, reject) => {
        let client = net.createConnection({
            port: 9595,
            host: '127.0.0.1'
        }, function () {
            console.log('connect host start...');
            client.setNoDelay(true);
            const msg = msgBuffer.publish(data)

            let b = client.write(msg);
            if (b === true) {
                //console.log('write data finish!');
            }
        });

        client.on('data', function (data) {
            console.log('recv data');
            //console.log(`recv echo: ${data.toString('base64')}`);
            //断开
            client.end();

            resolve(data);
        })

        client.on('end', function () {
            console.log('disconnect from server')
        });

        client.on('error', err => {
            //console.log(client.localAddress+' : '+client.localPort);
            console.log(err);
            //process.exit(1);
            reject(null);
        });
    });
};

async function sender(data) {
    let message={
        rc:0,
        message:''
    };

    try {
        console.log('await sendData(data) start....');
        let result = await sendData(data);

        message.message=result;
        console.log('await sendData(data) end....');
        //console.log(`recv echo: ${result.toString('base64')}`);
        
    } catch (err) {
        console.log('await sendData(data) error end....');
        //console.log(err);
        message.rc=-1;
    };

    return message;
};

ipcRenderer.on('asynchronous-message', (event, message) => {
    switch (message.id) {
        case 'netInit':
            //发送签到报文
            let sign = {
                id: 'sign-in',
                return_code: 'ok',
                message: 'username=wangjr&&passwork=123456'
            }

            console.log('sender start....');
            content.innerText=`recv sign data : ${sign.message}`;
            sender(sign.message).then(value=>{

                console.log('sender end.'+value.rc);

                if (-1 === value.rc) {
                    sign.return_code = 'error'
                    
                } else {
                    
                }
                sign.message=value.message;
                content.innerText+=`\r\nreps data : ${sign.message}`;
                ipcRenderer.send('asynchronous-message', sign);
            });

            break;
        case 'sign-in':
            console.log(`recv sign-in frame : ${message.message}`);
            content.innerText = `recv sign-in frame : ${message.message}`;
            //sleep(1000);

            break;
        default:
            break;
    }
});