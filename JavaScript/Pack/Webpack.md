# Webpack

为什么我们要使用webpack呢？

首先，在现在的开发环境中，面向对象编程是每个编程语言都在遵循的编程思想，前端开发人员所书写的`Javascript`也不例外，将业务大而化小，分离开来，分别管理和维护，是一个非常优秀的思路，在这个思路引导下，我们可能会将整个项目分成不同的部分，不同的部分又包含不同的业务（功能），有的时候我们甚至会在一个js文件中定义一个变量或者对象，也有可能是一个函数，来将一个复杂的业务分离成不同的文件，再将这些分离的文件进行整合来共同实现这个逻辑，如果其中某个文件逻辑出现问题，也方便开发人员迅速找到bug进行修改，也就是我们刚才所说的，便于后期维护和管理。但是，如果一个项目包含10个功能，按照这样的思路，对业务进行拆分，那么js文件的数量是可想而知的。如果我们在一个html文件中通过script标签一下引入数量这么庞大的js文件，有两个缺点：

1. 一个网页加载会非常缓慢，因为，每个文件都需要发一次请求，这样用户体验是非常糟糕的。
2. 我们知道，通过`script`标签引入文件的时候是动态加载的，也就是说，如果开发者不太细心，将某些文件的引入顺序写错了(其实在文件多的情况下，很容易犯这样的错误)，那么就会出现还没有引入对应的文件，而引入的上一个文件又使用了这个文件这样的现象，非常可惜，浏览器会残忍地报错。

为了解决上面的问题，有些人可能会想，借助js的模块化规范来将这些次优先级文件暴露，再在一个主要的js文件中引入，最后通过script标签引入这一个主要的js文件不就行了。

但是，现实总是骨感的，浏览器并不能解析这些模块化的规范，为了解决这个问题，webpack诞生了。

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

就是一个打包的方案，告诉webpack对于特定的文件应该如何打包，因为webpack不能识别非js结尾的文件，所以需要下载特定的loader对这些文件进行解析，并且在module属性中配置后，webpack才能将这些特殊的文件正确打包。`use`的属性可以使用数组，每一项传入

```javascript
module.exports = {
    entry: "./src/register.js",
    module: {
        rules: [
            { test: /.css$/, use: ["style-loader", "css-loader"] },
            { test: /\/jpg$/, use: {
                loader: 'file-loader'
            } }
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

静态资源打包:

+ 图片：

  ```javascript
  module.exports = {
      entry: "./src/register.js",
      module: {
          rules: [
              { 
                  test: /\.jpg$/, 
                  use: {
                      loader: 'url-loader',
                      options: {
                          // 按照原来文件的名字拼上哈希值进行打包
                          name: '[name]_[hash].[ext]' ,
                          // 将文件打包后的放在dist目录下的images目录下
                          outputPath: 'images/',
                          // 低于10k大小的图片用url-loader进行打包，否则使用file-loader
                          limit: 10240
                      }
                  } 
              }
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

  > 使用url-loader可以完成file-loader实现的所有功能，但是，在打包图片的时候，url-loader会将图片转化成一个base64编码的代码。

  为了针对不同大小的图片使用不同的loader，可以配置limit属性。

+ 样式文件

  ```javascript
  module.exports = {
      entry: "./src/register.js",
      module: {
          rules: [{
              test: /\.css$/,
              // loader的执行顺序是从右到左
              use: ['style-loader', 'css-loader']
          }]
      },
      output: {
          // 打包编译后文文件名
          filename: "[hash:6]bundle.js",
          // 打包后的文件路径
          path: path.join(__dirname, 'release')
      }
  }
  ```

  `css-loader`会将所有css文件进行分析，合并成一段css代码，然后传递给style-loader，style-loader再根据传递过来的内容解析，然后挂载到页面head区的style标签内部。

  postcss-loader可以将css3代码自动加入厂商前缀。

##  插件（Plugins）

plugin就是在webpack打包进行到某一时刻的时候，帮你做一些事情，举个栗子：

> npm install html-webpack-plugin -D`

首先要下载对应的插件，然后在配置文件中引入，然后配置plugins属性，将引入的插件实例化，这个插件会在打包结束后自动生成一个html文件，并把打包生成的js自动引入到html文件中。

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
    plugins: [new HtmlWebpackPlugin({
        // 一定要配置模板，否则页面是空的
        template: 'src/index.html'
    })]
};
```

打包之前删除上一次打包的目录——clean-webpack-plugin

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
    plugins: [new HtmlWebpackPlugin({
        // 一定要配置模板，否则页面是空的
        template: 'src/index.html'
        // 在打包之前先删除dist目录
    }), new CleanWebpackPlugin('dist') ]
};
```

## Sourcemap

资源映射工具，将打包后的文件中的代码正确映射到源代码，方便快速查找错误

修改`devtool: ' source-map '`即可

## WebpackDevServer

`npm install webpack-dev-server`

在配置文件中配置：

```javascript
module.exports = {
    // ...
    devServer: {
        port: 8080
        contentBase: './dist',
        open: true
    }
}
```

## Babel

打包并不能es6的语法转义，所以为了兼容不同的浏览器，需要使用babel进行版本降低。

`npm install --save-dev babel-loader @babel/core`

```javascript
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_moudles/,
            loader: "babel-loader"
        }]
    }
}
```

> babel-loader只是将babel与webpack进行打通，并不会将js文件中的es6语法转化成es5，所以需要通过别的模块对js的高级语法进行真正的处理

`npm install @babel/preset-env --save-dev`

```javascript
// 配置
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_moudles/,
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }]
    }
}
```

这个时候还没完，因为这里只是将es6的语法翻译成es5，而es6中的对象或者api比如Promise，数组的map函数等等，在浏览器中还是不存在的，所以我们要继续引入一个模块——polyfill

`npm install --save @babel/polyfill`

然后在需要的文件中进行引入:

```javascript
// index.js文件中
import "@babel/polyfill";
```

