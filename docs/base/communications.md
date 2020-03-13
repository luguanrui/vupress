## 通信类

## 什么是同源策略及限制

同源策略限制从一个源加载的文件或者脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（源包含：协议+域名+端口）

限制：
- Cookie,LocalStrorage和IndexDB无法读取
- DOM无法获取
- AJAX请求不能发送
    
## 前后端如何通信

- AJAX（只适合同源策略的通讯方式）
- WebSocket(不受同源策略的限制)
- CORS（支持同源策略通信，也可以不是同源策略的通信）

## 如何创建Ajax（原生）

- XMLHttpRequst对象的工作流程
- 兼容性处理（IE不支持）
- 事件的触发条件
- 事件的触发顺序

实现：
```js
function ajax(url){
    var xhr = window.XMLHttpRequest ? newXMLHttpRequest() : ActiveXObject("microsoft.XMLHttp")
    xhr.open("get",url,true);
    xhr.send();
    xhr.onreadysattechange = () =>{
        if(xhr.readystate == 4){
            if(xhr.status == 200){
                var data = xhr.responseTEXT;
                return data;
            }
        }
    }
}
```
    
## 跨域通信的几种方式（5种）

- JSONP
- Hash（url后面的#）
- postMessage（h5中新增）
- WebSocket
- CORS（理解为Ajax的一种方式）

(1)JSONP

原理：利用script标签的异步加载来实现

实现：
``` js
  自查
```

(2) Hash

```js
// 利用hash，场景是当前页面 A 通过iframe或frame嵌入了跨域的页面 B
// 在A中伪代码如下：
var B = document.getElementsByTagName('iframe');
B.src = B.src + '#' + 'data';
// 在B中的伪代码如下
window.onhashchange = function () {
  var data = window.location.hash;
};
```

(3) postMessage

实现：

```js
// 窗口A(http:A.com)向跨域的窗口B(http:B.com)发送信息
Bwindow.postMessage('data', 'http://B.com');
// 在窗口B中监听
Awindow.addEventListener('message', function (event) {
  console.log(event.origin);
  console.log(event.source);
  console.log(event.data);
}, false);
```

(4) WebSocket

```js
// Websocket【参考资料】http://www.ruanyifeng.com/blog/2017/05/websocket.html

var ws = new WebSocket('wss://echo.websocket.org');
// 发送消息
ws.onopen = function (evt) {
  console.log('Connection open ...');
  ws.send('Hello WebSockets!');
};
// 接受消息
ws.onmessage = function (evt) {
  console.log('Received Message: ', evt.data);
  ws.close();
};
// 连接中断
ws.onclose = function (evt) {
  console.log('Connection closed.');
};
```

(5) CORS

```js
// CORS【参考资料】http://www.ruanyifeng.com/blog/2016/04/cors.html
// url（必选），options（可选）
fetch('/some/url/', {
  method: 'get',
  // 跨域的，这里需要加配置
}).then(function (response) {

}).catch(function (err) {
// 出错了，等价于 then 的第二个参数，但这样更好用更直观
});
```

## 怎么与服务端保持连接

- HTTP请求头需要增加`Connection:keep-alive`字段
- websocket

## cookie有哪些属性

- name字段：一个cookie的名称
- value字段：一个cookie的值
- domain字段：可以访问此cookie的域名
- path字段：可以访问此cookie的页面路径
- Size字段：此cookie大小
- http字段：cookie的httponly属性，若此属性为True，则只有在http请求头中会有此cookie信息，而不能通过document.cookie来访问此cookie。
- secure字段：设置是否只能通过https来传递此条cookie。
- expires/Max-Age字段：设置cookie超时时间。如果设置的值为一个时间，则当到达该时间时此cookie失效。不设置的话默认是session，意思是cookie会和session一起失效，当浏览器关闭（并不是浏览器标签关闭，而是整个浏览器关闭）后，cookie失效。

## cookie,session,localstorage,sessionstorage有什么区别

## 怎么禁止js访问cookie

如果您在cookie中设置了`HttpOnly`属性，那么通过js脚本将无法读取到cookie信息，这样能有效的防止XSS攻击