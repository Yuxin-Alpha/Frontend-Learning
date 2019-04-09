# NodeJs

node不是什么新奇的东西，与浏览器类似，也是JavaScript的一种运行环境时，所以JavaScript能用的东西，node也能用。Chrome的V8+libuv组成了node环境，即引擎与作者定义的模块。Node使用观察者模式。Node线程保持一个事件循环，每当任何任务完成后得到结果，它触发通知事件侦听函数来执行相应的事件。在Node 应用，任何异步函数接受回调作为最后的参数，并回调函数接受错误作为第一个参数。

## 全局对象

+ `process`（全局对象）
  + `process.env`是一个对象，因为每个系统的环境变量几乎都不一样，我们可以通过其属性名来获取具体的环境变量值
  + `process.argv`是一个数组，里面存放了命令行参数，第一个存放node的绝对路径，第二个存放文件的绝对路径

## 模块化

CommonJS：模块定义，模块暴露，模块引入，记住，一个文件一个模块，模块之间相互使用需要暴露以及引入。


```javascript
const str1 = 'hello';
const str2 = 'world';

module.exports = {
    str1,
    str2
}

// 引入
const demo = require('./demo.js')
let a = demo.str1;
```

## NPM 

- package.json
  - **name** - 包的名称
  - **version** - 包的版本
  - **description** - 包的描述
  - **homepage** - 包的网站主页
  - **author** - 包的作者
  - **contributors** - 包的贡献者的名称列表
  - **dependencies** - 依赖性列表。npm自动安装所有在node_module文件夹中的包提到的依赖关系。
  - **repository** - 包的存储库类型和URL
  - **main** - 包的入口点
  - **keywords** - 关键字

## assert

断言，用于测试，如果条件成立，什么事情都不会发生，否则报错，进程直接死掉。用在庞大的函数内部，或者参数检查。

```javascript
const assert = require('assert');

assert(5>3, 'aaa')
```

`assert.deepEqual(变量，预期值，msg)`用于判断两个值是否深度相等，比如数组和json

## path

用于处理文件与目录的路径

```javascript
const { normalize, join, resolve, parse, format } = require('path');
// 1. path.normalize(path):会规范化给定的 path，并解析 '..' 和 '.' 片段
console.log(normalize.('/usr///local/bin'));   //  /usr/local/bin
console.log(normalize.('/usr//local/../bin'));  //  /usr/bin

// 2. path.join([...paths]):使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径,也能解析 '..' 和 '.' 
console.log(join.('/usr', 'local', 'bin/'));   //  /usr/local/bin
console.log(join.('/usr', '../local', 'bin/'));  //  /usr/bin

// 3. path.resolve([...paths]):会把一个路径或路径片段的序列解析为一个绝对路径
console.log(resolve.('./'));   //  /Users/clement/Desktop 返回当前路径的绝对路径

// 4. path.parse(path):返回一个对象，对象的属性表示 path 的元素
//path.format() 会从一个对象返回一个路径字符串。 与 path.parse()方法相反
const filePath = '/usr/local/bin/test.html';
const ret = parse(filePath);
console.log(ret);
/*
{ root: '/',
   dir: '/usr/local/bin',
   base: 'test.html',
  ext: '.html',
  name: 'test' }
*/
console.log(format(ret));  // /usr/local/bin/test.html
```

`__dirname`、`__filename`总是返回文件的绝对路径
`process.cwd()`总是返回执行node命令所在的文件夹

## buffer

可以在 `TCP` 流或文件系统操作等场景中处理二进制数据流，因为数据的形式有许多种，有字符串，图片，视频等等，所以在读取文件内容的时候，默认是读取buffer二进制数据。

```javascript
// 1. Buffer.byteLength():返回一个字符串的实际字节长度。
console.log(Buffer.byteLength('test'));   // 4
console.log(Buffer.byteLength('中国'));  // 6

// 2. Buffer.from(array):通过一个八位字节的 array 创建一个新的 Buffer ，如果 array 不是一个数组，则抛出 TypeError 错误。
console.log(Buffer.from([1, 2, 3]));  // <Buffer 01 02 03>

// 3. Buffer.isBuffer(obj):如果 obj 是一个 Buffer 则返回 true ，否则返回 false
console.log(Buffer.isBuffer({ 'a': 1 }));  // false
console.log(Buffer.isBuffer(Buffer.from([1, 2, 3])));  // true
```

常用属性:

