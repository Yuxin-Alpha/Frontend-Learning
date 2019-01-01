# Go语言笔记

## 初探

```go
// 将该文件打包,go中每个文件都必须属于一个包
package main
// 引入该包，为了使用该包中的API
import "fmt"
// fuc,表示后面是一个函数，main是我们程序的入口
func main() {
	fmt.Println("hello")
}
```

1. 控制台执行`go build main.go`后会编译生成一个可执行文件

   > Linux或者Mac下可以执行`./main`运行可执行文件

2. 控制台执行`go run main.go`可在终端之间运行源码（速度有点慢）

区别：如果我们需要将其拷贝到别的地方，其实可执行文件更加理想，因为.go文件在编译后，会自动将其运行需要的东西一起打包到可执行文件中。

> 1. 以.go结尾
> 2. 执行入口是main()函数
> 3. 一行只写一条语句
> 4. 引入包后必须使用
> 5. 定义变量后必须使用
> 6. 注释尽量使用行注释
> 7. 标识符首字母大写，可以被其他包访问，小写只能被本包访问

## 语法

+ 转义字符：

  > \t 制表符，用于排版
  >
  > \n换行符
  >
  > \ 转义需要转义的字符

+ 变量

  内存中的标识，类似于房间的门牌号

  ```go	
  // 变量声明
  var num int = 10;
  // 或者
  name := "tom"
  ```

  一次性声明多个变量:

  ```go
  // 方式一
  var n1, n2, n3 int
  fmt.Println("n1=", n1, "n2=", n2, "n3=", n3)
  // 方式二
  var n1, name, n3 = 11, "tom", 888
  // 方式三
  n1, name, n3 := 11, "tom", 888
  ```

  > 函数外部声明的变量就是全局变量

  ```go
  var (
  	n3 = 11
      n4 = 22
      name_u = "jack"
  )
  ```

  > 变量在同一个区域内的可以变化，但是不能修改类型
  >
  > 不能重复定义
  >
  > '+'运算，数值进行相加，字符串进行拼接

+ 数据类型

  - 基本数据类型，
    1. int，int8，int16，int32，int64
    2. float，float32，float64
    3. 无字符型，使用byte来存储单个字符
    4. bool
    5. string

  - 复杂数据类型，
    1. 指针
    2. 数组
    3. 结构体（类似class）
    4. 管道（高并发）
    5. 函数（闭包）
    6. 切片（动态数组）
    7. 接口
    8. map（集合）

### 整型

> Int 与uint

查看某个变量的数据类型，字节大小(空间使用够用，使用小的，不然占据的空间太大了)

```go
// 数据类型
fmt.Printf("n1 的类型%T"，n1)
// 字节大小
fmt.Printf("n1 的类型%T，占用的字节数%d"，n1，unsafe.Sizeof(n2))
```

多包引入

```go
import (
	"fmt"
    "unsafe"
    //...
)
```

### 浮点型

> Golang的浮点类型默认是float64
>
> 通常应该使用float64，避免精度损失

### 字符类型

Golang中通过`byte`来表示，由字节组成

```go
var c1 byte = 'a' // 97
var c2 byte = '0' // 48
```

输出`byte`值时，就是输出了对应的码值（ASCII）

```go
var c1 byte = 'a' // 97
fmt.Println("c1=%c", c1) // 'a'
var c1 byte = '北' // 97
fmt.Println("c1=%c", c1) // 报错，超出长度，可以用int保存
```

> 字符常量通过' '存放,其本质是存放一个整数

### 字符串

```go
var address string = "我真帅"
```

> 双引号会识别转义字符，可以通过反引号``进行包裹，会输出普通文本

基本数据类型转换：

- 需要显示转换，并且不能自动转换

  ```go
  var i int = 100 
  var n1 float32 = float32(i) // 显式将i转换成float32类型
  ```

  > 注意：转换过后得到的变量如果想要对其他变量赋值，这两变量的数据类型必须一样。
  >
  > 数据转换只是转换该变量的数值类型，变量的类型并没有改变

- string类型转换

  ```go
  var num1 int = 99
  fmt.Sprintf("%d", num1)
  ```


## 指针

1. 对于基本数据类型，变量存的就是一个值，为值类型

   观察一下：`var num int = 10`变量在内存中自动与一块小块内存关联，这块小内存有一个内存地址（0x5153458785），可以通过&num取得该变量的内存空间地址。

2. 指针类型：指针变量存的是一个地址，这个地址指向的空间存的才是值

   `var ptr *int = &num`。ptr是一个指针变量，类型是`*int`，表示指向一个int类型的数据内存空间，指向的是num变量所在的内存空间。通过`*ptr`可以查询num存储的变量值。

   `*int`类型的指针只能指向变量类型是`int`类型的内存空间

3. 内存分为栈区和堆区，值类型的存储通常在栈区，引用类型通常在堆区

> 从键盘输入，并接受

```go
var name string
fmt.Println("请输入姓名")
// 程序会等待输入，以回车为结束信号
fmt.Scanln(&name)
// 第二种
fmt.Scanf()
```

## 流程控制

`if`语法

```go
if tag = true {
    // coding
} else {
    // coding
}
```

`switch`语法：不用带`break`

```go
switch tag {
    case 1: // coding
    case 2: // coding
    default: // coding
}
```

## 循环控制

```go
for i := 1; i <= 10; i++ {
    // coding
}
```

> `break`使用：用于跳出循环

## 函数

> 每个源文件都包含一个init函数，该函数会在main函数执行前，被Go运行框架调用。先执行引入包的变量定义与init函数，再执行变量定义，再执行init函数，再执行main函数。

