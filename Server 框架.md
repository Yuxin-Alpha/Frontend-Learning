# Server 框架

## Express

下载:`npm install express --save`

### 正则表达式

#### 创建方式

```javascript
var reg = /pattern/flags
// 字面量创建方式
var reg = new RegExp(pattern,flags);
//实例创建方式
// pattern:正则表达式  
// flags:标识(修饰符)
// 1. i 忽略大小写匹配
// 2. m 多行匹配，即在到达一行文本末尾时还会继续寻常下一行中是否与正则匹配的项
// 3. g 全局匹配 模式应用于所有字符串，而非在找到第一个匹配项时停止
```

> 1. 字面量创建方式不能进行字符串拼接，实例创建方式可以 
> 2. 字面量创建方式特殊含义的字符不需要转义，实例创建方式需要转义

#### 元字符

+ 特殊含义

  ```javascript
  // \d : 0-9之间的任意一个数字  \d只占一个位置
  // \w : 数字，字母 ，下划线 0-9 a-z A-Z _
  // \s : 空格或者空白等
  //  . : 除了\n之外的任意一个字符
  //  \ : 转义字符
  //  | : 或者
  // () : 分组
  // \n : 匹配换行符
  // \b : 匹配边界 字符串的开头和结尾 空格的两边都是边界 => 不占用字符串位数
  // ^ : 限定开始位置 => 本身不占位置
  // $ : 限定结束位置 => 本身不占位置
  // [a-z] : 任意字母 []中的表示任意一个都可以
  // [^a-z] : 非字母 []中^代表除了
  // [abc] : abc三个字母中的任何一个 [^abc]除了这三个字母中的任何一个字符
  ```

+ 量词

  ```javascript
  // * : 0到多个
  // + : 1到多个
  // ? : 0次或1次 可有可无
  // {n} : 正好n次；
  // {n,} : n到多次
  // {n,m} : n次到m次
  ```

### 中间件

Express使用中间件Web请求一个一个处理，并通过其中一个中间件返回



### 路由

下面是一个简单的路由页面代码。

```javascript
const express = require("express")
// 调用其中的Router函数，这个函数返回一个路由对象
const router = express.Router()
// 拿到数据模型
const User = require("../../models/users/User")
// get方法测试接口 
router.get('/test', (req, res) => {
  res.json({msg: "api works"})
})
module.exports = router;
```

这里没有什么复杂的代码，这个时候我们需要在服务器上使用这个被暴露的路由对象，使他在服务器上生效。

```javascript
// ...
// 引入users接口配置好的路由对象
const users = require("./routes/api/users");
const bodyParser = require("body-parser");
// ...
// 在服务器上使用这两个中间件来解析请求。
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// 使用这个接口对象，其对应的url是localhost:5000/api/users
// 这个时候我们访问localhost:5000/api/users/test就可以接受到返回的数据
app.use("/api/users", users);
// ...
```

上部分代码中，我们省略了包引入，服务器生成，数据库链接，以及服务器监听的代码。

### 静态文件

```javascript
// __dirname 表示当前文件所在的目录的绝对路径
// __filename 表示当前文件的绝对路径
```

`Express` 提供了内置的中间件 `express.static` 来设置静态文件如：图片， `CSS, JavaScript` 等，你可以使用 `express.static` 中间件来设置静态文件路径。

`app.use(express.static('public'));`

## Koa

`Koa`框架的node环境必须是7.6以上的.

`npm install -g koa-generator`全局安装脚手架工具

`koa2 -e koa2-learn`使用koa2指令新建一个名字为`koa2-learn`的项目，-e表示使用ejs模板引擎。

然后进入`koa2-learn`目录下，执行`npm run dev`，项目会采用nodemon指令执行，也就是热更新加载。

### async、await

