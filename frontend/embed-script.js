/**
 * 🚀 超简单的一行代码嵌入脚本
 * 使用方法：<script src="embed-script.js"></script>
 */

(function() {
    // 创建聊天插件容器
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = `
        <style>
            .eco-widget-iframe {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 400px;
                height: 600px;
                border: none;
                z-index: 999999;
                display: none;
            }
            .eco-widget-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999998;
                border: none;
            }
            .eco-widget-button:hover {
                transform: scale(1.1);
            }
        </style>
        
        <button class="eco-widget-button" id="ecoWidgetButton">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </button>
        
        <iframe 
            id="ecoWidgetFrame"
            class="eco-widget-iframe"
            src="simple-widget.html">
        </iframe>
    `;
    
    document.body.appendChild(widgetContainer);
    
    // 切换聊天窗口
    document.getElementById('ecoWidgetButton').addEventListener('click', function() {
        const iframe = document.getElementById('ecoWidgetFrame');
        const button = document.getElementById('ecoWidgetButton');
        
        if (iframe.style.display === 'none' || !iframe.style.display) {
            iframe.style.display = 'block';
            button.style.display = 'none';
        }
    });
    
    // 监听iframe消息（关闭窗口）
    window.addEventListener('message', function(e) {
        if (e.data === 'closeChat') {
            document.getElementById('ecoWidgetFrame').style.display = 'none';
            document.getElementById('ecoWidgetButton').style.display = 'flex';
        }
    });
})();