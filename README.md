# 🌍 Planet Eco Services AI聊天插件

## 📊 实现方案对比

### 🔥 方案A：纯前端方案（推荐用于快速原型）
```
优点：
✅ 无需后端服务器
✅ 部署简单（只需静态托管）
✅ 成本极低
✅ 响应速度快

缺点：
❌ API密钥暴露风险
❌ 功能受限
❌ 无法保存对话历史
```

### 💪 方案B：带后端方案（推荐用于生产环境）
```
优点：
✅ API密钥安全
✅ 可保存用户数据
✅ 支持复杂业务逻辑
✅ 可集成CRM系统

缺点：
❌ 需要服务器成本
❌ 开发复杂度高
```

## 🚀 快速开始（纯前端版本）

### 1. 直接打开测试
```bash
# 在浏览器中打开
open frontend/simple-widget.html
```

### 2. 嵌入到任何网站
```html
<!-- 方法1：直接嵌入iframe -->
<iframe src="https://your-domain.com/simple-widget.html" 
        style="position: fixed; bottom: 20px; right: 20px; 
               width: 400px; height: 600px; border: none;">
</iframe>

<!-- 方法2：一行代码嵌入 -->
<script src="https://your-domain.com/embed-script.js"></script>
```

## 🎯 免费AI方案

### 1. Chrome内置AI（Gemini Nano）
```javascript
// 完全免费，无需API
if ('ai' in window) {
    const session = await window.ai.createTextSession();
    const response = await session.prompt(userMessage);
}
```

### 2. 使用Hugging Face免费API
```javascript
// 每月免费额度
const response = await fetch(
    "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
    {
        headers: { Authorization: "Bearer YOUR_TOKEN" },
        method: "POST",
        body: JSON.stringify({ inputs: userMessage }),
    }
);
```

### 3. 使用Cohere免费层
```javascript
// 每月100次调用免费
const response = await fetch('https://api.cohere.ai/generate', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_KEY',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        model: 'command-nightly',
        prompt: userMessage,
        max_tokens: 200
    })
});
```

## 🛠️ 托管方案（免费）

### 1. GitHub Pages
```bash
# 完全免费，支持自定义域名
git add .
git commit -m "Add chat widget"
git push origin main
# 设置 > Pages > 选择分支
```

### 2. Netlify Drop
```bash
# 拖拽文件夹即可部署
# 访问: https://app.netlify.com/drop
```

### 3. Vercel
```bash
# 一键部署
npx vercel
```

### 4. Cloudflare Pages
```bash
# 免费且速度快
wrangler pages publish frontend
```

## 📝 数据收集方案（无后端）

### 1. Google Forms集成
```javascript
// 将用户信息发送到Google Forms
function submitToGoogleForm(data) {
    const formId = 'YOUR_FORM_ID';
    const url = `https://docs.google.com/forms/d/${formId}/formResponse`;
    
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
            'entry.1234': data.name,
            'entry.5678': data.email,
            'entry.9012': data.phone
        })
    });
}
```

### 2. Airtable直接写入
```javascript
// 使用Airtable API
fetch('https://api.airtable.com/v0/YOUR_BASE/Leads', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        fields: {
            Name: userName,
            Email: userEmail,
            Message: userMessage
        }
    })
});
```

### 3. EmailJS发送邮件
```javascript
// 直接从前端发送邮件
emailjs.send("service_id", "template_id", {
    user_name: userName,
    user_email: userEmail,
    message: userMessage
});
```

## 🎨 定制化

修改 `simple-widget.html` 中的：
- 颜色主题：搜索 `background: linear-gradient`
- 公司信息：修改 knowledgeBase 对象
- 快速回复：编辑 quick-replies 按钮
- 问答内容：更新 knowledgeBase 数据

## 📱 移动端优化

已包含响应式设计，自动适配手机屏幕。

## 🔒 安全建议

1. **生产环境请使用后端API**
2. **定期更新知识库内容**
3. **添加访问频率限制**
4. **使用HTTPS部署**

## 📞 技术支持

如需更复杂的功能（如：
- 多语言支持
- 语音对话
- 视频通话
- CRM集成
- 支付功能

请考虑升级到完整的后端方案。