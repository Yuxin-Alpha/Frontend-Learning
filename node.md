# JavaScript笔记

##	js运行机制

对于运行机制的了解，无非涉及三个问题，即：单线程，异步，单线程如何实现异步。

### 单线程

即，同一时间职能做一件事。JavaScript的诞生是为了解决用户与页面的交互逻辑问题，如果采用多线程，假设process1对页面某个节点进行了删除操作，而process2又对该节点进行了改变，这样就会带来非常复杂的同步性问题。

### 任务队列

单线程就意味着，所有任务需要排队。但有时，cpu很空闲，但是IO操作很慢，导致该任务需要有一段的时间获取结果（比如ajax操作），于此同时，该任务后面的任务并没有被cpu处理，但是cpu却很闲，它在和后面的任务一起等待当前任务的返回结果，这样的设计显然是不合理的。为了处理这种现象，JavaScript中出现了任务队列这个概念，这个概念是针对主线程来定义的。主线程处理同步任务，任务队列暂时存放异步任务，我所理解的暂时存放，其实不论是同步还是异步，任务终究是由cpu去执行的，只不过cpu在面对JavaScript时，需要按照JavaScript制定的"规矩"执行，这个规定就是，在cpu执行时，JavaScript会帮cpu分类，同步任务进入主线程，异步任务暂时进入任务table将事件注册，当同步任务全部执行完，cpu才会去任务队列中查看是否有可执行的异步任务（已经满足触发条件的任务）,如果有就推入主线程中。

#### 回调函数

所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。"任务队列"中的事件，除了IO设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等。当主线程开始执行异步任务，就是执行对应的回调函数（异步任务必须指定回调函数）。需要注意一个好玩的东西：

```javascript
console.log(1);
setTimeout(() => {
  console.log(2);
},1000);
setTimeout(() => {
  console.log(3);
},500);
setTimeout(() => {
  console.log(1);
},200);
console.log(3);
//输出是1 3 1 3 2
```

`setTimeout()`函数是指经过指定的时间后，将内部回调函数进队（即满足了事件触发条件），如果此时主线程还没有执行完，它是不会先执行的。

以下一个简单的回调函数，判断传入数字的奇偶，node约定将错误信息作为回调的第一个参数

```javascript
function isEvenOrOdd(number, callback){
    if(typeof number === 'number'){
        if(number % 2){
            callback(null, '当前传入的是奇数')
        } else {
          	callback(null, '当前传入的是偶数')  
        }
    } else {
        callback(new Error('你传入的不是数字'))
    }
}
isEvenOrOdd(10, (err, data) => {
	if (err) throw err;
    console.log(data);
})
```

node会将一个任务和一个回调函数一起传给操作系统，任务完成后会触发回调函数（非阻塞机制）。

node进程启动过后会默认创建一个线程，线程（主线程）用于执行代码。



#### 宏任务，微任务

- macro-task(宏任务)：包括整体代码script，setTimeout，setInterval

- micro-task(微任务)：Promise，process.nextTick

  事件轮循在循环时先执行宏任务，再执行微任务

需要注意的是，js代码从开始加载的时候就是一次宏任务的完成（script标签），所以在执行完同步任务后，会直接执行在这次事件轮循中出现的微任务。



## this问题

在理解this之前，需要先理解对象再内存中的数据结构：

```javascript
var obj = { foo:  5 };
```

上面的代码将一个对象赋值给变量obj，JavaScript 引擎会先在内存里面，生成一个对象`{ foo: 5 }`，然后把这个对象的内存地址赋值给变量obj,而变量obj是一个地址（reference）。

原始的对象以字典结构保存，每一个属性名都对应一个属性描述对象：

```javascript
{
  foo: {
    [[value]]: 5
    [[writable]]: true
    [[enumerable]]: true
    [[configurable]]: true
  }
}
```

所以，我们通过生成对象操作，给foo的value赋值为5。我们知道，foo同样可以被赋值成一个函数，例如：

```javascript
var obj = { foo: function () {} };
```

这时，引擎会将函数<b>单独保存在内存</b>中，然后再将函数的地址赋值给foo属性的value属性。即：

```javascript
{
  foo: {
    [[value]]: //函数的地址
    ...
  }
}
```

