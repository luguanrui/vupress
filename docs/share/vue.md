# vue相关

## 初始化数据

### 业务场景

当使用`弹窗`或者`抽屉`提交`form`表单的之后，手动关闭弹窗不会清空数据

### 技术实现

```js
Object.assign(this.$data, this.$options.data())
```

## vue绑定值与字符串拼接

### 业务场景

使用`elementui`遍历一个`tabs`数组，为每个`tab`标签页的选项卡头设置显示文字，要求添加上序号,并从1开始

### 技术实现

```vue
<a-tabs type="card" size="small">
    <a-tab-pane :key="index" :tab="`标签${index+1}`" v-for="(item, index) in list">
    </a-tab-pane>
</a-tabs>
```

::: warning 
如果使用`:tab="'标签' + index+1}"`这种方式，会编译成`标签01`这种形式
:::
