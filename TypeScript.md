# TypeScript

1. 编译
2. 强类型
3. 真正面向对象：接口，有泛型，有枚举

编译:

```shell
tsc demo.ts
```

有类型的`script`:

```typescript
// 变量声明
var a:number;
a = 12;
a = 'abc'; // 报错，定义了类型是number

// void表示空,一般用于函数返回,在变量赋值的时候没有意义
```

热编译：

```shell
tsc --init
```

然后会生成`tsconfig.json`文件，修改`outDir`字段，在VS code中点击任务-运行任务 监视`tsconfig.json`文件

## 数据类型

相比于ES5，增加了类型校验：

```typescript
var flag:boolean = true;
var num:number = 123;
var str:string = 'hehehe';
var arr:number[] = [12, 13, 14]; // 数组中必须都是number类型
// 另一种数组定义方法：
var arrNext:Array<number> = [15, 16, 17];
// 元组类型(给每一个成员指定类型)
var arr:[number, string] = [122, '145'];

// 任意类型(可用于DOM操作)
var numNext:any = 123;
numNext = 'newYear';

// 同时指定两种类型
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

```

> 注意函数返回值必须与定义的类型相同

## 类

```typescript
class Person {
    name:string;
    constructor(n:string) {
        this.name = n;
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

