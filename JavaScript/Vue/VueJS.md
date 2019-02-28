## VueJS

### 基本语法

```vue
<div id="app">
    {{ content }}
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            content: 'hello world1'
        }
    })
    setTimepit(() => {
        app.$data.content = 'bye world'
    })
</script>
```

通过`new`操作符实例化一个Vue对象,该对象的`el`属性表示这个Vue对象挂载的目标,这个案例中是`id`值为app的DOM元素.而data属性是这个Vue对象的数据,里面可以定义任意多的数据,这样Vue对象可以将数据的值渲染到已经挂载的目标对象.可以通过`app.$data.content`来获取Vue对象中数据名为`content`的数据值.

### 指令

```vue
<div id="app">
    <input type="text" v-model="inputValue">
    <button @click="handleBtnClick">提交</button>
    <ul>
        <li v-for="item in list">{{item}}</li>
    </ul>
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            list: ['123', '456', '789'],
            inputValue: ''
        },
        methods: {
            handleBtnClick() {
                this.list.push(this.inputValue);
                this.inputValue = '';
            }
        }
    })
</script>
```

`v-model`指令:可以对Vue对象的数据进行双向绑定,所谓双向绑定,当修改input框中的value时,被v-model绑定的data数据就回修改,我们在修改被绑定的data数据的时候,input框中的value也会改变

`v-on`指令:将方法绑定给一个标签,方法有不同的触发方法,这里是我们比较常见的点击事件,这里绑定的语法可以用`@`代替,当被`v-on`绑定的方法被触发的时候,Vue会自动到对象app中去寻找这个方法,然后调用.

`v-for`指令:循环遍历app对象中data的一个列表数据,其中key的作用是对组件进行约束.

`v-if`指令:条件渲染,在DOM中直接插入或者删除元素

`v-show`指令:也是条件渲染,不过是将元素的样式`display`的值设置为`none`,如果元素要在页面之中频繁切换,应该使用这个指令来提高性能,毕竟DOM的删除和插入是直接操作DOM

### MVVM模式

`mvvm`模式(model-view-modelView):通过modelView作为中间层（即vm的实例），即模型-视图-视图模型。【模型】指的是后端传递的数据。【视图】指的是所看到的页面。【视图模型】mvvm模式的核心，它是连接view和model的桥梁。它有两个方向：一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。这两个方向都实现的，我们称之为数据的双向绑定。总结：在MVVM的框架下视图和模型是不能直接通信的。它们通过ViewModel来通信，ViewModel通常要实现一个observer观察者，当数据发生变化，ViewModel能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且MVVM中的View 和 ViewModel可以互相通信。

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

### 组件化

我们可以将页面分离成一个一个小的组件,那么一个大型页面组成就是各种小组件的拼装.

- 全局组件

  ```vue
  <div id="app">
      <input type="text" v-model="inputValue">
      <button @click="handleBtnClick">提交</button>
      <ul>
          <todo-item v-for="item in list" v-bind:content="item">	</todo-item>
      </ul>
  </div>
  <script>
      Vue.component('TodoItem', {
          props: ['content'],
          template: '<li>{{content}}</li>'
      });
      var app = new Vue({
          el: '#app',
          data: {
              list: [],
              inputValue: ''
          },
          methods: {
              handleBtnClick() {
                  this.list.push(this.inputValue);
                  this.inputValue = '';
              }
          }
      })
  </script>
  ```

  我们可以通过Vue自带的`component()`来创建一个全局组件,`template`属性指的是这个组件的标签,`props`属性用来接收父组件传递过来的数据.

- 局部组件

  ```vue
  var TodoItem = {
              props: ['content'],
              template: '<li>{{content}}</li>'
          }
  var app = new Vue({
  	el: '#app',
  	component: {
  		TodoItem: TodoItem
  	},
  	data: {
  		list: [],
  		inputValue: ''
  	},
  	methods: {
  		handleBtnClick() {
  			this.list.push(this.inputValue);
  			this.inputValue = '';
  		}
  	}
  })
  ```

  我们直接定义一个拥有Vue对象的各种属性的JS对象,然后在父组件中通过`component`属性引入这个对象,那么这个父组件中就可以使用这个JS对象,也就是我们所说的子组件.	

