import {host, picture3DSwitch, navData, getParmasByHash, tmp} from './public';
const blogBox = $('#blog-box');
const body = $('body:first');
window.onhashchange = function(e) {
    const {newURL, oldURL} = e;
    const newHash = newURL.split('#')[1];
    const oldHash = oldURL.split('#')[1];
    switchByHash(newHash, oldHash);
    body.scrollTop(0);
};
// canvas雪花
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
// 元素切换函数
let timer = null;
// 切换动画效果
const elementSwitch = function(newEl, oldEl) {
    // 添加即将出现的元素
    blogBox.append(newEl);
    // 旧元素离开
    oldEl.removeClass('enter').addClass('leave');
    clearTimeout(timer);
    timer = setTimeout(function() {
        oldEl.detach();
    }, 500);
    newEl.removeClass('leave').addClass('enter');
};
// 通过hash值切换元素
const switchByHash = function(newHash, oldHash) {
    // 即将出现组件索引
    let [is_new_hash, new_index, is_old_hash, old_index] = ['', 0,  '', 0];
    // 如果能找到对应的hash
    navData.forEach((navdata, i) => {
        if( navdata.reg.test(newHash) ) {
            is_new_hash = newHash;
            new_index = i;
        }
        if( navdata.reg.test(oldHash) ) {
            is_old_hash = oldHash;
            old_index = i;
        }
    });
    // 如果当前模块值允许请求一次
    if( navData[new_index].reqOnece ) {
        // 如果没有请求过
        if( !navData[new_index].req ) {
            navData[new_index].req = true;
            navData[new_index].cb(getParmasByHash());
        }
    } else {
        navData[new_index].cb(getParmasByHash());
    }
    elementSwitch(
        is_new_hash ? navData[new_index].element : navData[0].element,
        is_old_hash ? navData[old_index].element : $()
    );
};
// 首次加载
;(function() {
    // 获取当前hash
    let now_hash = window.location.hash.substr(1);
    // 如果能找到对应的hash
    let hash = '';
    navData.forEach((navdata, i) => {
        if( navdata.reg.test(now_hash) ) hash = now_hash;
    });
    // 如果匹配到对应的hash值
    if(hash) {
        switchByHash(hash);
    } else {
        hash = navData[0].hash;
        window.location.hash = hash;
    }
    $('#head-portrait > img').addClass('zoomInDown animated');
    $('#intrude-info').addClass('bounceInLeft animated');
})();
// 创建导航菜单
;(function() {
    // 获取导航ul
    const navList = $('#nav-list');
    const navText = doT.template(tmp.navTmp);
    // 过滤导航菜单
    const filterNavData = navData.filter(navdata => {
        return navdata.text;
    });
    navList.html(navText(filterNavData));
    const navItem = $('.nav-item');
    const hash = window.location.hash.substr(1);
    navItem.each(function (i, nav) {
        const reg = $(nav).data('reg').replace(/\//g, '');
        if( new RegExp(reg).test(hash) ) $(nav).addClass('act');
    });
    navItem.on('click', function() {
        // 导航加上高亮
        $(this).addClass('act').siblings().removeClass('act');
    });
})();
// 侧边栏3d图片切换
;(function() {
    // 引入服务器上的地址
    if( $(window).width() > 1000 ) picture3DSwitch($('#intrude-bg'), [`${host}/bg/bg1.png`, `${host}/bg/bg2.png`, `${host}/bg/bg3.png`, `${host}/bg/bg4.png`]);
    else $('#intrude-bg').css('background-image', `url(${host}/bg/s-bg${Math.ceil(Math.random()*4)}.png)`);
})();
// 点赞
;(function() {
    $('#blog-box').delegate('.art-heart', 'click', function() {
        $(this).toggleClass('act');
    });
})();