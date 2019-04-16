# Less

安装:

`npm install less --save`

使用`lessc`命令来编译

## 嵌套

```less
.container {
    padding: 0;
}
.container .article {
    background-color: red;
}

//可以转化为：
.container {
    padding: 0;
    .article {
        background-color: red;
    }
}
```

## 父类引用

```less
#header :after {
  content: " ";
  display: block;
  font-size: 0;
  height: 0;
  clear: both;
  visibility: hidden;
}
//转化为：
#header {
  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

## 变量

为了高可复用，less中有变量机制：

```less
@fontSize: 12px;
@bgColor: red;
@newColor: blue;

body {
    margin: 0;
    padding: 0;
}
.wrapper {
    background: lighten(@bgColor, 40%);
    .nav{
        font-size: @fontSize;
    }
    .content{
        font-size: @fontSize + 2px;
    }
    &:hover{
        background: @newColor
    }
}
```

## 混入

为了在css层面解决样式复用的问题，而不是一直在标签的class属性中添加同一个类名来复用。

```less
@fontSize: 12px;

.block(@fontSize) {
    font-size: @fontSize;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.wrapper{
    .nav{
        .block(@fontSize)
    }
}
```

> mixin的类可以不加()，但是编译后这个类会被编译出来

## extend

## loop

循环处理相似的样式

```less
.gen-cor(@n) when (@n > 0) {
    .gen-col(@n - 1);
    .col-@{n}{
        width: 1000px/12 * @n
    }
}
.gen-col(12)
```

## import

less中的import会将引入的所有文件合并到一个文件里面，不仅精简了代码，而且还可以减少http的请求数量。

> @import "./style/main.less"



