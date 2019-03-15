#  Python笔记

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

## 序列类

+ 容器序列: list, tuple, deque

+ 扁平序列: str, bytes, array.array

  容器序列可以放置任意类型的数据

+ 可变序列: list, deque, array

+ 不可变: str, tuple, bytes





## 循环语句

+ while 语句:

  ```python
  # continue 和 break 用法
   
  i = 1
  while i < 10:   
      i += 1
      if i%2 > 0:     # 非双数时跳过输出
          continue
      print i         # 输出双数2、4、6、8、10
   
  i = 1
  while 1:            # 循环条件为1必定成立
      print i         # 输出1~10
      i += 1
      if i > 10:     # 当i大于10时跳出循环
          break
  
  # while … else 在循环条件为 false 时执行 else 语句块
  count = 0
  while count < 5:
     print count, " is  less than 5"
     count = count + 1
  else:
     print count, " is not less than 5"
  ```



+ for循环:

  ```python
  for letter in 'Python':     # 第一个实例
     print '当前字母 :', letter
   
  fruits = ['banana', 'apple',  'mango']
  for fruit in fruits:        # 第二个实例
     print '当前水果 :', fruit
   
  print "Good bye!"
  
  # range() 函数可创建一个整数列表
  # 冒泡排序
  arays = [1,8,2,6,3,9,4]
  for i in range(len(arays)):
      for j in range(i+1):
          if arays[i] < arays[j]:
              # 实现连个变量的互换
              arays[i],arays[j] = arays[j],arays[i]
  print arays
  ```

+ break的正确姿势:跳出循环.

  ```python
  for letter in 'Python':     # 第一个实例
     if letter == 'h':
        break
     print '当前字母 :', letter
    
  var = 10                    # 第二个实例
  while var > 0:              
     print '当前变量值 :', var
     var = var -1
     if var == 5:   # 当变量 var 等于 5 时退出循环
        break
  ```


+ continue的正确姿势:直接进入下一轮循环

  ```python
  for letter in 'Python':     # 第一个实例
     if letter == 'h':
        continue
     print '当前字母 :', letter
   
  var = 10                    # 第二个实例
  while var > 0:              
     var = var -1
     if var == 5:
        continue
     print '当前变量值 :', var
  ```


+ pass的正确姿势:pass 不做任何事情，一般用做占位语句。

  ```python
  for letter in 'Python':
     if letter == 'h':
        pass
        print '这是 pass 块'
     print '当前字母 :', letter
  ```

## 迭代器

迭代器是一个可以记住遍历的位置的对象。

迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。迭代器有两个基本的方法：**iter()** 和 **next()**。字符串，列表或元组对象都可用于创建迭代器。

```python
>>>list=[1,2,3,4]
>>> it = iter(list)    # 创建迭代器对象
>>> print (next(it))   # 输出迭代器的下一个元素
1
>>> print (next(it))
2
```

## 函数

- 函数代码块以 **def** 关键词开头，后接函数标识符名称和圆括号 **()**。

- 任何传入参数和自变量必须放在圆括号中间，圆括号之间可以用于定义参数。
- 函数的第一行语句可以选择性地使用文档字符串—用于存放函数说明。

- 函数内容以冒号起始，并且缩进。
- 必需参数须以正确的顺序传入函数。调用时的数量必须和声明时的一样。
- **return [表达式]** 结束函数，选择性地返回一个值给调用方。不带表达式的return相当于返回 None.函数返回值的注意事项: 不同于 C 语言，Python 函数可以返回多个值，多个值以元组的方式返回

```python
# 计算面积函数
def area(width, height):
    return width * height
 
def print_welcome(name):
    print("Welcome", name)
 
print_welcome("Runoob")
w = 4
h = 5
print("width =", w, " height =", h, " area =", area(w, h))
```

### 默认参数

```python
#可写函数说明
def printinfo( name, age = 35 ):
   "打印任何传入的字符串"
   print ("名字: ", name)
   print ("年龄: ", age)
   return
 
#调用printinfo函数
printinfo( age=50, name="runoob" )
print ("------------------------")
printinfo( name="runoob" )
```



### 不定长参数

加了星号` * `的参数会以元组(tuple)的形式导入，存放所有未命名的变量参数。

```python
def functionname([formal_args,] *var_args_tuple ):
   "函数_文档字符串"
   function_suite
   return [expression]

def printinfo( arg1, *vartuple ):
   "打印任何传入的参数"
   print ("输出: ")
   print (arg1)
   print (vartuple)
 
# 调用printinfo 函数
printinfo( 70, 60, 50 )
```

加了两个星号 ** 的参数会以字典的形式导入。

```python
def printinfo( arg1, **vardict ):
   "打印任何传入的参数"
   print ("输出: ")
   print (arg1)
   print (vardict)
 
# 调用printinfo 函数
printinfo(1, a=2,b=3)
```

### 匿名参数

所谓匿名，意即不再使用 def 语句这样标准的形式定义一个函数。使用 lambda 来创建匿名函数。

- lambda 只是一个表达式，函数体比 def 简单很多。

- lambda的主体是一个表达式，而不是一个代码块。仅仅能在lambda表达式中封装有限的逻辑进去。

- lambda 函数拥有自己的命名空间，且不能访问自己参数列表之外或全局命名空间里的参数。

  ```python
  sum = lambda arg1, arg2: arg1 + arg2
   
  # 调用sum函数
  print ("相加后的值为 : ", sum( 10, 20 )) # 30
  print ("相加后的值为 : ", sum( 20, 20 )) # 40
  ```

### 变量作用域

程序的变量并不是在哪个位置都可以访问的，访问权限决定于这个变量是在哪里赋值的.在局部找不到，便会去局部外的局部找（例如闭包），再找不到就会去全局找，再者去内建中找。

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

