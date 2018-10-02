import {host, picture3DSwitch, navData, addEllipsis, ajax, tmp} from './public';
const blogBox = $('#blog-box');
const hashReg = /(^#)([^\/]+)/i;
let hash = '';
// 存储博客请求的回调函数
;(function() {
    // 请求函数
    const element_callBack = [
        // 文章
        () => {
            ajax(navData.blog.reqUrl, {
                page: 1
            })
            .then(data => {
                const articleData = data.articleList;
                articleData.map(function(articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                const articleList = $('<div id="article-list"></div>');
                articleList.html(arrText(articleData))
                navData.blog.element.append(articleList);
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 50);
            })
        },
        // 相册
        () => {
            ajax(navData.photo.reqUrl, {
                page: 1
            })
            .then(data => {
                const articleData = data.articleList;
                articleData.map(function(articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                const articleList = $('<div id="article-list"></div>');
                articleList.html(arrText(articleData))
                navData.photo.element.append(articleList);
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 50);
            })
        },
        // 心情
        () => {
            ajax(navData.blog.reqUrl, {
                page: 1
            })
            .then(data => {
                const articleData = data.articleList;
                articleData.map(function(articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                const articleList = $('<div id="article-list"></div>');
                articleList.html(arrText(articleData))
                navData.mood.element.append(articleList);
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 50);
            })
        }
    ];
    var index = 0;
    for (const hash in navData) {
        navData[hash].cbFn = element_callBack[index] || function() {alert('当前模块没有回调函数！');};
        index ++;
    }
})();
// canvas雪花
;(function () {
    const c = $('#canvasBg');
    const g = c[0].getContext('2d');
    const color = $('#canvasBg').css('color');
    let snowArr = [];
    let timer = null;
    let initTimer = null;
    const win = $(window);
    let starLen = Math.floor(win.width() / 80);
    starLen = starLen < 10 ? 10 : starLen;
    function random() {
        return Math.random();
    };
    c.attr({
        width: win.width(),
        height: win.height()
    });
    win.resize(function () {
        clearTimeout(initTimer);
        initTimer = setTimeout(function () {
            clearTimeout(timer);
            starLen = Math.floor(win.width() / 100);
            g.clearRect(0, 0, c.attr('width'), c.attr('height'));
            c.attr({
                width: win.width(),
                height: win.height()
            });
            snowArr = [];
            initStar();
            starFlash();
        }, 100);
    });
    initStar();
    function initStar() {
        g.clearRect(0, 0, c.attr('width'), c.attr('height'));
        // 初始化每一个雪花
        for (let i = 0; i < starLen; i++) {
            const x = random() * c.attr('width');
            snowArr.push({
                x: x,
                startX: x,
                y: random() * c.attr('height'),
                speedY: 1,
                r: random() * 2 + 1,
                xNum: 0,
                range: random() * 40,
            });
        }
    };
    // 重绘
    starFlash();
    function starFlash() {
        g.clearRect(0, 0, c.attr('width'), c.attr('height'));
        for (let i = 0; i < starLen; i++) {
            g.fillStyle = color;
            // y轴加
            snowArr[i].y += snowArr[i].speedY;
            if (snowArr[i].y >= win.height() + snowArr[i].r) snowArr[i].y = -snowArr[i].r;

            snowArr[i].xNum--;
            if (snowArr[i].xNum === -360) snowArr[i].xNum = 0;

            snowArr[i].x = snowArr[i].startX - snowArr[i].range * Math.sin(Math.PI / 180 * snowArr[i].xNum);

            g.beginPath();
            g.arc(snowArr[i].x, snowArr[i].y, snowArr[i].r, 0, Math.PI * 2);
            g.fill();
            g.closePath();
        };
        timer = setTimeout(function () {
            requestAnimationFrame(starFlash);
        }, 50);
    };
})();
// 元素切换函数
let timer = null;
const elementSwitch = function(newEl, oldEl) {
    // 添加即将出现的元素
    blogBox.append(newEl);
    // 旧元素离开
    oldEl.addClass('leaving');
    clearTimeout(timer);
    timer = setTimeout(function() {
        oldEl.detach();
    }, 500);
    setTimeout(() => {
        newEl.removeClass('leaving');
    }, 20);
};
// 通过hash值切换元素
const switchByHash = function(newHash, oldHash) {
    if( oldHash !== newHash ) {
        // 如果没有请求过
        if( navData[newHash] ) {
            if( !navData[newHash].isReq ) {
                navData[newHash].isReq = true;
                navData[newHash].cbFn();
            }
            elementSwitch(navData[newHash].element,  navData[oldHash] ? navData[oldHash].element : $());
        }
    }
};
// 首次加载
;(function() {
    const hashArr = window.location.hash.match(hashReg);
    // 如果配置文件里面有hash
    if( hashArr && hashArr[2] && navData[ hashArr[2] ] ) hash = hashArr[2];
    else {
        hash = 'blog';
        window.location.hash = 'blog';
    }
    switchByHash(hash);
})();
// 创建导航菜单
;(function() {
    // 获取导航ul
    const navList = $('#nav-list');
    const navText = doT.template(tmp.navTmp);
    navList.html(navText(navData));
    const navItem = $('.nav-item');
    navItem.each(function (index, nav) {
        if( $(nav).data('hash') === hash ) $(nav).addClass('act');
    });
    navItem.on('click', function() {
        $(this).addClass('act').siblings().removeClass('act');
        const oldHash = window.location.hash.match(hashReg)[2];
        window.location.hash = $(this).data('hash');
        const newHash = $(this).data('hash');
        switchByHash(newHash, oldHash);
    });
})();
// 侧边栏3d图片切换
;(function() {
    // 引入服务器上的地址
    if( $(window).width() > 1200 ) picture3DSwitch($('#intrude-bg'), [`${host}/bg/bg1.png`, `${host}/bg/bg2.png`, `${host}/bg/bg3.png`, `${host}/bg/bg4.png`], 3, 8);
    else $('#intrude-bg').css('background-image', `url(${host}/bg/s-bg${Math.ceil(Math.random()*2)}.png)`);
})();
// 点赞
;(function() {
    $('#blog-box').delegate('.art-heart', 'click', function() {
        $(this).toggleClass('act');
    });
})();