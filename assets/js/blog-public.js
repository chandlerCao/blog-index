// 后台端口
export const host = 'http://192.168.1.34:1111';
// 路由
export const navData = [{
        'reg': /^article\?page=(\d+)$/,
        'name': 'articleList',
        'href': '#article?page=1',
        'text': '前端',
        'icon': 'html.png',
        'element': $(`<section id="article-box" class="blog-element"></section>`),
        'reqUrl': '/index/article/getArticleList',
        'cb'(data = {}, cb = function () {}) {
            ajax(this.reqUrl, data).then(({
                data
            }) => {
                cb();
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
            });
        }
    },
    {
        'reg': /^live$/,
        'name': 'liveList',
        'href': '#live',
        'text': '生活',
        'icon': 'live.png',
        'element': $('<section id="live-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleList',
        'cb'(page = 1, cb = function () {}) {
            ajax(this.reqUrl, {
                page
            }).then(data => {
                cb();
                const articleData = data.articleList;
                // 格式化日期
                articleData.map(function (articleItem) {
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                // 博客盒子
                this.element.html(arrText(articleData));
            });
        }
    },
    {
        'reg': /^aboutMe$/,
        'href': 'https://www.baidu.com',
        'text': '简历',
        'icon': 'resume.png',
        'element': $('<section id="mood-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleList',
        'cb'(page = 1) {
            ajax(this.reqUrl, {
                    page
                })
                .then(data => {
                    const articleData = data.articleList;
                    articleData.splice(0, 2);
                    articleData.map(function (articleItem) {
                        // 格式化日期
                        articleItem.date = articleItem.date.split('T')[0];
                    });
                    const arrText = doT.template(tmp.articleTmp);
                    // 博客盒子
                    this.element.append(arrText(articleData));
                });
        }
    },
    {
        "reg": /^article\?tid=(\d+)&page=(\d+)$/,
        'name': 'articleTagList',
        'element': $('<section id="article-tag-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleListByTag',
        'cb'(data = {}, cb = function () {}) {
            ajax(this.reqUrl, data).then(data => {
                cb();
                const articleData = data.articleList;
                articleData.map(function (articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                // 博客盒子
                this.element.html(arrText(articleData));
            });
        }
    },
    {
        'reg': /^article\?aid=(\w+)$/,
        'name': 'articleContent',
        'element': $('<section id="markdown-box" class="blog-element"></section>'),
        'reqUrl': '/index/article/getArticleCnt',
        'cb'(data = {}, cb = function () {}) {
            ajax(this.reqUrl, data).then(data => {
                if (data.code === 0) {
                    cb();
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
                    date = formateDate(date);
                    const hour = date.match(/\s(\d+)/);
                    // 增加八个小时
                    date = date.replace(/\s(\d+)/, ' ' + add_hour8(hour));
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
                    const markdown_main = $(`<div id="markdown-main" class="markdown-main com-scroll">
                        <div class="markdown-title">
                            <h1>${title}</h1>
                        </div>
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
                    <div class="markdown-catalog com-scroll">
                        <div class="markdown-catalog-title">目录</div>
                        ${catalogStr}
                    </div>`).appendTo($(`<div id="markdown-wrap"></div>`).appendTo(this.element.empty()));
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
                }
            })
        }
    }
];
// ajax
export const ajax = function (url, data = {}, cb = function () {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: `${host}${url}`,
            data,
            dataType: "json"
        }).done(data => {
            resolve(data);
            cb();
        }).catch(err => {
            reject(err);
        });
    })
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

    let rowLen = 3,
        colLen = 5;
    while (box_width % rowLen === 0) {
        rowLen++;
    }
    while (box_height % colLen === 0) {
        colLen++;
    }

    // 单元宽高
    const cell_w = Math.floor(box_width / rowLen);
    const cell_h = box_height / colLen;
    const scale = box_height / 723;
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
            const bpx = i % rowLen * cell_w + 50;
            const bpy = Math.floor(i / rowLen) * cell_h;
            str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: 500px ${box_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 30s ${0.03 * i + 2}s infinite"></div>`;
        });
        html += `<div class="three-d" style="float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
    });
    box.html(html);
};
// 日期格式化
export const formateDate = function (date) {
    return date.slice(0, date.length - 5).replace('T', ' ');
};
// 增加八个小时
export const add_hour8 = function (hour) {
    const new_hour = parseInt(hour);
    return toZero(new_hour + 8 < 24 ? new_hour + 8 : new_hour - 24);
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
                <i class="nav-icon" style="background-image: url(./assets/img/{{=nav.icon}})"></i>
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
// loading图
export const loading = function (wrapper) {
    this.wrapper = wrapper;
    this.loading_box = $(`<div class="com-loading-box">
        <div class="com-loading-item"></div>
        <div class="com-loading-item"></div>
        <div class="com-loading-item"></div>
    </div>`);
    loading.prototype.show = function () {
        this.wrapper.append(this.loading_box);
        return this;
    }
    loading.prototype.hide = function () {
        this.loading_box.remove();
        return this;
    }
};
// 分页
export const page = function (opts) {
    /**
     * 父级: par
     * 总条数: total
     * 每页显示条数: page_size
     * 当前页码: now_page
     * 是否显示总数: show_total
     * 样式: theme
     * url 连接
     */
    this.par = opts.par || $();
    this.total = opts.total || 0;
    this.page_size = opts.page_size || 0;
    this.now_page = opts.now_page || 0;
    this.url = opts.url || 'javascript:;';
    this.on_change = opts.on_change || function () {};
    // 初始化
    page.prototype.init = function () {
        this.par.append(`<div class="com-page-box">
            <span class="com-page-total">共 ${this.total} 条</span>
            <div class="com-page-ul">${this.create_page_num()}</div>
        </div>`);
    }
    // 循环出页码
    page.prototype.create_page_num = function () {
        // 多少页
        const page_len = Math.ceil(this.total / this.page_size);
        let list_str = '';
        // 上一页
        const is_first_page = this.now_page === 1;
        list_str += `<a href="${is_first_page ? 'javascript:;' : this.url+(this.now_page-1)}" class="com-page-prev fa fa-angle-left${is_first_page ? ' disabled' : ''}"></a>`;
        // 第一页
        list_str += `<a href="${this.url}1" class="com-page-num${is_first_page ? ' active' : ''}">1</a>`;
        // 向前5页
        if (this.now_page > 5) {
            list_str += `<a href="${this.url}${this.now_page - 5 < 1 ? 1 : this.now_page - 5}" class="com-page-li-jump__prev">
                <i class="page-ellipsis"></i>
                <i class="page-arrow page-arrow-left fa fa-angle-double-left"></i>
            </a>`;
        } else {
            this.par.find('.com-page-li-jump__prev:first').remove();
        }
        // 循环生成页码
        let [start, limit] = [1, 0];
        if (this.now_page <= 5) {
            start = 2;
            limit = this.now_page + 2;
        } else if (this.now_page > page_len - 5) {
            start = this.now_page - 2;
            limit = page_len - 1;
        } else {
            start = this.now_page - 2;
            limit = this.now_page + 2
        }
        for (let i = start; i <= limit; i++) {
            if (i > page_len - 1) break;
            list_str += `<a href="${this.url}${i}" class="com-page-num${i === this.now_page ? ' active' : ''}">${i}</a>`;
        }
        // 向后5页
        if (this.now_page <= page_len - 5) {
            list_str += `<a href="${this.url}${this.now_page + 5 > page_len ? page_len : this.now_page + 5}" class="com-page-li-jump__next">
                <i class="page-ellipsis"></i>
                <i class="page-arrow page-arrow-right fa fa-angle-double-right"></i>
            </a>`;
        } else {
            this.par.find('.com-page-li-jump__next:first').remove();
        }
        // 最后一页
        if (page_len !== 1) list_str += `<a href="${this.url}${page_len}" class="com-page-num${this.now_page === page_len ? ' active' : ''}">${page_len}</a>`;
        // 下一页
        const is_last_page = this.now_page === page_len;
        list_str += `<a href="${is_last_page ? 'javascript:;' : this.url+(this.now_page+1)}" class="com-page-next fa fa-angle-right${is_last_page ? ' disabled' : ''}"></a>`;
        return list_str;
    }
    page.prototype.page_change = function () {
        this.par.delegate('.com-page-li', 'click', this.on_change);
    }
    this.init();
    // 按钮监听
    this.page_change();
}