# Dart & Flutter

## Dart变量

+ 定义

  1. 使用`var`定义
  2. number类型分为`int`与`double`，Dart中没有float类型
  3. Dart属于强类型的语言，但是它会自动推导出数据类型

+ 方法

  1. Dart 下 `??` 、`??=` 属于操作符，如: `AA ?? "999"` 表示如果 AA 为空，返回999；`AA ??= "999"` 表示如果 AA 为空，给 AA 设置成 999。
  2. Dart 不像 Java ，没有关键词 public 、private 等修饰符，`_`下横向直接代表 private ，但是有 `@protected` 注解。
  3. 默认的构造方法只能有一个

  ```dart
  class ModelA {
    String name;
    String tag;

    //默认构造方法，赋值给name和tag
    ModelA(this.name, this.tag);

    //返回一个空的ModelA
    ModelA.empty();

    //返回一个设置了name的ModelA
    ModelA.forName(this.name);
  }
  ```

## Flutter

### 异步

