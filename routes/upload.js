var fs = require('fs')
var express = require('express')
var multer = require('multer')
var Article = require('../model/article')
var Log = require('../model/log')

var uploadRouter = express.Router();

var upload = multer({ dest: 'upload_tmp/' });

uploadRouter.post('/gists', upload.any(), async function (req, res, next) {
    // console.log(req.files[0]);  // 上传的文件信息
    var articleByTitle = await Article.findOne({title: req.files[0].originalname})
    if(articleByTitle){
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf8'
        });
        return res.end('错误:上传的文件重名，请删除已有文件，再进行上传');
    }

    if (req.files[0].mimetype == 'application/octet-stream') {
        var des_file = "./upload/" + req.files[0].originalname;
        fs.readFile(req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    response = {
                        title: req.files[0].originalname,
                        intro: req.body.intro,
                        classify: req.body.classify,
                        theme: req.body.theme
                    };
                    new Article(response).save();
                    new Log({who: req.files[0].originalname, where: '/upload', what: 'upload' }).save();
                    res.redirect(302, '/admin');
                    // res.writeHead(200, {
                    //     'content-type': 'text/html;charset=utf8'
                    // });
                    // res.end(JSON.stringify(response));
                }
            });
        });
    }else{
        res.writeHead(200, {
            'content-type': 'text/html;charset=utf8'
        });
        res.end('错误:请上传 markdown 文件');
    }

});

module.exports = uploadRouter;