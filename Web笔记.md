# Web笔记

## HTTP协议

1. http:超文本传输协议
2. https:安全的超文本传输协议,不容易被攻击

### 版本

http:一次性链接;http1.1:保持链接;http2.0:强制https,自带双向通信.

###数据交互

1. 表单 action:提交地址,method: 方式

2. ajax(接收的时候,先接收头,再接收体)

3. jsonp

4. websocket(双向通信默认可以跨域)

## React

### 虚拟dom

需要先解释DOM：DOM是使用JavaScript对象来表示页面中的元素

而虚拟dom是框架中的概念，是我们程序员用js对象来模拟页面上的DOM和嵌套DOM。

我们平时在使用JavaScript操作DOM时，其实就是对页面进行重排和重绘，其实这是非常消耗性能的，试想，我们在使用ajax发送异步请求后，我们会得到一些数据，我们平时对页面的操作，其实是对数据的操作，就像一个数组，如果它的长度很长，那么我们大可不必要关心那些没有变化的数据，换句话说，数组中的某项或者多项，在数组中如果没有数值以及位置上的变化，我们是没有必要对这些项进行重排或者重绘的，顺着这个想法，我们只需要处理那些变动的东西，一样可以使页面得到相应的更新，与此同时，还可以大幅度地提高性能。

那么问题来了，我们在操作DOM时，实际上是通过浏览器提供的各种API，获得页面中的各个元素，使得我们可以修改每个元素的属性与样式，以此间接地修改DOM树，而DOM树本身并没有提供接口让我们直接可以操作我们熟悉而又陌生的DOM树，因为我们无法获取浏览器内存中的整个DOM树。为了解决这个问题，框架就诞生了，我们致力于构造两个DOM树，用后生成的DOM与之前生成的DOM树进行对比，只需要更新不同的地方即可，而创造这两个DOM树的方法，还是使用我们熟知的JavaScript。试想下面的Html：

```html
<div id="myDiv" title="说实话">我挺帅的
    <p>哈哈哈</p>
</div>
```

这个代码没有什么难度，但是我们可以通过JavaScript模拟构造这么一个html的元素：

```javascript
var div = {
    tagName: 'div',
    attrs: {
        id: 'myDiv',
        title: '说实话'
    },
    childrens: [
        '我挺帅的',
        {
         	tagName: 'p',
            attrs: {},
            childrens: [
                '哈哈哈'
            ]
        }
    ]
}
```

DOM的嵌套我们可以通过`childrens`属性来嵌套，运用这种思想，我们就可以再创造一个DOM元素。两者进行对比，就是遍历对象中同一属性的不同值，更新该值就可以。

所谓的虚拟DOM，其实就是使用JavaScript的形式，来模拟页面DOM之间的嵌套关系，即，虚拟DOM是以JS对象的形式存在的，其本质是为了实现页面元素高效的按需更新。

### Diff算法（差异查询算法）

- tree diff

  新旧两颗DOM树，逐层对比的过程，当该过程的完成，就能够找到需要更新的元素。

- component diff

  在进行tree diff的过程中，组件之间的对比。如果对比前后，组件的类型相同，如果类型相同，则暂时认为这个组件不需要被更新。如果组件类型不同，则需要移除旧组件，创建新的组件，并追加到页面上

- element diff

  在进行component diff的过程中，如果两个组件相同，则需要进行元素级别的对比。

三个diff算法逐层递进，使得整两个DOM树的对比没有遗漏。

### 安装

1. 运行`npm i react react-dom -S`安装包
   + react:  专门用于创建组件和虚拟DOM的，同时组件的声明周期都在这个包中
   + react-dom: 专门进行dom操作，主要用于`ReactDOM.render()`，将我们生成好的虚拟DOM渲染到页面上（因为我们生成的虚拟DOM在浏览器的内存中）

