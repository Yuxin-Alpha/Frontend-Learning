# Vuex

Vue的数据共享框架，解决了非父子组件之间数据共享的问题。将每个组件都有可能用到的数据放在Vuex中，当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。组件通过dispatch来分发actions中的方法，这些方法来提交mutations中定义的方法，在mutations的方法中来修改state。组件想要修改store中的数据，必须通过上面的步骤，不允许直接修改store中的数据。

具体使用：

1. `npm install vuex --save`下载插件

2. 在`src`目录下新建`store/index.js`

   ```javascript
   // index.js文件下
   import Vue from 'vue'
   import Vuex from 'vuex'
   // 使用这个插件
   Vue.use(Vuex)
   // 使用插件中的Store函数实例一个仓库并且暴露出去
   export default new Vuex.Store({
     state,
     mutations
     //...
   })
   ```

3. 在项目入口文件`main.js`中引入，通过在根实例中注册 `store` 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 `this.$store` 访问到。

   ```javascript
   // main.js文件下
   import Vue from 'vue'
   import App from './App'
   import router from './router'
   import store from './store'
   
   new Vue({
     el: '#app',
     router,
     // 注册
     store,
     components: { App },
     template: '<App/>'
   })
   ```

- state：数据存放的区域

  ```javascript
  // mapState函数辅助生成状态属性
  // 在需要使用store中数据的组件中引入
  import { mapState } from 'vuex'
  
  export default {
    // ...
    computed: mapState({
      // 箭头函数可使代码更简练
      count: state => state.count,
      // 传字符串参数 'count' 等同于 `state => state.count`
      countAlias: 'count',
      // 为了能够使用 `this` 获取局部状态，必须使用常规函数
      countPlusLocalState (state) {
        return state.count + this.localCount
      }
    })
  }
  // 或者
  computed: mapState([
    // 映射 this.count 为 store.state.count
    'count'
  ])
  // 使用对象展开运算符
  computed: {
      ...mapState(['city'])
    },
  ```

- `Getter`：类似于组件的computed属性，可以对state状态进行再次包装，Getter 会暴露为 `store.getters` 对象。

  ```javascript
  const store = new Vuex.Store({
    state: {
      todos: [
        { id: 1, text: '...', done: true },
        { id: 2, text: '...', done: false }
      ]
    },
    getters: {
      doneTodos: state => {
        return state.todos.filter(todo => todo.done)
      }
    }
  })
  
  // mapGetters辅助函数
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'doneTodosCount',
        'anotherGetter',
        // ...
      ])
  ```

- `mutations`：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。每个 mutation 都有一个字符串的事件类型和一个 回调函数 。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

  ```javascript
  const store = new Vuex.Store({
    state: {
      count: 1
    },
    mutations: {
      increment (state, n) {
        // 变更状态
        state.count + n
      }
    }
  })
  // 在组件中调用
  this.$store.commit('increment', 10)
  
  // mapMutations辅助函数
  import { mapMutations } from 'vuex'
  
  export default {
    // ...
    methods: {
      ...mapMutations([
        'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
  
        // `mapMutations` 也支持载荷：
        'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
      ]),
      ...mapMutations({
        add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      })
    }
  }
  ```

- `actions`：组件通过调用这里存放的异步处理或者批量的同步操作，通过这些操作去调用`mutations`

# 源码分析

## 从入口开始

```javascript
export default {
  Store,
  install,
  mapState,
  mapMutations,
  mapGetters,
  mapActions
}
```

在`index.js`文件的最后，Vuex向外暴露了这么多API。

首先先介绍一下`install`:

```javascript
function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
```

当我们执行 Vue.use(Vuex) 这句代码的时候，实际上就是调用了 install 的方法并传入 Vue 的引用。对 Vue 的判断主要是保证 install 方法只执行一次，这里把 install 方法的参数 _Vue 对象赋值给 Vue 变量，这样我们就可以在 index.js 文件的其它地方使用 Vue 这个变量了。`applyMixin(Vue)`方法的作用就是在 Vue 的生命周期中的初始化（1.0 版本是 init，2.0 版本是 beforeCreated）钩子前插入一段 Vuex 初始化代码——给 Vue 的实例注入一个 `$store` 的属性，这也就是为什么我们在 Vue 的组件中可以通过 `this.$store.xxx` 访问到 Vuex 的各种数据和状态。

## Store构造函数

使用 Vuex 的时候，通常会实例化 Store 类，然后传入一个对象，包括我们定义好的 actions、getters、mutations、state等，甚至当我们有多个子模块的时候，我们可以添加一个 modules 对象。在Store类的定义中，由于构造函数的定义过长，需要慢慢分析：

+ 断言函数

```javascript
class Store {
  constructor (options = {}) {
    assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
    assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
	// ...
  }
}  
```

构造函数中第一件事就使用断言函数判断Vue和Promise存在，也就是在我们实例化 Store 之前，必须要保证之前的 install 方法已经执行了。

assert函数的具体实现:

```javascript
export function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}
```

+ 