1. 匿名函数：

   ```go
   // 立即执行
   func (n1 int, n2 int) int {
       return n1 + n2
   }(10, 20)
   // 函数表达式
   a := func (n1 int, n2 int) int {
       return n1 - n2
   }
   result := a(10, 20) // 通过变量名调用函数
   ```

2. 全局匿名函数:

   ```go
   var (
   	var Func = func (n1 int, n2 int) int {
       return n1 + n2
   	}
   )
   ```

3. 闭包：一个函数与其他的引用环境组成的整体

   ```go
   func AddUpper() func (int) int {
       var n int = 10
       return func (x int) int {
           n += x
           return n
       }
   }
   func main() {
       f := AddUpper()
       f(1) // 11
       f(2) // 13
       f(3) // 16
   }
   ```

4. defer关键字：

   defer先压入栈中，所有非defer执行完后，再执行defer栈中的语句，主要用于资源释放。在Golang编程中的通常做法是，创建资源后，可以执行defer修饰关闭资源的动作，不用关注什么时候关闭，一定非常安全，程序员不必关心什么时候关闭资源而烦心。

   ```go
   // 关闭文件
   func test() {
       file = openfile(文件名)
       defer file.close()
   }
   // 链接关闭
   func test() {
       connect = openDatabase()
       defer connect.close()
   }
   ```

### 系统函数

#### 字符串函数

1. `len(str)`获得字符串的长度
2. `[]rune(str)`转换成`rune`切片可以遍历含有中文的字符串
3. `n, err := strconv.Atoi("123")`,将字符串转为整数
4. `str = strconv.Itoa(123456)`,将数字转化为字符串
5. `strings.Contains("seafood", "foo")`, 某字符串是否存在子串
6. `strings.Count("ceheese", "e")`, 查询某个字符串有多少个子串
7. `strings.EqualFold("abc", "ABC")`, 忽略大小写，判断两个字符串是否相等
8. `strings.Index("VLY_abc", "abc")`，返回子串在字符串中第一次出现的位置，如果没有则返回-1
9. `strings.Replace("go go hello", "go", "golang", 1)`在字符串中的第一次出现go的字符串处更换成golang，原字符串未修改
10. `str.Split("hello,world,ok", ",")`按照`,`进行拆分，返回一个数组
11. `strings.ToUpper(str)或者strings.ToLower(str)`字符串大小写转换
12. `strings.TrimSpace(str)`, 将字符串两边的空格消除
13. `strings.Trim("!heelolll!", "!")`,  将左右两边的`!`去掉
14. `strings.HasPrefix(str, 'http')`, 判断字符串是否以`http`打头
15. `strings.HasSuffix(str, '.jpg')`,判断字符串是否以`.jpg`结尾

#### 时间相关函数

> 需要导入time包

1. `time.Now()`获取当前的时间 包含时区等信息 返回`Time`类型
2. `time.Now().Year()`获取当前时间的年份
3. `time.Now().Format()`格式化当前时间

## 数组&切片

数组，存放多个同一类型的数据，是<b>值类型</b>

定义:`var hens [6]float64`,数组开始的地址是第一个元素的地址，并且各个元素地址是连续的，且每个元素地址的间隔是依据数组的类型决定的

四种定义方式：

```go
// 第一种
var numArr01 [3]int = [3]int{1, 2, 3}
// 第二种
var numArr01 = [3]int{1, 2, 3}
// 第三种
var numArr01 = [...]int{1, 2, 3}
// 第四种
numArr01 := [...]int{1: 800, 0:900, 2:999}
```

### 数组遍历 for-range

`index`是数组的下标，`value`是该下标位置的值，这两个变量因为作用域的问题只在for循环中能够使用。

```go
var heroes [3]string = [3]string{"Bob", "Mary", "Clement"}
for index, value := range heroes {
    fmt.Println(index, value)
}
```

> 数组的长度是数据类型的一部分，必须要清楚长度，否则报错

### slice切片

可以将切片理解成一个动态数组，其长度是不确定的，该数据类型的出现是为了解决数组定义时需要限制长度，有时不满足需求，切片是个引用类型。

切片有容量，不会出现越界的现象，这个属性是动态变化的

切片定义：

```go
var intArr [5]int = [...]int{1, 2, 3, 4, 5}
// 引用intArr这个数组下标从1~2的值
slice := intArr[1:3]
```

## map

一种`key-value`数据结构

`var mapName map[keytype]valuetype `

```go
var a map[string]string
var a map[string]int
var a map[string]map[string]string
```

> map的声明不会分配内存，初始化需要make,分配内存后才可以复制和使用
>
> key不可以重复

```go
var a map[string]string
// 表示可以放10个键值对
a = make(map[string]string, 10)

// 第二种
var b = make(map[string]string, 10)
```

map删除：

`delete(mapName, "key")`删除mapName变量下key值为"key"的键值对

 

## 面向对象

Golang只是支持面向对象编程特性，没有方法重载，没有构造函数，没有析构函数，没有this，而是通过结构体实现, 而结构体是一个值类型

```go
type Cat struct {
    Name string // 默认是空串
    Age int // 默认是0
    Color string // 默认是空串
} 
func main() {
    var cat1 Cat
    cat1.Name = "小白"
    cat1.Age = 3
    cat1.Color = "白色"
}
```

> 不同的结构体，字段互不影响

声明方式：

```go
// 第一种
var person Person
// 第二种
person := Person {
    // ...
}
// 第三种
var p3 *Person = new(Person)
(*p3).Name = "Mary" // 

// 第四种
var person *Person = &Person{
    // ... 
}
```

