# Server 框架

## Express

下载:`npm install express --save`

### 请求处理

```javascript
// 1.引入express搭建一个最基本的服务器
const express = require('express');
// 2.使用express创建服务
var server = express();

// 3.设置路由
server.get("/",function(req,res){
        res.send("你好");
    });

// 4.监听端口号
server.listen(8080);
```

`app.get()`,该方法中有两个参数，第一个参数为请求路径，不分大小写，第二个为回调函数，请求路径可以使用正则匹配，`app.post()`也是同样的参数形式。

### 静态文件

`Express` 提供了内置的中间件 `express.static` 来设置静态文件如：图片， `CSS, JavaScript` 等，你可以使用 `express.static` 中间件来设置静态文件路径。

`app.use(express.static('public'));`

### 中间件

路由`get、post`这些东西，就是中间件，中间件讲究顺序，匹配上第一个之后，就不会往后匹配了。`next`函数才能够继续往后匹配。如果我的的`get、post`回调函数中，没有`next`参数，那么就匹配上第一个路由，就不会往下匹配了。如果想往下匹配的话，那么需要写`next()`.`app.use()`也是一个中间件。与`get、post`不同的是，他的网址不是精确匹配的。而是能够有小文件夹拓展的。

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

Koa构造函数new出来的app，可以看做是承载http服务的洋葱，接受请求，发出响应。接受的时候，都是一层一层处理，一层处理好之后交给下一层。但是一个洋葱是成环的，也就是最后处理请求的那一层，最先发出响应，这样可以保证：假设有3层，由外向内依次是A，B，C，如果B处理过请求之后，C对B做的处理做了非法的修改，并生成了响应结果返回，B层可以检查到，这是一种栈式思维。

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

### 路由

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

- `Koa-route`

  原生路由用起来不太方便，我们可以使用封装好的[`koa-route`](https://www.npmjs.com/package/koa-route)模块。

  ```javascript
  const route = require('koa-route');
  
  const about = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
  }; 
  
  // body用来返回接口
  const main = ctx => {
    ctx.response.body = 'Hello World';
  };
  
  // render 函数用来渲染页面
  router.get('/hello', async (ctx, next) => {
    await ctx.render('index', {
      title: 'Hello Koa 2!'
    })
  })
  
  app.use(route.get('/', main));
  app.use(route.get('/about', about));
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

- 静态资源

  如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。`koa-static`模块封装了这部分的请求。

  ```javascript
  const path = require('path');
  const serve = require('koa-static');
  
  const main = serve(path.join(__dirname));
  app.use(main);
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

### 中间件

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

+ **mongoose**的使用 ：

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



