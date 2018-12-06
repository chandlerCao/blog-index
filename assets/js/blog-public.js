import { page } from '../com/com';
// 后台端口
export const host = 'http://192.168.1.35:1111';
// 路由
export const navData = [
    {
        'reg': /^article\?page=(\d+)$/,
        'name': 'articleList',
        'href': '#article?page=1',
        'text': '前端',
        'icon': 'fa fa-html5',
        'element': $(`<section id="article-box" class="blog-element"></section>`),
        'reqUrl': '/index/article/getArticleList',
        'cb'(data = {}) {
            return new Promise(resolve => {
                ajax(this.reqUrl, data).then(({ data }) => {
                    const articleData = data.articleList;
                    articleData.map(function (articleItem) {
                        // 格式化日期
                        articleItem.date = articleItem.date.split('T')[0];
                    });
                    const arrText = doT.template(tmp.articleTmp);
                    // 博客盒子
                    this.element.html(arrText(articleData));
                    new page({
                        par: this.element,
                        total: data.total,
                        page_size: data.page_size,
                        now_page: parseInt(getParmasByHash().page),
                        theme: '#3b8cff',
                        url: '#article?page=',
                        on_change() {
                            console.log(1);
                            $('#app').animate({
                                'scrollTop': 0
                            }, 'fast');
                        }
                    });
                    resolve();
                });
            })
        }
    },
    {
        'reg': /^live$/,
        'name': 'liveList',
        'href': '#live',
        'text': '生活',
        'icon': 'fa fa-coffee',
        'element': $('<section id="live-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleList',
        'cb'(data = {}) {
            return new Promise(resolve => {
                ajax(this.reqUrl, data).then(({ data }) => {
                    const articleData = data.articleList;
                    articleData.map(function (articleItem) {
                        // 格式化日期
                        articleItem.date = articleItem.date.split('T')[0];
                    });
                    const arrText = doT.template(tmp.articleTmp);
                    // 博客盒子
                    this.element.html(arrText(articleData));
                    new page({
                        par: this.element,
                        total: data.total,
                        page_size: data.page_size,
                        now_page: parseInt(getParmasByHash().page),
                        url: '#article?page=',
                        on_change() {
                            $('#app').animate({
                                scrollTop: 0
                            }, 'fast');
                        }
                    });
                    resolve();
                });
            })
        }
    },
    {
        'reg': /^aboutMe$/,
        'href': 'https://www.baidu.com',
        'text': '简历',
        'icon': 'fa fa-book',
        'element': $('<section id="mood-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleList'
    },
    {
        "reg": /^article\?tid=(\d+)&page=(\d+)$/,
        'name': 'articleTagList',
        'element': $('<section id="article-tag-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleListByTag',
        'cb'(data = {}) {
            return new Promise(resolve => {
                ajax(this.reqUrl, data).then(({ data }) => {
                    const articleData = data.articleList;
                    articleData.map(function (articleItem) {
                        // 格式化日期
                        articleItem.date = articleItem.date.split('T')[0];
                    });
                    const arrText = doT.template(tmp.articleTmp);
                    // 博客盒子
                    this.element.html(arrText(articleData));
                    new page({
                        par: this.element,
                        total: data.total,
                        page_size: data.page_size,
                        now_page: parseInt(getParmasByHash().page),
                        url: `#article?tid=${getParmasByHash().tid}&page=`,
                        on_change() {
                            $('#app').animate({
                                scrollTop: 0
                            }, 'fast');
                        }
                    });
                    resolve();
                });
            })
        }
    },
    {
        'reg': /^article\?aid=(\w+)$/,
        'name': 'articleContent',
        'element': $('<section id="markdown-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleCnt',
        'cb'(data = {}) {
            return new Promise(resolve => {
                ajax(this.reqUrl, data).then(data => {
                    if (data.code === 0) {
                        let {
                            title,
                            preface,
                            markdownHtml,
                            cover,
                            date,
                            like_count,
                            read_count
                        } = data.articleContent;
                        // 格式化日期
                        date = date.split('T')[0];
                        // 匹配h标签正则
                        const re = /<(h[1-3])><a id="(\w+)"><\/a>(.+)<\/\1>/ig;
                        // 每一个标题
                        let catalogCache, catalogStr = '';
                        // 正则匹配文章标题
                        while ((catalogCache = re.exec(markdownHtml)) !== null) {
                            const tag = catalogCache[1];
                            const id = catalogCache[2];
                            const html = catalogCache[3];
                            catalogStr += `<div class="catalog-item catalog-${tag}" data-id="${id}">
                            <a href="javascript:;" class="catalog-link">${html}</a></div>`;
                        }
                        // 获取文章内容div
                        const markdown_main = $(`
                        <div id="markdown-main" class="markdown-main com-scroll">
                            <!-- 文字标题 -->
                            <div class="markdown-title">
                                <h1>${title}</h1>
                            </div>
                            <!-- 文章元信息 -->
                            <div class="markdown-meta">
                                <time class="com-icon meta-time">
                                    <i class="com-icon__pic calendar-icon">&nbsp;</i>
                                    <span class="com-icon__text">${date}</span>
                                </time>
                                <span class="com-icon meta-comment">
                                    <i class="com-icon__pic heart-icon">&nbsp;</i>
                                    <span class="com-icon__text">喜欢(${like_count})</span>
                                </span>
                                <span class="com-icon meta-like">
                                    <i class="com-icon__pic eye-icon">&nbsp;</i>
                                    <span class="com-icon__text">阅读(${read_count})</span>
                                </span>
                            </div>
                            <div class="markdown-preface">${preface}</div>
                            <div class="markdown-cover" style="background-image: url(${cover})"></div>
                            <div class="markdown-content">
                                ${markdownHtml}
                            </div>
                        </div>
                        <!-- 目录 -->
                        <div class="markdown-catalog com-scroll">
                            <div class="markdown-catalog-title">目录</div>
                            ${catalogStr}
                        </div>`).appendTo($(`<div id="markdown-wrap"></div>`).appendTo(this.element));
                        // 目录点击事件
                        const catalogItem = $('.catalog-item');
                        catalogItem.each(function (i, catalog) {
                            const id = $(this).data('id');
                            $(catalog).data('top', $('#' + id).offset().top - 40);
                            $(catalog).click(function () {
                                catalogItem.removeClass('act');
                                $(this).addClass('act');
                                markdown_main.scrollTop($(this).data('top'));
                            });
                        });
                        resolve();
                    }
                })
            })
        }
    }
];
// ajax
export const ajax = function (url, data = {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: `${host}${url}`,
            data,
            dataType: "json"
        }).done(data => {
            resolve(data);
        }).catch(err => {
            reject(err);
        });
    });
};
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
};
// 侧边栏背景切换
export const picture3DSwitch = function (box, imgArr) {
    /**
     * box: 父级
     * imgArr 图片数组
     * rowLen 横排个数
     * colLen 竖排个数
     */
    // 盒子宽高
    const box_width = box.width();
    const box_height = box.height();

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
            str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: ${box_width}px ${box_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 30s ${0.03 * i + 2}s infinite"></div>`;
        });
        html += `<div style="transform-style: preserve-3d; float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
    });
    box.html(html);
};
// 日期格式化
export const formateDate = function (date) {
    const new_date = date.slice(0, date.length - 5).replace('T', ' ');
    // 获取时间日期
    const hour = parseInt(new_date.match(/\s(\d+)/));
    // 增加八个小时
    const new_hour = toZero(hour + 8);
    return new_date.replace(/\s(\d+)/, ' ' + new_hour);
};
// 转为0
export const toZero = function (num) {
    return num < 10 ? '0' + num : num;
};
// 模板
export const tmp = {
    navTmp: `{{~it:nav}}
    <li class="nav-item" data-reg="{{=nav.reg}}">
        <a href="{{=nav.href}}" class="nav-outer">
            <span class="nav-inner">
                <i class="nav-icon {{=nav.icon}}"></i>
                <span class="nav-text">{{=nav.text}}</span>
            </span>
        </a>
    </li>
    {{~}}`,
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
                <a href="javascript:;" class="com-icon art-heart art-icon {{? atc.is_like }} act {{?}}" data-aid="{{=atc.aid}}">
                    <i class="com-icon__pic heart-icon__pic"></i>
                    <span class="com-icon__text heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                </a>
                <a href="javascript:;" class="com-icon art-comment art-icon">
                    <i class="com-icon__pic eye-icon"></i>
                    <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                </a>
                <a href="javascript:;" class="com-icon art-tag art-icon">
                    <i class="com-icon__pic tag-icon" style="background: url({{=atc.tag_url}}"></i>
                    <span class="com-icon__text">{{=atc.tag_name}}</span>
                </a>
            </div>
        </div>
    </article>
    {{~}}`
};
// 本地存储
export const storage = {
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }
}