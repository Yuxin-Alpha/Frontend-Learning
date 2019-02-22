# ECMAScript笔记

## 变量&运算符

`||`与`&&`:

这两个运算符的返回值并不是true或者false，而是一个值，而且只有一个值。

他们会首先对第一个操作数执行条件判断，如果不是布尔值就进行条件条件类型转换再判断。

对于`||`来说，如果第一个条件成立就返回第一个操作数，否则返回第二个。

而对于`&&`来说刚好相反，如果条件判断成立就返回第二个，否则返回第一个。

```javascript
// 空值合并运算符, 也就是说如果函数给a传值了就用这个值，否则使用"hello"
function foo(a, b) {
    a = a || "hello"
    b = b || "world"
    console.log(a + " ~~~ " + b)
}

// 守护运算符，即短路运算
function foo() {
    console.log(a)
}
var a = 42
a && foo()
```

`==`与`===`:

`==`指允许在比较的时候进行强制类型转换，而`===`不允许，所谓的`==`检查值而`===`检查值和类型的说法并不标准。

> 注意：字符串是不可变的，即字符串的成员函数不会改变其原始值，而是返回一个新的字符串。
>
> 在JavaScript中，简单值都是通过值复制来进行赋值/传递，包括字符串，数字，布尔值，undefined，`null`
>
> 而对象（数组和封装对象）都是通过引用复制来进行赋值/传递。也就是说，值赋值还是引用赋值完全由值的类型来决定。

## 对象

每个`typeof`返回值为`object`的对象都包含一个`[[Class]]`内部属性，可以通过`Object.prototype.toString()`来查看，比如数组的就是`Array`类型。

我们有必要了解一下属性的4个特性：

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

我们来看一下对象的结构：

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



对象属性的访问器属性：我们在使用或者修改每个对象的属性时，其实都是通过其内置的getter方法与setter方法实现的，`[[Get]]`用于读取，`[[Set]]`用于设置。

我们在使用对象中的属性时，应该使用中括号，也就是`obj["value"]`，不要使用`obj.value`:

+ 点语法后面不能跟关键字或者保留字
+ 点语法后面不能跟数字

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
    // 不要忘记
    constructor: Person,
    sayName: funtion() {
      //do someThing
	}
}
```

### 对象继承

所有函数的默认原型都指向`Object.prototype`，即他们都是Object对象的实例，即某函数的原型中有个`__proto__`属性指向`Object`。我们在自定义对象的时候，之所以能够调用`hasOwnProperty`或者`toString`这样的方法，是因为这些方法都是`Object.prototype`上的方法，而我们自定义的函数，其对象又默认是`Object.prototype`的实例，所以我们自定义的函数可以通过原型链找到顶端的`Object`，调用其原型上的内置方法。

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

### 变量作用域

也就是变量可以使用的范围。

> 首先，`Js`有一个最外层的作用域，也就是我们常说的全局作用域。
>
> 再者，`Js`还可以通过函数创建出独立的作用域，由于函数可以嵌套，所以作用域也可以嵌套

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

> 查找函数的作用域，不是看它在哪里调用，而是看它在哪里定义的

## 函数的4种调用模式

在ES6之前，函数内部的this是由该函数的调用方式决定的。

1. 函数调用方式，`this`指向`window`

2. 方法调用方式，`this`指向调用该方法的对象

3. new关键字调用构造函数，函数内部的this会指向构造函数的实例

4. 上下文调用：

   + `bind(obj)`:函数在bind之后并不会立即执行，返回一个this指向被修改为obj的函数。再次调用新返回的函数，this的指向就已经修改了。

     ```javascript
     // 手写一个bind函数
     // bind方法应该被所有函数使用，所以应该放到函数的原型上
     // 所有函数对象的构造函数都是Function
     // 表示新函数的内部的this值
     Function.prototype._bind = function(target) {
         var _that = this
         return function() => {
             _that.call(target);
         }
     }
     ```

     

   + `call(obj, [arr])`修改调用函数的`this`指向，指向参数`obj`,如果obj是基本类型,this就是对应的内置对象，如果obj 是`undefinded`或者`null` ，`this`指向`window`

   + `apply(obj, argu1, argu2)`:原理与call相同，只是参数形式不一样。

我们所说的this，无非就是要调用变量，不同的变量是由不同的运行环境提供的，而不同的运行环境又由不同的运行函数提供，所以，this的出现，其实是为了获得当前的运行环境。

这三个函数都是修改this的指向，this原本是指向当前函数的执行栈环境，这个执行栈环境，可以是一个函数，也可以是一个对象，我们可以通过修改上述的三个函数显式地将this绑定到第一个参数上。

## ES6

### 变量/赋值

> 块级作用域：限制变量使用的范围，更容易去控制

没有块级作用域，内层变量可能会覆盖外层变量

`var `可以重复定义，不能限制修改，没有块级作用域

`let&const`弥补上面的缺陷

### 判断数据类型

`Object.prototype.toString.call()`:

1. 5 =>` '[ object Number ]'`

2. "abc" =>` '[ object String ]'`

3. true =>` '[ object Boolean ]'`

4. null =>` '[ object Null ]'`

5. undefined =>` '[ object Undefined ]'`

6. [1, 3, 5] =>` '[ object Array ]'`

7. function() {} =>` '[ object Function ]'`

8. new Date =>` '[ object Date ]'`

9. /abc/ =>` '[ object RegExp ]'`

   

### 解构赋值

> 左右两边必须一样，定义和赋值必须同步完成，右边必须是个“东西”
>
> ` let {a, b} = {15, 12}` {15, 12}不是所谓的“东西”

```javascript
let obj = {
    name: "zhangsan",
    age: 18
}
let {name: objName, age:objAge} = obj
// objName = "zhangsan"
// objAge = 18
```

### 函数

箭头函数：对匿名函数的一种简写

> 箭头函数不能带名字，如果有且仅有一个参数，() 可以省；如果函数体有且只有一个return 语句，{}可以省

箭头函数有４个主要点：

1. 函数体中的this在定义时绑定，而不是调用时
2. 不可以当做构造函数
3. 不可以使用`arguments`对象，可以使用rest参数代替
4. 不可以使用yield命令

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

### 数组/json

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

### 字符串

1. `starsWith('a')`是否以a开头
2. `endsWith('a')`是否以a结尾
3. 字符串模板

```javascript
let str = 'world';
console.log(`hello${str}`) // hello world
```

### 对象

对象拷贝：

```javascript
// 使用Object.assign()进行对象的浅拷贝
let person = {
    name: "zhangsan",
    age: 26,
    gender: "男"
}

