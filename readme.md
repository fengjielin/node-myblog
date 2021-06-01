## Project setup
```shell
npm install
```

## 启动mongodb
```shell
mongod
```

## Compiles and hot-reloads for development
```shell
npm run start
```

## 目录结构

```
|—— app.js
|—— middleware
|—— model
|—— routes
|—— public
|—— views
|—— node_modules
|—— package-lock.json
|—— package.json
|—— readme.md
```

## 环境搭建 

```
npm init -y
npm i express

npm i art-template
npm i express-art-template

npm i bootstrap@3.3.7
npm i jquery@3.5.1

npm i marked
npm i multer

npm i mongoose

npm i body-parser
npm i md5
npm i express-session
```

## 功能实现

1. 渲染静态模版页面
2. 读取本地的markdown文件并渲染到页面上
3. 将上传的markdown文件进行数据表创建关联  id 文件名 简介 分类
4. 渲染列表时，访问数据库，利用ajax获取文章信息，然后在页面上渲染出来
5. 渲染分页列表，通过 paging.js 访问数据库获取封装好的分页数据，在前端用ajax获取，再渲染在页面上
6. 时间格式化，把mongodb获取的UTC格式的时间转换为北京时间 GMT+0800

7. 修改管理页，删除上传数据库文件信息和上传到服务器的文件的功能，添加管理登陆页面
8. 修改文件上传页面，`添加图片上传功能`
9. 增加日志功能 who when where what


## 重新设计

1. 首页布局
类似文件夹布局，分为“我要变强”、“生活趣事”、“分类记录”、“图片天地”、“fengjielin”

## 问题

当读取的markdown文件内有图片链接时，而且在数据无法获取到图片，就会保报错，报的错，不知为什么会去执行分页的函数

express这个模块里有封装好的路由