我们所说的this，无非就是要调用变量，不同的变量是由不同的运行环境提供的，而不同的运行环境又由不同的运行函数提供，所以，this的出现，其实是为了获得当前的运行环境。

## 对象

在上述代码中我们有必要了解一下属性的4个特性：

| 特性             | 作用                               |
| ---------------- | ---------------------------------- |
| [[Configurable]] | 能否通过delete删除属性进而重新定义 |
| [[Enumerable]]   | 能否通过for...in循环返回属性       |
| [[Writable]]     | 能否修改属性的值                   |
| [[Value]]        | 该属性的数据值                     |

先从[[Value]]说起，我们平时修改任何一个对象某属性的数据值修改都是反映在该属性的[[Value]]属性上，我们可以通过`Object.defineProperty`函数来对某个对象的某个属性的特性进行设置。举个例子：

```javascript
var person = {};
Object.defineProperty(person, 'name', {
    writable: false,
    value: 'zhangsan'
});
// person.name的值就被设置成了'zhangsan'
person.name = 'lisi';
// person.name 此时依旧是'张三'
```

上述代码，我们对person对象下的name属性的特性进行了配置，由于`writable`属性被设置成为`false`，所以我们无法显式对其`value`特性进行修改。相似的，如果我们配置了`configurable`属性，则该属性无法通过`delete`命令删除。

> 注意，一旦对configurable特性进行了设置，则无法修改回来(没事干不要修改这个特性)

我们在书写JavaScript代码时，所定义的对象上的每个属性，除`value`特性以外，其他的特性默认值都是`true`，因此，如果不是特殊情况，不要通过上述函数修改某个属性的特性。

对象属性的访问器属性：我们在使用或者修改每个对象的属性时，其实都是通过其内置的getter方法与setter方法实现的，`[[Get]]`用于读取，`[[Set]]`用于设置。

#### new 操作符

在了解对象如何创建之前，我们先了解一下new操作符。

new构造函数的过程中，需要经历以下4个步骤：

1. 创建新的对象
2. 将构造函数的作用域赋给刚才创建的新对象（我们前面提到了，this的问题，不修改的话，其指向由调用该构造函数的上下文决定）
3. 执行构造函数代码
4. 返回新对象

代码实现：

```javascript
function _new (func) {
    var obj = {'__proto__': func.prototype};
    return function () {
        func.apply(obj, arguments);
        return obj
    }
}
```

##### 对象创建

工厂模式：

```javascript
function createPerson (name, age, job) {
   var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        //doSomeThing...
    }
    return o
}
var person1 = createPerson('zhangsan', 18, 'student')
```

工厂模式的缺点：无法知道一个对象的类型

构造函数模式：

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        //do someThing...
    };
}
var person1 = new Person('zhangsan', 18, 'student');
```

> 构造函数也是函数，就是普通的函数，只不过用new操作了一下

构造函数模式的缺点：每实例化一个对象，每个对象都会有各自的sayName函数，其实这是不好的，如果函数体内部只是返回这个对象的属性值，那么我们只需要一个这样的函数就可以，不需要每个对象都拥有一个自己的sayName函数。

原型模式：

在解释原型模式之前，有必要先了解一下，原型是神码意思。

我们创建的每个函数都有一个prototype属性，这个东西是一个指针，指向一个比较神奇的对象。这个对象通过调用构造函数而产生，包含所有实例可以共享的属性与方法。

```javascript
function Person () {
}
Person.prototype.name = 'zhangsan';
Person.prototype.age = 18;
Person.prototype.job = 'student';
Person.prototype.sayname = function () {
    //do someThing...
};
var person1 = new Person();
```

只要我们通过new创建了一个新的函数，那么就回自动生成一个prototype属性，该属性指向函数的原型对象，引擎在搜索时，会先搜索实例化对象中是否存在该属性，如果未找到，再去搜索原型对象上是否存在该属性。

> 原型模式的缺点：原型上的东西被所有实例对象共享，某个实例对原型对象做了改变，那么其余的实例也会随着改变。





组合使用构造函数模式与原型模式：

1. 构造函数模式：负责定义每个实例自己的属性;
2. 原型模式： 用于定义公共的方法与属性

这种组合方式，极大的增强了实例间的可不同性，又最大限度地节约了内存。

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
}
Person.prototype = {
    constructor: Person,
    sayName: funtion() {
      //do someThing
	}
}
```

