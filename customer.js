'use strict';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

// 获取按钮和容器的DOM节点
let content = document.getElementById('filedata');
let btn_withdrawal = document.getElementById('withdrawal');
let btn_search = document.getElementById('search');

function initUI(data, hidden) {
    content.innerText = data;
    btn_withdrawal.hidden=hidden;
    btn_search.hidden=hidden;
}

/**
 * @param  {} 'init'
 * @param  {} (event
 * @param  {} message
 * @param  {} =>{switch(message
 * @param  {initUI(} {case'initUI'
 */
ipcRenderer.on('asynchronous-message', (event, message) => {
    switch (message.id) {
        case 'initUI':
            initUI('初始设备......', true);
            break;
        case 'sign-in-ok':
            initUI('签到成功...', false);
            break;
        case 'run0':
            initUI('enter mantenace mode......', true);
            break;
        case 'run1':
            initUI('run mode......', false);
            break;
        case 'sign-in':
            if('ok'===message.return_code){
                initUI('sign-in successed.....', false);
            }
            else{
                initUI('sign-in failed.....', true);
            }
            
            break;
        default:
            initUI('no no......', false);
            break;
    }

});