# 字符串

## 字符串倒序
- reverseString(str)  生成一个倒序的字符串
  
```js
function reverseString (str) {
  return str.split('').reverse().join('')
}
```
## 字符串是否是回文
- palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false

```js
function palindrome (str) {
  return str===reverseString(str)
}
```
## 截取字符串
- truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束

```js
function truncate(str, num) {
  return str.length>num ? str.substring(0, num) + '...': str
}
```