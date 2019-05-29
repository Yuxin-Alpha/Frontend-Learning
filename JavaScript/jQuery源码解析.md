# jQuery源码解析

## 创建jQuery对象

```javascript
(function(root){
    var jQuery = function(){
        // 返回自身创建出来的实例对象
        return new jQuery.prototype.init()
    }
    jQuery.prototype = {
        init: function() {
            
        }
    }
    // 共享原型
    jQuery.prototype.init.prototype = jQuery.prototype;
    // 将jQuery对象暴露出去，并且在当前的环境中添加一个$变量，这样$()就相当于调用jQuery这个函数了
    root.$ = root.jQuery = jQuery
})(this)
```