- 组件之间的传值(单向数据流)

  父组件通过`v-bind`向子组件传值

  子组件通过`this.$emit()`触发函数来向父组件传值

  > 注意在子组件中,`data`属性必须是一个函数,该组件中所有的数据通过`data`函数return出去,因为组件会被复用,否则会出现组件之间数据共享,相同的子组件,有一个数据改变了,其他的子组件也会跟着改变

  组件参数校验:

  ```javascript
  Vue.component('child', {
        template: '<div>{{content}}</div>',
        props: {
          content: {
            type: String,
            required: false,
            default: 'default value',
            validate(value) {
              return value.length > 5
            }
          }
        }
      });
  ```

  非父子组件传值:发布订阅模式

- `ref`属性,父组件可以通过`refs`的属性获取被`ref`属性标记的DOM元素

  ```vue
    <div id="root">
      <div
        @click="handleDivClick"
        :class="{activated: isTrue}">hello
        <p ref="div1">world</p>
      </div>
    </div>
    <script>
      var app = new Vue({
        el: '#root',
        data: {
          isTrue: false
        },
        methods: {
          handleDivClick() {
            console.log(this.$ref.div1);
            this.isTrue = !this.isTrue;
          }
        }
      });
    </script>
  ```

- 插槽:子组件有一部分内容是根据父组件传递的DOM来进行渲染,这个时候就需要用到插槽

  因为子组件标签的内部是不允许直接插入别的标签的,所以如果我们想要在子组件中放入一些别的东西,我们可以在子组件定义的时候加入`<slot>默认内容</slot>`,这个位置可以理解成一个预留的位置,子组件给父组件暴露了一个标签的位置,父组件可以在调用子组件的时候向子组件里面插入一个标签,如果父组件没有插入任何标签,则会显示插槽中的默认内容.

  **具名插槽**:父组件在往子组件插入标签的时候,可以给插入的标签一个`slot`属性,比如

  ```html
  <child>
      <div slot="header">头部信息</div>
      <div slot="footer">底部信息</div>
  </child>
  ```

  然后,在子组件的模板中对这两个标签(`div`)设置具名插槽来显示他们:

  ```html
  <div>
      <slot name="header"></slot>
      <div>体部信息</div>
      <slot name="footer"></slot>
  </div>
  ```

  **作用域插槽**：当父组件向子组件传递数据是一个列表，子组件需要根据父组件传递的数据循环渲染子组件时，需要用到匿名插槽：

  ```html
  <child>
      作用域插槽必须用template标签包裹
      <template slot-scope="props">
          <h1>{{props.item}}</h1>
      </template>
  </child>
  
  
  <--！子组件中 -->
  <div>
      <ul>
          <slot v-for="item of list" :item=item></slot>
      </ul>    
  </div>
  ```

### 动画

需要添加动画的标签必须被<transition></transition>标签包裹

```html
<transition name="fade">
  <div v-if="show">
    hello
  </div>
</transition>
```

Vue在遇到`tansition`标签的时候会创建一个动画流程（显示与隐藏）：

1. 在动画即将执行的一瞬间，会向内部的标签增加两个样式类：`fade-enter`&`fade-enter-active`
2. 开始执行：也就是动画执行的第二针的时候，会去掉第一步的：`fade-enter`样式类，并且加入`fade-enter-to`这个样式类
3. 动画即将结束的时候，会去掉`fade-enter-active`&`fade-enter-to`两个样式类

  隐藏也是一样的：

1. 在动画即将执行的一瞬间，会向内部的标签增加两个样式类：`fade-leave`&`fade-leave-active`
2. 开始执行：也就是动画执行的第二针的时候，会去掉第一步的：`fade-leave`样式类，并且加入`fade-leave-to`这个样式类
3. 动画即将结束的时候，会去掉`fade-leave-active`&`fade-leave-to`两个样式类

