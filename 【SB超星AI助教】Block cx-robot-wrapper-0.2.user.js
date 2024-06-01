// ==UserScript==
// @name         【SB超星AI助教】Block cx-robot-wrapper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove cx-robot-wrapper and its audio
// @author       bili_下次一定的卡坦精
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 拦截并阻止特定URL的HTTP请求
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        if (arguments[1].includes('https://robot-lc.chaoxing.com/sdk/CxRobotSdkJs.js') ||
            arguments[1].includes('https://robot-lc.chaoxing.com/v1/api/getTTSWebSocketUrl')) {
            console.log('Blocked:', arguments[1]);
            return;
        }
        return originalOpen.apply(this, arguments);
    };

    // 拦截并阻止特定URL的WebSocket请求
    var originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        if (url.includes('wss://tts-api.xfyun.cn/v2/tts')) {
            console.log('Blocked WebSocket:', url);
            // Return an object with a close method to prevent errors
            return {
                close: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                send: function() {},
            };
        }
        return new originalWebSocket(url, protocols);
    };

    // Remove the element
    var element = document.querySelector('.cx-robot-wrapper');
    if (element) {
        element.remove();
    }

    // Observe for future elements
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var nodes = Array.from(mutation.addedNodes);
            for (var node of nodes) {
                if (node.nodeType === 1 && node.matches('.cx-robot-wrapper')) {
                    node.remove();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
