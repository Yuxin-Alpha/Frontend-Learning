# Vue-router

路由就是根据网址的不同，返回不同的内容给用户。

具体使用方法：

1. 在src文件下新建router文件，然后新建`index.js`文件。

2. 在index文件中导入这个插件`import Router from 'vue-router'`

3. 在导出路由配置对象之前，必须先使用这个插件对象`Vue.use(Router)`

4. 接着，使用`new`操作符实例化一个Router对象并将其暴露出去

   ```javascript
   import Vue from 'vue'
   import Router from 'vue-router'
   // 在此导入路由配置需要的组件，这里的@符号指的是src目录
   import HelloWorld from '@/components/HelloWorld'
   
   Vue.use(Router)
   
   export default new Router({
     routes: [
       {
         // 当用户访问根路径的时候，展示HelloWorld这个组件
         path: '/',
         name: 'HelloWorld',
         component: HelloWorld
       }
     ]
   })
   
   ```

5. 在src目录下的入口文件，也就是`main.js`中导入被暴露的路由对象，然后使用这个导入的路由对象

`<router-view/>`显示的就是当前路由地址所对应的内容。

通过注入路由器，我们可以访问它`this.$router`以及`this.$route`任何组件内部的当前路由。

- 动态路由：

  ```javascript
  const router = new VueRouter({
    routes: [
      // 使用：跟上动态参数id
      { path: '/user/:id', component: User }
    ]
  })
  ```

- 嵌套路由：

  在一个路由选项中配置其`children`属性（数组），在其中按需添加

  ```javascript
  const router = new VueRouter({
    routes: [
      { path: '/user/:id', component: User,
        children: [
          { path: '', component: UserHome },
          { path: 'profile', component: UserProfile },
          { path: 'posts', component: UserPosts }
        ]
      }
    ]
  })
  ```

- 路由跳转语法：

  ```html
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  ```

  或

  ```javascript
  // 字符串
  router.push('home')
  
  // 对象
  this.$router.push({path: '/login?url=' + this.$route.path});
  
  // 命名的路由
  router.push({ name: 'user', params: { userId: 123 }})
  
  // 带查询参数，变成/backend/order?selected=2
  this.$router.push({path: '/backend/order', query: {selected: "2"}});
  ```

  

## 源码分析