`buf.length` 长度
`buf.toString()` 转为字符串
`buf.fill()` 填充
`buf.equals()` 判断是否相等
`buf.indexOf()` 是否包含，如果包含返回位置值，不包含返回-1

## events

所有能触发事件的对象都是 `EventEmitter `类的实例。 这些对象开放了一个 `eventEmitter.on()` 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。`eventEmitter.on() `方法用于注册监听器，`eventEmitter.emit() `方法用于触发事件。

```javascript
const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}
const myEmitter = new CustomEvent();

myEmitter.on('error', err => {
    console.log(err);
})
// 当有一个错误的时候，会显示Error: This is an error!，然后显示具体错误内容。
myEmitter.emit('error', new Error('This is an error!'));
```

## http

抽象四个对象：

1. 服务器对象
2. 客户端对象
3. 请求对象—只读对象
4. 响应对象—只写对象

```javascript
const http = require('http');
// 生成服务器，req -> 请求对象　　 res -> 响应对象
let server = http.createServer((req, res) => {
    // 向前台返回‘666’
    res.write('666');
    // 告诉前台，没有东西了，可以滚了
    res.end()
    
});
// 开启服务，在3000端口，并监听
server.listen(3000);
```

`res.write()`中的参数只能是字符串，所以不能满足我们大部分的需求，这个时候我们需要借助fs模块读取某个文件，然后处理

## fs

通过 `require('fs') `使用该模块。 所有的方法都有异步和同步的形式。异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。

```javascript
const fs = require('fs');
// 读取hello.txt文件中存储的信息，并使用data(参数对象)保存
fs.readFile('hello.txt', (err, data) => {
    if (err) throw err;
    // data此时是二进制数据
    console.log(data);
    // 此时data转化为文本信息
    console.log(data.toString());
});
// 在world.txt中写入字符串'666'，如果写入的目标文件不存在，自动在当前目录创建该目标文件
fs.writeFile('world.txt', '666', (err) => {
    if (err) err;
});
```

- **fs模块与http模块简单结合**

  ```javascript
  const http = require('http');
  const fs = require('fs');
  let server = http.createServer((req, res) => {
      /* req.url -> '/index.html'
       * 如果index.html文件在某个别的目录下，比如'/www'
       * 那么我们所要读取的应该是'./www/index.html'
       */
      let file_name = './www' + req.url;
      fs.readFile(file_name, (err, data) => {
      	if (err) throw err;
      	res.write(data);
      	res.end()
  	});
  });
  server.listen(3000);
  ```

- **数据请求**

  对于后台来说，前端发送的请求不论是`form`表单还是`ajax`亦或者`jsonp`，处理方式都是一样，只跟请求方式有关。

  `Get`：数据在url地址之中；

  `Post`：数据不在url地址之中，而是在请求体中。

  对于url的解析(`get`方法)：

  ```javascript
  // url模块用来解析url
  const urlLib = require('url');
  // 注意，parse()函数中的true参数，是为了解析query属性
  let urlObj = urlLib.parse('http://www.baidu.com/index?name=zhangsan&age=18', true);
  console.log(urlObj);
  /* 我们可以看一下打印的信息
   * Url {
   *   protocol: 'http:',
   *   slashes: true,
   *   auth: null,
   *   host: 'www.baidu.com',
   *   port: null,
   *   hostname: 'www.baidu.com',
   *   hash: null,
   *   search: '?name=zhangsan&age=18',
   *   query: { name: 'zhangsan', age: '18' }, // 比较重要
   *   pathname: '/index', // 常用
   *   path: '/index?name=zhangsan&age=18',
   *   href: 'http://www.baidu.com/index?name=zhangsan&age=18' }
   */
  ```

  `post`方法：

  ```javascript
  const http = require('http');
  const urlLib = require('url');
  let server = http.createServer((req, res) => {
      let str = '';// 用于接受数据
      /* post很大，所以我们需要切成小段发送给前台
       * data事件——有一段数据到达(会发生很多次)
       * end事件——数据全部到达(只发生一次)
       */
      req.on('data', (data) => {
          str += data; 
      });
      req.on('end', () => {
          console.log(str);
      });
  });
  server.listen(3000);
  ```

## net

node对传输层TCP协议的实现

## 数据通信

1. ajax跨域

   ajax默认是不能跨域的，会被浏览器阻止，ajax通过浏览器来链接服务器。服务器一定会将响应返回给浏览器，这时候浏览器会根据同源策略判断ajax发出的请求和响应信息是否在同一个域名下，如果不是，浏览器会将服务器的响应丢掉

2. fetch

3. ajax2.0

4. Websocket