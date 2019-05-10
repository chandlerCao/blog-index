import { app, host, ajax, tmp, getParmasByHash, Comment } from './blog-utils';
import { Page, TimestampFormat } from '../com/js/com';
export default [
    {
        reg: /^article\?type=technology&page=(\d+)$/,
        name: 'technology',
        href: '#article?type=technology&page=1',
        text: '前端',
        target: '',
        icon: 'fa fa-html5',
        element: $(`<section id="article-box" class="blog-element"></section>`),
        fns: {
            // 文章点赞
            artLike() {
                let like_complete = true;
                this.element.off('click.artLike').delegate('.art-heart', 'click.artLike', function () {
                    if (!like_complete) return;
                    like_complete = false;
                    const aid = $(this).data('aid');
                    ajax({ url: '/index/article/givealike', data: { aid } }).then(likeInfo => {
                        // 点赞
                        if (likeInfo.likeState === 1) $(this).addClass('act');
                        // 取消赞
                        else $(this).removeClass('act');
                        // 赞个数赋值
                        $(this).find('.like-num:first').text(likeInfo.likeTotal);
                        like_complete = true;
                    });
                });
            }
        },
        handler: {
            ajax(data = {}) {
                return ajax({
                    url: '/index/article/getArticleList',
                    data
                });
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = TimestampFormat(articleItem.date);
                });
                const arrText = doT.template(tmp.articleTmp());
                // 博客盒子
                this.element.html(arrText(articleData));
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: '#article?type=technology&page=',
                    on_change() {
                        app.animate({
                            'scrollTop': 0
                        }, 'fast');
                    }
                });
                // 执行当前组件所有函数
                for (const fn in this.fns) {
                    this.fns[fn].call(this);
                }
            }
        }
    },
    {
        reg: /^article\?type=live&page=(\d+)$/,
        name: 'live',
        href: '#article?type=live&page=1',
        text: '生活',
        target: '',
        icon: 'fa fa-coffee',
        element: $('<section id="live-box" class="blog-element"></section>'),
        handler: {
            ajax(data = {}) {
                return ajax({
                    url: '/index/article/getArticleList',
                    data
                });
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = TimestampFormat(articleItem.date);
                });
                const arrText = doT.template(tmp.articleTmp());
                // 博客盒子
                this.element.html(arrText(articleData) || '暂无文章！');
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: '#article?type=live&page=',
                    on_change() {
                        app.animate({
                            'scrollTop': 0
                        }, 'fast');
                    }
                });
            }
        }
    },
    {
        reg: /^comment\?&page=(\d+)$/,
        name: 'comment',
        href: '#comment?&page=1',
        text: '留言',
        target: '',
        icon: 'fa fa-comment',
        element: $('<section id="message-box" class="blog-element"></section>'),
        handler: {
            ajax() {
                return new Promise(r => { r() });
            },
            callback() {
                new Comment(this.element, {
                    title: '留言板',
                    noCommentMsg: '当前没有留言，抢个沙发吧！',
                    methods: {
                        commentMore(page, callBack) {
                            const aid = getParmasByHash().aid;
                            ajax({
                                url: '/index/message/getMessageList',
                                data: { page }
                            }).then(resData => {
                                callBack && callBack(resData);
                            })
                        },
                        add(reqData, callBack) {
                            ajax({
                                type: 'post',
                                url: '/index/message/addMessage',
                                data: reqData,
                            }).then(resData => {
                                callBack && callBack(resData);
                            });
                        },
                        like(reqData, callBack) {
                            ajax({
                                type: 'post',
                                url: '/index/message/messageLike',
                                data: reqData
                            }).then(resData => {
                                callBack && callBack(resData);
                            });
                        },
                        replyMore(reqData, callBack) {
                            ajax({
                                url: '/index/message/getMReplyList',
                                data: reqData
                            }).then(resData => {
                                callBack && callBack(resData);
                            });
                        }
                    }
                });
            }
        }
    },
    {
        reg: /^aboutMe$/,
        href: 'https://www.caodj.cn',
        text: '简历',
        target: 'target="_blank"',
        icon: 'fa fa-book',
        element: $('<section id="mood-box" class="blog-element"></section>'),
        reqUrl: '/index/article/getArticleList'
    },
    {
        reg: /^article\?tag=(.+)&page=(\d+)$/,
        name: 'articleTagList',
        element: $('<section id="article-tag-box" class="blog-element"></section>'),
        fns: {
            // 文章点赞
            artLike() {
                let like_complete = true;
                this.element.off('click.artLike').delegate('.art-heart', 'click.artLike', function () {
                    if (!like_complete) return;
                    like_complete = false;
                    const aid = $(this).data('aid');
                    ajax({ url: '/index/article/givealike', data: { aid } }).then(likeInfo => {
                        // 点赞
                        if (likeInfo.likeState === 1) $(this).addClass('act');
                        // 取消赞
                        else $(this).removeClass('act');
                        // 赞个数赋值
                        $(this).find('.like-num:first').text(likeInfo.likeTotal);
                        like_complete = true;
                    });
                });
            }
        },
        handler: {
            ajax(data = {}) {
                return ajax({
                    url: '/index/article/getArticleListByTag',
                    data
                });
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = TimestampFormat(articleItem.date);
                });
                const arrText = doT.template(tmp.articleTmp());
                // 博客盒子
                this.element.html(arrText(articleData));
                // 分页
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: `#article?tag=${getParmasByHash().tag}&page=`,
                    on_change() {
                        app.animate({
                            scrollTop: 0
                        }, 'fast');
                    }
                });
                // 执行当前组件所有函数
                for (const fn in this.fns) {
                    this.fns[fn].call(this);
                }
            }
        }
    },
    {
        reg: /^article\?searchText=(.+)&page=(\d+)$/,
        name: 'articleTagList',
        element: $('<section id="article-search-box" class="blog-element"></section>'),
        fns: {
            // 文章点赞
            artLike() {
                let like_complete = true;
                this.element.off('click.artLike').delegate('.art-heart', 'click.artLike', function () {
                    if (!like_complete) return;
                    like_complete = false;
                    const aid = $(this).data('aid');
                    ajax({ url: '/index/article/givealike', data: { aid } }).then(likeInfo => {
                        // 点赞
                        if (likeInfo.likeState === 1) $(this).addClass('act');
                        // 取消赞
                        else $(this).removeClass('act');
                        // 赞个数赋值
                        $(this).find('.like-num:first').text(likeInfo.likeTotal);
                        like_complete = true;
                    });
                });
            }
        },
        handler: {
            ajax(data = {}) {
                return ajax({
                    url: '/index/article/getArticleBySearch',
                    data
                });
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = TimestampFormat(articleItem.date);
                });
                const arrText = doT.template(tmp.articleTmp());
                // 博客盒子
                this.element.html(arrText(articleData));
                // 分页
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: `#article?searchText=${getParmasByHash().searchText}&page=`,
                    on_change() {
                        app.animate({
                            scrollTop: 0
                        }, 'fast');
                    }
                });
                // 执行当前组件所有函数
                for (const fn in this.fns) {
                    this.fns[fn].call(this);
                }
            }
        }
    },
    {
        reg: /^article\?aid=(\w+)$/,
        name: 'articleContent',
        element: $('<section id="markdown-box" class="blog-element"></section>'),
        fns: {
            // 生成文章目录
            createCatalog(text = '') {
                // 匹配h标签正则
                const re = /<(h[1-3])><a id="(\w+)"><\/a>(.+)<\/\1>/ig;
                // 每一个标题
                let catalogCache, catalogStr = '';
                // 正则匹配文章标题
                while ((catalogCache = re.exec(text)) !== null) {
                    const tag = catalogCache[1];
                    const id = catalogCache[2];
                    const html = catalogCache[3];
                    catalogStr += `<div class="catalog-item catalog-${tag}" data-id="${id}" title="${html}">
                    <a href="javascript:;" class="catalog-link">${html}</a></div>`;
                }
                return {
                    catalogStr,
                    handler(scroll_el) {
                        // 目录点击事件
                        const catalogItem = $('.catalog-item');
                        catalogItem.each(function (i, catalog) {
                            const id = $(this).data('id');
                            $(catalog).data('top', $('#' + id).position().top - 20);
                            $(catalog).click(function () {
                                catalogItem.removeClass('act');
                                $(this).addClass('act');
                                scroll_el.stop().animate({ 'scrollTop': $(this).data('top') }, 400);
                            });
                        });
                    }
                }
            },
            // 滚动条到评论位置，获取评论列表
            getCommentList() {
                const _this = this;
                // markdown-comment
                const markdownComment = _this.element.find('.markdown-comment:first');
                // 自动滑到评论区按钮
                _this.element.find('.comment-trigger-btn:first').on('click', function () {
                    app.animate({
                        scrollTop: markdownComment.position().top
                    }, 300);
                });
                // 监听滚动条变化，是否到达评论区域
                app.off('scroll.comment').on('scroll.comment', () => {
                    if (markdownComment.offset().top <= $(window).height()) {
                        app.off('scroll.comment');
                        // 评论
                        new Comment(markdownComment, {
                            title: '评论区（纯手工，望大佬们手下留情~）',
                            methods: {
                                commentMore(page, callBack) {
                                    const aid = getParmasByHash().aid;
                                    ajax({
                                        url: '/index/comment/getCommentList',
                                        data: { aid, page }
                                    }).then(resData => {
                                        callBack && callBack(resData);
                                    })
                                },
                                add(reqData, callBack) {
                                    ajax({
                                        type: 'post',
                                        url: '/index/comment/addComment',
                                        data: reqData,
                                    }).then(resData => {
                                        callBack && callBack(resData);
                                    });
                                },
                                like(reqData, callBack) {
                                    ajax({
                                        type: 'post',
                                        url: '/index/comment/commentLike',
                                        data: reqData
                                    }).then(resData => {
                                        callBack && callBack(resData);
                                    });
                                },
                                replyMore(reqData, callBack) {
                                    ajax({
                                        url: '/index/comment/getReplyList',
                                        data: reqData
                                    }).then(resData => {
                                        callBack && callBack(resData);
                                    });
                                }
                            }
                        });
                    }
                });
                app.trigger('scroll.comment');
            },
            // 文章点赞
            artLike() {
                let likeReq = false;
                const likeBtn = this.element.find('.art-heart-btn:first');
                likeBtn.on('click', function () {
                    if (likeReq) return;
                    likeReq = true;
                    const aid = $(this).data('aid');
                    const likeSub = $(this).find('.com-badge:first');
                    ajax({ url: '/index/article/givealike', data: { aid } }).then(likeInfo => {
                        if (likeInfo.likeState === 1) {
                            $(this).addClass('red');
                            likeSub.addClass('red');
                        }
                        else {
                            $(this).removeClass('red');
                            likeSub.removeClass('red');
                        }
                        likeSub.text(likeInfo.likeTotal);
                        likeReq = false;
                    })
                });
            }
        },
        tmps: {
            // 文章模板
            articleMainTmp() {
                return `<div id="markdown-main" class="markdown-main com-block">
                    <!-- 文字标题 -->
                    <div class="markdown-title">
                        <h1>{{=it.title}}</h1>
                    </div>
                    <!-- 文章元信息 -->
                    <div class="markdown-meta">
                        <!-- 文章发布时间 -->
                        <time class="com-icon meta-time">
                            <i class="com-icon__pic calendar-icon">&nbsp;</i>
                            <span class="com-icon__text">{{=it.date}}</span>
                        </time>
                        <!-- 文章点赞 -->
                        <!-- <a href="javascript:;" class="com-icon heart-box art-heart art-icon {{? it.is_like }} act {{?}}" data-aid="{{=it.aid}}">
                            <i class="com-icon__pic heart-icon__pic"></i>
                            <span class="com-icon__text heart-icon__text">喜欢(<span class="like-num">{{=it.like_count}}</span>)</span>
                        </a> -->
                        <!-- 文章阅读量 -->
                        <span class="com-icon meta-like">
                            <i class="com-icon__pic eye-icon">&nbsp;</i>
                            <span class="com-icon__text">阅读({{=it.read_count}})</span>
                        </span>
                        <!-- 文章标签 -->
                        <a href="#article?tag={{=it.tag_name}}&page=1" class="com-icon art-tag art-icon">
                            <i class="com-icon__pic tag-icon" style="background-image: url(${host}/{{=it.tag_url}})"></i>
                            <span class="com-icon__text">{{=it.tag_name}}</span>
                        </a>
                    </div>
                    <!-- 文章前言 -->
                    <div class="markdown-preface">{{=it.preface}}</div>
                    <!-- 文章封面 -->
                    <div class="markdown-cover" style="background-image: url(${host}/{{=it.cover}})"></div>
                    <!-- 文章内容 -->
                    <div class="markdown-content">{{=it.markdownHtml}}</div>
                    <!-- 文章评论 -->
                    <div class="markdown-comment"></div>
                </div>
                <!-- 目录 -->
                <div class="markdown-action com-scroll">
                    <div class="markdown-action-wrap">
                        <div class="mb20">
                            <div class="markdown-catalog com-block">
                                <div class="markdown-catalog-title">
                                    <span class="markdown-catalog-item">目录</span>
                                </div>
                                {{=it.catalog}}
                            </div>
                        </div>
                        <!-- 操作 -->
                        <div class="mb20">
                            <div class="markdown-handler">
                            <!-- 评论区 -->
                            <button class="comment-trigger-btn com-button blue mini"><i class="fa fa-comment"></i> <sup class="com-badge blue">{{=it.commentCount}}</sup>评论区</button>
                            <!-- 点赞 -->
                            <button class="art-heart-btn com-button mini {{? it.is_like }} red {{?}}" data-aid="{{=it.aid}}"><i class="fa fa-thumbs-up"></i> <sup class="com-badge {{? it.is_like }} red {{?}}">{{=it.like_count}}</sup>喜欢</button>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        },
        handler: {
            ajax(data = {}) {
                return ajax({
                    url: '/index/article/getArticleCnt',
                    data
                });
            },
            callback(data = {}) {
                // 格式化日期
                data.date = TimestampFormat(data.date);
                // 生成文章目录
                const catalogRes = this.fns.createCatalog(data.markdownHtml);
                data.catalog = catalogRes.catalogStr;
                // 生成文字模板 dot
                var markdown_cnt = doT.template(this.tmps.articleMainTmp())(data);
                // 获取文章内容div
                $(markdown_cnt).appendTo($(`<div id="markdown-wrap" class="clear"></div>`).appendTo(this.element));
                // 执行目录点击事件
                catalogRes.handler(app);
                // 执行当前组件所有函数
                for (const fn in this.fns) {
                    this.fns[fn].call(this);
                }
            }
        }
    }
];