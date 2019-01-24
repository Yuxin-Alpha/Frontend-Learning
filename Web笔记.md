# Web笔记

## 浏览器

浏览器功能:呈现web资源.

工作机制:

1. 输入网址。 
2. 浏览器查找域名的IP地址。 
3. 浏览器给web服务器发送一个HTTP请求 
4. 网站服务的永久重定向响应 
5. 浏览器跟踪重定向地址 现在，浏览器知道了要访问的正确地址，所以它会发送另一个获取请求。 
6. 服务器“处理”请求，服务器接收到获取请求，然后处理并返回一个响应。 
7. 服务器发回一个HTML响应 
8. 浏览器开始显示HTML 
9. 浏览器发送请求，以获取嵌入在HTML中的对象

我们先来了解一下一个html页面怎么被渲染最后呈现到浏览器用户眼前的.

### 渲染

由渲染引擎执行,会解析三种文件,`HTML`,`CSS`与`JS`,主要会经历这几个步骤

1. 解析html以构建dom树 -> 2. 构建render树 -> 3.布局render树 ->4. 绘制render树

渲染引擎会首先渲染解析`HTML`文件,第一步将每个`html`元素转换成一个`DOM`节点构建一棵`DOM`树,样式信息与HTML中的可视化指令一起用于创建渲染树,在构建渲染树后,根据`CSS`中的位置属性参与布局过程,每个`DOM`节点有自己的确切的坐标,最后是绘制阶段,渲染引擎将遍历整个渲染树,并使用UI后端层绘制每个节点.

输出树 - 解析树是DOM元素和属性节点的树。它是HTML文档的对象呈现和HTML元素与外部世界的接口.HTML5规范描述了解析算法,该算法包括两个阶段 - 标记化和树形结构。标记化是词法分析，将输入解析为标记。HTML标记包括开始标记，结束标记，属性名称和属性值。

+ 标记化算法

初始状态是“数据状态”。遇到“<”字符时，状态将更改为**“标记打开状态”**。使用“az”字符会导致创建“开始标记令牌”，状态将更改为**“标记名称状态”**。我们保持这种状态直到消耗“>”字符。每个字符都附加到新令牌名称。到达“>”标记时，将发出当前标记，并且状态将更改回**“数据状态”**。

+ 树构造算法

创建解析器时，将创建Document对象。在树构建阶段，将修改其根目录中包含Document的DOM树，并将元素添加到其中。标记生成器发出的每个节点都将由树构造函数处理。对于每个标记，规范定义哪个DOM元素与其相关，并将为此标记创建。除了将元素添加到DOM树之外，它还被添加到一堆开放元素中。

+ 渲染树

在构建DOM树时，浏览器构造另一个树，即渲染树。该树具有视觉元素，按其显示顺序排列。它是文档的直观表示。此树的目的是以正确的顺序绘制内容。构建渲染树需要计算每个渲染对象的可视属性。渲染器对应于DOM元素，但关系不是一对一的。非可视DOM元素不会插入渲染树中。此外，显示属性分配为“无”的元素也不会出现在树中（具有“隐藏”可见性属性的元素将显示在树中）。

+ 布局

创建渲染器并将其添加到树中时，它没有位置和大小。计算这些值称为布局或重排。布局是一个递归过程。它从根渲染器开始，它对应于HTML文档的元素。布局以递归方式继续通过部分或全部帧层次结构，计算需要它的每个渲染器的几何信息。

+ 绘制

在绘制阶段，遍历渲染树并调用渲染器“绘制”方法以在屏幕上显示其内容。

### 脚本

网络模型是同步的。解析文档会暂停，直到执行脚本为止。如果脚本是外部的，则必须首先从网络中获取资源 - 这也是同步完成的，解析将暂停，直到获取资源。Webkit和Firefox都进行了这种优化。在执行脚本时，另一个线程会解析文档的其余部分，并找出需要从网络加载的其他资源并加载它们。这些方式可以在并行连接上加载资源，整体速度更好。注意 - 推测解析器不会修改DOM树并将其留给主解析器，它只解析对外部脚本，样式表和图像等外部资源的引用。

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

MVVM

### 虚拟dom

需要先解释DOM：DOM是使用JavaScript对象来表示页面中的元素

而虚拟dom是框架中的概念，是我们程序员用js对象来模拟页面上的DOM和嵌套DOM。

