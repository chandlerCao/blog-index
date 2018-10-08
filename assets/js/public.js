// 后台端口
export const host = 'http://192.168.1.35:1111';
// 路由
export const navData = [
    {
        'reg': /^article\?page=(\d+)$/,
        'hash': 'article?page=1',
        'text': '技术',
        'icon': 'fa fa-home',
        'element': $('<div id="article-box" class="blog-element"></div>'),
        'reqUrl': 'index/getArticleList',
        'reqOnece': true,
        'cb'(data = {}) {
            ajax(this.reqUrl, data)
            .then(data => {
                const articleData = data.articleList;
                articleData.map(function(articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                // 博客盒子
                this.element.append(arrText(articleData));
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 20);
            });
        }
    },
    {
        'reg': /^photo$/,
        'hash': 'photo',
        'text': '杂谈',
        'icon': 'fa fa-photo',
        'element': $('<div id="photo-box" class="blog-element"></div>'),
        'reqUrl': 'index/getArticleList',
        'reqOnece': true,
        'cb'(page = 1) {
            ajax(this.reqUrl, {
                page
            })
            .then(data => {
                const articleData = data.articleList;
                articleData.splice(0, 1);
                // 格式化日期
                // articleData.map(function(articleItem) {
                //     articleItem.date = articleItem.date.split('T')[0];
                // });
                const arrText = doT.template(tmp.articleTmp);
                // 博客盒子
                this.element.append(arrText(articleData));
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 20);
            });
        }
    },
    {
        'reg': /^mood$/,
        'hash': 'mood',
        'text': '心情',
        'icon': 'fa fa-smile-o',
        'element': $('<div id="mood-box" class="blog-element"></div>'),
        'reqUrl': 'index/getArticleList',
        'reqOnece': true,
        'cb'(page = 1) {
            ajax(this.reqUrl, {
                page
            })
            .then(data => {
                const articleData = data.articleList;
                articleData.splice(0, 2);
                articleData.map(function(articleItem) {
                    // 格式化日期
                    articleItem.date = articleItem.date.split('T')[0];
                });
                const arrText = doT.template(tmp.articleTmp);
                // 博客盒子
                this.element.append(arrText(articleData));
                // 添加省略号
                setTimeout(function() {
                    $('.art-note').each(function (index, el) {
                        addEllipsis($(el));
                    });
                }, 20);
            });
        }
    },
    {
        'reg': /^article\?aid=(.+)$/,
        'element': $('<div id="article-cnt" class="blog-element"></div>'),
        'reqUrl': 'index/getArticleCnt',
        'cb'(data = {}) {
            ajax(this.reqUrl, data).then(data => {
                if(data.code === 0) {
                    let {title, preface, content, cover, date} = data.articleInfo[0];
                    date = formateDate(date);
                    this.element.html(`
                        <div class="markdown-cnt">
                            <div class="markdown-title">
                                <h1>${title}</h1>
                                <div class="markdown-meta">
                                    <time class="meta-time"><i class="fa fa-calendar"></i> ${date}</time>
                                    <span class="meta-like"><i class="fa fa-heart"></i> 喜欢 399</span>
                                    <span class="meta-comment"><i class="fa fa-comment"></i> 评论 22</span>    
                                </div>
                            </div>
                            <div class="markdown-preface">${preface}</div>
                            <div class="markdown-cover" style="background-image: url(${cover})"></div>
                            <div class="v-note-wrapper markdown-body">
                                <div class="v-note-read-model scroll-style">
                                    <div class="v-note-read-content">
                                        ${content}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="markdown-catalog">
                            <h1><a href="标题1">标题1</a></h1>
                        </div>
                    `);
                } else alert(data.msg)
            })
        }
    }
];
// 文字溢出隐藏
export const addEllipsis = function (box) {
    var bgColor = '#fff';
    var boxH = box.height();
    var span = box.find('span:first');
    var cntH = span.height();

    if (boxH > cntH + 1) return;

    var fontSize = parseInt(span.css('font-size'));
    var lineH = parseInt(span.css('line-height'));
    // 获取能显示几行
    var lineCount = Math.ceil(boxH / lineH) - 1;
    var top = lineCount * lineH;

    var paddingTop = parseInt(box.css('paddingTop'));

    var mask = $('<div style="position: absolute; width: 100%; height: 40px; background-color: ' + bgColor + '; left: 0; top: ' + (top + paddingTop) + 'px;"></div>');

    var ellipsis = $(`<span style="position: absolute; width: ${fontSize}px; text-align: left; right: 0; top: ${(((lineCount - 1) * lineH) + paddingTop)}px; background-color: ${bgColor};">...</span>`);

    box.append(mask, ellipsis);
};
// ajax
export const ajax = function (url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: `${host}/${url}`,
            data,
            dataType: "json"
        })
        .done(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        });
    })
};
// 获取hash动态路径参数
export const getParmasByHash = function() {
    const hash = window.location.hash;
    const regArr = hash.match(/(\w+)=[^&]+/g);
    const data = {};
    if( regArr && regArr.length ) {
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
    while (box_width % rowLen === 0) {
        rowLen ++;
    }
    while (box_height % colLen === 0) {
        colLen ++;
    }
    
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
            const bpx = i % rowLen * cell_w + 50;
            const bpy = Math.floor(i / rowLen) * cell_h;
            str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: 500px ${box_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 30s ${0.03 * i + 2}s infinite"></div>`;
        });
        html += `<div class="three-d" style="float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
    });
    box.html(html);
};
// 模板
export const tmp = {
    navTmp: `{{~it:nav}} 
    <li class="nav-item" data-reg="{{=nav.reg}}">
        <a href="#{{=nav.hash}}" class="nav-outer">
            <span class="nav-inner">
                <i class="{{=nav.icon}}"></i>
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
            <a href="#article?aid={{=atc.aid}}" data-aid="{{=atc.aid}}" class="art-wrap">
                <div class="art-info">
                    <h2 class="art-title">{{=atc.title}}</h2>
                    <h3 class="art-note" title="{{=atc.preface}}">
                        <span>{{=atc.preface}}</span>
                    </h3>
                </div>
                <div class="art-img" style="background-image: url({{=atc.cover}})"></div>
            </a>
            <div class="art-meta">
                <a href="javascript:;" class="art-heart" title="i lile it">
                    <i class="heart-icon"></i>
                    <span>喜欢(500)</span>
                </a>
                <a href="javascript:;" class="art-comment" title="评论">
                    <i class="comment-icon fa fa-comment"></i>
                    <span>评论(20)</span>
                </a>
                <a href="javascript:;" class="art-tag" title="博客标签">
                    <i class="fa fa-tag"></i>
                    <span>{{=atc.tag_name}}</span>
                </a>    
            </div>
        </div>
    </article>
    {{~}}`
};
// 日期格式化
export const formateDate = function(date) {
    return date.slice(0, date.length - 5).replace('T', ' ');
};