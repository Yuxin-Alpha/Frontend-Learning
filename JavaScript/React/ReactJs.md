## ReactJs

### 虚拟dom

需要先解释DOM：DOM是使用JavaScript对象来表示页面中的元素

而虚拟dom是框架中的概念，是我们程序员用js对象来模拟页面上的DOM和嵌套DOM。

真正的 DOM 元素非常庞大，这是因为标准就是这么设计的。我们平时在使用JavaScript操作DOM时，其实就是对页面进行重排和重绘，其实这是非常消耗性能的，试想，我们在使用ajax发送异步请求后，我们会得到一些数据，我们平时对页面的操作，其实是对数据的操作，就像一个数组，如果它的长度很长，那么我们大可不必要关心那些没有变化的数据，换句话说，数组中的某项或者多项，在数组中如果没有数值以及位置上的变化，我们是没有必要对这些项进行重排或者重绘的，顺着这个想法，我们只需要处理那些变动的东西，一样可以使页面得到相应的更新，与此同时，还可以大幅度地提高性能。

相对于 DOM 对象，原生的 JavaScript 对象处理起来更快，而且更简单。那么问题来了，我们在操作DOM时，实际上是通过浏览器提供的各种API，获得页面中的各个元素，使得我们可以修改每个元素的属性与样式，以此间接地修改DOM树，而DOM树本身并没有提供接口让我们直接可以操作我们熟悉而又陌生的DOM树，因为我们无法获取浏览器内存中的整个DOM树。为了解决这个问题，框架就诞生了，我们致力于构造两个DOM树，用后生成的DOM与之前生成的DOM树进行对比，只需要更新不同的地方即可，而创造这两个DOM树的方法，还是使用我们熟知的`JavaScript`。试想下面的Html：

```html
<div id="myDiv" title="说实话">我挺帅的
    <p>哈哈哈</p>
</div>
```

这个代码没有什么难度，但是我们可以通过`JavaScript`模拟构造这么一个html的元素：

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

DOM的嵌套我们可以通过`childrens`属性来嵌套.用 JavaScript 对象表示 DOM 信息和结构，当状态变更的时候，重新渲染这个 JavaScript 的对象结构。当然这样做其实没什么卵用，因为真正的页面其实没有改变。但是可以用新渲染的对象树去和旧的树进行对比，记录这两棵树差异。记录下来的不同就是我们需要对页面真正的 DOM 操作,但是可以用新渲染的对象树去和旧的树进行对比，记录这两棵树差异。记录下来的不同就是我们需要对页面真正的DOM操作，然后把它们应用在真正的 DOM 树上，页面就变更了。

所谓的虚拟DOM，其实就是使用JavaScript的形式，来模拟页面DOM之间的嵌套关系，即，虚拟DOM是以JS对象的形式存在的，其本质是为了实现页面元素高效的按需更新。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，既然硬盘这么慢，我们就在它们之间加个缓存：既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。

### Diff算法（差异查询算法）

- `tree diff`

  新旧两颗DOM树，逐层对比的过程，当该过程的完成，就能够找到需要更新的元素。

- `component diff`

  在进行tree diff的过程中，组件之间的对比。如果对比前后，组件的类型相同，如果类型相同，则暂时认为这个组件不需要被更新。如果组件类型不同，则需要移除旧组件，创建新的组件，并追加到页面上

- `element diff`

  在进行component diff的过程中，如果两个组件相同，则需要进行元素级别的对比。

三个diff算法逐层递进，使得整两个DOM树的对比没有遗漏。



### 安装

运行`npm i react react-dom -S`安装包

- react:  专门用于创建组件和虚拟DOM的，同时组件的声明周期都在这个包中
- react-dom: 专门进行dom操作，主要用于`ReactDOM.render()`，将我们生成好的虚拟DOM渲染到页面上（因为我们生成的虚拟DOM在浏览器的内存中）

### 语法

```javascript
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
// 定义变量
const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};
// 声明一个React元素
const element = (
  <h1 tabIndex="0" title={user.avatarUrl}>
    Hello, {formatName(user)}!
  </h1>
);
// 上述的声明等价于
// const element = {
//   type: 'h1',
//   props: {
//     className: 'greeting',
//     children: 'Hello, world'
//   }
// };

// 使用render函数将上述标签挂载到id为root的DOM元素中
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

在React元素中，使用JavaScript表达式需要使用`{}`进行包裹，不论是标签上的属性还是标签内部需要渲染的数据。React 元素都是不可变的。当元素被创建之后，你是无法改变其内容或属性的。一个元素就好像是动画里的一帧，它代表应用界面在某一时间点的样子。

```javascript
// Fragment由React16版本提供,本身是一个占位符,不会渲染到页面上,因此不会影响组件的CSS样式或者布局
import React, { Component, Fragment } from 'react';

