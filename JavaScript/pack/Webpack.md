# Webpack

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
        path: path.join(__dirname, 'release')
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

