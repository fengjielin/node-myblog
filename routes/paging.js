var Article = require('../model/article')

var paging = async (page, theme, limit, next) => {
    try {
        var limit = limit;// 分页大小
        var currentPage = page;// 当前页码

        var list = { currentPage: currentPage, theme: theme }
        await Article.find({ theme: theme }, (err, ress) => {
            if(err){
                console.log(" paging err");
            }else{
                list.total = ress.length; //总条数
                list.pageNum = Math.ceil(ress.length / limit); //分多少页
            }
        })
        return await Article.find({ theme: theme }).skip((parseInt(currentPage) - 1) * parseInt(limit)).limit(parseInt(limit)).then(res => {
            list.message = 'success';
            list.hlist = res;
            return list;
        }).catch(err => {
            console.log(err);
        })
    } catch (err) {
        return next(err);
    }
}

var pagingClassify = async (page, classify, limit, next) => {
    try {
        var limit = limit;// 分页大小
        var currentPage = page;// 当前页码

        var list = { currentPage: currentPage, classify: classify }
        await Article.find({ classify: classify }, (err, ress) => {
            if(err){
                console.log("pagingClassify err");
            }else{
                list.total = ress.length; //总条数
                list.pageNum = Math.ceil(ress.length / limit); //分多少页
            }
        })
        return await Article.find({ classify: classify }).skip((parseInt(currentPage) - 1) * parseInt(limit)).limit(parseInt(limit)).then(res => {
            list.message = 'success';
            list.hlist = res;
            return list;
        }).catch(err => {
            console.log(err);
        })
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    paging,
    pagingClassify
};