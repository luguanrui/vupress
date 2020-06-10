# vuex

## 原理

<img src="../public/vuex.png"/>

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

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

## vuex的使用

基础应用：
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

复杂应用：

user.js

```js
import {login} from '@/api/user'

const user = {
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    SET_TOKEN(state, val) {
      state.token = val
    },
    SET_USERINFO(state, val) {
      state.userInfo = val
    },
  },
  actions: {
    LoginActions({commit,state,dispatch}, params) {
        return new Promise((resolve,reject) => {
            login(params).then(res => {
                const {code, rs} = res
                if (code === 200){
                    commit('token', data.token)
                    localStorage.setItem('token', data.token)
                    resolve(res)
                }else {
                    reject(res)
                }
            }).catch(error => {
            reject(error)
          })
        })
    }
  },
  getters: {
    userInfo(state) {
        return state.userInfo
    }
  },
}
export default user
```

## mapState,mapGetters,mapActions,mapMutations分别用在vue的什么地方

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

## 如何开启Vuex的严格模式？它有什么作用？

开启严格模式，仅需在创建 store 的时候传入strict: true

```js
const store = new Vuex.Store({
   state,
   strict: true//开启严格模式后，只能通过mutation来改变状态（不支持异步）否则会报错
})
```

## Vuex的Mutation和Action有哪些区别

- mutation是修改store中state的唯一途径
- mutation必须是同步的
- action可以是异步的，但是不能直接操作state，需要通过提交（commit） mutation 间接更变状态
- mutation只要一个操作，而action可以整合多个mutation

## 请谈谈你对Vuex的理解

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化