1. 什么是同源策略及限制

    同源策略限制从一个源加载的文件或者脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。（源包含：协议+域名+端口）

    限制：
    - Cookie,LocalStrorage和IndexDB无法读取
    - DOM无法获取
    - AJAX请求不能发送
    
2. 前后端如何通信

    - AJAX（只适合同源策略的通讯方式）
    - WebSocket(不受同源策略的限制)
    - CORS（支持同源策略通信，也可以不是同源策略的通信）

3. 如何创建Ajax（原生）

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
    
4. 跨域通信的几种方式（5种）

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