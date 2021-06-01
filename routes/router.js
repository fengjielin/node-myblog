const express = require('express');
const router = express.Router();

const fs = require('fs');
const marked = require('marked');
const md5 = require('md5');

var Article = require('../model/article')
var User = require('../model/user')
var Log = require('../model/log')
var paging = require('../routes/paging').paging
var pagingClassify = require('../routes/paging').pagingClassify
var limit = 5;

// 渲染首页
router.get('/', (req, res, next) => {
    res.render('index.html');
});

// 渲染'我要变强'和'点滴记录'里的文章列表 
router.get('/renderFirst', async (req, res, next) => {
    try {
        var currentPage = req.query.currentPage;
        var theme = req.query.theme;
        var page = await paging(currentPage, theme, limit)
        res.json(page);
    } catch (err) {
        return next(err);
    }
})

// 渲染'分类记录'里的类目
router.get('/renderClassify', async (req, res, next) => {
    try {
        var classify = await Article.find({}).distinct('classify');
        classify.reverse();
        res.json({
            classify: classify
        })
    } catch (err) {
        return next(err);
    }
})

// 渲染'分类记录'里的不同类目的文章列表
router.post('/classify', async (req, res, next) => {
    try {
        var currentPage = req.body.currentPage;
        var classify = req.body.classify;
        var page = await pagingClassify(currentPage, classify, limit)
        res.json(page);
    } catch (err) {
        return next(err);
    }
});

// 渲染图片天地页面
router.get('/image', (req, res, next) => {
    res.render('image.html');
});

// 渲染关于页面
router.get('/about', (req, res, next) => {
    res.render('about.html');
});

// 注册用户信息
router.post('/regist', async (req, res, next) => {
    var body = req.body;
    try {
        if (await User.findOne({ username: body.username })) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email already exists.'
            });
        }
        // 对密码进行 md5 重复加密
        body.password = md5(md5(body.password));
        // 创建用户，执行注册
        var user = await new User(body).save();
        // req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
        await new Log({who: body.username,where: '/regist', what: 'regist'}).save();
    } catch (err) {
        return next(err);
    }
});

// 验证用户登陆信息
router.post('/login', async (req, res, next) => {
    var body = req.body;
    try {
        var user = await User.findOne({
            username: body.username,
            password: md5(md5(body.password))
        });
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            });
        }
        req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        });
        await new Log({who: body.username,where: '/login', what: 'login'}).save();
    } catch (err) {
        return next(err);
    }
});

// 实现 退出登陆 功能
router.get('/logout', async function (req, res, next) {
    await new Log({who: req.session.user,where: '/logout', what: 'logout'}).save();
    req.session.user = null;
    res.redirect('/admin');
});

// 渲染日志页
router.get('/log', async (req, res, next) => {
    try {
        var logList = await Log.find({});
        logList.reverse();
        res.render('log.html',{
            logList:logList
        });
    } catch (err) {
        return next(err);
    }
});

router.get('/fengjielin', async (req, res, next) => {
    res.render('fengjielin.html');
});

// 渲染管理登录页
router.get('/admin_login', async (req, res, next) => {
    try {
        res.render('admin_login.html');
    } catch (err) {
        return next(err);
    }
});



// 渲染管理页
router.get('/admin', async (req, res, next) => {
    try {
        if (req.session.user) {
            var articleList = await Article.find();
            articleList.reverse();
            res.render('admin.html', {
                articleList: articleList
            });
        } else {
            res.render('admin_login.html');
        }
    } catch (err) {
        return next(err);
    }
});

// 渲染上传页面
router.get('/uploadFiles', (req, res, next) => {
    res.render('uploadFiles.html');
});

// 处理读取文档请求
router.post('/filename', async (req, res, next) => {
    try {
        var id = req.body.id;
        var article = await Article.findOne({ _id: id });

        var path = './upload/' + article.title;
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                res.send('文件不存在');
            } else {
                // console.log(data);
                str = marked(data.toString());
                // console.log(str);
                res.json(str);
            }
        })
    } catch (err) {
        return next(err);
    }
})

// 处理删除上传的文档
router.get('/delete', async (req, res, next) => {
    try {
        var id = (req.query.id).replace(/\"/g, "");
        Article.findOne({ _id: id }, (err, ret) => {
            var des_file = "./upload/" + ret.title;
            fs.unlink(des_file, () => {
                console.log('删除本地文件')
                new Log({who: ret.title, where: '/delete', what: 'delete'}).save();
            });
        })
        Article.deleteOne({ _id: id }, (err, ret) => {
            if (err) {
                console.log('删除失败');
            } else {
                console.log('删除成功');
                res.json(200, {
                    code: 0
                })
                // res.redirect(302, '/admin');
            }
        });
    } catch (err) {
        return next(err);
    }
})

// 渲染修改页
router.get('/update_page', async (req, res, next) => {
    var id = req.query.id
    try {
        var article = await Article.findOne({ _id: id });
        res.render('update.html', {
            article: article
        });
    } catch (err) {
        return next(err);
    }
})

// 处理修改请求
router.post('/update', async (req, res, next) => {
    var id = req.body.id
    try {
        var article = await Article.update({ _id: id }, { intro: req.body.intro, classify: req.body.classify, theme: req.body.theme }, (err, ress) => {
            if (err) {
                console.log(err)
            } else {
                res.json(200, {
                    code: 0
                })
                new Log({who: req.body.id, where: '/update', what: 'update: intro->' + req.body.intro + ';classify->'+ req.body.classify + ';theme->'+req.body.theme}).save();
            }
        });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;