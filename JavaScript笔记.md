# JavaScript笔记

一般情况下，一个进程一次只能执行一个任务。需要注意的是js的内存分配和执行机理和别的语言不太一样。                                                  

## js运行机制

对于运行机制的了解，无非涉及三个问题，即：单线程，异步，单线程如何实现异步。如果有很多任务需要执行，不外乎三种解决方法。

1. **排队:**因为一个进程一次只能执行一个任务，只好等前面的任务执行完了，再执行后面的任务。
2. **新建进程:**使用`fork`命令，为每个任务新建一个进程。
3. **新建线程:**因为进程太耗费资源，所以如今的程序往往允许一个进程包含多个线程，由线程去完成任务。

### 单线程

即，同一时间职能做一件事。JavaScript的诞生是为了解决用户与页面的交互逻辑问题，如果采用多线程，假设`process1`对页面某个节点进行了删除操作，而`process2`又对该节点进行了改变，这样就会带来非常复杂的同步性问题。

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

以下一个简单的回调函数，判断传入数字的奇偶，node约定将错误信息作为回调的第一个参数:

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

- `macro-task`(宏任务)：包括整体代码script，setTimeout，setInterval

- `micro-task`(微任务)：Promise，process.nextTick

  事件轮循在循环时先执行宏任务，再执行微任务

需要注意的是，js代码从开始加载的时候就是一次宏任务的完成（script标签），所以在执行完同步任务后，会直接执行在这次事件轮循中出现的微任务。


## 对象

在上述代码中我们有必要了解一下属性的4个特性：

| 特性             | 作用                               |
| ---------------- | ---------------------------------- |
| [[Configurable]] | 能否通过delete删除属性进而重新定义 |
| [[Enumerable]]   | 能否通过for...in循环返回属性       |
| [[Writable]]     | 能否修改属性的值                   |
| [[Value]]        | 该属性的数据值                     |

先从`[[Value]]`说起，我们平时修改任何一个对象某属性的数据值修改都是反映在该属性的`[[Value]]`属性上，我们可以通过`Object.defineProperty`函数来对某个对象的某个属性的特性进行设置。举个例子：

```javascript
var person = {};
// person.name的值就被设置成了'zhangsan'
Object.defineProperty(person, 'name', {
    writable: false,
    value: 'zhangsan'
});
// person.name 此时依旧是'zhangsan'
person.name = 'lisi';
```

上述代码，我们对person对象下的name属性的特性进行了配置，由于`writable`属性被设置成为`false`，所以我们无法显式对其`value`特性进行修改。相似的，如果我们配置了`configurable`属性，则该属性无法通过`delete`命令删除。

> 注意，一旦对configurable特性进行了设置，则无法修改回来(没事干不要修改这个特性)

我们在书写JavaScript代码时，所定义的对象上的每个属性，除`value`特性以外，其他的特性默认值都是`true`，因此，如果不是特殊情况，不要通过上述函数修改某个属性的特性。

对象属性的访问器属性：我们在使用或者修改每个对象的属性时，其实都是通过其内置的getter方法与setter方法实现的，`[[Get]]`用于读取，`[[Set]]`用于设置。

### new 操作符

在了解对象如何创建之前，我们先了解一下`new`操作符。

`new`构造函数的过程中，需要经历以下4个步骤：

1. 创建新的对象
2. 将构造函数的作用域赋给刚才创建的新对象（我们前面提到了，this的问题，不修改的话，其指向由调用该构造函数的上下文决定）
3. 执行构造函数代码
4. 返回新对象

代码实现：

```javascript
function _new(func) {
    var obj = {'__proto__': func.prototype};
    return function() {
        func.apply(obj, arguments);
        return obj
    }
}
```

### 对象创建

对象的创建有两种方式：

```javascript
// 1. 字面量
var myObj = {
    key: value
    ...
}

// 2. 构造形式,必须逐个添加属性
var yourObj = new Object()
yourObj.key = value
```

- 工厂模式：

