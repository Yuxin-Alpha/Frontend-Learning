## SassScript

+ sass中的变量支持作用域，即，每个大括号是一个作用域，嵌套规则内的变量只能在这个作用域里面使用。局部变量可以通过 `!global` 声明。

+ 数据类型：

```scss
/**
 * 数字 1, 2, 13, 10px
 * 字符串 "foo", 'bar', baz
 * 颜色 blue, #04a3f9, rgba(255,0,0,0.5)
 * 布尔型 true, false
 * null
 * list 1.5em 1em 0 2em, Helvetica, Arial, sans-serif
 * map (key1: value1, key2: value2)
*/
```

+ 如果需要使用变量，同时又要确保 / 不做除法运算而是完整地编译到 CSS 文件中，只需要用 `#{}` 插值语句将变量包裹。

+ `@import` 允许其导入 SCSS 或 Sass 文件，被导入的文件中所包含的变量或者混合指令 (mixin) 都可以在导入的文件中使用。
