#  Python笔记

程序执行的顺序：

1. 设备 ->`CPU` + 内存(临时存储数据，电脑断电，数据消失) + 硬盘( 永久存储数据 )
2. 真正负责程序运行的是`CPU`，代码保存在硬盘
3. 操作系统会先把程序复制到内存中，Python解释器在内存中，CPU根据解释器翻译内存中拷贝的代码，然后执行这些翻译好的程序运行。

注释:

不要描述代码，而是去解释这段代码的目的，python文件的命名一定不能有大写字母，也不能以数字开头，严格缩进,不需要使用`{}`

单行注释：#开头

多行注释：

```python
"""
我是一条注释
"""
```

语句以换行符结束，不要加分号

```python
# import 语法
import sys
print('================Python import mode==========================');
print ('命令行参数为:')
for i in sys.argv:
    print (i)
print ('\n python 路径为',sys.path)
```



## 变量

不需要声明，直接进行赋值，并使用，但是必须赋值后使用，Python可以根据变量指向的内存所存储的值来自动推测该变量的类型。变量和数据是分开存储的,数据存储在内存中的一个位置,变量中保存着数据再内存中的地址,变量中记录数据的地址,就叫做引用.所以当我们给变量赋值的时候,本质是修改了数据的引用

```python
# 变量的命名规范
# 所有字母小写
person_name = '张三'
print(person_name)
# 帕斯卡命名法
PersonName = '李四'

# 数字类型
a, b, c, d = 20, 5.5, True, 4+3j
print(type(a), type(b), type(c), type(d))
# 输出<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>

# type()函数可以检查某个值的类型

# 用 isinstance 来判断类型
a = 111
isinstance(a, int) # 注意:type()不会认为子类是一种父类类型。isinstance()会认为子类是一种父类类型。

# 二进制
c = 0b10
# 八进制
d = 0o10
# 十六进制
f = 0x16

# 字符串,单引号和双引号都可以
string_one = 'hello'
string_two = "world"

str = 'Runoob'
 
print (str[0:-1])    # 输出第一个到倒数第二个的所有字符
print (str[0])       # 输出字符串第一个字符
print (str[2:5])     # 输出从第三个开始到第五个的字符
print (str[2:])      # 输出从第三个开始的后的所有字符
print (str * 2)      # 输出字符串两次
print (str + "TEST") # 连接字符串
```

### 数字

整数类型没有限制。

`ceil(x)`:返回数字的上入整数

`floor(x)`:返回数字的下舍整数

`random(x)`:随机生成下一个实数,在`[0, 1)`之间

### 字符串

| 操作符 | 描述                                             |
| ------ | ------------------------------------------------ |
| +      | 字符串连接                                       |
| *      | 重复输出字符串                                   |
| in     | 成员运算符 - 如果字符串中包含给定的字符返回 True |

+ 格式化字符串:

  ```python
  print ("我叫 %s 今年 %d 岁!" % ('小明', 10))
  ```

  符号:

  | 符号 | 描述                                 |
  | ---- | ------------------------------------ |
  | %c   | 格式化字符及其ASCII码                |
  | %s   | 格式化字符串                         |
  | %d   | 格式化整数                           |
  | %f   | 格式化浮点数字，可指定小数点后的精度 |

截取字符串补充:Python不支持单字符类型，单字符在 Python 中也是作为一个字符串使用。

```python
# 0、a,b为参数。从字符串指针为a的地方开始截取字符，到b的前一个位置（因为不包含b）
var1 = "hello world";
print(var1[a: b]);

# 1、如果a,b均不填写，默认取全部字符。即，下面这两个打印结果是一样的
print(var1[:]);  # hello world
print(var1);      # hello world

# 2、如果a填写，b不填写（或填写的值大于指针下标），默认从a开始截取，至字符串最后一个位置
print(var1[3:]); # lo world

# 3、如果a不填写， b填写，默认从0位置开始截取，至b的前一个位置
print(var1[:8]); # hello wo

# 4、如果a为负数，默认从尾部某一位置，开始向后截取
print(var1[-2:]); # ld

# 内置方法
# 判断是否以指定的字符串开始
var1.startswith("hello")

# 判断是否以指定的字符串结束
var1.endswith("world")

# 查找指定的字符串在大字符中的索引,找不到返回-1
var1.find("llo")

# 替换指定的字符串,会返回一个新的字符串,但不会修改原有的字符串的内容
var1.replace("world", "my love")

# 删除字符串两边的空白字符
var1.strip()
```