```javascript
function createPerson(name, age, job) {
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

- 构造函数模式：

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

- 原型模式：

在解释原型模式之前，有必要先了解一下，原型是神码意思。

我们创建的每个函数都有一个prototype属性，这个东西是一个指针，指向一个比较神奇的对象。这个对象通过调用构造函数而产生，包含所有实例可以共享的属性与方法。

```javascript
function Person() {
}
Person.prototype.name = 'zhangsan';
Person.prototype.age = 18;
Person.prototype.job = 'student';
Person.prototype.sayname = function() {
    //do someThing...
};
var person1 = new Person();
```

只要我们通过new创建了一个新的函数，那么就回自动生成一个prototype属性，该属性指向函数的原型对象，引擎在搜索时，会先搜索实例化对象中是否存在该属性，如果未找到，再去搜索原型对象上是否存在该属性。

> 原型模式的缺点：原型上的东西被所有实例对象共享，某个实例对原型对象做了改变，那么其余的实例也会随着改变。

- 组合使用构造函数模式与原型模式：

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

### 对象继承

在理解`JavaScript`之前，我们需要明白一点，所有函数的默认原型都指向`Object.prototype`，即他们都是Object对象的实例，即某函数的原型中有个`__proto__`属性指向`Object`。我们在自定义对象的时候，之所以能够调用`hasOwnProperty`或者`toString`这样的方法，是因为这些方法都是`Object.prototype`上的方法，而我们自定义的函数，其对象又默认是`Object.prototype`的实例，所以我们自定义的函数可以通过原型链找到顶端的`Object`，调用其原型上的内置方法。

- 原型链模式实现继承：

```javascript
function SuperType() {
    this.property = true;
};
SuperType.prototype.getSuperValue = function() {
    return this.property;
};
function SonType() {
    this.sonProperty = false;
};
//最重要的一步，将SonType的原型指向SuperType的原型，以此产生原型链
SonType.prototype = new SuperType();
SonType.prototype.getSonValue = function() {
    return this.sonProperty;
};
var instance = new SonType();
```

原型链模式的弊端：通过原型的指向，其实是把子的原型变成父原型的一个实例，这样的话，父原型的属性也就顺理成章变成实例属性了，如果我们实例一个子对象，而某个属性是父原型上面的属性，我们通过该子对象对该属性进行修改，那么，其余的实例在通过原型链查找时，该属性都会改变，这并不符合我们的初衷。

- 借用构造函数

  ```javascript
  function SuperType(name) {
      this.name = name;
  }
  // 我们在新的环境下调用父构造函数，这样每个子实例都拥有自己的name属性
  function SonType(name) {
      SuperType.call(this, name)
  }
  var son1 = new SonType('zhangsan')
  var son2 = new SonType('lisi')
  ```

  缺点：方法都在构造函数中定义，不能复用，这种方法不建议使用

- 组合继承：

  ```javascript
  function SuperType(name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green']
  }
  SuperType,prototype.sayName = function() {
      // coding
  }
  function SonType(name, age) {
      SuperType.call(this, name)
      this.age = age
  }
  SonType.prototype = new SuperType();
  SonType.prototype.constructor = SonType;
  SonType.prototype.sayAge = function() {
      // coding
  }
  ```

  这种继承的方式比较经典，通过原型链实现原型方法与属性的继承，而通过借用构造函数来实现对实例属性的继承。

  来一张图，好好理解原型链：

  ![原型链](/home/clement/Desktop/原型链.jpg)

## 闭包

在理解闭包之前，有必要聊聊JavaScript的函数。先看看两种定义函数的例子：

```javascript
// 第一种，函数声明
function say() {
    // coding
}
// 第二种，函数表达式,将匿名函数赋值给一个变量
var sayName = function() {
    // coding
}
```

这两种方式，最主要的区别是，函数表达式中的函数是匿名函数，也就是说其name属性是一个空的字符串，不存在变量提升的问题，如果声明之前调用，会报错;而对于函数声明，`say`就是这个函数的名称，如果在声明之前调用，那么，运行环境会先寻找是否有名字是`say`的函数。

- 作用域：某个函数在调用时，会创建一个执行环境以及相应的作用域链。作用域链有当前函数，由内而外，一个一个排列，最终到达全局作用域。
## this问题

在理解`this`之前，需要先理解对象在内存中的数据结构：

```javascript
var obj = { foo:  5 };
```

上面的代码将一个对象赋值给变量`obj`，`JavaScript `引擎会先在内存里面，生成一个对象`{ foo: 5 }`，然后把这个对象的内存地址赋值给变量`obj`而变量`obj`是一个地址（reference）。

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
var obj = { foo: function() {} };
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

在说this的过程中一定要说的几个函数:

1. `bind(obj)`
2. `call(obj, [arr])`
3. `apply(obj, argu1, argu2)`

这三个函数都是修改this的指向，this原本是指向当前函数的执行栈环境，这个执行栈环境，可以是一个函数，也可以是一个对象，我们可以通过修改上述的三个函数显式地将this绑定到第一个参数上。

## ES6

### 变量/赋值

> 块级作用域：限制变量使用的范围，更容易去控制

没有块级作用域，内层变量可能会覆盖外层变量

`var `可以重复定义，不能限制修改，没有块级作用域

`let&const`弥补上面的缺陷

### 解构赋值

> 左右两边必须一样，定义和赋值必须同步完成，右边必须是个“东西”
>
> ` let {a, b} = {15, 12}` {15, 12}不是所谓的“东西”

### 函数

箭头函数：对原来函数的一种简写

> 箭头函数不能带名字，如果有且仅有一个参数，() 可以省；如果函数体有且只有一个return 语句，{}可以省

默认参数：

```javascript
function(a=1, b=2, c=3) {
    //coding
}
```

参数展开：

```javascript
function show(a, ...args) {
    //coding
}
```

将剩余的参数放入名字为args的数组中

> 剩余参数必须是最后一个形参

#### 数组/json

- map(映射)：一对一，进去是几个，出来还是几个

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

- filter(筛选)：过滤掉一部分

```javascript
let arr = [12, 55, 82, 37, 26]
let arr2 = arr.fiter((item) => {
    return item > 30
})    //[55, 82, 37]
```

- forEach(遍历)：

```javascript
let arr = [{},]
let arr2 = arr.fiter((item) => {
    return item > 30
}) 
```

+ every()&some()

```javascript
/** 
 * 计算对象数组中每个电脑的扣件系统是否可用,大于16位操作系统表示可用,否则不可用
*/
var computers = [
    {name:"Apple",ram:8},
    {name:"IBM",ram:4},
    {name:"Acer",ram:32},
];
 var result= computers.every(function(computer){
   return computer.ram > 16
})
console.log(result)//false;

