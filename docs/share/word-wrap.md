# 中文数字字母文案换行

## 业务场景

- 在h5页面中，比如课程名称，包含中文，数字，字母
- 数字字母文案太长，导致不换行

## 技术实现

```css
word-wrap: break-word; // 在长单词或 URL 地址内部进行换行
word-break: break-all;  // 允许在单词内换行
```

- [word-wrap](https://www.w3school.com.cn/cssref/pr_word-wrap.asp)

默认值：normal，允许内容顶开指定的容器边界；break-word，内容将在边界内换行

- [work-break](https://www.w3school.com.cn/cssref/pr_word-break.asp)