### 列表

列表中元素的类型可以不相同，它支持数字，字符串甚至可以包含列表（所谓嵌套）.和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表.索引值以 0 为开始值，-1 为从末尾的开始位置。列表都可以进行的操作包括索引，切片，加，乘，检查成员。

```python
list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ]
tinylist = [123, 'runoob']
 
print (tinylist * 2)    # 输出两次列表
print (list + tinylist) # 连接列表

len([1, 2, 3]) # 3
[1, 2, 3] + [4, 5, 6] # [1, 2, 3, 4, 5, 6]

# 删除元素 del关键字会将变量直接从内存中删除
list = ['Google', 'Runoob', 1997, 2000] 
print ("原始列表 : ", list)
del list[2]
print ("删除第三个元素 : ", list)

# 内置方法

# append() 方法用于在列表末尾添加新的对象。
aList = [123, 'xyz', 'zara', 'abc'];
aList.append( 2009 );
print "Updated List : ", aList;

# extend() 函数用于在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表）。
aList = [123, 'xyz', 'zara', 'abc', 123];
bList = [2009, 'manni'];
aList.extend(bList)
print "Extended List : ", aList ;

# index() 函数用于从列表中找出某个值第一个匹配项的索引位置。
aList = [123, 'xyz', 'zara', 'abc'];
print "Index for xyz : ", aList.index( 'xyz' ) ;

# remove() 删除列表中的某一项(指定的)
aList.remove(123)

# clear() 清空列表 
aList.clear()

# pop() 函数用于移除列表中的一个元素（默认最后一个元素），并且返回该元素的值。
list1 = ['Google', 'Runoob', 'Taobao']
list_pop=list1.pop(1)
print "删除的项为 :", list_pop
print "列表现在为 : ", list1

# count() 用于计算一个元素在列表中出现的次数
list1.count('Google')

# 列表的循环遍历(迭代)
name_list = ['张三', '李四', '王五', '王小二']
for my_name in name_list:
    print("我的名字叫%s" % my_name)
```

### 元组

元组`（tuple）`与列表类似，不同之处在于元组的元素<b>不能修改</b>。元组写在小括号 () 里，元素之间用逗号隔开。元组中只包含一个元素时，需要在元素后面添加逗号.

```python
tuple = ( 'abcd', 786 , 2.23, 'runoob', 70.2  )
tinytuple = (123, 'runoob')
 
print (tuple)             # 输出完整元组
print (tuple[0])          # 输出元组的第一个元素
print (tuple[1:3])        # 输出从第二个元素开始到第三个元素
print (tuple[2:])         # 输出从第三个元素开始的所有元素
print (tinytuple * 2)     # 输出两次元组
print (tuple + tinytuple) # 连接元组
```

### set集合

集合`（set）`是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员。创建一个空集合必须用` set()` 而不是` {}`，因为` {}` 是用来创建一个空字典。

```python
student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'}
print(student)   # 输出集合，重复的元素被自动去掉
 
# 成员测试
if 'Rose' in student :
    print('Rose 在集合中')
else :
    print('Rose 不在集合中')
  
# set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')
 
print(a) 
print(a - b)     # a 和 b 的差集
print(a | b)     # a 和 b 的并集 
print(a & b)     # a 和 b 的交集
print(a ^ b)     # a 和 b 中不同时存在的元素

# {'Mary', 'Jim', 'Rose', 'Jack', 'Tom'}
# Rose 在集合中
# {'b', 'a', 'c', 'r', 'd'}
# {'b', 'd', 'r'}
# {'l', 'r', 'a', 'c', 'z', 'm', 'b', 'd'}
# {'a', 'c'}
# {'l', 'r', 'z', 'm', 'b', 'd'}
```

### 字典

字典当中的元素是通过键来存取的，而不是通过偏移存取。字典是一种映射类型，字典用` { } `标识，它是一个无序的 **键(key) : 值(value)** 的集合。