```javascript
const router = require('koa-router')()
// async放在箭头函数前，声明这个函数是一个内部函数，只有被async修饰的函数，其内部才可以使用await修饰符(但是await不是必须有的)
router.get('/', async (ctx, next) => {
  // A,B,C是三个异步的方法（Promise对象），a表示我要拿到A最后执行完返回的东西，在a没有拿到A事件返回的结果之前，代码不会向下执行，剩下两个同理
  const a = await A;
  const b = await B;
  const c = await C;
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})
```



### 基础

- 架设`HTTP`服务

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  app.listen(3000);
  ```

- `Context`对象

  表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。Koa的Context将node的request对象和response对象封装起来，这个对象是属于app的全局对象，不管是什么中间件都可以拿到这个对象。每个请求都会创建一个ctx，并作为接收器引用，通过加工这个对象上的属性，就可以控制返回给用户的内容。

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  
  const main = ctx => {
    ctx.response.body = 'Hello World';
  };
  
  app.use(main);
  app.listen(3000);
  ```

  上面代码中，`main`函数用来设置`ctx.response.body`。然后，使用`app.use`方法加载`main`函数。`ctx.response`代表 HTTP Response。同样地，`ctx.request`代表 HTTP Request。

  运行这个 demo。

- `HTTP Response` 类型

  Koa 默认的返回类型是`text/plain`，如果想返回其他类型的内容，可以先用`ctx.request.accepts`判断一下，客户端希望接受什么数据（根据 HTTP Request 的`Accept`字段），然后使用`ctx.response.type`指定返回类型。

  ```javascript
  const main = ctx => {
    if (ctx.request.accepts('xml')) {
      ctx.response.type = 'xml';
      ctx.response.body = '<data>Hello World</data>';
    } else if (ctx.request.accepts('json')) {
      ctx.response.type = 'json';
      ctx.response.body = { data: 'Hello World' };
    } else if (ctx.request.accepts('html')) {
      ctx.response.type = 'html';
      ctx.response.body = '<p>Hello World</p>';
    } else {
      ctx.response.type = 'text';
      ctx.response.body = 'Hello World';
    }
  };
  ```

- 渲染模板

  返回给用户的网页往往都写成模板文件。我们可以让 Koa 先读取模板文件，然后将这个模板返回给用户。

  ```javascript
  const fs = require('fs');
  const main = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./demos/template.html');
  };
  ```

### 中间件

Koa构造函数new出来的app，可以看做是承载http服务的洋葱，接受请求，发出响应。接受的时候，都是一层一层处理，一层处理好之后交给下一层。但是一个洋葱是成环的，也就是最后处理请求的那一层，最先发出响应，这样可以保证：假设有3层，由外向内依次是A，B，C，如果B处理过请求之后，C对B做的处理做了非法的修改，并生成了响应结果返回，B层可以检查到，这是一种栈式思维。当我们调用`app.use()`时，会在内部形成一个中间件数组，框架内部会将执行下一个中间件的操作放在next方法的内部，执行这个方法后，就会执行下一个中间件

我们手写一个简单的中间件：

```javascript
function pv (ctx) {
    global.console.log(cstx.path)
}
module.exports = function () {
    return async function (ctx, next) {
        // 表示当前pv这个中间件运行完毕后交给下一个中间件处理
        pv(ctx)
        await next()
    }
}
```

为什么这么写呢，我们可以发现，koa实例是通过use()这个函数来使用引入的中间件的，所以我们在自己手写中间件的过程中需要导出一个函数。

### koa-router

- 原生路由

  网站一般都有多个页面。通过`ctx.request.path`可以获取用户请求的路径，由此实现简单的路由。

  ```javascript
  const main = ctx => {
    if (ctx.request.path !== '/') {
      ctx.response.type = 'html';
      ctx.response.body = '<a href="/">Index Page</a>';
    } else {
      ctx.response.body = 'Hello World';
    }
  };
  ```

