# Go语言笔记

## 初探

```go
// 将该文件打包,go中每个文件都必须属于一个包
package main
// 引入该包，为了使用该包中的API
import "fmt"
// fuc,表示后面是一个函数，main是我们程序的入口
func main() {
	fmt.Println("hello")
}
```

1. 控制台执行`go build main.go`后会编译生成一个可执行文件

   > Linux或者Mac下可以执行`./main`运行可执行文件

2. 控制台执行`go run main.go`可在终端之间运行源码（速度有点慢）

区别：如果我们需要将其拷贝到别的地方，其实可执行文件更加理想，因为.go文件在编译后，会自动将其运行需要的东西一起打包到可执行文件中。