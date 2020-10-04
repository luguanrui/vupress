# 二进制流文件下载

## 业务场景

在业务开发过程中，经常会遇到文件下载的场景，通常有两种方式，一种是接口返回下载的地址，另一种是接口返回`二进制`文件流，目前我们业务当中，使用的是`文件流`的形式，前端通过`Blob`来实现`excel`文件的下载


## 技术实现

1. axios请求接口

**get方式：**
```js
export function exportExcel(params) {
  const url = '/export'  
  return axios.get(url, { params, responseType: "blob" })
}
```
 
**post方式：**
```js
export function exportExcel(params) {
  const url = '/export'  
  return axios.post(url, param, { responseType: "blob" })
}
```
::: tip 说明
1. `responseType: "blob"`的作用是：设置服务器返回的数据类型，将流文件转化为二进制数据的`Blob 对象`
2. 必须设置，否则下载的文件打不开
:::

2. 处理返回的**二进制文件流**，并下载
  
```js
// 接口请求
async caseListExport() {
    try {
        this.loading = true;
        let params = {}
        let result = await caseListExport(params);
        if (result) {
            this.loading = false;
        }
        this.downFile(result, '文件名');
    } catch (err) {
        this.loading = false;
    }
},
// 下载方法,可封装在一个工具函数中
downFile(result, name) {
    // 通过Blob构造函数，创建Blob对象
    const blob = new Blob([result], { type: "application/vnd.ms-excel,charset=UTF-8"});
    // 定义文件名+后缀
    let fileName = `${name}.xlsx`;

    if (window.navigator.msSaveOrOpenBlob) {
        // IE以及IE内核的浏览器
        navigator.msSaveBlob(blob, fileName);
    } else {
        // 创建a标签
        var link = document.createElement("a");
        // createObjectURL(blob)会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
        // a标签的 href 赋值 url
        link.href = window.URL.createObjectURL(blob);
        // a标签的 download 属性指向 fileName
        link.download = fileName;
        // a标签自动触发click事件
        link.click();
        // 用来释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象
        window.URL.revokeObjectURL(link.href);
    }
},
```
## 遇到的坑

由于项目用到了`mockjs`，mockjs初始化的时候，拦截响应设置了`responseType: ''`,导致下载的文件无法打开，最简单的方法就是注释掉`mockjs`