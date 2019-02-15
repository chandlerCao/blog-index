import { app, host, ajax, tmp, getParmasByHash, artLike } from './blog-utils';
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
                this.element.html(arrText(articleData));
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
        element: $('<section id="comment-box" class="blog-element"></section>'),
        handler: {
            ajax(data = {}) {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            },
            callback(data = {}) {
                this.element.html('留言');
            }
        }
    },
    {
        reg: /^aboutMe$/,
        href: 'http://resume.caodj.cn',
        text: '简历',
        target: 'target="_blank"',
        icon: 'fa fa-book',
        element: $('<section id="mood-box" class="blog-element"></section>'),
        reqUrl: '/index/article/getArticleList'
    },
    {
        reg: /^article\?tag=(\w+)&page=(\d+)$/,
        name: 'articleTagList',
        element: $('<section id="article-tag-box" class="blog-element"></section>'),
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
                    catalogStr += `<div class="catalog-item catalog-${tag}" data-id="${id}">
                    <a href="javascript:;" class="catalog-link">${html}</a></div>`;
                }
                return {
                    catalogStr,
                    handler(scroll_el) {
                        // 目录点击事件
                        const catalogItem = $('.catalog-item');
                        catalogItem.each(function (i, catalog) {
                            const id = $(this).data('id');
                            $(catalog).data('top', $('#' + id).position().top - 30);
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
                // 评论列表父级
                const commentBox = _this.element.find('.comment-box:first');
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
                        renderCommentList.call(_this);
                    }
                });
                app.trigger('scroll.comment');
                // 加载更多评论点击
                const commentMore = _this.element.find('.comment-more:first');
                commentMore.on('click', function () {
                    // 获取当前页码
                    if (!$(this).data('page')) {
                        $(this).data('page', 1);
                    } else {
                        $(this).data('page', $(this).data('page') + 1);
                    }
                    renderCommentList.call(_this, $(this).data('page'));
                });
                // 发送请求，渲染评论
                function renderCommentList(page = 0) {
                    const aid = getParmasByHash().aid;
                    ajax({
                        url: '/index/comment/getCommentList',
                        data: { aid, page }
                    }).then(data => {
                        const { commentList, isMore } = data;
                        if (commentList && commentList.length) {
                            const commentListStr = this.tmps.commentList(commentList);
                            commentBox.append(commentListStr);
                        }
                        if (isMore === 0) commentMore.remove();
                    })
                }
            },
            // 添加评论（回复）
            addComment() {
                const _this = this;
                _this.element.off('click.publish').delegate('.publish-btn', 'click.publish', function () {
                    const $this = $(this);
                    // 获取评论输入框
                    const commentInp = $this.parent().prev().find('.comment-input:first');
                    const commentVal = $.trim(commentInp.val());
                    // 如果评论为空，提示
                    if (!commentVal) { alert('说点啥呗~'); return; }
                    // 获取用户名输入框
                    const userVal = $.trim($this.prev().val());
                    if (!userVal) { alert('尊姓大名！'); return; }
                    // 清空输入框值
                    commentInp.val('');

                    // 获取当前按钮类型
                    const type = $this.data('type');
                    // 请求参数
                    const reqData = {
                        content: commentVal,
                        user: userVal,
                        aid: getParmasByHash().aid,
                    };
                    if (type === 'reply') {
                        const { cid, cuser } = $this.parents('.pub-publish-content:first').data();
                        reqData.cid = cid;
                        reqData.toUser = cuser;
                    }
                    // 添加评论请求
                    ajax({
                        type: 'post',
                        url: '/index/comment/addComment',
                        data: reqData,
                    }).then(data => {
                        if (type === 'comment') {
                            // 获取评论列表盒子
                            const commentBox = $this.parents('.publish-box:first').siblings('.comment-box:first');
                            commentBox.prepend(_this.tmps.commentList(data));
                            commentBox.find('.no-comment:first').remove();
                        } else {
                            const commentMainCnt = $this.parents('.pub-publish-submit:first');
                            commentMainCnt.next().append(_this.tmps.commentList(data, type));
                            // 关闭回复输入框
                            commentMainCnt.hide();
                        }
                    });
                });
            },
            // 触发回复
            replyAction() {
                const _this = this;
                // 上个回复框
                let prevReplyInput = $();
                this.element.off('click.replyAction').delegate('.reply-action', 'click.replyAction', function (e) {
                    e.stopPropagation();
                    // 当前回复的评论条目
                    const commentMainCnt = $(this).parents('.pub-publish-content:first');
                    // 当前回复的评论信息
                    const commentInfo = commentMainCnt.data();
                    // 判断是否生成了回复输入框
                    const replyInput = commentMainCnt.find('>.pub-publish-submit:first');
                    // 隐藏上个回复框
                    if (replyInput.length) {
                        if (prevReplyInput[0] === replyInput[0]) replyInput.toggle();
                        else {
                            prevReplyInput.hide();
                            replyInput.show();
                        }
                        prevReplyInput = replyInput;
                    } else {
                        prevReplyInput.hide();
                        commentMainCnt.find('.comment-bar:first').after(_this.tmps.pubPublishInput({
                            type: 'reply',
                            plh: `回复${commentInfo.cuser}`,
                            subText: '回复',
                            bgColor: commentInfo.type === 'comment' ? '#f8fafc' : '#fff'
                        }));
                        prevReplyInput = commentMainCnt.find('>.pub-publish-submit:first');
                    }
                });
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
                    artLike(aid).then(likeInfo => {
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
            },
            // 评论点赞
            commentLike() {
                let like_complete = true;
                this.element.off('click.commentLike').delegate('.comment-like', 'click.commentLike', function () {
                    if (!like_complete) return;
                    like_complete = false;
                    const cid = $(this).data('cid');
                    ajax({
                        type: 'post',
                        url: '/index/comment/commentLike',
                        data: { cid }
                    }).then(commentLikeInfo => {
                        if (commentLikeInfo.likeState) $(this).addClass('act');
                        else $(this).removeClass('act');
                        $(this).find('.like-num:first').text(commentLikeInfo.likeTotal);
                        like_complete = true;
                    });
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
                    <!-- 评论 -->
                    ${this.commentBox()}
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
                            <button class="art-heart-btn com-button mini {{? it.is_like }} red {{?}} ml20" data-aid="{{=it.aid}}"><i class="fa fa-thumbs-up"></i> <sup class="com-badge {{? it.is_like }} red {{?}}">{{=it.like_count}}</sup>喜欢</button>
                            </div>
                        </div>
                    </div>
                </div>`
            },
            // 评论父级block
            commentBox() {
                return `<div class="markdown-comment">
                    <div class="comment-line">
                        <span>评论</span>
                    </div>
                    <!-- 发布评论框 -->
                    <div class="publish-box">
                        <!-- 用户头像 -->
                        ${this.userFace()}
                        <div class="ml50">
                            <!-- 公共评论输入框 -->
                            ${this.pubPublishInput({ type: 'comment' })}
                        </div>
                    </div>
                    <!-- 评论列表 -->
                    <div class="comment-box">
                        <!-- 评论列表项 -->
                    </div>
                    <div class="comment-more mt10">加载更多 ></div>
                </div>`
            },
            // 头像
            userFace(str) {
                return `<div class="user-face fl">${str || ''}</div>`
            },
            // 公共评论（回复）输入框
            pubPublishInput(obj = {}) {
                return `<div class="pub-publish-submit mt10" style="background-color: ${obj.bgColor};">
                    <div class="publish-input">
                        <input type="text" class="com-text comment-input animated" placeholder="${obj.plh || '说点啥呗~'}">
                    </div>
                    <div class="publish-action">
                        <input type="text" class="com-text user-input animated" placeholder="我的大名！">
                        <button type="button" data-type="${obj.type}" class="${obj.type}-btn publish-btn com-button blue mini"> <i class="fa fa-send"></i> ${obj.subText || '评论'}</button>
                    </div>
                </div>`
            },
            // 公共评论主要内容展示
            pubPublishContent(commentItem, type = "comment") {
                return `<div class="pub-publish-content ${type}-publish-content" data-cid="${commentItem.cid}" data-cuser="${commentItem.user}" data-aid="${commentItem.aid}" data-type="${type}">
                    <div class="user-name">${commentItem.user}</div>
                    <div class="comment-content">${commentItem.toUser ? `回复 <span style="color: #2e97ff;">${commentItem.toUser}</span>：` : ''}${commentItem.content}</div>
                    <div class="comment-bar clear mt10">
                        <div class="com-icon fl">
                            <i class="com-icon__pic calendar-icon"></i>
                            <span class="com-icon__text">${TimestampFormat(commentItem.date)}</span>
                        </div>
                        <div class="${type}-action fr">
                            <a href="javascript:;" class="comment-like heart-box art-icon mr20 ${commentItem.isLike ? 'act' : ''}" data-cid="${commentItem.cid}">
                                <i class="heart-icon__pic"></i>
                                <span class="heart-icon__text">喜欢(<span class="like-num">${commentItem.likeCount}</span>)</span>
                            </a>
                            <a href="javascript:;" class="com-icon reply-action">
                                <i class="com-icon__pic reply-icon">&nbsp;</i>
                                <span class="com-icon__text">回复</span>
                            </a>
                        </div>
                    </div>
                    ${commentItem.replyList && commentItem.replyList.length ? `
                        <!-- 回复block，如果有回复内容 -->
                        <div class="reply-box mt10">${this.commentList(commentItem.replyList, 'reply')}</div>
                    ` : ``}
                </div>`
            },
            // 评论列表项
            commentList(commentData, type = "comment") {
                if (!commentData || !commentData.length) return '';
                return commentData.reduce((commentStr, commentItem) => {
                    return commentStr += `<div class="${type}-item item flipInX enter">
                        ${this.userFace(commentItem.user[0])}
                        <div class="ml50">
                            ${this.pubPublishContent(commentItem, type)}
                        </div>
                    </div>`
                }, '')
            },
            // noComment
            noComment(tip = '暂无评论！') {
                return `<div class="no-comment com-plain">${tip}</div>`;
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
                // 评论列表
                this.fns.getCommentList.call(this);
                // 添加评论
                this.fns.addComment.call(this);
                // 点赞
                this.fns.artLike.call(this);
                // 评论点赞
                this.fns.commentLike.call(this);
                // 回复
                this.fns.replyAction.call(this);
            }
        }
    }
];