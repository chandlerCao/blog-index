// 后台端口
const host = 'http://192.168.200.148:1111';
// 对应的模块id
export const navData = {
    'blog': {
        'text': '博客',
        'icon': 'fa fa-home',
        'element': $('<div id="article-box" class="leaving"></div>'),
        'reqUrl': 'index/getArticleList'
    },
    'photo': {
        'text': '相册',
        'icon': 'fa fa-photo',
        'element': $('<div id="photo-box" class="leaving"></div>'),
        'reqUrl': 'index/getArticleList'
    },
    'mood': {
        'text': '心情',
        'icon': 'fa fa-smile-o',
        'element': $('<div id="mood-box" class="leaving"></div>'),
        'reqUrl': 'index/getArticleList'
    }
};
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
// 雪花
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
// 侧边栏背景切换
export const picture3DSwitch = function (box, imgArr, rowLen, colLen) {
    /**
     * box: 父级
     * imgArr 图片数组
     * rowLen 横排个数
     * colLen 竖排个数
     */
    // 盒子宽高
    const box_width = box.width();
    const box_height = box.height();

    // 单元宽高
    const cell_w = Math.floor(box_width / rowLen);
    const cell_h = box_height / colLen;

    // 单元个数
    const cell_num = rowLen * colLen;
    // 循环生成
    let html = ``;
    new Array(cell_num).fill('').forEach((item, i) => {
        let str = ``;
        imgArr.forEach((url, j) => {
            let transform = '';
            if (j === 0) transform = `transform: rotateY(0);`;
            if (j === 1) transform = `transform: rotateY(90deg);`;
            if (j === 2) transform = `transform: rotateY(180deg);`;
            if (j === 3) transform = `transform: rotateY(270deg);`;
            const bpx = i % rowLen * cell_w;
            const bpy = Math.floor(i / rowLen) * cell_h;
            str += `<div style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-image: url(${url}); background-size: ${box_width}px ${box_height}px; background-position: ${-bpx}px ${-bpy}px; transform-origin: center center -${cell_w / 2}px; ${transform}; animation: picture3DSwitch${j + 1} 20s ${0.03 * i}s infinite"></div>`;
        });
        html += `<div class="three-d" style="float: left; position: relative; width: ${cell_w}px; height: ${cell_h}px;">${str}</div>`;
    });
    box.html(html);
};