```python
dict = {}
dict['one'] = "abcbcbcb"
dict[2]     = "dddddd"
tinydict = {'name': 'runoob','code':1, 'site': 'www.runoob.com'}
 
print (dict['one'])       # 输出键为 'one' 的值
print (dict[2])           # 输出键为 2 的值
print (tinydict)          # 输出完整的字典
print (tinydict.keys())   # 输出所有键
print (tinydict.values()) # 输出所有值
```

### 对象（object）

程序运行中，所有的数据都是存储到内存当中。对象就是内存中专门用来存储指定数据的一块区域。即，对象就是一个容器，存储数据用的。

对象的结构： 

```python
# 每个对象的结构
{
    id #(标识)，每个对象都有唯一的id，由解析器生成，对象一旦创建，id就不变了
    value#(对象的值)，某些对象可以修改
    type #(对象的类型)，决定这个对象的功能，对象一旦创建就变不了了
}
```

变量与对象的关系：

```python
# 3其实是一个类型为整型的对象，这句的意思其实是进行a与对象3进行绑定，可以通过a找到对象3.
# 这步语句会首先在内存中创建一个对象3，然后将a指向对象3的id
a = 3
```



## 运算符

`//`: 取整除 - 向下取接近除数的整数

`**=`:幂赋值运算符

+ 逻辑运算符,0和""都是假

  | 运算符 | 表达式  | 描述     |
  | ------ | ------- | -------- |
  | and    | x and y | 布尔"与" |
  | or     | x or y  | 布尔"或" |
  | not    | not x   | 布尔"非" |

+ 成员运算符

  `in`:如果在指定的序列中找到值返回 True，否则返回 False。

  `not in`:如果在指定的序列中没有找到值返回 True，否则返回 False。

+ 身份运算符

  `is`:is 是判断两个标识符是不是引用自一个对象

+ 三元运算符：`语句1 if 条件表达式 else 语句2`

## 条件语句

"判断条件"成立时（非零），则执行后面的语句，而执行内容可以多行，以缩进来区分表示同一范围。可以使用`pass`关键字占位

else 为可选语句，当需要在条件不成立时执行内容则可以执行相关语句.

```python
# if 基本用法
flag = False
name = 'luren'
if name == 'python':         # 判断变量否为'python'
    flag = True          # 条件成立时设置标志为真
    print 'welcome boss'    # 并输出欢迎信息
else:
    print name              # 条件不成立时输出变量名称
    
# elif用法 
num = 5     
if num == 3:            # 判断num的值
    print 'boss'        
elif num == 2:
    print 'user'
elif num == 1:
    print 'worker'
elif num < 0:           # 值小于零时输出
    print 'error'
else:
    print 'roadman'     # 条件均不成立时输出
```

由于 python 并不支持 switch 语句，所以多个条件判断，只能用 elif 来实现，如果判断需要多个条件需同时判断时，可以使用 or （或），表示两个条件有一个成立时判断条件成功；使用 and （与）时，表示只有两个条件同时成立的情况下，判断条件才成功。如果遇到很多中情况的时候，写很多的 **if/else** 不是很好维护，这时可以考虑用字典映射的方法替代：

```python
import os
def zero():
    return "zero"

def one():
    return "one"

def two():
    return "two"

def num2Str(arg):
    switcher={
        0:zero,
        1:one,
        2:two,
        3:lambda:"three"
    }
    func=switcher.get(arg,lambda:"nothing")
    return func()

if __name__ == '__main__':
    print num2Str(0)
```

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

### dir() 函数

内置函数,这个函数可以找到模块内定义的所有名称.

### 包

```python
sound/                          顶层包
      __init__.py               初始化 sound 包
      formats/                  文件格式转换子包
              __init__.py
              wavread.py
              wavwrite.py
              aiffread.py
              aiffwrite.py
              auread.py
              auwrite.py
              ...
      effects/                  声音效果子包
              __init__.py
              echo.py
              surround.py
              reverse.py
              ...
      filters/                  filters 子包
              __init__.py
              equalizer.py
              vocoder.py
              karaoke.py
```

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