`animate.css`库的使用：首先必须导入animate这个库，然后需要定义`enter-active-class`&`leave-active-class`，即入场与出场动画的样式类，样式类需要指定animated，然后后面跟上需要使用的动画效果即可。至于加入的`apper`是为了解决页面刚载入的时候标签没有动画效果的问题。

```html
<transition
    name="fade"
    apper
    apper-active-class="animated swing"
    enter-active-class="animated swing"
    leave-active-class="animated shake"
            
    >
    <div v-if="show">
        hello
    </div>
</transition>

<button @click="handleDivClick">切换</button>
```

过渡效果：

```html

```



### 生命周期钩子

Vue实例在某个时间点会自动调用的方法.所有的生命周期钩子自动绑定 `this` 上下文到实例中，因此你可以访问数据，对属性和方法进行运算。

> 注意:不能使用箭头函数来定义一个生命周期方法。

`beforeCreate()`:实例基础初始化之后,此时还不能数据观测.

`created()`:实例创建完成(初始化完毕)之后立即调用,完成数据观测,属性和方法的运算,但未挂载,所以实例中的`$el`属性是不可见的.

之后,Vue实例会自我判断,是否有`el`属性与`template`属性,即询问是否有挂载点和自身的标签模板,当没有自身模板,它会将挂载点的元素当作自己的自身模板.

`beforeMount`:在实例挂载之前被调用,这个时候数据还没有被渲染到页面上,该钩子函数子在服务器端渲染不被调用.

`mounted`:实例被挂载之后,自动执行,

`beforeUpdate`:数据发生改变,但是还没有被渲染到页面的时候被自动调用

`updated`:数据改变页面重新渲染之后自动调用

`beforeDestroy`:在实例即将被销毁之前调用.

`destroyed`:在实例被销毁之后自动调用.

### 计算属性

我们在书写vue代码的时候尽量不要在模板中加入JavaScript的逻辑表达式,只是进行数据的绑定和数据的渲染,所以如果有需求不得不渲染一些数据直接的逻辑运算的结果,我们可以使用计算属性:

```vue
var app = new Vue({
            el: '#root',
            data: {
                message: 'hello',
                firstName: 'zhang',
                lastName: 'san'
            },
            computed: {
                fullName() {
                    return this.firstName + this.lastName;
                }
				newName: {
                    get() {
						return this.firstName +" "+ this.lastName
                    }
                    set(value) {
						alert(value)
                    }
				}
            }
        });
```

> 计算属性会有缓存,如果它依赖的变量都没有改变,它是不会重新渲染的,其他的变量的改变并不能影响计算属性.

计算属性的`getter`与`setter`:获取计算属性值的时候会调用`getter`函数,设置计算属性值的时候会调用`setter`函数

### 样式绑定

```vue
<style>
    .activated{
        color: red;
    }
</style>
<div id="root">
    <div
         @click="handleDivClick"
         :class="{activated: isTrue}">hello
    </div>
</div>
<script>
    var app = new Vue({
        el: '#root',
        data: {
            isTrue: false
        },
        methods: {
            handleDivClick() {
                this.isTrue = !this.isTrue;
            }
        }
    });
</script>
```

### API

- `Vue.extend()`使用基础 Vue 构造器，创建一个“子类”,参数是一个包含组件选项的对象.

- `Vue.nextTick()`在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

- `Vue.set()`向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新

- `Vue.directive(id,{})`注册或获取全局指令。

- `Vue.component()`注册或获取全局组件。注册还会自动使用给定的`id`设置组件的名称

  ```vue
  // 注册组件，传入一个选项对象 (自动调用 Vue.extend)
  Vue.component('my-component', { /* ... */ })
  
  // 获取注册的组件 (始终返回构造器)
  var MyComponent = Vue.component('my-component')
  ```

### 选项

- `data`  Vue 实例的数据对象。Vue 将会递归将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化,实例创建之后，可以通过 `vm.$data` 访问原始数据对象。

- `props` props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组

- `computed` 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果某个依赖 (比如非响应式属性) 在该实例范畴之外，则计算属性是**不会**被更新的。

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

