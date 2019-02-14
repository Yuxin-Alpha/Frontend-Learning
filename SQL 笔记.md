# SQL笔记

## MySQL

DB:仓库.  

DBMS: 数据库管理系统. 

SQL:结构化查询语言

## MongoDB

> cd /usr/local/mongodb/bin

> ./mongo

MongoDB中的记录是一个文档，它是由字段和值对组成的数据结构。

创建数据库：`use DATABASE_NAME`

向数据库中增加数据：`db.runoob.insert({"name":"zhangsan"})`

删除数据库：`use runoob`切换到当前数据库runoob，然后执行`db.dropDatabase()`

创建集合：`db.createCollection(name, options)`

```shell
db.createCollection("mycol", { capped : true, autoIndexId : true, size : 6142800, max : 10000 } )
```

插入文档时会自动创建：` db.mycol2.insert({"name" : "zhangsan"})`

删除集合：`db.collection.drop()`

查看已插入文档：`db.col.find()`

更新文档：`db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}})`

删除文档：`db.inventory.deleteMany({ status : "A" })`