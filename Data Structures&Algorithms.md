**题目1：**实现一个函数，将一个字符串中的空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。

```javascript
function replaceSpace(str){
    return str.replace(/ /g, '%20');
}
```

> 正则表达式需要再熟悉一下

