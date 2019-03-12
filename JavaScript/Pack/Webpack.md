# Webpack

为什么我们要使用webpack呢？

首先，在现在的开发环境中，面向对象编程是每个编程语言都在遵循的编程思想，前端开发人员所书写的Javascript也不例外，将业务大而化小，分离开来，分别管理和维护，是一个非常优秀的思路，在这个思路引导下，我们可能会将整个项目分成不同的部分，不同的部分又包含不同的业务（功能），有的时候我们甚至会在一个js文件中定义一个变量或者对象，也有可能是一个函数，来将一个复杂的业务分离成不同的文件，再将这些分离的文件进行整合来共同实现这个逻辑，如果其中某个文件逻辑出现问题，也方便开发人员迅速找到bug进行修改，也就是我们刚才所说的，便于后期维护和管理。但是，如果一个项目包含10个功能，按照这样的思路，对业务进行拆分，那么js文件的数量是可想而知的。如果我们在一个html文件中通过script标签一下引入数量这么庞大的js文件，有两个缺点：

1. 一个网页加载会非常缓慢，因为，每个文件都需要发一次请求，这样用户体验是非常糟糕的。
2. 我们知道，通过script标签引入文件的时候是动态加载的，也就是说，如果开发者不太细心，将某些文件的引入顺序写错了(其实在文件多的情况下，很容易犯这样的错误)，那么就会出现还没有引入对应的文件，而引入的上一个文件又使用了这个文件这样的现象，非常可惜，浏览器会残忍地报错。

为了解决上面的问题，有些人可能会想，借助js的模块化规范来将这些次优先级文件暴露，再在一个主要的js文件中引入，最后通过script标签引入这一个主要的js文件不就行了。

但是，现实总是骨感的，浏览器并不能解析这些模块化的规范，为了解决这个问题，webpack诞生了。

其实webpack就是一个模块打包工具。不仅能对js文件进行打包，还能对css，图片等文件进行打包，是一个非常优秀的前端工程工具。

## 模块化

在介绍webpack的使用法则之前，我们先要了解js中各种模块化规范：

+ ES module

  ```javascript
  // 导入
  import MyModule from './my-module.js';
  import { NamedExport } from './other-module.js';
  ```

  > import 导入的时候是静态导入的，所以开发者并不用关心文件引入的顺序，只要将需要的引入即可

  ```javascript
  // 具名导出
  export var Count = 5;
  export function Multiply(a, b) {
    return a * b;
  }
  
  // 默认导出
  export default {
    // Some data...
  }
  ```

+ CommonJs

  在浏览器之外，我们可以使用CommonJs导入或导出模块（最常见的就是node）

  ```javascript
  // 导入
  var $ = require("jquery");
  var myModule = require("my-module");
  
  // 导出
  module.exports = {
      // ...
  }
  ```

  

## 基本使用

1. `npm install -g webpack webpack-cli `

2. 执行`webpack filename`进行编译

   + `webpack filename index.js --mode development` 使用开发模式进行编译
   + `webpack filename index.js --mode production`使用生产模式进行编译

   会在当前目录下生成一个`dist`目录，里面有编译过后的文件

> 如果是局部引入，需要先执行`npm init -y`来生成package,json文件



+ 打包的同时生成`html`文件：

  1. `npm install -D html-webpack-plugin`下载插件

  2. 在项目目录下新建`webpack.config.js`文件

  ```javascript
  // webpack.config.js
  const HtmlWebpackPlugin = require("html-webpack-plugin")
  module.exports = {
      entry: "./src/index.js"
      plugins: [
      	new HtmlWebpackPlugin()
      ]
  }
  ```

## webpack 配置项目

1. mode: 类型　"production" | "development" | "none"

2. entry: 入口文件路径

3. output: 出口文件

4. module: 模块

5. resolve: 解决重命名冲突

6. performance: 性能相关的东西

   ...

## 入口（entry）

在package.json中的script属性中，可以给build属性赋值:

`webpack --mode development`来规定好打包编译的环境



配置webpack.config.js文件中的entry属性，可以规定打包的入口文件

如果有多个文件:

```javascript
// webpack.config.js下
module.exports = {
    entry: {
        register: "./src/register.js",
        home: "./src/home.js",
        detail: "./src/detail.js"
    }
}
```

## 出口（output）

定义打包后的文件:

```javascript
// webpack.config.js下
module.exports = {
    entry: "./src/register.js",
    output: {
        filename: "bundle.js"
    }
}
```

为了解决浏览器缓存的问题，可以在出口属性配制哈希值:

```javascript
// webpack.config.js下
const path = require('path')
module.exports = {
    entry: "./src/register.js",
    output: {
        // 打包编译后文文件名
        filename: "[hash:6]bundle.js",
        // 打包后的文件路径
        path: path.resolve(__dirname, 'public')
    }
}
```

## 装载（Loaders）

```javascript
module.exports = {
    entry: "./src/register.js",
    module: {
        rules: [
            { test: /.css$/, use: ["style-loader", "css-loader"] }
        ]
    },
    output: {
        // 打包编译后文文件名
        filename: "[hash:6]bundle.js",
        // 打包后的文件路径
        path: path.join(__dirname, 'release')
    }
}
```

