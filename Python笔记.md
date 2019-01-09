#  Python笔记

注释

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

不需要声明，直接进行赋值，并使用，但是必须赋值后使用

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

截取字符串补充:

```python
# 0、a,b为参数。从字符串指针为a的地方开始截取字符，到b的前一个位置（因为不包含b）
var1 = "hello world";
print(var1[a: b]);

# 1、如果a,b均不填写，默认取全部字符。即，下面这两个打印结果是一样的
print(var1[: ]);  # hello world
print(var1);      # hello world

# 2、如果a填写，b不填写（或填写的值大于指针下标），默认从a开始截取，至字符串最后一个位置
print(var1[3: ]); # lo world

# 3、如果a不填写， b填写，默认从0位置开始截取，至b的前一个位置
print(var1[: 8]); # hello wo

# 4、如果a为负数，默认从尾部某一位置，开始向后截取
print(var1[-2: ]); # ld
```

### 列表

列表中元素的类型可以不相同，它支持数字，字符串甚至可以包含列表（所谓嵌套）.和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表.索引值以 0 为开始值，-1 为从末尾的开始位置。

```python
list = [ 'abcd', 786 , 2.23, 'runoob', 70.2 ]
tinylist = [123, 'runoob']
 
print (list)            # 输出完整列表
print (list[0])         # 输出列表第一个元素
print (list[1:3])       # 从第二个开始输出到第三个元素
print (list[2:])        # 输出从第三个元素开始的所有元素
print (tinylist * 2)    # 输出两次列表
print (list + tinylist) # 连接列表

len([1, 2, 3]) # 3
[1, 2, 3] + [4, 5, 6] # [1, 2, 3, 4, 5, 6]

# 删除元素
list = ['Google', 'Runoob', 1997, 2000] 
print ("原始列表 : ", list)
del list[2]
print ("删除第三个元素 : ", list)

```

### 元组

元组（tuple）与列表类似，不同之处在于元组的元素<b>不能修改</b>。元组写在小括号 () 里，元素之间用逗号隔开。

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

集合（set）是由一个或数个形态各异的大小整体组成的，构成集合的事物或对象称作元素或是成员。创建一个空集合必须用` set()` 而不是` { }`，因为` { }` 是用来创建一个空字典。

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

格式化字符串：

