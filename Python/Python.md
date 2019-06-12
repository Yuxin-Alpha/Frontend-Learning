#  Python笔记

##运算符

同级运算符之间计算从左向右。同级运算符有轻微的优先级区别

1. not > and > or

## 组织

包：文件夹

模块：文件

文件内部又有类，类包含函数

如果想让一个普通的文件夹变成Python的一个包，需要在这个文件夹内新建一个`__init__.py`文件，这个文件本身也是一个模块，可以什么都不写，这个`__init__.py`文件的模块名就是所在包的包名。

## 异常



## 函数



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

## 抽象基类(abc模块)

可以理解成`java`中的接口，抽象接口不能实例化，定义各种方法而不做具体实现的类，任何继承自抽象基类的类必须实现这些方法，否则无法实例化。实现一个类中不同的魔法函数，就会赋予这个类不同的特性。

那么抽象基类这样实现的目的是什么呢？ 假设我们在写一个关于动物的代码。涉及到的动物有鸟，狗，牛。首先鸟，狗，牛都是属于动物的。既然是动物那么肯定需要吃饭，发出声音。但是具体到鸟，狗，牛来说吃饭和声音肯定是不同的。需要具体去实现鸟，狗，牛吃饭和声音的代码。概括一下抽象基类的作用：定义一些共同事物的规则和行为。

鸭子类型：python中实现多态的一种形式，在这种形式中，对象的类型无关紧要，只要实现了特定的协议，也就是魔法函数即可。

### 魔法函数

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



## 元类编程

### 内存解析

由于python内部的优化机制，对于简单构造的对象，比如：整数，小数，字符串，它会在全局内存中开辟一个空间专门存放，每个被这种简单结构对象赋值的变量，指向的都是同一块内存

is: 用来判断两边的对象是否是同一个对象（判断变量的内存地址是否相等）

==: 当使用这个运算符的时候，python会自动调用\__eq__这个魔法函数，判断的是两个对象的值

### 垃圾回收

python中垃圾回收的算法是采用引用计数

```python
a = 1
b = a # 这时1这个对象的计数器就会加到２
```

当某个对象的引用计数器减到0的时候，python解释器就会将这个对象自动清除，释放内存。

del　关键字会将某个对象的引用计数-1，并且在栈中删除del后面的变量，而不是将这个对象直接回收

### property

计算属性装饰器，可以将类的一个函数变成属性描述符，在代码中通过`obj.func_name`进行调用

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

当属性查找没有找到的时候，会调用`\__getattr__`魔法函数。

而只要代码中对对象的属性进行查找，就会无条件地执行`\__getattribute__`魔法函数，也就是属性描述的入口。

### 属性描述符

```python
import numbers
class IntField:
    def __get__(self, instance, owner):
        return self.value
    def __set__(self, instance, value):
        if not isinstance(value, numbers.Integral):
            raise ValueError("int value need")
        self.value = value
    def __delete__(self, instance):
        pass
```



## 进程＆线程

一个运行的程序称为进程，但是每个程序又有许多子任务，这些子任务称为线程。

### multiprocessing

+ 提供一个`Process`类来代表一个进程对象

```python
from multiprocessing import Process
# 控制进程的包
import time

def run_proc(n):
    while True:
        print("----2----")
        # 暂停当前的进程
        time.sleep(1)
        
if __name__ == '__main__':
    # 创建一个进程，传入进程名（函数名）
	p = Process(target=run_proc, args=(1,))
    # 启动进程（放入进程队列）
    p.start()
    while True:
        print("---1----")
        time.sleep(1)
```