##### 对象继承

在理解JavaScript之前，我们需要明白一点，所有函数的默认原型都指向`Object.prototype`，即他们都是Object对象的实例，即某函数的原型中有个`__proto__`属性指向`Object`。我们在自定义对象的时候，之所以能够调用`hasOwnProperty`或者`toString`这样的方法，是因为这些方法都是`Object.prototype`上的方法，而我们自定义的函数，其对象又默认是`Object.prototype`的实例，所以我们自定义的函数可以通过原型链找到顶端的`Object`，调用其原型上的内置方法。

原型链模式实现继承：

```javascript
function SuperType() {
    this.property = true;
};
SuperType.prototype.getSuperValue = function () {
    return this.property;
};
function SonType() {
    this.sonProperty = false;
};
//最重要的一步，将SonType的原型指向SuperType的原型，以此产生原型链
SonType.prototype = new SuperType();
SonType.prototype.getSonValue = function () {
    return this.sonProperty;
};
var instance = new SonType();
```







## ES6



##### 变量/赋值

> 块级作用域：限制变量使用的范围，更容易去控制

没有块级作用域，内层变量可能会覆盖外层变量

var 可以重复定义，不能限制修改，没有块级作用域

let&const弥补上面的缺陷

##### 解构赋值

> 左右两边必须一样，定义和赋值必须同步完成，右边必须是个“东西”
>
> ` let {a, b} = {15, 12}` {15, 12}不是所谓的“东西”

##### 函数

箭头函数：对原来函数的一种简写

> 箭头函数不能带名字，如果有且仅有一个参数，() 可以省；如果函数体有且只有一个return 语句，{}可以省

默认参数：

```javascript
function (a=1, b=2, c=3) {
    //coding
}
```

参数展开：

```javascript
function show (a, ...args) {
    //coding
}
```

将剩余的参数放入名字为args的数组中

> 剩余参数必须是最后一个形参

##### 数组/json

map(映射)：一对一，进去是几个，出来还是几个

```javascript
let arr = [12, 55, 82, 37, 26]
let arr2 = arr.map((item) => {
    if (item >= 60) {
        return true
    } else {
        return false
    }
})    //[false, false, true, false, false]
```

filter(筛选)：过滤掉一部分

forEach(遍历)：

reduce(汇总)：

from()

##### 字符串

1. `starsWith('a')`是否以a开头
2. `endsWith('a')`是否以a结尾
3. 字符串模板

```javascript
let str = 'world';
console.log(`hello${str}`) // hello world
```

##### 对象

有了专门的构造器，与类分开了

```javascript
class User {
    //用于定义实例的私有属性，类似于构造函数模式
    constructor (name,  pass) {
        this.name = name;
        this.pass = pass;
    }
    //不用外挂prototype的方法
    showName () {
        //do someThing
    }
}
```

继承：



## Ajax

```javascript
//readyState状态为0
const xhr = new XMLHttpRequest();
//连接，readyState状态为1
xhr.open('GET','url',true)//readyState状态为1
    //发送，readyState状态为2，若为post，则需要用xhr.setRequestHeader()设置请求头
    xhr.setRequestHeader('content-type','application/x-www-form-urlencoded')
    xhr.send();
//接收(readyState状态为3,4;3表示接收到响应头，4表示接收到响应体)
xhr.onreadystatechange = function () {
    if(xhr.readyState==4&&((xhr.status>=200&&xhr.status<300)||xhr.status.304){
        alert('成功'+xhr.responseText);
    }else{
        alert('失败');
    }
}
```



## JavaScript代码规范

1. 二元运算符两侧必须有一个空格，一元运算符与操作对象之间不允许有空格，用作代码块起始的左花括号` { `前必须有一个空格。

   ```javascript
   let a = 4;
   a++;
   if (a >= 0) {
       // do someThing
   }
   ```

2. `if / else / for / while / function / switch / do / try / catch / finally `关键字后，必须有一个空格:

   ```javascript
   if (a > 0 && a < 10) {
       // do someThing
   } else {
       // do someThing
   }
   ```


