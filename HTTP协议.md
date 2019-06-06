## HTTP协议

在浏览器输入`URL`之后，请求返回的完整过程：

1. Redirect(跳转)
2. App cache (应用缓存)
3. DNS(域名解析)
4. TCP(创建TCP链接)
5. Request(发送请求)
6. Response(接收响应返回)

> HTTP并不存在连接的概念，这一层只有请求和响应，客户端与服务器相互传输请求和响应需要一个通道，所以在发送请求的时候，会创建一个TCP connection的东西，请求和响应的传输必须建立在这个东西上面。



## 跨域

同源策略：协议，域名，端口号都一样，称为同源。



如果不满足同源策略，就形成了跨域。浏览器是不支持跨域的。



实现跨域：

+ jsonp

  创建一个script标签将文件引入进来，

+ cors

+ postMessage

+ document.domain

+ location.hash

+ proxy

+ nginx

+ websocket