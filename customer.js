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
ipcRenderer.on('init', (event, message) => {
    switch (message) {
        case 'initUI':
            initUI('初始设备......', true);
            break;
        case 'sign-in-ok':
            initUI('签到成功...', false);
            break;
        default:
            initUI('no no......', false);
            break;
    }

});