#  Python笔记

## 闭包

在某个函数定义的内部，定义一个内部函数，这个函数最后`return func_name`

## 对象

### 一切皆对象

类和函数也是对象。

1. 可以赋值给一个变量:

2. 可以添加到集合对象中

3. 可以作为参数传递给函数

4. 可以当做函数的返回值

   ```python
   # 函数赋值
   def ask(name="zhangsan"):
       print(name)
       
   my_func = ask
   # 输出"zhangsan"
   my_func()
   
   # 类赋值
   class Person:
       def __init__(self):
           print("lisi")
   
   my_class = Person
   # 输出"lisi"
   my_class()
   
   # 装饰器原理
   def func_ask():
       print("我想先打印再调用ask函数")
       return ask
   ```

### type,object,class

思考一段代码：

```python
a = 1
# 输出<class int>
print(type(a))
# 输出<class type>
print(type(int))
```

我们可以得出type生成了int, int 生成了1

进而我们知道了type 生成了class , class 再生成obj

不管是python语言的内置class，还是我们自己自定义的class，其实都是使用type生成的

> 我们常说object是最顶层的基类，其实type(object)的输出，还是type，而type.\__bases__又是object

即，object是type的实例，type又继承自object，并且是自己的实例。

### 内置类型

对象的三个特征：1. 身份(对象在内存中的地址，通过`id()`查看)   2. 类型  3. 值

类型总结：

+ None : 全局只有一个
+ 数值：int, float, complex, bool
+ 迭代类型(可以使用for循环进行遍历)
+ 序列类型: list, range, str, array, tuple
+ 映射类型(dict)
+ 集合(set)
+ 上下文管理类型with
+ 模块类型，函数类型，方法类型，class和实例等等

## 魔法函数

鸭子类型：python中实现多态的一种形式，在这种形式中，对象的类型无关紧要，只要实现了特定的协议，也就是魔法函数即可。

以双下划线开头与结尾的函数，由python语言本身提供，为了增强自定义类的特性，魔法函数的调用是隐式的。

```python
class Company(object):
    def __init__(self, employee_list):
        self.employee = employee_list
    #　这个魔法函数使得实例对象变成可以迭代的    
    def __getitem__(self, item):
        return self.employee[item]

company = Company(["jack", "tom", "bob", "jane"])
for em in company:
    print(em)
```

### \__str__

```python
class Company(object):
    def __init__(self, employee_list):
        self.employee = employee_list
    #　当对象被print()调用时，会隐式调用这个魔法函数    
    def __str__(self):
        return ','.join(self.employee)

company = Company(["jack", "tom", "bob", "jane"])
print(company)
```

## 抽象基类(abc模块)

可以理解成`java`中的接口，抽象接口不能实例化，定义各种方法而不做具体实现的类，任何继承自抽象基类的类必须实现这些方法，否则无法实例化。实现一个类中不同的魔法函数，就会赋予这个类不同的特性。

那么抽象基类这样实现的目的是什么呢？ 假设我们在写一个关于动物的代码。涉及到的动物有鸟，狗，牛。首先鸟，狗，牛都是属于动物的。既然是动物那么肯定需要吃饭，发出声音。但是具体到鸟，狗，牛来说吃饭和声音肯定是不同的。需要具体去实现鸟，狗，牛吃饭和声音的代码。概括一下抽象基类的作用：定义一些共同事物的规则和行为。

## 序列类

+ 容器序列: list, tuple, deque

+ 扁平序列: str, bytes, array.array

  容器序列可以放置任意类型的数据

+ 可变序列: list, deque, array

+ 不可变: str, tuple, bytes





## import导入模块



## ==与is

由于python内部的优化机制，对于简单构造的对象，比如：整数，小数，字符串，它会在全局内存中开辟一个空间专门存放，每个被这种简单结构对象赋值的变量，指向的都是同一块内存

is: 用来判断两边的对象是否是同一个对象（判断变量的内存地址是否相等）

==: 当使用这个运算符的时候，python会自动调用\__eq__这个魔法函数，判断的是两个对象的值

## del与垃圾回收

python中垃圾回收的算法是采用引用计数

```python
a = 1
b = a # 这时1这个对象的计数器就会加到２
```

当某个对象的引用计数器减到0的时候，python解释器就会将这个对象自动清除，释放内存。

del　关键字会将某个对象的引用计数-1，并且在栈中删除del后面的变量，而不是将这个对象直接回收

