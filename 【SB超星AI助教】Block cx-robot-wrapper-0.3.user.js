// ==UserScript==
// @name         【SB超星AI助教】Block cx-robot-wrapper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove cx-robot-wrapper and its audio
// @author       bili_下次一定的卡坦精
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 拦截并阻止特定的 JavaScript 文件加载
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var nodes = Array.from(mutation.addedNodes);
            for (var node of nodes) {
                if (node.nodeType === 1 && node.tagName === 'SCRIPT' && node.src) {
                    if (node.src.includes('CxRobotSdkJs.js') || node.src.includes('VoiceToonBot.js')) {
                        console.log('Blocked script:', node.src);
                        node.parentNode.removeChild(node);
                    }
                }
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove the element immediately if it's already present
    var element = document.querySelector('.cx-robot-wrapper');
    if (element) {
        element.remove();
    }

})();
