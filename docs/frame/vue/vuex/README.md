---
sidebar: auto
---

# Vuex

[Vuex](https://vuex.vuejs.org/zh/) 是一个专为 Vue.js 应用程序开发的状态管理模式。

<img src="../../../public/vuex.png">

## 核心api

api | 说明
--- | ---
state | state是存储的单一状态，是存储的基本数据
getters | getters是store的计算属性，对state的加工，是派生出来的数据。就像computed计算属性一样，getter返回的值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会被重新计算
mutations | mutations提交更改数据，使用store.commit方法更改state存储的状态。（mutations同步函数）
actions | actions像一个装饰器，提交mutation，而不是直接变更状态。（actions可以包含任何异步操作）
module | Module是store分割的模块，每个模块拥有自己的state、getters、mutations、actions
辅助函数 | Vuex提供了mapState、mapGetters、mapActions、mapMutations等辅助函数给开发在vm中处理store
dispatch | 
commit | 

## 使用

### 基础应用

```js
import Vuex from 'vuex';
Vue.use(Vuex); // 1. vue的插件机制，安装vuex
let store = new Vuex.Store({ // 2.实例化store，调用install方法
    state,
    getters,
    modules,
    mutations,
    actions,
    plugins
});
new Vue({ // 3.注入store, 挂载vue实例
    store,
    render: h=>h(app)
}).$mount('#app');
```

### 按模块区分

user.js

```js
import { login, logout, getInfo } from '@/api/user'

const state = {
  token: getToken(), // token
  name: '', // 用户名
  avatar: '', // 用户头像
  introduction: '', // 用户个人介绍
  roles: [], // 用户角色列表
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    try {
      const { data } = await login({ username: username.trim(), password: password })
      // 设置vuex和cookie中的token
      commit('SET_TOKEN', data.token)
      setToken(data.token)
    } catch (error) {
      throw new Error(error)
    }
  },
  // 退出
  async logout({ commit, state, dispatch }) {
    try {
      await logout(state.token)
      dispatch('resetToken')
      dispatch('tagsView/delAllViews')
    } catch (error) {
      throw new Error(error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
```

settings.js

```js
import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme, // 主题色
  showSettings: showSettings, // 是否显示设置面板
  tagsView: tagsView, // 是否显示tagsView
  fixedHeader: fixedHeader, // 是否固定头部
  sidebarLogo: sidebarLogo, // 是否显示侧边栏的logo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
```

index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import settings from './settings'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: [user, settings],
  getters
})

export default store
```

main.js

```js
import Vue from 'vue'
import App from './App'
import store from './store'
// ...

new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
})
```

使用：`this.$store.dispatch('user/login', 参数)`

```vue
<template>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
```

## 辅助函数

辅助函数`mapState`,`mapGetters`,`mapActions`,`mapMutations`分别用在vue的什么地方

```js
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['sideBarList']),
    ...mapGetters(['getCardProgramInfo'])
  },
  methods: {
    ...mapMutations({
      setCurrentScene: "SET_CURRENT_SCENE"
    }),
    ...mapActions(['getIncrementList','handleIgnoreOne'])
  }
}
```

## 严格模式

如何开启Vuex的严格模式？它有什么作用？

开启严格模式，仅需在创建 store 的时候传入strict: true

```js
const store = new Vuex.Store({
   state,
   strict: true//开启严格模式后，只能通过mutation来改变状态（不支持异步）否则会报错
})
```

## Mutation和Action的区别

- mutation是修改store中state的唯一途径
- mutation必须是同步的
- action可以是异步的，但是不能直接操作state，需要通过提交（commit） mutation 间接更变状态
- mutation只要一个操作，而action可以整合多个mutation

## 问题

- 请谈谈你对Vuex的理解？

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化