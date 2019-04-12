# DOM

专门操作网页内容的API标准。Document对象由浏览器自动创建。

DOM针对的是我们平时编码的文档对象，也就是整个`HTML`文件，`DOM`定义了一个`Node`接口，其中每个元素都可以看做是一个节点，这个节点接口提供了许多属性和方法，比如，`nodeName`就是当前节点的标签名，不同的节点有不同的`nodeType`属性，每个节点都有一个`childNodes`属性,这个属性是一个类数组对象。`DOM`树可以被看成由一系列双向指针连接起来的B+树。树型结构最适合保存上下级关系，且可无限延伸

## 节点类型

网页每项内容的(元素，属性，文本)都是DOM树上的一个节点对象。节点类型用来鉴别不同的节点。

| Node             | Desc         | NodeType |
| ---------------- | ------------ | -------- |
| Element          | 元素         | 1        |
| Attr             | 元素属性     | 2        |
| Text             | 纯文本内容   | 3        |
| CDATASection     | XML文档      | 4        |
| Comment          | 注释         | 8        |
| Document         | 整个文档对象 | 9        |
| DocumentType     |              | 10       |
| DocumentFragment |              | 11       |

`nodeName`：用来进一步区分元素的名称。

> NodeList是动态的，只要文档结构发生了改变，他们都会得到更新。也正因为如此，操作DOM的代价很高，对性能的影响很大，因为，每次访问NodeList都会运行一次查询

## 查询

### 直接获得

+ `html：document.documentElement`
+ `body：document.body`
+ `head：document.head`

### 节点间关系查找

+ 父子关系
  1. `element.parentNode`  获得element的父节点
  2. `element.childNodes`  获得element的所有<b>直接</b>子节点，返回一个类数组对象
+ 兄弟关系
  1. `element.previousSibling`  获得element的前一个兄弟节点
  2. `element.nextSibling`  获得element的后一个兄弟节点

> 这种查找方法，不能忽略空格和tab

### 元素树

- 父子关系
  1. `element.parentElementNode`  获得element的父元素
  2. `element.children`  获得element的所有<b>直接</b>子元素，返回一个类数组对象
- 兄弟关系
  1. `element.previousElementSibling`  获得element的前一个兄弟元素
  2. `element.nextElementSibling`  获得element的后一个兄弟元素

- querySelector()`接受一个CSS选择符，返回匹配到的第一个元素，如果没有就返回`null`。
- `querySelectorAll()`的参数与上面的函数一样，但是返回值是一个NodeList。如果找不到，NodeList就是空的。

```javascript
let $ = function (...args) {
    return docunment.querySeletorAll(...args);
}

// 或者,因为$是全局的变量，所以需要绑定this
let $ = document.querySeletorAll.bind(document)
```





## 修改

## 添加

## 删除

## 事件绑定