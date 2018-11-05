import { host, picture3DSwitch, navData, getParmasByHash, tmp, ajax } from './blog-public';
require('./side-bar');
const mainBox = $('#main-box');
const body = $('body:first');
window.onhashchange = function (e) {
    const { newURL, oldURL } = e;
    const newHash = newURL.split('#')[1];
    const oldHash = oldURL.split('#')[1];
    get_component_by_hash(newHash, oldHash);
    // $(window).scrollTop(0);
};
// canvas雪花
; (function () {
    function drawStar(cxt, x, y, r, color) {
        let r2 = r / 2.5;
        cxt.beginPath();
        for (var i = 0; i < 5; i++) {
            cxt.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * r + y);
            cxt.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * r2 + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * r2 + y);
        }
        cxt.closePath();
        //设置边框样式以及填充颜色
        cxt.fillStyle = color;
        cxt.fill();
    }
    const c = $('#canvasBg');
    const g = c[0].getContext('2d');
    const color = '#6eaaff';
    let snowArr = [];
    let timer = null;
    let initTimer = null;
    const win = $(window);
    let starLen = Math.floor(win.width() / 60);
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
                r: random() * 8,
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
            // y轴加
            snowArr[i].y += snowArr[i].speedY;
            if (snowArr[i].y >= win.height() + snowArr[i].r) snowArr[i].y = -snowArr[i].r;

            snowArr[i].xNum--;
            if (snowArr[i].xNum === -360) snowArr[i].xNum = 0;

            snowArr[i].x = snowArr[i].startX - snowArr[i].range * Math.sin(Math.PI / 180 * snowArr[i].xNum);

            // g.arc(snowArr[i].x, snowArr[i].y, snowArr[i].r, 0, Math.PI * 2);
            drawStar(g, snowArr[i].x, snowArr[i].y, snowArr[i].r, color);
        };
        timer = setTimeout(function () {
            requestAnimationFrame(starFlash);
        }, 50);
    };
})();
// 元素切换函数
let timer = null;
// 切换动画效果
const element_switch = function (newEl, oldEl) {
    if (newEl.attr('id') !== oldEl.attr('id')) {
        // 添加即将出现的元素
        mainBox.append(newEl);
        // 新元素出现
        newEl.removeClass('leave').addClass('enter');
        // 旧元素离开
        oldEl.removeClass('enter').addClass('leave');
        // 移除旧元素
        clearTimeout(timer);
        timer = setTimeout(function () {
            oldEl.detach();
        }, 500);
    }
};
// 通过hash匹配相应的组件
const get_component_by_hash = function (newHash, oldHash) {
    // 即将出现组件索引
    let [new_index, old_index] = [-1, -1];
    // 如果能找到对应的hash
    navData.forEach((navdata, i) => {
        if (navdata.reg.test(newHash)) new_index = i;
        if (navdata.reg.test(oldHash)) old_index = i;
    });
    // 如果找到对应的索引
    if (new_index > -1) {
        // 请求回调函数
        navData[new_index].cb(getParmasByHash());
        // 元素切换
        element_switch(
            navData[new_index].element,
            old_index >= 0 ? navData[old_index].element : $()
        );
    } else window.location.hash = navData[0].href;
};
// 首次加载
; (function () {
    get_component_by_hash(window.location.hash.substr(1));
    $('#head-portrait').addClass('zoomInDown animated');
    $('#intrude-info').addClass('bounceInLeft animated');
    document.addEventListener('touchstart', function () {
    })
})();
// 创建导航菜单
; (function () {
    // 获取导航ul
    const navList = $('#nav-list');
    const navText = doT.template(tmp.navTmp);
    // 过滤出需要展示的导航元素
    const filterNavData = navData.filter(navdata => {
        return navdata.text;
    });
    navList.html(navText(filterNavData));
    const navItem = $('.nav-item');
    // 获取当前hash
    const hash = window.location.hash.substr(1);
    navItem.each(function (i, nav) {
        const reg = $(nav).data('reg').replace(/\//g, '');
        if (new RegExp(reg).test(hash)) $(nav).addClass('act');
    });
    navItem.on('click', function () {
        // 导航加上高亮
        $(this).addClass('act').siblings().removeClass('act');
    });
})();
// 侧边栏3d图片切换
; (function () {
    // 引入服务器上的地址
    if ($(window).width() > 1000) picture3DSwitch($('#intrude-bg'), [`${host}/bg/bg1.png`, `${host}/bg/bg2.png`, `${host}/bg/bg3.png`, `${host}/bg/bg4.png`]);
    else $('#intrude-bg').css('background-image', `url(${host}/bg/s-bg${Math.ceil(Math.random() * 4)}.png)`);
})();
// 点赞
; (function () {
    $('#blog-box').delegate('.art-heart', 'click', function () {
        ajax('index/article-like').then(data => {
            console.log(data);
        })
        // $(this).addClass('act');
    });
})();