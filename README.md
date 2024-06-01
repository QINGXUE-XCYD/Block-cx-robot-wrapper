# 屏蔽超星学习网站中干扰元素的脚本

本项目提供了一个油猴（Tampermonkey）脚本，用于屏蔽超星学习网站中名为`cx-robot-wrapper`的干扰元素，避免其播放语音干扰学习。

![就是这破玩意](./images/example.jpg)

# 原理

经检查是由于`CxRobotSdkJs.js`相关部分代码启动的AI助教，因此可以直接禁止此JS文件加载。此外由于AI助教会尝试获取麦克风权限以实现对话功能，同时将VoiceToonBot.js禁止加载。

# 实现

基于以上原理，有两种方法可实现此功能：
1. 阻止相关HTTP请求和WebSocket连接
```javascript
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
```
2. 禁止JS加载
```javascript
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
```
## 安装方法

1. **安装Tampermonkey插件**
    - Chrome浏览器: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    - Firefox浏览器: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
    - Safari浏览器: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

2. **安装脚本**
    - 点击Tampermonkey图标，选择“添加新脚本”。
    - 复制以下脚本代码，并粘贴到编辑器中：

    ```javascript
// ==UserScript==
// @name         【SB超星AI助教】Block cx-robot-wrapper
// @namespace    http://tampermonkey.net/
// @version      0.1
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
    ```

    - 点击“文件” -> “保存”以保存脚本。
    （此处使用的是第二种解决方法，禁止JS脚本启动）
    如果要使用第一种方法，请使用如下代码
```javascript
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
```
## 使用方法

1. **激活脚本**：确保Tampermonkey插件已启用，并且脚本在插件中处于激活状态。
2. **访问超星学习网站**：脚本将在你访问超星学习网站时自动运行，移除干扰元素，如果没有启动请手动启动Tampermonkey以及脚本

## 许可证

此项目基于MIT许可证，并附加禁止商业用途条款。具体条款请参见[LICENSE](./LICENSE)文件。

---

如有任何问题或建议，请在GitHub项目页面中提交Issue，感谢你的使用和支持！
或联系B站用户：下次一定的卡坦精