var some = computers.some(function(computer){
   return computer.ram > 16
})
console.log(some)//true;
```

+ reduce(汇总)：

  `reduce()` 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。`reduce()` 方法接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用` reduce()` 的数组。

```javascript
// 数组求和
var total = [ 0, 1, 2, 3 ].reduce(( acc, cur ) => {
    return acc + cur
}, 0);
console.log(total)   // 6

// 计算数组中每个元素出现的次数
let names = ['tom', 'jim', 'jack', 'tom', 'jack'];

const countNames = names.reduce((allNames, name) => {
  if (name in allNames) {
    allNames[name] ++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});

console.log(countNames)

// 数组去重
let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
let result = arr.sort().reduce((init, current) => {
    if (init.length === 0 || init[init.length - 1] !== 			 current) {
        	init.push(current);
    }
    return init;
}, []);
console.log(result);
```

from()

- JSON

  + `JSON.stringify(json)`将JSON对象转化成字符串
  + `JSON.parse(json)`将字符串变为对象

#### 字符串

1. `starsWith('a')`是否以a开头
2. `endsWith('a')`是否以a结尾
3. 字符串模板

```javascript
let str = 'world';
console.log(`hello${str}`) // hello world
```

#### 对象

有了专门的构造器，与类分开了

```javascript
class User {
    //用于定义实例的私有属性，类似于构造函数模式
    constructor(name, pass) {
        this.name = name;
        this.pass = pass;
    }
    //不用外挂prototype的方法，注意方法之间不要加逗号
    showName() {
        //do someThing
    }
}
```

继承：

```javascript
class VipUser extends User{
    constructor(name, pass, level) {
        // 执行父类的构造函数
        super(name, pass);
        this.level = level;
    }
    // 父类的方法已经通过extends继承了，子类中书写的方法实际上是新添的方法
    showLevel() {
        // coding
    }
}
```

1. `Object.assign`合并对象（浅拷贝）

   ```javascript
   const target = { a: 1 };
   const source1 = { b: 2 };
   const source2 = { c: 3 };
   // 第一个参数是目标对象， 如果出现同名属性，后者会覆盖前者
   Object.assign(target, source1, source2);
   target // {a:1, b:2, c:3}
   ```

   用途:

   ```javascript
   Object.assign(SomeClass.prototype, {
   	someMethod(arg1, arg2) {
   		···
   },
   anotherMethod() {
   		···
   	}
   });
   // 等同于下面的写法
   SomeClass.prototype.someMethod = function (arg1, arg2) {
   	···
   };
   SomeClass.prototype.anotherMethod = function () {
   	···
   };
   ```

2. 属性名表达式：

   ```javascript
   // 第一种
   obj.foo = true
   //第二种
   obj['a' + 'bc'] = 123 // 等同于obj.abc = 123
   
   // 字面量定义
   let obj  = {
       [propKey]: true,
       ['a' + 'bc']: 123,
       ['he' + 'llo']() {
           return 'hi'
       }
   }
   ```


### Promise

用同步方式来书写异步代码。Promise本身是一个容器,里面保存这未来才会结束的事件的<b>结果</b>. 各种异步操作都可以使用相同的方法.

该对象的状态不受外界影响.一共有pending,fulfilled与rejected3种状态,表示进行中,已成功,已失败.一旦状态发生变化了,就不会再变了.

```javascript
const promise = new Promise(function(resolve, reject) {
	// ... some code
	if (/* 异步操作成功 */){
        // resolve将状态变成resolved,并将异步操作的结果作为			// 参数返回
		resolve(value);
	} else {
		reject(error);
	}
});
// 实例生成后可以通过then方法分别指定成功状态与失败状态的函数
promise.then(function(value) {
// success
}, function(error) {
// failure
});
```

应用: 封装ajax:

```javascript
const getJSON = function(url) {
	const promise = new Promise(function(resolve, reject){
		const handler = function() {
			if (this.readyState !== 4) {
				return;
			}
			if (this.status === 200) {
				resolve(this.response);
			} else {
				reject(new Error(this.statusText));
			}
		};
		const client = new XMLHttpRequest();
		client.open("GET", url);
		client.onreadystatechange = handler;
		client.responseType = "json";
		client.setRequestHeader("Accept", "application/json");
		client.send();
	});
	return promise;
};
```

#### then方法

`then` 方法是定义在原型对象 Promise.prototype 上的,为 Promise 实例添加状态改变时的回调函数,then 方法的第一个参数是 resolved 状态的回调函数,第二个参数(可选)是 rejected 状态的回调函数

#### catch方法

```javascript
getJSON('/posts.json').then(function(posts) {
	// ...
}).catch(function(error) {
	// 处理 getJSON 和 前一个回调函数运行时发生的错误
	console.log('发生错误!', error);
});
```

推荐写法: 

```javascript
promise
.then(function(data) { 
	// success
})
.catch(function(err) {
	// error
});
```

### Iterator

一种接口,为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口,就可以完成遍历操作(即依次处理该数据结构的所有成员)。

遍历过程:

1. 创建一个指针对象,指向当前数据结构的起始位置。也就是说,遍历器对象本质上,就是一个指针对象。
2. 第一次调用指针对象的 next 方法,可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的 next 方法,指针就指向数据结构的第二个成员。
4. 不断调用指针对象的 next 方法,直到它指向数据结构的结束位置。

每一次调用 next 方法,都会返回数据结构的当前成员的信息,即,就是返回一个包含 value 和 done 两个属性的对象。其中, value 属性是当前成员的值, done 属性是一个布尔值,表示遍历是否结束。

### Generator

生成器函数：中间能暂停(踹一脚走一步)，通常用于数据请求的时候，等待数据返回。Generator函数和普通的函数区别有两个， 1：`function`和函数名之间有一个\*号， 2：函数体内部使用了`yield`表达式；写法：

```javascript
function *show() {
    alert('a');
    yield; // 放弃执行权利 
    alert('b')
}
// generator函数会返回一个对象，通过其中的next()函数控制执行
let genObj = show();
// 执行第一步，输出'a'
genObj.next();
// 执行第二步，输出'b'
genObj.next();
```

`show()`函数会返回一个一个`Iterator`实例,

`Generator`函数通过`yield`将代码块分割成无数个小的函数，每次调用next()，则执行一个小函数。Generator函数返回的`Iterator`运行的过程中，如果碰到了`yield`， 就会把`yield`后面的值返回， 此时函数相当于停止了， 下次再执行`next()`方法的时候， 函数又会从上次退出去的地方重新开始执行.注意:如果把**yield**和**return**一起使用的话， 那么return的值也会作为最后的返回值， 如果return语句后面还有yield， 那么这些yield不生效.

- `yield`理解：既可以传参，又可以返回。传参数：

  ```javascript
  function *show() {
      alert('a');
      // yield可以传参，此处a被赋值为5
      let a = yield; 
      alert('b')
  }
  let genObj = show();
  //第一段代码执行到yield，而此时a还没有被赋值，换句话说，这个步骤是无法给yield传递参数的
  genObj.next(12);
  //第二段代码执行let a 之后的代码，此时由于传入的参数是5,所以a被赋值成了5
  genObj.next(5);
  ```

  返回：

  ```javascript
  function *show() {
      alert('a');
  
      yield 12; 
      alert('b')
  }
  let genObj = show();
  let res1 = genObj.next(); //{value: 12, done: false} 返回的数据是12,done表示程序为执行完
  let res2 = genObj.next(); //{value： undefined, done: true}
  ```

  突然想到了生活中的类比：

  ```javascript
  // 这是一段搞笑代码，只是为了理解
  function *炒菜(从菜市场买回来的菜){
      洗菜 -> 洗好的菜;
      let 干净的菜 = yield 洗好的菜;
      切菜 -> 丝;
      let 切好的菜 = yield 丝;
      炒菜 -> 熟的菜;
      return 熟的菜;
  }
  let 炒菜实例 = 炒菜（）;
  // 洗菜
  炒菜实例.next()
  // 切菜
  炒菜实例.next()
  // 炒菜
  炒菜实例.next()
  ```

  这样就比较好理解了，假设一个饭馆里面，炒菜是一个宏观的过程，通过两个`yield`（在厨房架立两个挡板，分成3个工作区）分成3个小步骤——洗菜，切菜，炒菜（每个工作区由不同的人做不一样的事情），每一个小步骤都可以产生一个成果（也就是所谓的中间生成参数），通过yield进行传递，最后的成果（熟的菜）需要通过`return`来获取，而第一步的参数，就是炒菜的形参。

  yield*这种语句让我们可以在Generator函数里面再套一个Generator， 当然你要在一个Generator里面调用另外的Generator需要使用: **yield\* 函数()** 这种语法.

### `async`&`await`

先说一下`async`的用法，它作为一个关键字放到函数前面，用于表示函数是一个异步函数，因为`async`就是异步的意思， 异步函数也就意味着该函数的执行不会阻塞后面代码的执行。`async `函数也是函数，平时我们怎么使用函数就怎么使用它，直接加括号调用就可以了

```javascript
async function timeout() {
　　return 'hello world';
}
```

`async `函数返回的是一个promise 对象，如果要获取到promise 返回值，我们应该用`then `方法:

```javascript
async function timeout() {
    return 'hello world'
}
timeout().then(result => {
    console.log(result);
})
console.log('虽然在后面，但是我先执行');
```

如果`async` 函数中有返回一个值 ,当调用该函数时，内部会调用`Promise.solve()` 方法把它转化成一个promise 对象作为返回，但如果`timeout `函数内部抛出错误呢？ 那么就会调用`Promise.reject() `返回一个`promise `对象.

```javascript
async function timeout(flag) {
    if (flag) {
        return 'hello world'
    } else {
        throw 'my god, failure'
    }
}
console.log(timeout(true))  // 调用Promise.resolve() 返回promise 对象。
console.log(timeout(false)); // 调用Promise.reject() 返回promise 对象。

// 　如果函数内部抛出错误， promise 对象有一个catch 方法进行捕获
timeout(false).catch(err => {
    console.log(err)
})
```

再说`await`关键字:后面可以放任何表达式，不过我们更多的是放一个返回promise 对象的表达式。注意await 关键字只能放到`async `函数里面.先上一段代码

```javascript
// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}
// 现在再写一个async 函数，从而可以使用await 关键字， await 后面放置的就是返回promise对象的一个表达式
async function testResult() {
    let result = await doubleAfter2seconds(30);
    console.log(result);
}
// 调用
testResult();
```

分析一哈过程:调用`testResult()`，它里面遇到了`await`,` await` 表示等一下，代码就暂停到这里，不再向下执行了，它等什么呢？等后面的`promise`对象执行完毕，然后拿到`promise resolve` 的值并进行返回，返回值拿到之后，它继续向下执行。再看我们的代码:遇到`await` 之后，代码就暂停执行了， 等待`doubleAfter2seconds(30)` 执行完毕，`doubleAfter2seconds(30)` 返回的promise 开始执行，2秒 之后，`promise resolve` 了， 并返回了值为60， 这时`await `才拿到返回值60， 然后赋值给result， 暂停结束，代码才开始继续执行，执行` console.log`语句。

### 模块语法

```javascript
// CommonJS模块
let { stat, exists, readFile } = require('fs');
// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

缺点: “运行时加载”,因为只有运行时才能得到这个对象,导致完全没办法在编译时做“静态优化”。

ES6加载:

`import { stat, exists, readFile } from 'fs';`

`export`的使用:模块即是独立文件,外部无法获取该文件内部的变量,

```javascript
// profile.js 用export暴露多少,外部就能访问多少,没暴露的不能访问
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 第二种 推荐,底部容易查看
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;
export {firstName, lastName, year};

// 输出函数
export function multiply(x, y) {
	return x * y;
};
```

`import`的使用:由于 import 是静态执行,所以不能使用表达式和变量,这些只有在运行时才能得到结果的语法结构.

```javascript
// main.js
import {firstName, lastName, year} from './profile';

function setName(element) {
	element.textContent = firstName + ' ' + lastName;
}

// 引入变量重命名

```

#### 模块整体加载

```javascript
// circle.js
export function area(radius) {
	return Math.PI * radius * radius;
}
export function circumference(radius) {
	return 2 * Math.PI * radius;
}
// 加载
import * as circle from './circle';
console.log('圆面积:' + circle.area(4));
console.log('圆周长:' + circle.circumference(14));
```

#### export default

```javascript
// export-default.js,它的默认输出是一个函数
export default function () {
	console.log('foo');
}
// 其他模块加载该模块时, import 命令可以为该匿名函数指定任意名字
// import-default.js
import customName from './export-default';
customName(); // 'foo'

/* 注意,使用 export default 时,对应的 import 语句不需要使用大括号;第二组是不使用 export default 时,对应的 import 语
句需要使用大括号。*/

export default function crc32() { // 输出
// ...
}
import crc32 from 'crc32'; // 输入
// 第二组
export function crc32() { // 输出
// ...
};
import {crc32} from 'crc32'; // 输入


```






## JavaScript运行环境时

### 浏览器

JavaScript可以通过V8引擎在浏览器中运行，所以我们先来了解一下浏览器中的JavaScript。

- BOM

### Node

node不是什么新奇的东西，与浏览器类似，也是JavaScript的一种运行环境时，所以JavaScript能用的东西，node也能用。Chrome的V8+libuv组成了node环境，即引擎与作者定义的模块。Node使用观察者模式。Node线程保持一个事件循环，每当任何任务完成后得到结果，它触发通知事件侦听函数来执行相应的事件。在Node 应用，任何异步函数接受回调作为最后的参数，并回调函数接受错误作为第一个参数。

#### 模块化

CommonJS：模块定义，模块暴露，模块引入

```javascript
const str1 = 'hello';
const str2 = 'world';

module.exports = {
    str1,
    str2
}

// 引入
const demo = require('./demo.js')
let a = demo.str1;
```



#### NPM 

+ package.json
  - **name** - 包的名称
  - **version** - 包的版本
  - **description** - 包的描述
  - **homepage** - 包的网站主页
  - **author** - 包的作者
  - **contributors** - 包的贡献者的名称列表
  - **dependencies** - 依赖性列表。npm自动安装所有在node_module文件夹中的包提到的依赖关系。
  - **repository** - 包的存储库类型和URL
  - **main** - 包的入口点
  - **keywords** - 关键字

#### 常用模块

+ **path模块**:用于处理文件与目录的路径

  ```javascript
  const { normalize, join, resolve, parse, format } = require('path');
  // 1. path.normalize(path):会规范化给定的 path，并解析 '..' 和 '.' 片段
  console.log(normalize.('/usr///local/bin'));   //  /usr/local/bin
  console.log(normalize.('/usr//local/../bin'));  //  /usr/bin
  
  // 2. path.join([...paths]):使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径,也能解析 '..' 和 '.' 
  console.log(join.('/usr', 'local', 'bin/'));   //  /usr/local/bin
  console.log(join.('/usr', '../local', 'bin/'));  //  /usr/bin
  
  // 3. path.resolve([...paths]):会把一个路径或路径片段的序列解析为一个绝对路径
  console.log(resolve.('./'));   //  /Users/clement/Desktop 返回当前路径的绝对路径
  
  // 4. path.parse(path):返回一个对象，对象的属性表示 path 的元素
  //path.format() 会从一个对象返回一个路径字符串。 与 path.parse()方法相反
  const filePath = '/usr/local/bin/test.html';
  const ret = parse(filePath);
  console.log(ret);
  /*
  { root: '/',
     dir: '/usr/local/bin',
     base: 'test.html',
    ext: '.html',
    name: 'test' }
  */
  console.log(format(ret));  // /usr/local/bin/test.html
  ```

  `__dirname`、`__filename`总是返回文件的绝对路径
  `process.cwd()`总是返回执行node命令所在的文件夹

+ **buffer模块**

  可以在 TCP 流或文件系统操作等场景中处理二进制数据流,

  ```javascript
  // 1. Buffer.byteLength():返回一个字符串的实际字节长度。
  console.log(Buffer.byteLength('test'));   // 4
  console.log(Buffer.byteLength('中国'));  // 6
  
  // 2. Buffer.from(array):通过一个八位字节的 array 创建一个新的 Buffer ，如果 array 不是一个数组，则抛出 TypeError 错误。
  console.log(Buffer.from([1, 2, 3]));  // <Buffer 01 02 03>
  
  // 3. Buffer.isBuffer(obj):如果 obj 是一个 Buffer 则返回 true ，否则返回 false
  console.log(Buffer.isBuffer({ 'a': 1 }));  // false
  console.log(Buffer.isBuffer(Buffer.from([1, 2, 3])));  // true
  ```

  常用属性:

  `buf.length` 长度
  `buf.toString()` 转为字符串
  `buf.fill()` 填充
  `buf.equals()` 判断是否相等
  `buf.indexOf()` 是否包含，如果包含返回位置值，不包含返回-1

+ **events模块**

  所有能触发事件的对象都是 `EventEmitter `类的实例。 这些对象开放了一个 `eventEmitter.on()` 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。`eventEmitter.on() `方法用于注册监听器，`eventEmitter.emit() `方法用于触发事件。

  ```javascript
  const EventEmitter = require('events');
  
  class CustomEvent extends EventEmitter {}
  const myEmitter = new CustomEvent();
  
  myEmitter.on('error', err => {
      console.log(err);
  })
  // 当有一个错误的时候，会显示Error: This is an error!，然后显示具体错误内容。
  myEmitter.emit('error', new Error('This is an error!'));
  ```

- **http模块**

  ```javascript
  const http = require('http');
  // 生成服务器，req -> 请求 res -> 响应
  let server = http.createServer((req, res) => {
      // 向前台返回‘666’
      res.write('666');
      // 告诉前台，没有东西了，可以滚了
      res.end()
      
  });
  // 开启服务，在3000端口，并监听
  server.listen(3000);
  ```

- **fs模块**

  通过 `require('fs') `使用该模块。 所有的方法都有异步和同步的形式。异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。

  ```javascript
  const fs = require('fs');
  // 读取hello.txt文件中存储的信息，并使用data(参数对象)保存
  fs.readFile('hello.txt', (err, data) => {
      if (err) throw err;
      // data此时是二进制数据
      console.log(data);
      // 此时data转化为文本信息
      console.log(data.toString());
  });
  // 在world.txt中写入字符串'666'，如果写入的目标文件不存在，自动在当前目录创建该目标文件
  fs.writeFile('world.txt', '666', (err) => {
      if (err) err;
  });
  ```

  - **fs模块与http模块简单结合**

    ```javascript
    const http = require('http');
    const fs = require('fs');
    let server = http.createServer((req, res) => {
        /* req.url -> '/index.html'
         * 如果index.html文件在某个别的目录下，比如'/www'
         * 那么我们所要读取的应该是'./www/index.html'
         */
        let file_name = './www' + req.url;
        fs.readFile(file_name, (err, data) => {
        	if (err) throw err;
        	res.write(data);
        	res.end()
    	});
    });
    server.listen(3000);
    ```

- **数据请求**

  对于后台来说，前端发送的请求不论是form表单还是ajax亦或者jsonp，处理方式都是一样，只跟请求方式有关。

  Get：数据在url地址之中；

  Post：数据不在url地址之中，而是在请求体中。

  对于url的解析(`get`方法)：

  ```javascript
  // url模块用来解析url
  const urlLib = require('url');
  // 注意，parse()函数中的true参数，是为了解析query属性
  let urlObj = urlLib.parse('http://www.baidu.com/index?name=zhangsan&age=18', true);
  console.log(urlObj);
  /* 我们可以看一下打印的信息
   * Url {
   *   protocol: 'http:',
   *   slashes: true,
   *   auth: null,
   *   host: 'www.baidu.com',
   *   port: null,
   *   hostname: 'www.baidu.com',
   *   hash: null,
   *   search: '?name=zhangsan&age=18',
   *   query: { name: 'zhangsan', age: '18' }, // 比较重要
   *   pathname: '/index', // 常用
   *   path: '/index?name=zhangsan&age=18',
   *   href: 'http://www.baidu.com/index?name=zhangsan&age=18' }
   */
  ```

  `post`方法：

  ```javascript
  const http = require('http');
  const urlLib = require('url');
  let server = http.createServer((req, res) => {
      let str = '';// 用于接受数据
      /* post很大，所以我们需要切成小段发送给前台
       * data事件——有一段数据到达(会发生很多次)
       * end事件——数据全部到达(只发生一次)
       */
      req.on('data', (data) => {
          str += data; 
      });
      req.on('end', () => {
          console.log(str);
      });
  });
  server.listen(3000);
  ```


#### 操作mongoDB

1. `npm install mongodb`下载mongodb的模块

2. 测试程序:

   ```javascript
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost',27017,{auto_reconnect:true});
    var db = new mongodb.Db('mydb',server,{safe:true});
    db.open(function(err,db){
        if(!err) {   
           console.log('connect');
        } else {
          console.log(err);
        }
    });
   
   // 有两种方法链接collection，分别为：
   
   db.collection('mycoll',function(err,coll){});
   
   db.createCollection('mycoll',function(err,coll){});
   ```

#### Express

下载:`npm install express --save`

##### 请求处理

```javascript
// 1.引入express搭建一个最基本的服务器
const express = require('express');
// 2.使用express创建服务
var server = express();

// 3.设置路由
server.get("/",function(req,res){
        res.send("你好");
    });

// 4.监听端口号
server.listen(8080);
```

`app.get()`,该方法中有两个参数，第一个参数为请求路径，不分大小写，第二个为回调函数，请求路径可以使用正则匹配，`app.post()`也是同样的参数形式。

##### 静态文件

`Express` 提供了内置的中间件 `express.static` 来设置静态文件如：图片， `CSS, JavaScript` 等，你可以使用 `express.static` 中间件来设置静态文件路径。

`app.use(express.static('public'));`

##### 中间件

路由`get、post`这些东西，就是中间件，中间件讲究顺序，匹配上第一个之后，就不会往后匹配了。`next`函数才能够继续往后匹配。如果我的的`get、post`回调函数中，没有`next`参数，那么就匹配上第一个路由，就不会往下匹配了。如果想往下匹配的话，那么需要写`next()`.`app.use()`也是一个中间件。与`get、post`不同的是，他的网址不是精确匹配的。而是能够有小文件夹拓展的。

#### Koa

`Koa`框架的node环境必须是7.6以上的.

##### 基础

+ 架设`HTTP`服务

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  app.listen(3000);
  ```

+ `Context`对象

  表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容。

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  
  const main = ctx => {
    ctx.response.body = 'Hello World';
  };
  
  app.use(main);
  app.listen(3000);
  ```

  上面代码中，`main`函数用来设置`ctx.response.body`。然后，使用`app.use`方法加载`main`函数。`ctx.response`代表 HTTP Response。同样地，`ctx.request`代表 HTTP Request。

  运行这个 demo。

+ `HTTP Response` 类型

  Koa 默认的返回类型是`text/plain`，如果想返回其他类型的内容，可以先用`ctx.request.accepts`判断一下，客户端希望接受什么数据（根据 HTTP Request 的`Accept`字段），然后使用`ctx.response.type`指定返回类型。

  ```javascript
  const main = ctx => {
    if (ctx.request.accepts('xml')) {
      ctx.response.type = 'xml';
      ctx.response.body = '<data>Hello World</data>';
    } else if (ctx.request.accepts('json')) {
      ctx.response.type = 'json';
      ctx.response.body = { data: 'Hello World' };
    } else if (ctx.request.accepts('html')) {
      ctx.response.type = 'html';
      ctx.response.body = '<p>Hello World</p>';
    } else {
      ctx.response.type = 'text';
      ctx.response.body = 'Hello World';
    }
  };
  ```

+ 渲染模板

  返回给用户的网页往往都写成模板文件。我们可以让 Koa 先读取模板文件，然后将这个模板返回给用户。

  ```javascript
  const fs = require('fs');
  const main = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./demos/template.html');
  };
  ```

##### 路由

+ 原生路由

  网站一般都有多个页面。通过`ctx.request.path`可以获取用户请求的路径，由此实现简单的路由。

  ```javascript
  const main = ctx => {
    if (ctx.request.path !== '/') {
      ctx.response.type = 'html';
      ctx.response.body = '<a href="/">Index Page</a>';
    } else {
      ctx.response.body = 'Hello World';
    }
  };
  ```

+ `Koa-route`

  原生路由用起来不太方便，我们可以使用封装好的[`koa-route`](https://www.npmjs.com/package/koa-route)模块。

  ```javascript
  const route = require('koa-route');
  
  const about = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
  };
  
  const main = ctx => {
    ctx.response.body = 'Hello World';
  };
  
  app.use(route.get('/', main));
  app.use(route.get('/about', about));
  ```

  根路径`/`的处理函数是`main`，`/about`路径的处理函数是`about`。

+ 静态资源

  如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。`koa-static`模块封装了这部分的请求。

  ```javascript
  const path = require('path');
  const serve = require('koa-static');
  
  const main = serve(path.join(__dirname));
  app.use(main);
  ```

+ 重定向

  有些场合，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。`ctx.response.redirect()`方法可以发出一个302跳转，将用户导向另一个路由。

  ```javascript
  const redirect = ctx => {
    ctx.response.redirect('/');
    ctx.response.body = '<a href="/">Index Page</a>';
  };
  
  app.use(route.get('/redirect', redirect));
  ```

##### 错误处理

+ 500

  如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回500状态码。Koa 提供了`ctx.throw()`方法，用来抛出错误，`ctx.throw(500)`就是抛出500错误。

  ```javascript
  const main = ctx => {
    ctx.throw(500);
  };
  ```

+ 404

  如果将`ctx.response.status`设置成404，就相当于`ctx.throw(404)`，返回404错误。

  ```javascript
  const main = ctx => {
    ctx.response.status = 404;
    ctx.response.body = 'Page Not Found';
  };
  ```

+ 错误处理中间件

  为了方便处理错误，最好使用`try...catch`将其捕获。但是，为每个中间件都写`try...catch`太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

  ```javascript
  const handler = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.response.status = err.statusCode || err.status || 500;
      ctx.response.body = {
        message: err.message
      };
    }
  };
  
  const main = ctx => {
    ctx.throw(500);
  };
  
  app.use(handler);
  app.use(main);
  ```

+ error事件的监听

  运行过程中一旦出错，Koa 会触发一个`error`事件。监听这个事件，也可以处理错误。

  ```javascript
  const main = ctx => {
    ctx.throw(500);
  };
  
  app.on('error', (err, ctx) =>
    console.error('server error', err);
  );
  ```

##### Web APP

+ `ctx.cookies`用来读写 Cookie。

  ```javascript
  const main = function(ctx) {
    const n = Number(ctx.cookies.get('view') || 0) + 1;
    ctx.cookies.set('view', n);
    ctx.response.body = n + ' views';
  }
  ```

+ 表单

  Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。[`koa-body`](https://www.npmjs.com/package/koa-body)模块可以用来从 POST 请求的数据体里面提取键值对。

  ```javascript
  const koaBody = require('koa-body');
  
  const main = async function(ctx) {
    const body = ctx.request.body;
    if (!body.name) ctx.throw(400, '.name required');
    ctx.body = { name: body.name };
  };
  
  app.use(koaBody());
  ```

+ 文件上传

  [`koa-body`](https://www.npmjs.com/package/koa-body)模块还可以用来处理文件上传。

  ```javascript
  const os = require('os');
  const path = require('path');
  const koaBody = require('koa-body');
  
  const main = async function(ctx) {
    const tmpdir = os.tmpdir();
    const filePaths = [];
    const files = ctx.request.body.files || {};
  
    for (let key in files) {
      const file = files[key];
      const filePath = path.join(tmpdir, file.name);
      const reader = fs.createReadStream(file.path);
      const writer = fs.createWriteStream(filePath);
      reader.pipe(writer);
      filePaths.push(filePath);
    }
  
    ctx.body = filePaths;
  };
  
  app.use(koaBody({ multipart: true }));
  ```










## Ajax

```javascript
//readyState状态为0
const xhr = new XMLHttpRequest();
//连接，readyState状态为1
xhr.open('GET', 'url', true);
//发送，readyState状态为2， 若为post，则需要用xhr.setRequestHeader()设置请求头
xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
xhr.send();
//接收(readyState状态为3,4;3表示接收到响应头，4表示接收到响应体)
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 
       && ((xhr.status >= 200 && xhr.status < 300)
           || xhr.status === 304){
        alert('成功' + xhr.responseText);
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

3. 函数声明、具名函数表达式、函数调用中，函数名和 `(` 之间不允许有空格。

   ```javascript
   //函数声明
   function show() {
       // do someThing
   };
   //具名函数表达式
   let show = function() {
       // do someThing
   };
   //函数调用
   show();
   ```

4.  如果函数或全局中的 else 块后没有任何语句，可以删除 else:

   ```javascript
   function getName() {
       if (name) {
           return name;
       }
       return 'unnamed';
   }
   ```


