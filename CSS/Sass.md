# Sass

sass文件的后缀有两种，一个是.sass，另一个是.scss，区别就是scss结尾的文件是有大括号和分号的。

`npm install -g sass`全局下载sass编译环境

监听sass文件：`sass --watch input.scss input.css`当input.scss文件内容改变，input.css文件会热更新

监听目录：`sass --watch sass:dist`这样sass目录下所有的scss文件都会热编译到dist目录下产生相应的css文件以及map文件。

## 语法

+ 变量：

  ```scss
  $primary-color: #e5e788;
  
  body{
      color: $primary-color;
  }
  ```

+ 嵌套：

  ```scss
  nav{
      ul{
          margin: 0;
          padding: 0;
      }
  }
  ```

+ 部分文件与导入

  ```scss
  // _partial.scss中
  $primary-color: #e5e788;
  ```

  ```scss
  // input.scss文件中
  @import "./partial.scss"
  a {
  	color: $primary-color       
  }
  ```

+ 父级选择器引用

  ```scss
  a {
  	color: $primary-color;
      &:hover{
          color: #ccc;
      }
  }
  ```

+ 

