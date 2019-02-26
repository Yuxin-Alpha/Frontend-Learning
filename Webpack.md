# Webpack

命令行参数形式

```shell
webpack ./main.js ./build.js
```

第一个参数是项目的入口文件，第二个参数是打包后的文件。

接着我们在`index.html`中通过`<script src="./build,js"></script>`引入这个打包过后的`js`文件。

webpack会自动根据配置从入口文件开始，对整个项目进行打包。

## `config`

针对开发环境和生产环境，应该配置两套不同的`config`文件。

```javascript
// webpack.dev.config.js
module.exports = {
    // 入口，如果有一个入口，就默认从这里开始分析
    entry: {
        "main": "./main.js"
    },
    // 打包后的出口
    output: {
        filename: "./build.js"
    },
    // 文件监视改动，自动产出打包文件
    watch: true,
}
```

在`package.json`文件中修改`build`代表的指令

```json
{
    // ...
    "scripts": {
        "build": "webpack --config ./webpack.dev.config.js",
        "prod": "webpack --config ./webpack.prod.config.js"
    },
    // ...
}
```

## 样式文件打包