2. 初探：

   ```javascript
   import React from 'react'
   import ReactDOM from 'react-dom'
   
   // 创建虚拟DOM元素
   // 参数1： 创建元素的类型， 接受字符串，表示元素的名称
   // 参数2: 是一个对象或者null，表示当前这个DOM元素的属性
   // 参数3：子节点(包括其它虚拟DOM获取的文本子节点)
   // 参数n：其它子节点
   // <h1 id="myh1" title="this is a h1">这是一个大大的h1</h1>
   const myh1 = React.createElement('h1', {id: 'myh1', title: "this is a h1"}, '这是个大大的h1')
   
   // 使用ReactDOM把虚拟DOM渲染到页面上
   // 参数1：要渲染的那个虚拟DOM元素
   // 参数2：指定页面上的容器
   ReactDOM.render(myh1, document.getElementById('app'))
   ```

   当然，我们可以这么创建一个元素，但是真正在书写前端页面的时候，一个页面就有成百上千个元素，所以，这么做成本实在太高了。为了能够实现快速开发，我们想到了在js文件中书写我们的HTML代码，但是js原本的语法并不允许我们这样做。由此，生成了JSX语法。

### JSX语法

## Vue

### API

+ `Vue.extend()`使用基础 Vue 构造器，创建一个“子类”,参数是一个包含组件选项的对象.

+ `Vue.nextTick()`在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

+ `Vue.set()`向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新

+ `Vue.directive(id,{})`注册或获取全局指令。

+ `Vue.component()`注册或获取全局组件。注册还会自动使用给定的`id`设置组件的名称

  ```vue
  // 注册组件，传入一个选项对象 (自动调用 Vue.extend)
  Vue.component('my-component', { /* ... */ })
  
  // 获取注册的组件 (始终返回构造器)
  var MyComponent = Vue.component('my-component')
  ```

### 选项

+ `data`  Vue 实例的数据对象。Vue 将会递归将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化,实例创建之后，可以通过 `vm.$data` 访问原始数据对象。

+ `props` props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组

+ `computed` 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果某个依赖 (比如非响应式属性) 在该实例范畴之外，则计算属性是**不会**被更新的。

  ```vue
  var vm = new Vue({
    data: { a: 1 },
    computed: {
      // 仅读取
      aDouble: function () {
        return this.a * 2
      },
      // 读取和设置
      aPlus: {
        get: function () {
          return this.a + 1
        },
        set: function (v) {
          this.a = v - 1
        }
      }
    }
  })
  vm.aPlus   // => 2
  vm.aPlus = 3
  vm.a       // => 2
  vm.aDouble // => 4
  ```

+ `methods` methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 `this` 自动绑定为 Vue 实例。

  注意：不能使用箭头函数来定义method函数，因为箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向 Vue 实例，`this.a` 将是 undefined。

+ `el` 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。
+ `template` 一个字符串模板作为 Vue 实例的标识使用。模板将会 **替换** 挂载的元素。
+ `render` 

### 使用插件

通过全局方法 `Vue.use()` 使用插件。它需要在你调用 `new Vue()` 启动应用之前完成：

```vue
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  //... options
})
```

`Vue.use` 会自动阻止多次注册相同插件，届时只会注册一次该插件。

### 写法规范

1. 组件名应该始终是多个单词的,避免跟现有的以及未来的 HTML 元素.

   ```vue
   Vue.component('todo-item', {
     // ...
   })
   
   export default {
     name: 'TodoItem',
     // ...
   }
   ```

2. data必须是一个函数,然后值被return出去:因为当data是一个对象时,它会在组件的所有实例中共享,如果该组件被复用,A组件对数据的修改将会影响另一个组件.

   ```Vue
   data: function () {
     return {
       listTitle: '',
       todos: []
     }
   }
   ```

3. Prop属性应该尽量详细,至少要指定类型

   ```vue
   props: {
     status: {
       type: String,
       required: true,
       validator: function (value) {
         return [
           'syncing',
           'synced',
           'version-conflict',
           'error'
         ].indexOf(value) !== -1
       }
     }
   }
   ```

4. 永远不要把 v-if 和 v-for 同时用在同一个元素上。

5. 单文件组件的文件要么始终是单词大写开头,要么始终是横线连接.

6. 在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板和 JSX 中应该始终使用 kebab-case。

   ```vue
   props: {
     greetingText: String
   }
   <WelcomeMessage greeting-text="hi"/>
   ```

7. 属性多行书写:

   ```Vue
   <img
     src="https://vuejs.org/images/logo.png"
     alt="Vue Logo"
   >
   <MyComponent
     foo="a"
     bar="b"
     baz="c"
   />
   ```

8. 组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。

## Webpack