let newPerson = Object.assign({}, person)
// 注意，这里的newPerson　和　person指向的是不同的内存区域


// 还可以使用对象扩展运算符
let newPersonOne = {...person, name: "lisi"}
console.log(newPersonOne) // {name: "lisi", age:26, gender: "男"}
```





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

### Set

类似于数组的数据结构，但成员的值都是唯一的。

通过构造函数来new实例

```javascript
const set = new Set([1, 2, 3, 3, 5, 5, 7, 7, 7])
// set 值是[1, 2, 3, 5, 7]
```

set对象上自带size属性，返回成员总数

其原型上拥有四个函数`add(value)`, `delete(value)`,`has(value)`, `clear()`

### JS运行机制

一般情况下，一个进程一次只能执行一个任务。需要注意的是js的内存分配和执行机理和别的语言不太一样。                                                  

对于运行机制的了解，无非涉及三个问题，即：单线程，异步，单线程如何实现异步。如果有很多任务需要执行，不外乎三种解决方法。

1. **排队:**因为一个进程一次只能执行一个任务，只好等前面的任务执行完了，再执行后面的任务。
2. **新建进程:**使用`fork`命令，为每个任务新建一个进程。
3. **新建线程:**因为进程太耗费资源，所以如今的程序往往允许一个进程包含多个线程，由线程去完成任务。

#### 单线程

即，同一时间职能做一件事。JavaScript的诞生是为了解决用户与页面的交互逻辑问题，如果采用多线程，假设`process1`对页面某个节点进行了删除操作，而`process2`又对该节点进行了改变，这样就会带来非常复杂的同步性问题。

#### 任务队列

来段伪代码：

```javascript
var eventLoop = [];
var event;
while (true) {
    if(eventLoop.length > 0) {
        event = event.shift();
        try {
        	event();
    	}
    	catch (err) {
        	reportError(err);
   		}
    }    
}
```

单线程就意味着，所有任务需要排队。但有时，cpu很空闲，但是IO操作很慢，导致该任务需要有一段的时间获取结果（比如ajax操作），于此同时，该任务后面的任务并没有被cpu处理，但是cpu却很闲，它在和后面的任务一起等待当前任务的返回结果，这样的设计显然是不合理的。为了处理这种现象，JavaScript中出现了任务队列这个概念，这个概念是针对主线程来定义的。主线程处理同步任务，任务队列暂时存放异步任务，我所理解的暂时存放，其实不论是同步还是异步，任务终究是由cpu去执行的，只不过cpu在面对JavaScript时，需要按照JavaScript制定的"规矩"执行，这个规定就是，在cpu执行时，JavaScript会帮cpu分类，同步任务进入主线程，异步任务暂时进入任务table将事件注册，当同步任务全部执行完，cpu才会去任务队列中查看是否有可执行的异步任务（已经满足触发条件的任务）,如果有就推入主线程中。

#### 回调函数

所谓"回调函数"`（callback）`，就是那些会被主线程挂起来的代码。"任务队列"中的事件，除了IO设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等。当主线程开始执行异步任务，就是执行对应的回调函数（异步任务必须指定回调函数）。

#### 宏任务，微任务

- `macro-task`(宏任务)：包括整体代码script，setTimeout，setInterval

- `micro-task`(微任务)：Promise，process.nextTick

  事件轮循在循环时先执行宏任务，再执行微任务

需要注意的是，js代码从开始加载的时候就是一次宏任务的完成（script标签），所以在执行完同步任务后，会直接执行在这次事件轮循中出现的微任务。

### Promise

Promise本身是一个容器, 我们将异步操作封装到一个promise实例中，异步操作执行完之后会返回一个结果，表示操作是否成功，成功与失败对应着两种不同的解决方法。

该对象的状态不受外界影响.一共有pending,fulfilled与rejected3种状态,表示进行中,已成功,已失败.一旦状态发生变化了,就不会再变了.说白了，Promise的构造函数中传入一个异步事件，该事件有两个参数，是对该异步事件未来执行结果的两个处理函数，也就是发生两种结果的不同回调。

```javascript
const promise = new Promise(function(resolve, reject) {
	// ... some code
	if (/* 异步操作成功 */){
        // resolve将状态变成resolved,并将异步操作的结果作为参数返回
        
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
                // 要在成功的时候调用resolve函数来告知外界promise的状态变成功了，这样promise的then方法才能继续执行
				resolve(this.response);
			} else {
                // 同理，如果发生了错误，也要告知外界promise的状态变成了失败状态
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

catch方法不仅可以捕捉到异步操作的错误，还可以捕捉到异步操作成功后，处理then方法中存在的错误

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

### Iterator（遍历器）

为了处理类似集合（数组，对象，Set，Map）这类的数据结构的接口机制。部署了这个接口的数据结构，其成员就可以被遍历。

过程：

1. 创建一个指针对象,指向当前数据结构的起始位置。也就是说,遍历器对象本质上,就是一个指针对象
2. 第一次调用指针对象的 next 方法,可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法,指针就指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法,直到它指向数据结构的结束位置

每次调用`next()`都会返回一个`{value: "", done: true|false}`,value字段返回当前成员的值，而`done`表示遍历是否结束。

默认的 `Iterator `接口部署在数据结构的` Symbol.iterator `属性

```javascript
let arr = ['a', 'b', 'c'];
// 为数组部署这个属性
let iter = arr[Symbol.iterator]();
```

使用场合：

+ 解构赋值：对数组和 Set 结构进行解构赋值时,会默认调用 Symbol.iterator 方法

  ```javascript
  let set = new Set().add('a').add('b').add('c');
  let [x,y] = set;
  // x='a'; y='b'
  let [first, ...rest] = set;
  // first='a'; rest=['b','c'];
  ```

+ 扩展运算符：扩展运算符(...)也会调用默认的 Iterator 接口

  ```javascript
  // 例一
  var str = 'hello';
  [...str] // ['h','e','l','l','o']
  // 例二
  let arr = ['b', 'c'];
  ['a', ...arr, 'd']
  // ['a', 'b', 'c', 'd']
  ```

遍历对象：

```javascript
let es6 = {
    edition: 6,
    committee: "TC39",
    standard: "ECMA-262"
};
// 因为forEach函数无法和break,continue或者return 结合
for (var key of Object.keys(someObject)) {
	console.log(key + ': ' + someObject[key]);
}
```



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

`show()`函数会返回一个一个`Iterator`实例,当调用Generantor函数的时候，函数不会执行。

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

+ 解决异步编程

  ```javascript
  function* gen(x) {
  	var y = yield x + 2;
  	return y;
  }
  var g = gen(1);
  g.next() // { value: 3, done: false }
  g.next() // { value: undefined, done: true }
  ```

  调用 Generator 函数,会返回一个内部指针(即遍历器) g 。这是 Generator 函数不同于普通函数的另一个地方,即执行它不会返回结果,返回的是指针对象。调用指针 g 的 next 方法,会移动内部指针(即执行异步任务的第一段),指向第一个遇到的 yield 语句,上例是执行到 x + 2 为止。next 方法的作用是分阶段执行 Generator 函数。每次调用 next 方法,会返回一个对象,表示当前阶段的信息( value 属性和 done 属性)。value 属性是 yield 语句后面表达式的值,表示当前阶段的值; done 属性是一个布尔值,表示 Generator 函数是否执行完毕,即是否还有下一个阶段。

  案例：

  ```javascript
  var fetch = require('node-fetch');
  
  function* gen(){
  	var url = 'https://api.github.com/users/github';
  	var result = yield fetch(url);
  	console.log(result.bio);
  }
  ```

  

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

ajax确实也能同步发送请求，但是这样可能会造成浏览器UI被锁定，按钮，菜单，滚动条无法使用。

## 代码规范

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


