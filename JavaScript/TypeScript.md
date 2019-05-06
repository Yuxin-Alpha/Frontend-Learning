# TypeScript

1. 编译
2. 强类型
3. 真正面向对象：接口，有泛型，有枚举

安装:`npm install -g typescript`

编译:

```shell
tsc demo.ts
```

有类型的`script`,`TypeScript` 中，使用 `:` 指定变量的类型，`:` 的前后有没有空格都可以。:

```typescript
// 变量声明
var a:number;
a = 12;
a = 'abc'; // 报错，定义了类型是number

// void表示空,一般用于函数返回,在变量赋值的时候没有意义
```

**TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错,但还是会生成编译结果**。

**变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型**



热编译：

```shell
tsc --init
```

然后会生成`tsconfig.json`文件，修改`outDir`字段，在VS code中点击任务-运行任务 监视`tsconfig.json`文件

## 数据类型

相比于ES5，增加了类型校验：

```typescript
var flag: boolean = true;
var num: number = 123;
var str: string = 'hehehe';
var arr: number[] = [12, 13, 14]; // 数组中必须都是number类型

// 另一种数组定义方法(泛型)：
var arrNext: Array<number> = [15, 16, 17];

// 元组类型(给每一个成员指定类型)
var arr: [number, string] = [122, '145'];

// 任意类型(可用于DOM操作)
var numNext:any = 123;
numNext = 'newYear';

// 同时指定两种类型(联合类型)
var numNext1:number | undefined | null;

// void 表示没有任何类型(通常用于定义函数时没有返回值)
function run():void {
    // coding
}

// 枚举类型
enum GENDER {
    MALE,FAMALE
}
let sex:GENDER;
sex = GENDER.MALE
```

+ 类型别名

  ```typescript
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
      if (typeof n === 'string') {
          return n;
      } else {
          return n();
      }
  }
  ```

+ 字符串字面两类型

  ```typescript
  type EventNames = 'click' | 'scroll' | 'mousemove';
  function handleEvent(ele: Element, event: EventNames) {
      // do something
  }
  
  handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
  handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
  ```


## 接口

接口是一个对象的描述，它是对行为的抽象，而具体如何行动需要由类去实现,在`TS`中。

```typescript
// 定义了一个接口 Person，接着定义了一个变量 tom，它的类型是 Person。这样，我们就约束了 tom 的形状必须和接口 Person 一致。多一些属性或者少一些属性都是不允许的.
interface Person {
    name: string
    age: number
}

let tom: Person = {
    name: 'Tom',
    age: 25
};

// 可选属性声明的时候使用?:声明  表示这个属性可有可无
interface Animal {
  name?: string
  age?: number
}

// 只读属性,不能修改
interface Demo {
  readonly x: number
}
```

## 函数

```typescript
// ES5 中定义函数
function remove() {
    // coding
}
// TypeScript中定义函数
function run():string {
    return 'hello'
}
// 函数表达式
var say = function say():number {
    return 123
}
// TypeScript 中定义传参
function getInfo(name:string, age:number):string {
    // coding
}
// TypeScript中实参和形参必须一样，如果不一样则需要配置
function getInfo(name:string, age?:number):string {
    // 判定是否传入age,用？配置
    if (age) {
        return `${name}------${age}`;
    } else {
        return `${name}------年龄保密`;
    }
}
// 剩余参数
function sum(...result:number[]):number{
    // coding
}
// 函数重载
function getInfo(name:string):string;
function getInfo(name:age):number;
function getInfo(str:any):any {
    if (typeof str === 'string') {
        return '我叫' + str;
    } else {
        return '我的年龄是' + str;
    }
}

// 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

> 注意函数返回值必须与定义的类型相同,函数的参数数量必须和定义时保持一致

## 类

```typescript
class Person {
    name:string
    constructor(n:string) {
        this.name = n
    }
    getName():string {
        return this.name
    }
    setName(name:string):void {
        this.name = name
    }
    run():void {
        // coding
    }
}
// 继承
class Man extends Person {
    constructor(name:string) {
        super(name)
    }
}
var m1 = new Man('张三')
```

## 内置对象

```typescript
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

## 声明文件

当使用第三方库时,我们需要引用它的声明文件。拿`jQuery`举例,在`TS`中,我们并不知道 `$` 或 `jQuery` 是什么东西,这时,我们需要使用 `declare` 关键字来定义它的类型,帮助 TypeScript 判断我们传入的参数类型对不对：

```typescript
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```

