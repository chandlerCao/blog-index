import {navData, addEllipsis, ajax} from './public';
const blogBox = $('#blog-box');
const hashReg = /(^#)([^\/]+)/i;
let hash = '';
(function() {
    const hashArr = window.location.hash.match(hashReg);
    // 如果配置文件里面有hash
    if( navData[ hashArr[2] ] ) hash = hashArr[2];
    else {
        hash = 'blog';
        window.location.hash = 'blog';
    }
})();
// hash和文章的交互
(function() {
    // const blogBox = $('#blog-box');
    // const articleBox = $('#article-box');
    // let [
    //     articleList,
    //     articleCnt
    // ] = [
    //     $('<li id="article-list"></li>'),
    //     $('<li id="article-cnt" class="markdown-preview OneDark moving"></li>')
    // ];
    // const article_cnt_aggregate = {};
    // // 是否请求过列表
    // let getArticleList_request = false;
    // // 列表显示
    // const article_list_show = function() {
    //     articleBox.append(articleList);
    //     articleCnt.addClass('moving');
    //     setTimeout(function() {
    //         articleList.removeClass('moving');
    //     }, 30);
    //     setTimeout(function() {
    //         articleCnt.detach();
    //     }, 300);
    // };
    // // 内容显示
    // const article_cnt_show = function() {
    //     articleBox.append(articleCnt);
    //     articleList && articleList.addClass('moving');
    //     setTimeout(function() {
    //         articleCnt.removeClass('moving');
    //     }, 30);
    //     setTimeout(function() {
    //         articleList && articleList.detach();
    //     }, 300);
    // };
    // // 交换显示
    // const article_toggle_show = function() {
    //     if( window.location.hash === '' ) article_list_show();
    //     else article_cnt_show();
    // };
    // // 获取文章列表
    // function getArticleList() {
    //     getArticleList_request = true;
    //     $.ajax({
    //         type: "post",
    //         data: {
    //             page: 1
    //         },
    //         url: `${host}/index/getArticleList`,
    //         dataType: "json"
    //     })
    //     .done(function(data) {
    //         const articleData = data.articleList;
    //         articleData.map(function(articleItem) {
    //             // 存储文章内容
    //             article_cnt_aggregate[articleItem.aid] = articleItem.content;
    //             articleItem.date = articleItem.date.split('T')[0];
    //         });
    //         const arrText = doT.template($("#article-tpl").text());
    //         blogBox.append(articleList.html(arrText(articleData)));
    //         // 添加省略号
    //         setTimeout(function() {
    //             $('.art-note').each(function (index, el) {
    //                 addEllipsis($(el));
    //             });
    //         }, 50);
    //     })
    //     .catch(function() {
    //         alert('获取文章列表失败！');
    //     })
    //     .always(function() {
    
    //     })
    // };
    // // 根据文章id获取文章
    // const getDataByHash = function() {
    //     const aid = getQueryByHash('aid');
    //     if( aid ) {
    //         $.ajax({
    //             type: "post",
    //             url: `${host}/index/getArticleByHash`,
    //             data: {aid: aid},
    //             dataType: "json"
    //         })
    //         .done(function(data) {
    //             if( data.code === 0 ) {
    //                 const articleInfo = data.articleInfo[0];
    //                 articleCnt.html(articleInfo.content);
    //                 article_cnt_show();
    //             } else alert(data.msg);
    //         })
    //         .catch(function() {
    //             alert('查询失败！');
    //         })
    //         .always(function() {
        
    //         });
    //     } else getArticleList();
    // };
    // getDataByHash();
    // // 查看文章内容
    // blogBox.delegate('.art-wrap', 'click', function() {
    //     const aid = $(this).data('aid');
    //     window.location.hash = `aid=${aid}`;
    //     articleCnt.html( article_cnt_aggregate[aid] );
    // });
    // // 文章返回
    // window.onhashchange = function() {
    //     article_toggle_show();
    //     if( !getArticleList_request ) getArticleList();
    // };
    // // 点赞
    // (function() {
    //     blogBox.delegate('.art-heart', 'click', function() {
    //         $(this).find('.heart:first').toggleClass('heartBlast');
    //     })
    // })();
})();
// 存储回调函数
var element_req_cb = {};
// 请求函数
;(function() {
    // 请求函数
    const element_callBack = [
        // 文章请求
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
                const arrText = doT.template($("#article-tpl").text());
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
                const arrText = doT.template($("#article-tpl").text());
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
                const arrText = doT.template($("#article-tpl").text());
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
        element_req_cb[hash] = element_callBack[index] || function() {};
        index ++;
    }
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
    setTimeout(function() {
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
                element_req_cb[newHash]();
            }
            elementSwitch(navData[newHash].element,  navData[oldHash] ? navData[oldHash].element : $());
        }
    }
};
// 首次加载
;(function() {
    switchByHash(hash);
})();
// 创建导航菜单
;(function() {
    // 获取导航ul
    const navList = $('#nav-list');
    const navText = doT.template($("#nav-tpl").text());
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