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

## 文件打包

`npm i css-loader style-loader file-loader url-loader -D`

.然后在config中进行配置

```javascript
// webpack.dev.config.js
module.exports = {
    // some code
    // 文件监视改动，自动产出打包文件
    watch: true,
    // 声明模块
    // 包含各个loader，主要处理css，img，json等非js文件
    module: {
        loaders: [
            {
                // 遇到后缀为.css的文件，webpack先用css-loader加载器去解析这个文件
                // 计算完CSS之后会使用style-loader生成一个内容为最终解析完的CSS代码的style标签
            	test: /\.css$/,
            	loader: 'style-loader!css-loader' 
        	},  
            {
                // 对图片的处理
                test: /\.(jpg|png|jpeg|gif|svg)$/,
                loader: 'url-loader?limit=40000'
            },
            {
                // 对less文件的处理
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }
        ]
    }
}
```

## dist文件配置

```javascript
// webpack.dev.config.js
var path = require("path")
module.exports = {
    // 入口，如果有一个入口，就默认从这里开始分析
    entry: {
        "main": "./src/main.js"
    },
    // 打包后的出口
    output: {
        // 将相对路径转为绝对路径
        path: path.resolve('./dist')
        filename: "build.js"
    },
    // 文件监视改动，自动产出打包文件
    watch: true,
}
```

自动转移`index.html`:

`npm i html-webpack-plugin`

```javascript
// webpack.dev.config.js
var path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // ...
    watch: true,
    plugin:[
        // 插件的执行顺序与元素索引有关
        new HtmlWebpackPlugin({
            template: './src/index.html' // 给出参照物
        })
    ]
}
```

