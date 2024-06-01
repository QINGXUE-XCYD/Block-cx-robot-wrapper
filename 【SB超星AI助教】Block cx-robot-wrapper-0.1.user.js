// ==UserScript==
// @name         【SB超星AI助教】Block cx-robot-wrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove cx-robot-wrapper and its audio
// @author       bili_下次一定的卡坦精
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
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