class TodoList extends Component{
    render() {
        return (
            // <Fragment> 标签进行占位
            <Fragment>
                <div><input type="text"/><button>提交</button></div>
                <ul>
                    <li>学英语</li>
                    <li>learning React</li>
                </ul>
            </Fragment>
        )
    }
}

export default TodoList;
```

### 组件

使用脚手架工具的时候,`index.js`文件是整个项目的入口文件

```react
import React from 'react';
import ReactDOM from 'react-dom';

// 加载一个App组件
import App from './App';

// 这个函数将App组件挂载到id是root的节点上
ReactDOM.render(<App />, document.getElementById('root'));
```

组件定义的语法:

```react
import React, { Component } from 'react';
// 通过类的继承,定义一个App类来继承React下的Component类，组件名的作为标签使用时,必须使用大写,`jsx`中的html代码必须有元素包裹,否则报错
class App extends Component {
  // render函数是Component类的内置函数,render函数返回什么,页面之中就显示什么
  render() {
    return (
      <div>
        hello world
      </div>
    );
  }
}
// 将组件暴露出去,以便其他文件import
export default App;

```

可以把组件理解成一个函数，他可以接收任意的输入值（props），并返回一个需要在页面上展示的React元素。当React遇到的元素是用户自定义的组件，它会将JSX属性作为一个单个对象（props）传递给该组件。注意，组件本身不能修改自己的props，即必须像纯函数那样使用props。

### 响应式设计思想与事件绑定

不要操作`dom`,React永远操作的都是数据.数据定义语法:

```react
class TodoList extends Component{
    // 因为TodoList是一个类,那么它一定有constructor这个构造函数,我们在使用TodoList的时候,这个函数会被最先执行
    constructor(props) {
        super(props);
        // state用来存储数据，表示组件的状态
        this.state = {
            inputValue: '',
            list: []
        }
    }
    render() {

        return (
            <Fragment>
                <div>
                    <input
                        {/*数据绑定 注意{}来包裹JSX表达式*/}
                        value={this.state.inputValue}
                        {/*在绑定事件时一定要通过bind函数来修改this指向*/}
                        onChange={this.handleInputChange.bind(this)}
                    />
                    <button>提交</button>
                </div>
                <ul>
                    <li>学英语</li>
                    <li>learning React</li>
                </ul>
            </Fragment>
        )
    }
	// 注意: react中不允许直接改变state中的数据,必须通过setState函数对其进行重新赋值
    handleInputChange(e) {
        this.setState({
            inputValue: e.target.value
        })
    }
}

export default TodoList;
```

### 组件之间传值

React中组件之间的传值是单项的,父组件向子组件传值通过属性传值,而子组件向父组件传值通过触发函数来传值:

```react
// 父组件
class TodoList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            list: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
    }
    render() {

        return (
            <Fragment>
                {/*我是一个注释*/}
                <div>
                    <input
                        className='input'
                        value={this.state.inputValue}
                        onChange={this.handleInputChange}
                    />
                    <button
                        onClick={this.handleBtnClick}
                    >提交</button>
                </div>
                <ul>{ this.getTodoItem() }</ul>
            </Fragment>
        )
    }

    getTodoItem() {
        return this.state.list.map((item, index) => {
            // 子组件调用
            return <TodoItem
                key={index}
                deleteItem={this.handleItemDelete}
                content={item}
                index={index}
            />
        })
    }

    handleInputChange(e) {
        const value = e.target.value;
        this.setState(() => ({
            inputValue: value
        }))
    }

    handleBtnClick() {
        this.setState((prevState) => ({
            list: [...prevState.list, prevState.inputValue],
            inputValue: ''
        }))
    }
    handleItemDelete(index) {
        this.setState((prevState) => {
            const list = [...prevState.list];
            list.splice(index, 1);
            return { list }
        })
    }
}

