# keep-alive的真实场景应用

## 业务场景

由于列表页面需要用户筛选的条件太多，从列表页进入详情页，在从详情页返回到列表页时，数据刷新，这样就造成了用户需要重新去选择筛选条件（要求列表页面跳转详情页，返回时列表页面数据和滚动位置缓存）

## 需求

1. 从详情页返回列表页时保留用户选择和填写的数据
2. 页面停留在原来滚动的位置
3. 在详情页对单条数据进行操作之后，要求返回列表页时，只更新单条数据的的信息

## 问题分析

组件切换时，DOM重新渲染，导致数据刷新

## 技术方案

1. 使用vue的内置组件keep-alive，将状态保存在内存中，防止重复渲染DOM,结合router的meta属性，缓存部分页面
2. 使用keep-alive生命周期钩子函数：activated，更新单条数据
3. 进入详情页面时，缓存DOM元素的scrollTop，返回重新设置scrollTop解决页面返回时滚动的位置

## 具体实现

1. main.vue页面

```vue
<router-view/>
```

替换为：

```vue
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```

2. 设置需要缓存路由的keepAlive属性

```js
{
    path: '/list',
    component: list,
    meta: {
    keepAlive: true,
    refresh: false,
    id: ''
    },
    beforeEnter: (to, from, next)=> {
    // 判断是不是从详情页返回的
    if (from.path === '/detail') {
        to.meta.keepAlive = true
        to.meta.refresh = true
        to.meta.id = from.query.id
    }
    next()
    }
},
```

3. 设置页面的srollTop并更新单条数据

```js
// 从例子详情页返回，更新本条例子信息
activated() {
if (this.$route.meta.refresh) {
    // 滚动到原来的位置
    let scrollToTop = JSON.parse(sessionStorage.getItem('scrollToTop'))
    document.getElementsByClassName('container')[0].scrollTop = scrollToTop

    // 遍历更新
    let id = this.$route.meta.id
    getListDetail({id: id}).then((res) => {
    let {code, data} = res
    if (code === 200) {
        this.data.forEach((val, i) => {
        if (val.id === id) {
            this.data[i] = Object.assign(this.data[i], data)
        }
        })
    }
    })
}
}
```
4. 进入详情页时缓存dom元素的scrollTop
```js
// 查看详情
_handleDetail(id) {
    let scrollToTop = document.getElementsByClassName('container')[0].scrollTop
    sessionStorage.setItem('scrollToTop', scrollToTop)
}
```