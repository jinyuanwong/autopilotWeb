# Google Form URL Configuration

## 你需要提供的信息：

请提供你的Google Form URL，格式如下：
```
https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxx/viewform
```

## 当前已配置的字段ID：

✅ **已获取的字段ID**（来自你的表单）：
- Name: `entry.682685384`
- Email: `entry.1238611864`
- Phone: `entry.1407605129`
- Service: `entry.1891032903`
- Preferred Date: `entry.152986260`
- Time Hour: `entry.1449457478_hour`
- Time Minute: `entry.1449457478_minute`
- Date Year: `entry.378052578_year`
- Date Month: `entry.378052578_month`
- Date Day: `entry.378052578_day`

## 下一步：

1. **提供你的Form ID**
   - 从你的Google Form URL中提取
   - 例如：如果URL是 `https://docs.google.com/forms/d/e/1FAIpQLSe_ABC123/viewform`
   - Form ID就是：`1FAIpQLSe_ABC123`

2. **更新meeting-booking.js**
   ```javascript
   // 将这行：
   this.googleFormBaseUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
   
   // 替换为：
   this.googleFormBaseUrl = 'https://docs.google.com/forms/d/e/你的实际FORM_ID/viewform';
   ```

3. **测试流程**
   - 打开聊天界面
   - 输入 "I want to book a meeting"
   - 跟随引导填写信息
   - 确认预填充的表单链接正确

## 注意事项：

- 确保Google Form设置为"Anyone can respond"（任何人都可以回答）
- 建议开启"Collect email addresses"（收集电子邮件地址）
- 开启"Send responders a copy of their response"（向回复者发送回复副本）