- `methods` methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。方法中的 `this` 自动绑定为 Vue 实例。

  注意：不能使用箭头函数来定义method函数，因为箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向 Vue 实例，`this.a` 将是` undefined`。

- `el` 提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。

- `template` 一个字符串模板作为 Vue 实例的标识使用。模板将会 **替换** 挂载的元素。

- `render` 函数

  ```vue
  <h1>{{ blogTitle }}</h1>
  // 或者
  render: function (createElement) {
    return createElement('h1', this.blogTitle)
  }
  ```

  - Vue 通过建立一个**虚拟 DOM** 对真实 DOM 发生的变化保持追踪。

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

### Vue-cli





### Vue-Router（路由插件）

路由就是根据网址的不同，返回不同的内容给用户。

具体使用方法：

1. 在src文件下新建router文件，然后新建`index.js`文件。

2. 在index文件中导入这个插件`import Router from 'vue-router'`

3. 在导出路由配置对象之前，必须先使用这个插件对象`Vue.use(Router)`

4. 接着，使用`new`操作符实例化一个Router对象并将其暴露出去

   ```javascript
   import Vue from 'vue'
   import Router from 'vue-router'
   // 在此导入路由配置需要的组件，这里的@符号指的是src目录
   import HelloWorld from '@/components/HelloWorld'
   
   Vue.use(Router)
   
   export default new Router({
     routes: [
       {
         // 当用户访问根路径的时候，展示HelloWorld这个组件
         path: '/',
         name: 'HelloWorld',
         component: HelloWorld
       }
     ]
   })
   
   ```

5. 在src目录下的入口文件，也就是`main.js`中导入被暴露的路由对象，然后使用这个导入的路由对象

`<router-view/>`显示的就是当前路由地址所对应的内容。

通过注入路由器，我们可以访问它`this.$router`以及`this.$route`任何组件内部的当前路由。

- 动态路由：

  ```javascript
  const router = new VueRouter({
    routes: [
      // 使用：跟上动态参数id
      { path: '/user/:id', component: User }
    ]
  })
  ```

- 嵌套路由：

  在一个路由选项中配置其`children`属性（数组），在其中按需添加

  ```javascript
  const router = new VueRouter({
    routes: [
      { path: '/user/:id', component: User,
        children: [
          { path: '', component: UserHome },
          { path: 'profile', component: UserProfile },
          { path: 'posts', component: UserPosts }
        ]
      }
    ]
  })
  ```

- 路由跳转语法：

  ```html
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  ```

  或

  ```javascript
  // 字符串
  router.push('home')
  
  // 对象
  this.$router.push({path: '/login?url=' + this.$route.path});
  
  // 命名的路由
  router.push({ name: 'user', params: { userId: 123 }})
  
  // 带查询参数，变成/backend/order?selected=2
  this.$router.push({path: '/backend/order', query: {selected: "2"}});
  ```

  

### Vuex（单项数据改变流程）

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

- Getter：类似于组件的computed属性，可以对state状态进行再次包装，Getter 会暴露为 `store.getters` 对象。

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

- mutations：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。每个 mutation 都有一个字符串的事件类型和一个 回调函数 。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

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

- actions：组件通过调用这里存放的异步处理或者批量的同步操作，通过这些操作去调用mutations

### NuxtJs（SSR）

`SSR`：在服务器端将`Vue`程序渲染成HTML文件返回给浏览器，因为SEO无法抓取到Vue文件，而且是加载速度比纯SPA页面快很多。

`Nuxt`：基于`Vue`的应用框架，主要关注应用的`UI`渲染。

常用配置项修改：

1. 服务器启动路由修改：

   在`package.json`文件中添加配置项：

   ```javascript
   "config": {
     "nuxt": {
       "host": "127.0.0.1",
       "port": "1818"
     }
   }
   ```

2. 配置项目全局属性都是在`nuxt.config.js`中进行配置，比如全局引入CSS样式文件，就可以找到`"css"`属性，这是个数组，可以添加多个CSS全局样式文件。

3. 

### mixin

将公共的行为混入。将发送请求C的行为混入到组件A和B之中