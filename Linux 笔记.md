# Linux 笔记

shell解析命令的流程：

1. 收到虚拟终端中用户输入的命令，然后在环境变量(应用的配置路径)中搜索
2. 找到输入的命令之后，shell会运行这个程序
3. 将结果在终端中输出

## 目录概念

`Windows`：单用户操作系统

Linux：多用户操作系统（电脑上的所有资源被多个用户共享），只有一个硬盘，/home目录，可以支持不同的用户访问。

Linux只有一个根目录`/`，Linux的世界里面，一切都是文件

`/bin `存放最经常使用的指令(一些二进制文件——可执行文件)

`/home` 每创建一个用户，这个文件就会多一个该用户文件,每个用户在自己的区域开心，不许去别人的区域捣乱。

`/lib` 系统开机所需要的最基本的动态链接共享库

`/etc `所有系统管理所需要的配置文件和子目录

`/usr `用户的很多应用程序和文件都放在这个目录

- /usr/local 额外软件所安装的目录

`/dev `专门管理设备（将硬件映射成一个文件，例如cpu）

`/var `存放着不断扩充的东西

`/media` 外设的自动挂在目录

`/root`超级用户的加目录

`/opt`安装第三方应用程序

`/tmp`存放临时文件，开机后自动清空

## 文件类型

一共十个字符 :比如 -rwxrwx---

第一个字符表示文件类型，d表示目录，-表示普通文件，l表示链接文件，c表示外设，p表示管道，s表示套接字。

后面9个，每三个表示一组权限，一共三组，第一组表示**文件所有者**的权限，第二组表示文件**所属用户组**的权限，第三组表示其他人的权限，r表示可读，w表示可写，x表示可执行，如果没有权限则会被-代替

修改文件属性与权限：

1. `chgrp —R `修改文件所属用户组

2. `chown`修改文件拥有者

   `chown BIN initial-setup-ks.cfg`参数先拥有者 ，再文件名，加上`-R`可以将所有子目录与文件修改拥有者

3. `chmod`修改文件权限，使用数字来代表各个权限，`r:4`,`w:2`,`x:1`

   `[-rwxrwx---]` 对应数字770

   `chmod 770 .bashrc`参数先权限值，再文件名，`-R`选项可以递归修改子目录以及其下所有子文件

   或者chmod who +/-/= mode filename

4. `mkdir -p test/test1/test2`递归创建目录。

   `mkdir -m 711 test`创建时声明权限rwx--x--x

## vi vim

`vim` 是 vi 的增强版本

+ 正常模式
+ 插入模式（可以输入，输入i即可进入）
+ 命令行模式（保存退出或者不保存退出）

## 用户 

用户至少要属于一个组，每个用户的目录/home/xiaoming

`id 用户` 查询用户信息   输出：用户代号，组代号 

### 用户/组——添加

`useradd xiaoming`会自动创建一个xiaoming组，/home目录下会增加一个/xiaoming 目录

`passwd xiaoming`给xiaoming账户指定密码

+ `groupadd school`添加school组
  + `useradd -g school xiaoming`将用户xiaoming添加到school组

+ `groupadd hospitol`添加hospitol组
  - ` usermod -g hospital xiaoming`将用户xiaoming添加到hospital组中

### 用户删除

`userdel xiaoming`保留 家目录

`userdel -r xiaoming`删除xiaoming并且删除家目录

### 用户查询

`id xiaoming`查询用户xiaoming的各种信息

### 用户切换

`su - xiaoming`切换到xiaoming目录

## 常用命令

crtl + shift + /crtl - 放大/缩小终端字体

文件检索 ：

+ `*.txt`：以txt为结尾的所有文件
+ `1*`：以1开头的所有文件
+ `1*3`：以1开头，3结尾的所有文件
+ `[123]456`: 1456  2456  3456这3个文件

tree: 树状显示目录结构

- `tree dir` (dir 目录可以是绝对路径，也可以是相对路径)

ls：查看当前文件夹下的内容

+ Linux中，以`.`开头的文件是隐藏文件，可以用 `ls -a `显示当前文件夹所有文件
+ `ls -l`以列表显示文件,文件的详细信息
+ 白色表示普通文件，绿色表示可执行文件，红色表示压缩文件，蓝色表示目录

pwd：查看当前目录的绝对路径

cd [目录名]： 切换文件夹

+ `cd ~`返回家目录

touch：如果文件不存在，新建文件；如果文件存在则更新文件的时间

mkdir：创建目录

+ `mkdir -p /home/animal/tiger`创建多级目录

rmdir：删除空目录

rm [文件名]：删除指定的文件名

+ 使用rm删除的文件是无法回复的（注意）
+ `rm -r` 递归删除目标文件全部目录和所有子目录
+ `rm -f` 强制删除，不给出提示