真正的 DOM 元素非常庞大，这是因为标准就是这么设计的。我们平时在使用JavaScript操作DOM时，其实就是对页面进行重排和重绘，其实这是非常消耗性能的，试想，我们在使用ajax发送异步请求后，我们会得到一些数据，我们平时对页面的操作，其实是对数据的操作，就像一个数组，如果它的长度很长，那么我们大可不必要关心那些没有变化的数据，换句话说，数组中的某项或者多项，在数组中如果没有数值以及位置上的变化，我们是没有必要对这些项进行重排或者重绘的，顺着这个想法，我们只需要处理那些变动的东西，一样可以使页面得到相应的更新，与此同时，还可以大幅度地提高性能。

相对于 DOM 对象，原生的 JavaScript 对象处理起来更快，而且更简单。那么问题来了，我们在操作DOM时，实际上是通过浏览器提供的各种API，获得页面中的各个元素，使得我们可以修改每个元素的属性与样式，以此间接地修改DOM树，而DOM树本身并没有提供接口让我们直接可以操作我们熟悉而又陌生的DOM树，因为我们无法获取浏览器内存中的整个DOM树。为了解决这个问题，框架就诞生了，我们致力于构造两个DOM树，用后生成的DOM与之前生成的DOM树进行对比，只需要更新不同的地方即可，而创造这两个DOM树的方法，还是使用我们熟知的JavaScript。试想下面的Html：

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

DOM的嵌套我们可以通过`childrens`属性来嵌套.用 JavaScript 对象表示 DOM 信息和结构，当状态变更的时候，重新渲染这个 JavaScript 的对象结构。当然这样做其实没什么卵用，因为真正的页面其实没有改变。但是可以用新渲染的对象树去和旧的树进行对比，记录这两棵树差异。记录下来的不同就是我们需要对页面真正的 DOM 操作,但是可以用新渲染的对象树去和旧的树进行对比，记录这两棵树差异。记录下来的不同就是我们需要对页面真正的 DOM 操作，然后把它们应用在真正的 DOM 树上，页面就变更了。

所谓的虚拟DOM，其实就是使用JavaScript的形式，来模拟页面DOM之间的嵌套关系，即，虚拟DOM是以JS对象的形式存在的，其本质是为了实现页面元素高效的按需更新。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，既然硬盘这么慢，我们就在它们之间加个缓存：既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。

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

mvvm模式(model-view-modelView):通过modelView作为中间层（即vm的实例），即模型-视图-视图模型。【模型】指的是后端传递的数据。【视图】指的是所看到的页面。【视图模型】mvvm模式的核心，它是连接view和model的桥梁。它有两个方向：一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。这两个方向都实现的，我们称之为数据的双向绑定。总结：在MVVM的框架下视图和模型是不能直接通信的。它们通过ViewModel来通信，ViewModel通常要实现一个observer观察者，当数据发生变化，ViewModel能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且MVVM中的View 和 ViewModel可以互相通信。

渲染原理:

1. 通过建立虚拟dom树`document.createDocumentFragment()`,方法创建虚拟dom树。
2. 一旦被监测的数据改变，会通过`Object.defineProperty`定义的数据拦截，截取到数据的变化。
3. 截取到的数据变化，从而通过订阅——发布者模式，触发Watcher（观察者）,从而改变虚拟dom的中的具体数据。
4. 最后，通过更新虚拟dom的元素值，从而改变最后渲染dom树的值，完成双向绑定

`Object.defineProperty()`会在一个对象上定义一个新属性,或者修改一个对象的现有属性,并返回一个对象.上代码:

```javascript
var obj = {};
Object.defineProperty(obj,'hello',{
  get:function(){
    // 我们在这里拦截到了数据
    console.log("get方法被调用");
  },
  set:function(newValue){
    // 改变数据的值，拦截下来
    console.log("set方法被调用");
  }
});
obj.hello//输出为“get方法被调用”，输出了值。
obj.hello = 'new Hello';//输出为set方法被调用，修改了新值
```

在此基础上,我们可以做到简单的双向绑定:

```javascript
var obj = {};
Object.defineProperty(obj,'hello',{
  get:function(){
    //我们在这里拦截到了数据
    console.log("get方法被调用");
  },
  set:function(newValue){
    //改变数据的值，拦截下来额
    console.log("set方法被调用");
    document.getElementById('test').value = newValue;
    document.getElementById('test1').innerHTML = newValue;
  }
});
document.getElementById('test').addEventListener('input',function(e){
  // 修改obj.hello的值,触发该属性的set方法
  obj.hello = e.target.value;
})
```

html:

```html
<div id="mvvm">
    <input v-model="text" id="test"></input>
	<div id="test1"></div>
</div>
```

实现Vue:

```javascript
function nodeContainer(node, vm, flag){
  var flag = flag || document.createDocumentFragment();
  var child;
  while(child = node.firstChild){
    compile(child, vm);
    flag.appendChild(child);
    if(child.firstChild){
      // flag.appendChild(nodeContainer(child,vm));
      nodeContainer(child, vm, flag);
    }
  }
  return flag;
}

function compile(node, vm){
  var reg = /\{\{(.*)\}\}/g;// 匹配双绑的双大括号
  if(node.nodeType === 1){
    var attr = node.attributes;
    // 解析节点的属性
    for(var i = 0;i < attr.length; i++){
      if(attr[i].nodeName == 'v-model'){
        var name = attr[i].nodeValue;
        node.addEventListener('input',function(e){
          console.log(vm[name]);
          vm[name] = e.target.value;//改变实例里面的值
        });
        node.value = vm.data[name];// 讲实例中的data数据赋值给节点
        // node.removeAttribute('v-model');
      }
    }
  }
  // 如果节点类型为text
  if(node.nodeType === 3){  
    if(reg.test(node.nodeValue)){
      var name = RegExp.$1; // 获取匹配到的字符串
      name = name.trim();
      node.nodeValue = vm.data[name];
    }
  }
}

function Vue(options){
  this.data = options.data;
  
  var id = options.el;
  observe(data,this);
  var dom = nodeContainer(document.getElementById(id),this);
  document.getElementById(id).appendChild(dom);  
}

var Demo = new Vue({
  el:'mvvm',
  data:{
    text:'HelloWorld',
    d:'123'
  }
})
```

data属性的响应式:

```javascript
function defineReactive (obj, key, value){
  Object.defineProperty(obj,key,{
    get:function(){
      console.log("get了值"+value);
      return value;//获取到了值
    },
    set:function(newValue){
      if(newValue === value){
        return; // 如果值没变化，不用触发新值改变
      }
      value = newValue;// 改变了值
      console.log("set了最新值"+value);
    }
  })
}

// 循环调用
function observe (obj,vm){
  Object.keys(obj).forEach(function(key){
    defineReactive(vm,key,obj[key]);
  })
}
```



我们在导入包之后，在浏览器的内存中就多了一个Vue构造函数。

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

+ `render` 函数

  ```vue
  <h1>{{ blogTitle }}</h1>
  // 或者
  render: function (createElement) {
    return createElement('h1', this.blogTitle)
  }
  ```

  + Vue 通过建立一个**虚拟 DOM** 对真实 DOM 发生的变化保持追踪。

    `createElement`：

    ```vue
    createElement(
      // {String | Object | Function}
      // 一个 HTML 标签字符串，组件选项对象，或者
      // 解析上述任何一种的一个 async 异步函数。必需参数。
      'div',
    
      // {Object}
      // 一个包含模板相关属性的数据对象
      // 你可以在 template 中使用这些特性。可选参数。
      {},
    
      // {String | Array}
      // 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，
      // 也可以使用字符串来生成“文本虚拟节点”。可选参数。
      [
        '先写一些文字',
        createElement('h1', '一则头条'),
        createElement(MyComponent, {
          props: {
            someProp: 'foobar'
          }
        })
      ]
    )
    ```


### 生命周期

所有的生命周期钩子自动绑定 `this` 上下文到实例中，因此你可以访问数据，对属性和方法进行运算。不能使用箭头函数来定义一个生命周期方法。

`beforeCreate()`:实例初始化之后,此时还不能数据观测.

`created()`:实例创建完成之后立即调用,完成数据观测,属性和方法的运算,但未挂载,所以实例中的`$el`属性是不可见的.

`beforeMount`:在实例挂载之前被调用,该钩子函数子在服务器端渲染不被调用

`mounted`:

### 实例属性

`vm.$parent`:父实例

`vm.$root`:当前组件树的跟实例

`vm.$refs`:保存所有注册过`ref`特性的所有DOM元素和组件实例

### 实例方法

`vm.$on`:监听当前实例上的自定义事件.回调函数会接收由`vm.$emit`触发事件传入事件触发函数的额外参数.



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

 webpack 处理应用程序时，它会递归地构建一个依赖关系图,其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 *bundle*。

### 入口起点

指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。可以通过配置 `entry` 属性，来指定一个入口起点,默认值为 `./src`.

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

### 出口

**output** 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 `./dist`。

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### loader

处理非 JavaScript 文件（因为webpack 自身只理解 JavaScript）,loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块. 在 webpack 的配置中 **loader** 有两个目标:`test` 属性(用于标识应该被对应的loader进行转换的文件)与`use` 属性(使用什么loader进行转换).

```javascript
const path = require('path');

const config = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};

module.exports = config;
```

当txt文件被导入(require或者import)的时候,先使用`raw-loader`转换一下,再打包.