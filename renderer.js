'use strict';

var fs = require('fs');
var net = require('net');
const stick = require('./lib/core');
const msgCenter = require('./lib/msgCenter');
const msgBuffer = new msgCenter();

// 获取按钮和容器的DOM节点
var content = document.getElementById('filedata');
var button = document.getElementById('btn');

/**
 * 注册按钮点击事件
 * 当按钮点击的时候读取当前目录下的 1.text
 * 之后将里面的内容放到content 之中
 */
let send_count=0;
button.addEventListener('click', (e)=>{
    fs.readFile('./1.txt', 'utf8', (err, data)=>{
        if(err===null){
            content.innerText = data;
        }
        
    });

    let client = net.createConnection({
        port: 9595,
        host: '127.0.0.1'
    }, function () {
        client.setNoDelay(true);
        send_count++;
        //for(let i = 0; i<1000;++i){
        let date = Date.now().toString();
        //date += 'username=123&password=1234567,qwe ';
        date += content.innerText;
        date += send_count;
        const msg = msgBuffer.publish(date)

        let b = client.write(msg);
        if (b === true) {
            console.log('write data finish!');
        }
    });

    client.on('data', function (data) {
        console.log(`recv echo: ${data.toString('base64')}`);
        //断开
        client.end();
    })

    client.on('end', function () {
        console.log('disconnect from server')
    });

    client.on('error', err => {
        //console.log(client.localAddress+' : '+client.localPort);
        console.log(err);
        //process.exit(1);
    });

});

