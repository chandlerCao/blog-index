import { Page } from '../com/js/com';
export const host = 'http://192.168.1.34:1111';
// app
export const app = $('#app');
// 路由
export const navData = [
    {
        reg: /^article\?type=technology&page=(\d+)$/,
        name: 'technology',
        href: '#article?type=technology&page=1',
        text: '前端',
        target: '',
        articleTmp() {
            return `{{~it:atc}}
                <article class="article-item">
                    <div class="art-pretty">
                        <b class="art-dotts"></b>
                        <time class="art-time">
                            {{=atc.date}}
                        </time>
                    </div>
                    <div class="art-main">
                        <a href="#article?aid={{=atc.aid}}" class="art-wrap">
                            <div class="art-info">
                                <h2 class="art-title">{{=atc.title}}</h2>
                                <h3 class="art-note" title="{{=atc.preface}}">
                                    <span>{{=atc.preface}}</span>
                                </h3>
                            </div>
                            <div class="art-img" style="background-image: url({{=atc.cover}})"></div>
                        </a>
                        <div class="art-meta">
                            <a href="javascript:;" class="art-heart art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">
                                <i class="heart-icon__pic"></i>
                                <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                            </a>
                            <a href="javascript:;" class="com-icon art-comment art-icon mr20">
                                <i class="com-icon__pic eye-icon"></i>
                                <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                            </a>
                            <a href="#article?tag={{=atc.tag_name}}&page=1" class="com-icon art-tag art-icon mr20">
                                <i class="com-icon__pic tag-icon" style="background-image: url({{=atc.tag_url}}"></i>
                                <span class="com-icon__text">{{=atc.tag_name}}</span>
                            </a>
                        </div>
                    </div>
                </article>
            {{~}}`
        },
        icon: 'fa fa-html5',
        element: $(`<section id="article-box" class="blog-element"></section>`),
        handler: {
            ajax(data = {}) {
                return ajax('/index/article/getArticleList', data);
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(this.articleTmp());
                // 博客盒子
                this.element.html(arrText(articleData));
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    theme: '#2e97ff',
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
        articleTmp: `{{~it:atc}}
            <article class="article-item">
                <div class="art-pretty">
                    <b class="art-dotts"></b>
                    <time class="art-time">
                        {{=atc.date}}
                    </time>
                </div>
                <div class="art-main">
                    <a href="#article?aid={{=atc.aid}}" class="art-wrap">
                        <div class="art-info">
                            <h2 class="art-title">{{=atc.title}}</h2>
                            <h3 class="art-note" title="{{=atc.preface}}">
                                <span>{{=atc.preface}}</span>
                            </h3>
                        </div>
                        <div class="art-img" style="background-image: url({{=atc.cover}})"></div>
                    </a>
                    <div class="art-meta">
                        <a href="javascript:;" class="art-heart art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">
                            <i class="heart-icon__pic"></i>
                            <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                        </a>
                        <a href="javascript:;" class="com-icon art-comment art-icon mr20">
                            <i class="com-icon__pic eye-icon"></i>
                            <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                        </a>
                        <a href="#article?tag={{=atc.tag_name}}&page=1" class="com-icon art-tag art-icon mr20">
                            <i class="com-icon__pic tag-icon" style="background: url({{=atc.tag_url}}"></i>
                            <span class="com-icon__text">{{=atc.tag_name}}</span>
                        </a>
                    </div>
                </div>
            </article>
        {{~}}`,
        icon: 'fa fa-coffee',
        element: $('<section id="live-box" class="blog-element"></section>'),
        handler: {
            ajax(data = {}) {
                return ajax('/index/article/getArticleList', data)
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(this.articleTmp);
                // 博客盒子
                this.element.html(arrText(articleData));
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: '#article?type=live&page=',
                    theme: '#2e97ff',
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
            },
            callback(data = {}) {
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
        articleTmp: `{{~it:atc}}
            <article class="article-item">
                <div class="art-pretty">
                    <b class="art-dotts"></b>
                    <time class="art-time">
                        {{=atc.date}}
                    </time>
                </div>
                <div class="art-main">
                    <a href="#article?aid={{=atc.aid}}" class="art-wrap">
                        <div class="art-info">
                            <h2 class="art-title">{{=atc.title}}</h2>
                            <h3 class="art-note" title="{{=atc.preface}}">
                                <span>{{=atc.preface}}</span>
                            </h3>
                        </div>
                        <div class="art-img" style="background-image: url({{=atc.cover}})"></div>
                    </a>
                    <div class="art-meta">
                        <a href="javascript:;" class="art-heart art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">
                            <i class="heart-icon__pic"></i>
                            <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                        </a>
                        <a href="javascript:;" class="com-icon art-comment art-icon mr20">
                            <i class="com-icon__pic eye-icon"></i>
                            <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                        </a>
                        <a href="#article?tag={{=atc.tag_name}}&page=1" class="com-icon art-tag art-icon mr20">
                            <i class="com-icon__pic tag-icon" style="background: url({{=atc.tag_url}}"></i>
                            <span class="com-icon__text">{{=atc.tag_name}}</span>
                        </a>
                    </div>
                </div>
            </article>
        {{~}}`,
        handler: {
            ajax(data = {}) {
                return ajax('/index/article/getArticleListByTag', data)
            },
            callback(data = {}) {
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(this.articleTmp);
                // 博客盒子
                this.element.html(arrText(articleData));
                new Page({
                    par: this.element,
                    total: data.total,
                    page_size: data.page_size,
                    now_page: parseInt(getParmasByHash().page),
                    url: `#article?tag=${getParmasByHash().tag}&page=`,
                    theme: '#2e97ff',
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
            // 日期格式化
            dateFormatter(date) {
                return date.split('T')[0];
            }
        },
        tmps: {
            // 文章模板
            articleMainTmp() {
                return `<div id="markdown-main" class="markdown-main com-scroll">
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
                        <a href="javascript:;" class="com-icon art-heart art-icon {{? it.is_like }} act {{?}}" data-aid="{{=it.aid}}">
                            <i class="com-icon__pic heart-icon__pic"></i>
                            <span class="com-icon__text heart-icon__text">喜欢(<span class="like-num">{{=it.like_count}}</span>)</span>
                        </a>
                        <!-- 文章阅读量 -->
                        <span class="com-icon meta-like">
                            <i class="com-icon__pic eye-icon">&nbsp;</i>
                            <span class="com-icon__text">阅读({{=it.read_count}})</span>
                        </span>
                        <!-- 文章标签 -->
                        <a href="#article?tag={{=it.tag_name}}&page=1" class="com-icon art-tag art-icon">
                            <i class="com-icon__pic tag-icon" style="background-image: url({{=it.tag_url}})"></i>
                            <span class="com-icon__text">{{=it.tag_name}}</span>
                        </a>
                    </div>
                    <!-- 文章前言 -->
                    <div class="markdown-preface">{{=it.preface}}</div>
                    <!-- 文章封面 -->
                    <div class="markdown-cover" style="background-image: url({{=it.cover}})"></div>
                    <!-- 文章内容 -->
                    <div class="markdown-content">{{=it.markdownHtml}}</div>
                    <!-- 评论 -->
                    ${this.commentBox()}
                </div>
                <!-- 目录 -->
                <div class="markdown-action com-scroll">
                    <div class="markdown-catalog">
                        <div class="markdown-catalog-title">
                            <span class="markdown-catalog-item">目录</span>
                        </div>
                        {{=it.catalog}}
                    </div>
                </div>`
            },
            // 评论block
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
                            ${this.pubPublishInput()}
                        </div>
                    </div>
                    <!-- 评论列表 -->
                    <div class="comment-box">
                        <!-- 评论列表项 -->
                        ${this.commentList()}
                    </div>
                </div>`
            },
            // 头像
            userFace() {
                return `<div class="user-face"></div>`
            },
            // 公共评论输入框
            pubPublishInput(placeholder = '说点啥呗~') {
                return `<div class="pub-publish-submit mt10">
                    <div class="publish-input">
                        <input type="text" class="com-area comment-input" placeholder="${placeholder}">
                    </div>
                    <div class="publish-action clear">
                        <button type="button" class="publish-btn com-button blue mini"> <i class="fa fa-send"></i> 评论</button>
                    </div>
                </div>`
            },
            // 公共评论主要内容展示
            pubPublishContent(type = "comment") {
                return `<div class="pub-publish-content">
                    <div class="user-name">翠花</div>
                    <div class="comment-content">我要给你生猴子！</div>
                    <div class="comment-bar clear mt10">
                        <div class="com-icon fl">
                            <i class="com-icon__pic calendar-icon"></i>
                            <span class="com-icon__text">2018-12-31</span>
                        </div>
                        <div class="${type}-action fr">
                            <a href="javascript:;" class="art-heart art-icon act mr20">
                                <i class="heart-icon__pic"></i>
                                <span class="heart-icon__text">喜欢(<span class="like-num">5</span>)</span>
                            </a>
                            <a href="javascript:;" class="com-icon">
                                <i class="com-icon__pic reply-icon">&nbsp;</i>
                                <span class="com-icon__text">回复</span>
                            </a>
                        </div>
                    </div>
                </div>`
            },
            // 评论列表项
            commentList(commentData = [1, 2, 3, 4, 5, 6, 7]) {
                return commentData.reduce((commentStr, commentItem) => {
                    return commentStr += `<div class="comment-item mt20">
                        ${this.userFace()}
                        <div class="ml50">
                            ${this.pubPublishContent()}
                            <!-- 回复block，如果有回复内容 -->
                            <div class="reply-box mt10">
                                ${this.replyList()}
                            </div>
                        </div>
                    </div>`
                }, '')
            },
            // 回复列表
            replyList(replyData = [1, 2]) {
                return replyData.reduce((replyStr, replyItem) => {
                    return replyStr += `<div class="reply-item">
                        <div class="reply-wrap">
                            ${this.userFace()}
                            <div class="ml50">
                                ${this.pubPublishContent('reply')}
                            </div>
                        </div>
                    </div>`
                }, '')
            }
        },
        handler: {
            ajax(data = {}) {
                return ajax('/index/article/getArticleCnt', data)
            },
            callback(data = {}) {
                // 格式化日期
                data.date = this.fns.dateFormatter(data.date);
                // 生成文章目录
                const catalogRes = this.fns.createCatalog(data.markdownHtml);
                data.catalog = catalogRes.catalogStr;
                // 生成文字模板 dot
                var markdown_cnt = doT.template(this.tmps.articleMainTmp())(data);
                // 获取文章内容div
                $(markdown_cnt).appendTo($(`<div id="markdown-wrap" class="clear"></div>`).appendTo(this.element));
                // 执行目录点击事件
                catalogRes.handler(app);
            }
        }
    }
];
// ajax
export const ajax = function (url, data = {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'get',
            url: `${host}${url}`,
            data,
            dataType: 'json'
        }).done(data => {
            if (data.c === 0) resolve(data.d);
            else {
                reject()
                alert(data.m)
            }
        }).catch(err => {
            alert('请求超时！');
        });
    });
}
// 获取hash动态路径参数
export const getParmasByHash = function () {
    const hash = window.location.hash;
    const regArr = hash.match(/(\w+)=[^&]+/g);
    const data = {};
    if (regArr && regArr.length) {
        regArr.forEach(params => {
            const paramsArr = params.split('=');
            data[paramsArr[0]] = paramsArr[1];
        });
        return data;
    } else return {};
}
// 侧边栏背景切换
export const banner3d = function (box, imgArr) {
    /**
     * box: 父级
     * imgArr 图片数组
     * rowLen 横排个数
     * colLen 竖排个数
     */
    // 盒子宽高
    const box_width = box.width();
    const box_height = box.height();

    let img_width, img_height;
    getImageSizeByUrl(imgArr[0]).then(imgSize => {
        img_width = imgSize.w;
        img_height = imgSize.h;

        let new_width, new_height;
        if (img_width < box_width) {
            new_width = box_width;
            new_height = box_height * box_width / img_width;
        } else if (img_height < box_height) {
            new_height = box_height;
            new_width = box_width * box_height / img_height;
        }

        init(new_width, new_height)
    }).catch(e => {
    });

    function init(new_width, new_height) {
        let rowLen = 3, colLen = 5;

        // 单元宽高
        const cell_w = Math.floor(box_width / rowLen);
        const cell_h = box_height / colLen;
        // 单元格总数
        const cell_num = rowLen * colLen;
        // 循环生成
        let html = ``;
        new Array(cell_num).fill('').forEach((item, i) => {
            let str = ``;
            imgArr.forEach((url, j) => {
                let transform = '';
                if (j === 0) transform = `transform: rotateY(0)`;
                if (j === 1) transform = `transform: rotateY(90deg)`;
                if (j === 2) transform = `transform: rotateY(180deg)`;
                if (j === 3) transform = `transform: rotateY(270deg)`;
                const bpx = i % rowLen * cell_w;
                const bpy = Math.floor(i / rowLen) * cell_h;
                str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: ${new_width}px ${new_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 20s ${0.04 * i + 2}s infinite"></div>`;
            });
            html += `<div style="transform-style: preserve-3d; float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
        });
        box.html(html);
    }

    // 获取图片宽高
    function getImageSizeByUrl(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                resolve({ w: img.width, h: img.height });
            }
            img.onerror = function (e) {
                reject(e);
            }
            img.src = src;
        })
    }
}
// 日期格式化
export const formateDate = function (date) {
    const new_date = date.slice(0, date.length - 5).replace('T', ' ');
    // 获取时间日期
    const hour = parseInt(new_date.match(/\s(\d+)/));
    // 增加八个小时
    const new_hour = toZero(hour + 8);
    return new_date.replace(/\s(\d+)/, ' ' + new_hour);
}
// 转为0
export const toZero = function (num) {
    return num < 10 ? '0' + num : num;
}
// 本地存储
export const storage = {
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }
}
// 图片加载完成
export const imgload = function (src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
            resolve(img);
        }
        img.onerror = function (e) {
            reject(e);
        }
        img.src = src;
    })
}
// 模板
export const tmp = {
    // 导航
    navTmp: `{{~it:nav}}
        <li class="nav-item" data-reg="{{=nav.reg}}">
            <a href="{{=nav.href}}" class="nav-outer" {{=nav.target}}>
                <span class="nav-inner">
                    <i class="nav-icon {{=nav.icon}}"></i>
                    <span class="nav-text">{{=nav.text}}</span>
                </span>
            </a>
        </li>
    {{~}}`
}