## 元类编程

### property

计算属性装饰器，可以将类的一个函数变成属性描述符，在代码中通过obj.func_name进行调用

```python
from datetime import date, datetime
class User:
    def __init__(self, name, birthday):
        self.name = name
        self.birthday = birthday
        
    @property
    def age(self):
        return datetime.now().year - self.birthday.year
    
    @age.setter
    def age(self, value):
        self.age = value
```

### \_\_getattr\_\_与\_\_getattribute__

当属性查找没有找到的时候，会调用\__getattr__魔法函数。

而只要代码中对对象的属性进行查找，就会无条件地执行\__getattribute__魔法函数，也就是属性描述的入口。

### 属性描述符



## 



### 



## 模块化

`import sys` 引入 python 标准库中的 `sys.py `模块；这是引入某一模块的方法。个模块只会被导入一次，不管你执行了多少次import.

### \__name__属性

一个模块被另一个程序第一次引入时，其主程序将运行。如果我们想在模块被引入时，模块中的某一程序块不执行，我们可以用__name__属性来使该程序块仅在该模块自身运行时执行。

### 包

可以看做成一个目录，但是里面一定要有\_\_init\_\_.py文件

导入方式:

```python
import sound.effects.echo
# 或者
from sound.effects import echo
```

## 文件

1. `open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)`:打开一个文件,并返回文件对象.

   参数说明:

   + `file`: 必需，文件路径（相对或者绝对路径）。

   + `mode`: 可选，文件打开模式

   + `buffering`: 设置缓冲

   + `encoding`: 一般使用utf8

   + `errors`: 报错级别

   + `newline`: 区分换行符

   + `closefd`: 传入的file参数类型

   + `opener`:

2. `file对象`由open函数返回,常用函数:

   + `file.close()`:关闭文件
   + `file.flush()`:刷新缓冲区
   + `file.isatty()`:检测文件是否连接到一个终端设备

## 面向对象

将功能独立的代码封装到一个方法中,然后将多个方法封装到一个类之中.类是抽象的,不能直接使用.

注意,类中定义的方法,第一个参数必须是`self`.不要在类的外部添加对象属性.当创建对象时,先分配空间,再调用init方法.获取属性的时候,有一个向上查找的过程.

```python
# 类名符合大驼峰命名法
class MyClass:
    # 实例 ,类属性
    i = 12345
    
    # 类有一个名为 __init__() 的特殊方法（构造方法），该方法在类实例化时会自动调用
    def __init__(self, name):
        self.name = name
    	self.data = []
    
    # 类方法
    @classmethod
    def a(cls):
        
        
    def f(self):
        MyClass.i++
        return 'hello world'
 
# 实例化类
x = MyClass("zhangsan")
 
# 访问类的属性和方法
print("MyClass 类的属性 i 为：", x.i)
print("MyClass 类的方法 f 输出为：", x.f())
```

内置函数,可以通过`dir()`获得

`__方法名__`Python针对对象提供的内置方法

`__del__`对象销毁前自动调用

`__str__`返回一个字符串,上述代码`print(x)`会输出这个对象在内存中的地址,如果希望输出别的东西,可以重写该函数	

私有属性在外界不能被自由访问,对象的方法内部可以访问私有属性.私有方法不能在外界自由访问.

### 继承

子类拥有父类的所有属性和方法(注意子类不能访问父类的私有属性和私有方法),子类通过再自己内部重写父类的方法来实现多态:

```python
class Animal:
    def eat(self):
        print("吃")      
    def drink(self):
        print("喝")
    def run(self):
        print("跑")
              
class Dog(Animal):
    
    # 重写 + super()调用
    def eat(self):
        print("吃肉")
        super().eat()
        
        
    def bark(self):
        print("叫")
```

+ 多继承:

  ```python
  class 子类名(父类名1, 父类名2...)
  ```

  注意:开发时尽量避免两个父类拥有同名方法.解释器会从左向右搜索方法直到`object`

## 设计模式

不同的问题用不同的套路(整套解决方案)来解决,这个套路叫做设计模式

### 单例模式

单个实例,让类创建的对象在系统中只有唯一一个实例.

+ `__new__()`方法:内置的静态方法,为对象分配空间,返回对象的引用

## 异常

+ 捕获异常

  ```python
  try:
  	num = int(input("请输入一个整数"))
  except:
      print("请输入正确的整数")
  ```


## 代码规范

