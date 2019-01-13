export const host = 'http://192.168.1.34:8080';
// app
export const app = $('#app');
// ajax
export const ajax = function (opts) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: opts.type || 'get',
            url: `${host}${opts.url}`,
            data: opts.data || {},
            dataType: 'json'
        }).done(data => {
            if (data.c === 0) resolve(data.d);
            else {
                reject()
                alert(data.m)
            }
        }).catch(err => {
            alert('请求超时！服务器发生异常！');
        });
    });
}
export const artLike = function (aid) {
    return ajax({ url: '/index/article/givealike', data: { aid } });
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
    navTmp() {
        return `{{~it:nav}}
            <li class="nav-item" data-reg="{{=nav.reg}}">
                <a href="{{=nav.href}}" class="nav-outer" {{=nav.target}}>
                    <span class="nav-inner">
                        <i class="nav-icon {{=nav.icon}}"></i>
                        <span class="nav-text">{{=nav.text}}</span>
                    </span>
                </a>
            </li>
        {{~}}`;
    },
    articleTmp() {
        return `{{~it:atc}}
            <article class="article-item">
                <div class="art-pretty">
                    <b class="art-dotts"></b>
                    <time class="art-time">
                        {{=atc.date}}
                    </time>
                </div>
                <div class="art-main com-block">
                    <a href="#article?aid={{=atc.aid}}" class="art-wrap">
                        <div class="art-info">
                            <h2 class="art-title">{{=atc.title}}</h2>
                            <h3 class="art-note" title="{{=atc.preface}}">
                                <span>{{=atc.preface}}</span>
                            </h3>
                        </div>
                        <div class="art-img" style="background-image: url(${host}/{{=atc.cover}})"></div>
                    </a>
                    <div class="art-meta">
                        <a href="javascript:;" class="art-heart heart-box art-icon{{? atc.is_like }} act {{?}} mr20" data-aid="{{=atc.aid}}">
                            <i class="heart-icon__pic"></i>
                            <span class="heart-icon__text">喜欢(<span class="like-num">{{=atc.like_count}}</span>)</span>
                        </a>
                        <a href="javascript:;" class="com-icon art-comment art-icon mr20">
                            <i class="com-icon__pic eye-icon"></i>
                            <span class="com-icon__text">阅读({{=atc.read_count}})</span>
                        </a>
                        <a href="#article?tag={{=atc.tag_name}}&page=1" class="com-icon art-tag art-icon mr20">
                            <i class="com-icon__pic tag-icon" style="background-image: url(${host}/{{=atc.tag_url}})"></i>
                            <span class="com-icon__text">{{=atc.tag_name}}</span>
                        </a>
                    </div>
                </div>
            </article>
        {{~}}`
    }
}