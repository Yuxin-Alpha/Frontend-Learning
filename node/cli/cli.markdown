# 脚手架

提升前端研发效率，实现标准化，自动化

脚手架本质上，是一个操作系统的客户端。
我们一般使用脚手架的命令，都是这种形式:
`vue create my-test-app --force`

这种命令可以拆分成几个部分：

- 主命令: vue
- 辅命令: create
- 命令参数: my-test-app
- 选项: --force

我们下载完 Node 之后，在 node 源文件中有两个比较重要的目录，`bin`和`lib`
当我们执行 vue 操作的时候，操作系统会先到`bin`目录下去找到`vue`文件，其实这个 vue 文件只是一个软链接，这个软链接指向了`lib/node_modules`目录下找到 vue，`lib/node_modules`其实是一个全局 npm 包的管理目录，我们所有通过`npm install -g`下载下来的包都会存到这个目录下。在这个目录下，会有一个`@vue/cli`，这个就是 vue 实际的脚手架项目，在这个目录下有个`bin`目录，而里面的`vue.js`才是我们真正执行的脚本。之后，操作系统通过 node 命令去执行这个`vue.js`文件，解析我们上述的辅命令&命令参数&选项。

在 package.json 文件中有个 bin 选项，我们可以写成:

```json
{
  "bin": {
    "vue": "bin/vue.js"
  }
}
```

所以，我们之所以可以再控制台使用 vue 作为脚手架的主命令，是因为这里 vue-cli 在这里指定了这个规则。
在指向的 vue.js 上方，需要加一行代码，才能在执行 vue 的时候自动执行这个文件

```javascript
#!/usr/bin/env node

```

## 创建项目 + 通用代码

## git 操作

## 构建发布上线