`clear`：清屏

cp：复制文件到指定目录（不能拷贝整个目录）

+ `cp -r `递归拷贝整个目录或文件

mv：移动文件或者重命名，希望移动的文件，和目标路径

cat：查看文件内容

+ `cat -n` ：输出所有行的编号

more: 分屏显示文件内容（文件内容多的时候使用），回车可以滚动，空格滚一屏，q可以退出

ln：创建快捷方式

+ ln -s filename 快捷方式的名字

find：文件查找和检索

+ find  dirname  -name  "filename"　查找dirname目录下的filename文件
+ find  dirname  -type  filetype 按照文件类型查找，普通文件用f表示
+ find  dirname  -name  "filename"　-exec  shell 有点类似于管道

grep：文本搜索  搜索的内容  搜索的文件 

+ `^f`,以f开头
+ `a$`,以a结尾

history: 查看别人敲过的指令

echo：将文本显示在终端，与重定向配合使用

+ ```shell
  echo Hello > a
  ```

  将Hello重定向到a文件，会创建a文件，并且覆盖内部全部内容

  ```shell
  echo Hello >> a
  ```

  将Hello内容追加到a文件

管道：`|` 左边可以生成结果，然后将该结果传递到右边

+ ```shell
  ls -a | grep de
  ```

  将ls输出的内容通过管道传递给grep

reboot：重启

halt：关机

sync：把内存同步到磁盘（关机前使用）

shutdown：关机

+ `shutdown -r`：重启

ifconfig：查看网卡信息

more：分屏查看文件内容，空格键继续查看





终端命令格式：`command  [-options]/[parameter]`

Command 命令名：相应的功能

[-options] 选项：可以对命令进行控制

[parameter]：传递给命令的参数



##  Linux通过SSH客户端来管理SSH服务器

SSH数据传输是加密并且压缩的，可以防止信息泄露，并且提高传输速度

通过IP地址找到计算机，再通过端口号找到web服务器的应用程序.

先下载ssh服务:

`sudo apt-get install openssh-server `

再检查服务是否开启：

`ps -s | grep ssh`

启动服务：

`sudo service ssh start` 

```shell
ssh [-p port] user@remote
```

port：默认是22

user：Linux服务器用户名

remote：服务器IP

`ssh -P 22 clement@192.168.7.01`登录例子

### SSH常用指令

scp：远程拷贝文件

`scp -P 22 01.py clement@10.0.2.15 :Desktop/`



## 磁盘管理

`df [-ahikHTm] [目录或文件名]`,检查文件系统的磁盘占用情况

- -a ：列出所有的文件系统，包括系统特有的 /proc 等文件系统；
- -k ：以 KBytes 的容量显示各文件系统；
- -m ：以 MBytes 的容量显示各文件系统；
- -h ：以人们较易阅读的 GBytes, MBytes, KBytes 等格式自行显示；
- -H ：以 M=1000K 取代 M=1024K 的进位方式；
- -T ：显示文件系统类型, 连同该 partition 的 filesystem 名称 (例如 ext3) 也列出；
- -i ：不用硬盘容量，而以 inode 的数量来显示

`du [-ahskm] [文件或目录名]`



## Shell编程

shell命令解释器来操作内核，内核来驱动硬件，用户可以通过书写代码在shell命令解释器中调用Linux自身指令。

```shell
#!/bin/bash
// 每一句结束后不需要分号
echo "hello,world!"
```

+ 执行方式:以.sh结尾的文件

   `sh file.sh`

### 变量

系统变量&用户自定义变量

定义&撤销变量：

```shell
# 直接定义
A=100
echo "A=$A"
# 撤销一个变量
unset A
echo "A=$A"

# 静态变量,无法被unset
readonly A=99

# 将一个命令赋值给一个变量，$(ls -l /home)
RESULT=`ls -l /home` 

# 此时会直接执行这个命令
echo $RESULT
# 设置环境变量
TOME_HOME=/opt/tomcat
export TOME_HOME

# 位置参数变量 $*所有参数 $@所有参数(分别对待) $# 参数个数 
echo "$0 $1 $2"
echo "$*"
echo "$@"
echo "$#"

# 预定义变量

#当前进程号
$$ 
```

> 变量赋值时等号两侧不能有空格，并且尽量用大写
>
> 为了让环境变量重新生效，需要使用`source /etc/profile`
>
> 引用变量的时候必须在前面加入$

### 运算符

```shell
# 第一种
RESULT1=$(((2+3)*4))
echo "$RESULT1"
# 第二种
RESULT1=$[(2+3)*4]
echo "$RESULT1"
# 第三种， 使用expr
TEMP=`expr 2 + 3`
RESULT1=`expr $TEMP \* 4`

```

### 条件判断

```shell
[ condition ] 返回true
[] 返回false
```





