const express = require('express');
const app = express();

var bodyParser = require('body-parser')

const router = require('./routes/router');
const upload = require('./routes/upload');
const paging = require('./routes/paging');

var session = require('express-session');

// 配置模版引擎
app.engine('html', require('express-art-template'));

// 开放静态资源
app.use('/public/', express.static('./public'));
app.use('/node_modules/', express.static('./node_modules'));
app.use('/images/', express.static('./upload/images'));


// 配置body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// express-session 用来提供对 Session 和 Cookie 支持
app.use(session({
    secret: 'keyboard cat', // 配置加密字符串
    resave: false,           
    saveUninitialized: true // 无论是否使用 Session,都默认分配一把钥匙
}));

// 调用中间件
app.use(router);
app.use(upload);
app.use(paging.paging);
app.use(paging.pagingClassify);

app.use(function(err, req, res, next){
    res.status(500).json({
        err_code: 500,
        message: err.message
    });
});

// 监听端口
app.listen(3000,() => {
    console.log('server start at http://127.0.0.1:3000');
})