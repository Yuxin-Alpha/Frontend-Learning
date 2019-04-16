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

