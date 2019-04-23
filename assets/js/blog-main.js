import { host, app, banner3d, getParmasByHash, tmp, storage, PreventShaking } from './blog-utils';
import { Loading, PageUp, $win } from '../com/js/com';
import Router from './blog-router';
const mainBox = $('#main-box');
// 存储当前组件的滚动条位置
; (function () {
    window.onhashchange = function (e) {
        // 获取新旧hash
        const { newURL, oldURL } = e;
        const newHash = newURL.split('#')[1];
        const oldHash = oldURL.split('#')[1];
        getComponent(newHash, oldHash);
    };
})();
// 侧边栏3d图片切换
; (function () {
    // 背景防抖
    const bgShaking = PreventShaking(function () {
        banner3d($('#intrude-bg'), [`${host}/bg/bg1.jpg`, `${host}/bg/bg2.jpg`, `${host}/bg/bg3.jpg`, `${host}/bg/bg4.jpg`]);
    }, 500);
    $win.on('resize.initBg', bgShaking);
    bgShaking();
})();
// 移除旧元素
const oldElRm = function (oldEl) {
    oldEl.off('animationend webkitAnimationEnd').on('animationend webkitAnimationEnd', function () {
        $(this).off('animationend webkitAnimationEnd').empty().detach();
    });
    // 旧元素离开
    oldEl.removeClass('enter').addClass('leave');
};
// 添加新元素
const newElAdd = function (newEl, fn) {
    // 添加即将出现的元素
    mainBox.append(newEl);
    // 新元素出现
    newEl.off('animationend webkitAnimationEnd').on('animationend webkitAnimationEnd', fn).removeClass('leave').addClass('enter');
};
// 切换动画效果
const componentSwitch = function (newEl, oldEl) {
    return new Promise(resolve => {
        oldElRm(oldEl);
        newElAdd(newEl, resolve);
    })
};
// 通过hash匹配相应的组件
const getComponent = function (newHash, oldHash) {
    // 即将出现组件索引
    let [new_index, old_index] = [-1, -1];
    // 如果能找到对应的hash
    Router.forEach((navdata, i) => {
        if (navdata.reg.test(newHash)) new_index = i;
        if (navdata.reg.test(oldHash)) old_index = i;
    });
    // 如果找到对应的索引
    if (new_index === -1) {
        if (old_index > -1) oldElRm(Router[old_index].element);
        // 没有找到对应的hash值，默认跳转到第一个
        window.location.hash = Router[0].href;
        return;
    }
    // 元素切换
    if (Router[new_index] !== Router[old_index]) {
        componentSwitch(
            Router[new_index].element,
            Router[old_index] ? Router[old_index].element : $()
        ).then(() => {
            // 新元素滚动到上一次位置
            const scrollTop_data = storage.get('scrollTop') || {};
            // 如果本地存储了当前的滚动位置，没有就跳转到顶部
            let scrollTop = scrollTop_data[newHash] ? scrollTop_data[newHash] : 0;
            app.animate({ 'scrollTop': scrollTop }, 300);
        });
    }
    // 发送当前组件对应请求
    Router[new_index].handler.ajax.call(Router[new_index], getParmasByHash()).then(data => {
        // 执行当前组件回调函数
        Router[new_index].handler.callback.call(Router[new_index], data);
    });
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
    const navText = doT.template(tmp.navTmp());
    // 过滤出需要展示的导航元素
    const filterNavData = Router.filter(navdata => {
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
// 回到顶部
; (function () {
    new PageUp({
        scroll_el: app
    })
})();
// 记录滚动条位置
; (function () {
    const scrollPositionShaking = PreventShaking(() => {
        const scrollTop_data = storage.get('scrollTop') || {};
        let hash = window.location.hash;
        hash = hash.substr(1, hash.length);
        scrollTop_data[hash] = app.scrollTop();
        // 存储到本地存储
        storage.set('scrollTop', scrollTop_data);
    }, 50);
    app.on('scroll', scrollPositionShaking);
})();