// 子组件
class TodoItem extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        const { content } = this.props;
        return <div onClick={this.handleClick}>{ content }</div>
    }

    handleClick() {
        const { deleteItem, index} = this.props;
        deleteItem(index)
    }
}
```

我们可以观察到子组件在接受父组件的数据或者函数的时候，都是通过`this.props`来接收。

注意写法：

1. 在组件中实现函数绑定的时候最好在`constructor()`中完成，否则影响性能
2. 竟可能将比较长的jsx代码封装到函数中然后返回，在render函数中直接调用这个函数即可
3. 竟可能使用解构赋值来解构`this.props`

- 属性校验

  1. `import PropTypes from 'prop-types'`引入属性校验的包,脚手架自带

  2. `propTypes`指定每个从父组件获得的属性或者函数的类型

     ```react
     //　对父组件的属性进行强校验
     TodoItem.propTypes = {
         // isRequired表示该属性或者方法必须传入
         test: PropTypes.string.isRequired,
         content: PropTypes.string.isRequired,
         deleteItem: PropTypes.func,
         index: PropTypes.number
     }
     ```

  3. `defaultProps`指定每个属性或者方法的默认值,如果父组件没有传入,则使用默认值代替:

     ```react
     TodoItem.defaultProps = {
         test: 'hello world'
     }
     ```

- `props,state与render()`的关系:当组件的`state`或者`props`发生改变的时候,`render()`就回重新执行

### 生命周期函数

在某一个时刻,组件会自动调用的函数.

React组件在创建的时候会经历4个过程:

- Initialization(初始化数据)

  `constructor()`负责对`state`与`props`进行初始化

- Mounting(渲染并挂载),挂载的意思就是组件第一次出现在页面中的时候

  `componentWillMount()`在组件即将被挂载到页面的时刻自动调用

  `render()`挂载组件

  `componentDidMount()`组件被挂载到页面之后自动调用,这里常常写一些ajax请求

  ```react
  // 引入axios插件来发送ajax
  import axios from 'axios'
  
  // 在生命周期函数之中这么写
  componentDidMount() {
          axios.get('/api/todolist').then(() => {
              console.log('success');
          }).catch(err => {
              console.log(err);
          })
      }
  ```

- Updation(组件更新的过程),即数据(props或者state)发生变化

  `shouldComponentUpdate()`组件数据更新之前自动调用,注意这个函数必须返回一个布尔类型的结果,类似于询问->需要更改组件嘛?所以如果返回true,意思就是,需要更新,就回继续执行下面的生命周期函数.

  `componentWillUpdate()`在`shouldComponentUpdate()`返回true后执行,表示组件的数据即将被更新.

  `render()`再次被调用

  `componentDidUpdate()`在组件的数据完成更新后自动调用

  > 注意,上述的数据生命周期函数只针对state中的数据,在props中`componentWillReceiveProps()`当一个组件从父组件接收参数时,当父组件的render函数被执行的时候,这个生命周期函数会被执行.

- Unmounting

  `componentWillUnmount()`当组件即将在页面中被剔除的时候自动调用

### CSS过渡动画

```react	
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
        this.handleToggle = this.handleToggle.bind(this);
    }
    
    render() {
        return (
        	<Fragment>
                <div className={this.state.show ? 'show' : 'hide'}>hello</div>
                <button onClick={this.handleToggle}>toggle</button>
            </Fragment>
        
        )
    }
    handleToggle() {
        this.setState({
            show: this.state.show ? false : true
        })
    }
}
```

```css
.show {
    animation: show-item 2s ease-in forwards;
}

.hide {
    animation: hide-item 2s ease-in forwards;
}

@keyframes show-item {
    0% {
        opacity: 0;
        color: red;
    }
    50% {
        opacity: 0.5;
        color: green;
    }
    100% {
        opacity: 1;
        color: blue;
    }
}

@keyframes hide-item {
    0% {
        opacity: 1;
        color: red;
    }
    50% {
        opacity: 0.5;
        color: green;
    }
    100% {
        opacity: 0;
        color: blue;
    }
}

```

`react-transition-group`的使用:

1. 

### Redux

`React`只是一个轻量级的视图层框架,在项目中无法解决组件之间复杂的数据传递问题:比如组件越级获取数据,越级触发父组件,所以在开发项目的过程中,我们需要搭配数据层的框架来实现业务功能.`Redux`就是非常优秀的数据层框架.

`Redux = Reducer + Flux`

模拟借书流程:

- 组件(`Component`):借书的人
- `Action Creators`:借书人的需求(即:需要借什么样的书)
- `Store`:图书管的管理员(负责管理各种书籍)
- `Reducers`:管理员手上的书籍记录

所以,Redux的工作流程就可以是这样,借书的人想要借书,所以他需要找到图书管理员,告诉他我需要什么样的书籍,图书管理员没有办法记住所有的书本信息,所以掏出了小本本找到借书人想要借的书,然后将这本书借给借书人.

```react
// 新建store仓库
```

其中:`store`是唯一的,在`/store`文件下的`index.js`文件中,`reducer`拿到`store`中的数据进行深拷贝,对深拷贝后的数据进行处理,并返回,`store`拿到新的数据对自己本身存储的数据进行更新.

> 注意:`reducer`必须是一个纯函数,即给定输入一定会有输出,而且这个输出是固定的,而且这个函数不能有任何的副作用.

### Redux-thunk