# Linux 笔记

## 目录概念

Windows：单用户操作系统

Linux：多用户操作系统（电脑上的所有资源被多个用户共享），只有一个硬盘，/home目录，可以支持不同的用户访问

## 常用命令

crtl + shift + /crtl - 放大/缩小终端字体

文件检索 ：

+ *.txt：以txt为结尾的所有文件
+ 1*：以1开头的所有文件
+ 1*3：以1开头，3结尾的所有文件
+ [123]456: 1456  2456  3456这3个文件

ls：查看当前文件夹下的内容

+ Linux中，以.开头的文件是隐藏文件，可以用 ls -a 显示当前文件夹所有文件

pwd：查看当前所在文件夹

cd [目录名]： 切换文件夹

touch：如果文件不存在，新建文件

mkdir：创建目录

rm [文件名]：删除指定的文件名

+ 使用rm删除的文件是无法回复的（注意）
+ rm -r 删除目标文件全部目录和所有子目录
+ rm -f 强制删除，不给出提示

clear：清屏

cp：复制

+ cp -r 复制目录

mv：移动文件

cat：查看文件内容

+ cat -n ：输出所有行的编号

grep：文本搜索 

echo：将文本显示在终端，与重定向配合使用

+ ```shell
  echo Hello > a
  ```

  将Hello重定向到a文件，会创建a文件，并且覆盖内部全部内容

  ```shell
  echo Hello >> a
  ```

  将Hello内容追加到a文件

管道：|

+ ```shell
  ls -a | grep de
  ```

  将ls输出的内容通过管道传递给grep

shutdown：关机

+ shutdown -r：重启

Ifconfig：查看网卡信息



more：分屏查看文件内容，空格键继续查看

tree：以树形结构图展示当前目录的文件结构

+ tree -d 只显示文件目录，不显示文件

终端命令格式：command  [-options]/[parameter]

Command 命令名：相应的功能

[-options] 选项：可以对命令进行控制

[parameter]：传递给命令的参数



##  Linux通过SSH客户端来管理SSH服务器

SSH数据传输是加密并且压缩的，可以防止信息泄露，并且提高传输速度

通过IP地址找到计算机，再通过端口号找到web服务器的应用程序

```shell
ssh [-p port] user@remote
```

port：默认是22

user：Linux服务器用户名

remote：服务器IP



scp：远程拷贝文件