- `Koa-router`

  原生路由用起来不太方便，我们可以使用封装好的[`koa-route`](https://www.npmjs.com/package/koa-route)模块。

  ```javascript
  var Koa = require('koa');
  var Router = require('koa-router');
  
  var app = new Koa();
  var router = new Router();
  
  router.get('/', (ctx, next) => {
    // ctx.router available
  });
  
  app
    .use(router.routes())
    .use(router.allowedMethods());
  ```

  根路径`/`的处理函数是`main`，`/about`路径的处理函数是`about`。

- 使用prefix函数添加前缀来分模块编写接口：

  ```javascript
  const router = require('koa-router')()
  
  router.prefix('/users')
  // 此时的'/'不是指页面的根路径，而是'/users/'
  router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
  })
  ```

- 重定向

  有些场合，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。`ctx.response.redirect()`方法可以发出一个302跳转，将用户导向另一个路由。

  ```javascript
  const redirect = ctx => {
    ctx.response.redirect('/');
    ctx.response.body = '<a href="/">Index Page</a>';
  };
  
  app.use(route.get('/redirect', redirect));
  ```

### koa-static

对于静态服务文件服务，我们使用这个中间件

```javascript
const Koa = require('koa');
const app = new Koa();
// root指的是静态文件存放的路径
// 例如 (__direname + '/static/html', {extension: ['html']})
app.use(require('koa-static')(root, opts));
```

### mongoose

1. `npm install mongoose --save`

2. 在服务器文件夹下新建`/dbs/config.js`,在文件中配置数据库的位置

   ```javascript
   // config.js文件夹下，地址中的dbs就是目标数据库的库名
   module.exports = {
       dbs: 'mongodb://127.0.0.1:27017/dbs'
   }
   ```

3. 在`app.js`中引入相应的包，为了使koa提供的http服务可以使用数据库服务，我们需要将http服务连接到数据库服务上

   ```javascript
   // app.js文件中
   // ...省略部分中间件的引入
   const mongoose = require('mongoose')
   const dbConfig = require('./dbs/config')
   // 使用mongoose的connect方法连接到指定的数据库，如果不存在就创建一个。
   mongoose.connect(dbConfig.dbs, {
     useNewUrlParser: true
   })
   ```

   当然，我们这里`dbConfig`配置的是本地的数据库，如果数据库服务在其他的服务器上，我们可以将其配置成：`mongoose.connect('mongodb://username:password@host:port/database?options...')`

4. 新建`dbs/models`目录，其中存放各种集合的对应模型

   ```javascript
   // 在models文件夹下新建一个person.js文件
   const mongoose = require('mongoose')
   // 实例化一个范式，范式的模子由传入的对象决定，相当于
   let personSchema = new mongoose.Schema({
       name: String,
       age: Number
   })
   // 使用mongoose提供的model方法，按照范式的模子打造一个名字叫做Person的数据模型
   module.exports = mongoose.model('Person', personSchema)
   ```

5. 在路由文件中，可以指定接口来操纵数据库：

   ```javascript
   // 在router/users.js 文件夹中
   const router = require('koa-router')()
   const Person = require('../dbs/models/person')
   // 访问接口/users/addPerson对数据库的数据进行添加
   router.post('/addPerson', async function(ctx) {
     const person = new Person({
       name: ctx.request.body.name,
       age: ctx.request.body.age
     })
     let code = 101
     try {
       await person.save()
     } catch (e) {
       code = 404
     }
     ctx.body = {
       code
     }
   })
   // 访问接口/users/getPerson对数据库的数据进行查找
   router.post('/getPerson', async function(ctx) {
     const result = await Person.findOne({
       name: ctx.request.body.name
     })
     const results = await Person.find({
       name:ctx.request.body.name
     })
     ctx.body = {
       code: 0,
       result,
       results
     }
   })
   // 访问接口/users/updatePerson对数据库的数据进行修改
   router.post('/updatePerson', async function(ctx) {
     const result = await Person.where({
       name: ctx.request.body.name
     }).update({
       age: ctx.request.body.age
     })
     ctx.body = {
       code: 666,
       result
     }
   })
   // 访问接口/users/removePerson对数据库的数据进行删除，但是不要这么做
   router.post('/removePerson', async function(ctx) {
     const result = await Person.where({
       name: ctx.request.body.name
     }).remove()
     ctx.body = {
       code: 0
     }
   })
   ```


### 错误处理

- 500

  如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回500状态码。Koa 提供了`ctx.throw()`方法，用来抛出错误，`ctx.throw(500)`就是抛出500错误。

  ```javascript
  const main = ctx => {
    ctx.throw(500);
  };
  ```

- 404

  如果将`ctx.response.status`设置成404，就相当于`ctx.throw(404)`，返回404错误。

  ```javascript
  const main = ctx => {
    ctx.response.status = 404;
    ctx.response.body = 'Page Not Found';
  };
  ```

- 错误处理中间件

  为了方便处理错误，最好使用`try...catch`将其捕获。但是，为每个中间件都写`try...catch`太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

  ```javascript
  const handler = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.response.status = err.statusCode || err.status || 500;
      ctx.response.body = {
        message: err.message
      };
    }
  };
  
  const main = ctx => {
    ctx.throw(500);
  };
  
  app.use(handler);
  app.use(main);
  ```

- error事件的监听

  运行过程中一旦出错，Koa 会触发一个`error`事件。监听这个事件，也可以处理错误。

  ```javascript
  const main = ctx => {
    ctx.throw(500);
  };
  
  app.on('error', (err, ctx) =>
    console.error('server error', err);
  );
  ```

### Web APP

- `ctx.cookies`用来读写 Cookie。

  ```javascript
  const main = function(ctx) {
    const n = Number(ctx.cookies.get('view') || 0) + 1;
    ctx.cookies.set('view', n);
    ctx.response.body = n + ' views';
  }
  ```

- 表单

  Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。[`koa-body`](https://www.npmjs.com/package/koa-body)模块可以用来从 POST 请求的数据体里面提取键值对。

  ```javascript
  const koaBody = require('koa-body');
  
  const main = async function(ctx) {
    const body = ctx.request.body;
    if (!body.name) ctx.throw(400, '.name required');
    ctx.body = { name: body.name };
  };
  
  app.use(koaBody());
  ```

- 文件上传

  [`koa-body`](https://www.npmjs.com/package/koa-body)模块还可以用来处理文件上传。

  ```javascript
  const os = require('os');
  const path = require('path');
  const koaBody = require('koa-body');
  
  const main = async function(ctx) {
    const tmpdir = os.tmpdir();
    const filePaths = [];
    const files = ctx.request.body.files || {};
  
    for (let key in files) {
      const file = files[key];
      const filePath = path.join(tmpdir, file.name);
      const reader = fs.createReadStream(file.path);
      const writer = fs.createWriteStream(filePath);
      reader.pipe(writer);
      filePaths.push(filePath);
    }
  
    ctx.body = filePaths;
  };
  
  app.use(koaBody({ multipart: true }));
  ```

### 源码分析

Koa主要的代码在`/lib`文件夹下，一共有`Request.js`,`Response.js`,`Context.js`,`Application.js`四个文件

```javascript
// Application.js
 module.exports = class Application extends Emitter {
  constructor() {
    super();
    // 定义下面的属性
    this.proxy = false;
    // 管理中间件的数组
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    // 创造三个对象
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  // ....
}
```

这个文件暴露一个对象出去，当我们调用一个构造函数的时候，会初始化属性和方法。

实例的app通过`use()`来调用中间件

```javascript
 //中间件使用的use方法
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // 为了加载koa1.x版本的中间件
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }
```

这个方法维持一个middleware数组，如果有中间件加载，就push进去



## 后端工程注意事项

1. 数据库里的数据不要直接删掉，如果有此业务，添加一个标记字段，对其进行筛选返回，也就是我们常说的假删

