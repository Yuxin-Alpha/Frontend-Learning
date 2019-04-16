# Less

安装:

`npm install less --save`

使用lessc命令来编译

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

