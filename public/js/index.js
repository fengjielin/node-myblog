$(function () {
    renderAjaxFirst(1, 0);
})

// '我要变强' 与 '点滴记录'
function renderAjaxFirst(currentPage, theme) {
    $.ajax({
        url: '/renderFirst',
        dataType: 'json',
        type: 'get',
        data: 'currentPage=' + currentPage + '&theme=' + theme,
        success: function (data) {
            renderArticleList(data)
        },
        error: function () {
            console.log("错误");
        }
    });
}

// '分类列表'
function renderAjaxClassifyList() {
    $.ajax({
        url: '/renderClassify',
        dataType: 'json',
        type: 'get',
        success: function (data) {
            renderClassifyList(data);
        },
        error: function () {
            console.log("错误");
        }
    });
}

// '分类列表详情'
function renderClassifyList(data) {
    $('#blog-main').html('');
    var classify = data['classify']
    $.each(classify, function (index, item) {
        var template = `
        <div class="blog-classify">
            <ul>
                <li><a href="javascript:void(0);" onclick="renderAjaxClassifyArticleList(1,'${item}')">${item}</a></li>    
            </ul>
        </div>`
        $('#blog-main').append(template);
    })
}

// '分类文章列表'
function renderAjaxClassifyArticleList(currentPage, classify) {

    $.each($('.blog-nav-item'), function (index, item) {
        item.classList.remove('active');
        if (index == 2) {
            item.classList.add('active');
        }
    })

    $.ajax({
        url: 'classify',
        dataType: 'json',
        type: 'post',
        data: 'currentPage=' + currentPage + '&classify=' + classify,
        success: function (data) {
            renderArticleList(data);
        },
        error: function () {
            console.log("错误");
        }
    });
}

// '文章列表'
function renderArticleList(data) {
    $('#blog-main').html('');
    var articleList = data['hlist'];
    $.each(articleList, function (index, item) {
        var template = `
        <div class="blog-post">
            <h3 class="blog-post-title"><a href="javascript:void(0);" onclick="renderArticle('${item._id}')">${item.title}</a></h3>
            <p class="blog-post-meta">${utcTobeijing(item.date)} <a href="javascript:void(0);"onclick="renderAjaxClassifyArticleList(1, '${item.classify}')"> ${item.classify}</a></p>
            <p>简介：${item.intro}</p>
        </div>`
        $('#blog-main').append(template);
    })

    // 分页
    if (!data.classify) {
        var templatePage = `
            <ul class="pagination">
                <li><a href="javascript:void(0);" class="btn prePageLi" id="prePageLi">&laquo;</a></li>
                <li><a href="javascript:void(0);" class="btn nextPageLi" id="nextPageLi">&raquo;</a></li>
            </ul>`
        $('#blog-main').append(templatePage);

        for (var i = 1; i <= data.pageNum; i++) {
            if (i == data.currentPage) {
                $(".pagination li:last").before('<li class="active"><a href="javascript:void(0);" class="btn" onclick="renderAjaxFirst(' + i + ',' + data.theme + ')">' + i + '</a></li>');
            } else {
                $(".pagination li:last").before('<li><a href="javascript:void(0);" class="btn" onclick="renderAjaxFirst(' + i + ',' + data.theme + ')">' + i + '</a></li>');
            }
        }
        if (data.currentPage == 1) {
            $('.prePageLi')[0].classList.add('disabled');
            if (data.pageNum == 1) {
                $('.nextPageLi')[0].classList.add('disabled');
            }
        } else {
            $('#prePageLi').on("click", function (e) {
                renderAjaxFirst(data.currentPage - 1, data.theme);
            })
        }
        if (data.currentPage == data.pageNum) {
            $('.nextPageLi')[0].classList.add('disabled');
        } else {
            $('#nextPageLi').on("click", function (e) {
                renderAjaxFirst(-(-data.currentPage - 1), data.theme);
            })
        }
    } else {
        var templatePage = `
            <ul class="pagination">
                <li><a href="javascript:void(0);" class="btn prePageLi" id="prePageLi">&laquo;</a></li>
                <li><a href="javascript:void(0);" class="btn nextPageLi" id="nextPageLi">&raquo;</a></li>
            </ul>`
        $('#blog-main').append(templatePage);
        for (var i = 1; i <= data.pageNum; i++) {
            if (i == data.currentPage) {
                $(".pagination li:last").before('<li class="active"><a href="javascript:void(0);" class="btn" onclick="renderAjaxClassifyArticleList(' + i + ',\'' + data.classify + '\')">' + i + '</a></li>');
            } else {
                $(".pagination li:last").before('<li><a href="javascript:void(0);" class="btn" onclick="renderAjaxClassifyArticleList(' + i + ',\'' + data.classify + '\')">' + i + '</a></li>');
            }
        }
        if (data.currentPage == 1) {
            $('.prePageLi')[0].classList.add('disabled');
            if (data.pageNum == 1) {
                $('.nextPageLi')[0].classList.add('disabled');
            }
        } else {
            $('#prePageLi').on("click", function (e) {
                renderAjaxClassifyArticleList(data.currentPage - 1, data.classify);
            })
        }
        if (data.currentPage == data.pageNum) {
            $('.nextPageLi')[0].classList.add('disabled');
        } else {
            $('#nextPageLi').on("click", function (e) {
                renderAjaxClassifyArticleList(-(-data.currentPage - 1), data.classify);
            })
        }
    }
}

// '文章详情'
function renderArticle(id) {
    var template = `<div id="article"></div>`
    $('#blog-main').html(template);
    $.ajax({
        url: '/filename',
        dataType: 'json',
        data: "id=" + id,
        type: 'post',
        success: function (data) {
            $("#article").append(data);
        },
        error: function () {
            console.log("错误");
        }
    });
}

// '图片天地'
function renderImageArea() {
    $('#blog-main').load('image');
}

// '关于页面'
function renderAbout() {
    // $('#blog-main').html('<h1>fengjielin</h1>');
    $('#blog-main').load('about');
}




// JS 对UTC格式转换 https://blog.csdn.net/weixin_41607151/article/details/83859991  m_spider
function utcTobeijing(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0, T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos + 1, Z_pos - T_pos - 1);
    var new_datetime = year_month_day + " " + hour_minute_second; // 2017-03-31 08:02:06
    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();// 返回距 1970 年 1 月 1 日之间的毫秒数
    timestamp = timestamp / 1000; // 毫秒转为秒
    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp + 8 * 60 * 60;
    // 时间戳转为时间
    var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return beijing_datetime; // 2017-03-31 16:02:06
}