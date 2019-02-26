# Webpack

命令行参数形式

```shell
webpack ./main.js ./build.js
```

第一个参数是项目的入口文件，第二个参数是打包后的文件。

接着我们在`index.html`中通过`<script src="./build,js"></script>`引入这个打包过后的`js`文件。

webpack会自动根据配置从入口文件开始，对整个项目进行打包。

