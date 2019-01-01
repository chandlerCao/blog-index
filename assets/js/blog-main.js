import { host, app, banner3d, navData, getParmasByHash, tmp, ajax, storage } from './blog-public';
import { Loading, PageUp } from '../com/js/com';
const mainBox = $('#main-box');
const scrollTop_data = storage.get('scrollTop') || {};
// 存储当前组件的滚动条位置
window.onhashchange = function (e) {
    const { newURL, oldURL } = e;
    // 获取新旧hash
    const newHash = newURL.split('#')[1];
    const oldHash = oldURL.split('#')[1];
    getComponent(newHash, oldHash);
};
// 侧边栏3d图片切换
; (function () {
    // 引入服务器上的地址
    $(window).on('resize.initBg', () => {
        let bg_dir;
        if ($(window).width() > 800) bg_dir = 'large';
        else if ($(window).width() > 600) bg_dir = 'medium';
        else bg_dir = 'small';
        banner3d($('#intrude-bg'), [`${host}/bg/${bg_dir}/bg1.jpg`, `${host}/bg/${bg_dir}/bg2.jpg`, `${host}/bg/${bg_dir}/bg3.jpg`, `${host}/bg/${bg_dir}/bg4.jpg`]);
    });
    setTimeout(() => {
        $(window).trigger('resize.initBg');
    }, 0);
})();
// canvas雪花
; (function () {
    function drawObj(cxt, x, y, r, color) {
        /**星星 */
        /* let r2 = r / 2.5;
        cxt.beginPath();
        for (let i = 0; i < 5; i++) {
            cxt.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * r + y);
            cxt.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * r2 + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * r2 + y);
        }
        cxt.closePath();
        //设置边框样式以及填充颜色
        cxt.fillStyle = color;
        cxt.fill(); */
        /**星星 */

        /**雪花 */
        cxt.beginPath();
        var img = new Image();
        img.src = '/assets/img/snow.png';
        cxt.drawImage(img, x, y, r, r);
        cxt.closePath();
        /**雪花 */

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
                r: random() * 8 + 8,
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
            if (snowArr[i].y >= win.height()) snowArr[i].y = -snowArr[i].r;

            snowArr[i].xNum--;
            if (snowArr[i].xNum === -360) snowArr[i].xNum = 0;

            snowArr[i].x = snowArr[i].startX - snowArr[i].range * Math.sin(Math.PI / 180 * snowArr[i].xNum);

            // g.arc(snowArr[i].x, snowArr[i].y, snowArr[i].r, 0, Math.PI * 2);
            drawObj(g, snowArr[i].x, snowArr[i].y, snowArr[i].r, color);
        };
        timer = setTimeout(function () {
            requestAnimationFrame(starFlash);
        }, 20);
    };
})();
// 切换动画效果
let timer = null;
const componentSwitch = function (newEl, oldEl) {
    return new Promise(resolve => {
        // 添加即将出现的元素
        mainBox.append(newEl);
        // 新元素出现
        newEl.removeClass('leave').addClass('enter');
        // 旧元素离开
        oldEl.removeClass('enter').addClass('leave');
        clearTimeout(timer);
        timer = setTimeout(() => {
            oldEl.empty().detach();
            resolve();
        }, 300);
    })
};
// 通过hash匹配相应的组件
const getComponent = function (newHash, oldHash) {
    // 即将出现组件索引
    let [new_index, old_index] = [-1, -1];
    // 如果能找到对应的hash
    navData.forEach((navdata, i) => {
        if (navdata.reg.test(newHash)) new_index = i;
        if (navdata.reg.test(oldHash)) old_index = i;
    });
    // 如果找到对应的索引
    if (new_index > -1) {
        // 显示loading图
        const load = new Loading(mainBox).show();
        // 记录旧元素滚动条位置
        if (old_index > -1) {
            scrollTop_data[navData[old_index].name] = app.scrollTop();
            // 存储到本地存储
            storage.set('scrollTop', scrollTop_data);
        }
        // 发送当前组件对应请求
        navData[new_index].handler.ajax(getParmasByHash()).then(data => {
            load.hide();
            // 元素切换
            if (navData[new_index] !== navData[old_index]) {
                componentSwitch(
                    navData[new_index].element,
                    old_index >= 0 ? navData[old_index].element : $()
                ).then(() => {
                    // 新元素滚动到上一次位置
                    let scrollTop = 0;
                    if (scrollTop_data[navData[new_index].name]) scrollTop = scrollTop_data[navData[new_index].name];
                    app.animate({ 'scrollTop': scrollTop }, 300);
                });
            }
            // 执行当前组件回调函数
            navData[new_index].handler.callback.call(navData[new_index], data);
        })
    } else {
        // 没有找到对应的hash值，默认跳转到第一个
        window.location.hash = navData[0].href;
    }
};
// 首次加载
; (function () {
    getComponent(window.location.hash.substr(1));
    $('#head-portrait').addClass('zoomInDown animated');
    $('#intrude-info').addClass('bounceInLeft animated');
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
// 点赞
; (function () {
    let like_complete = true;
    mainBox.delegate('.art-heart', 'click', function () {
        if (!like_complete) return;
        like_complete = false;
        const aid = $(this).data('aid');
        ajax('/index/article/givealike', { aid }).then(data => {
            $(this).toggleClass('act');
            $(this).find('.like-num:first').text(data.likeTotal);
            like_complete = true;
        });
    });
})();
// 回到顶部
; (function () {
    new PageUp({
        scroll_el: app
    })
})();