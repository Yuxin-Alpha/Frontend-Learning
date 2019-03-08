# Webpack

## 基本使用

1. `npm install -g webpack webpack-cli `

2. 执行`webpack filename`进行编译

   + `webpack filename index.js --mode development` 使用开发模式进行编译
   + `webpack filename index.js --mode production`　使用生产模式进行编译

   会在当前目录下生成一个`dist`目录，里面有编译过后的文件

> 如果是局部引入，需要先执行`npm init -y`来生成package,json文件



+ 打包的同时生成html文件：

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

