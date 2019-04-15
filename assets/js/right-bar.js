import { host, toZero, ajax, app, Snow, PreventShaking } from './blog-utils';
import Router from './blog-router';
// 右边栏固定定位
const rightBarFixed = () => {
    const side_bar = $('#side-bar');
    const side_bar_pos = side_bar.offset().top + side_bar.height();
    app.scroll(function () {
        if ($(this).scrollTop() >= side_bar_pos && !side_bar.hasClass('fixed')) side_bar.addClass('fixed');
        else if ($(this).scrollTop() < side_bar_pos && side_bar.hasClass('fixed')) side_bar.removeClass('fixed');
    });
};
// 文字搜索
; (function () {
    const searchInput = $('#article-search-input');
    const searchBtn = $('#article-search-btn');

    // 搜索防抖
    const searchPreventShaking = PreventShaking(function (searchText) {
        window.location.hash = `#article?searchText=${searchText}&page=1`;
    }, 200);

    searchBtn.on('click', function () {
        const searchVal = searchInput.val();
        searchPreventShaking(searchInput.val());
    });

    searchInput.on('keydown', function (e) {
        if (e.keyCode === 13) searchBtn.trigger('click');
    });


})();
// 时钟
; (function () {
    const hour_num = $('#hour-num');
    const anchor_box = $('#anchor-box');
    let anchor_str = '';
    for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) anchor_str += `<i class="anchor anchor-num" style="transform: rotate(${i * 6}deg);">
                <span style="transform: rotate(${-i * 6}deg);">${toZero(i)}</span>
            </i>`;
        else anchor_str += `<i class="anchor anchor-bar" style="transform: rotate(${i * 6}deg);"></i>`;
    }
    anchor_box.html(anchor_str);

    let hour_str = '';
    for (let i = 1; i <= 12; i++) {
        hour_str += `<span class="hour-text" style="transform: rotate(${i * 30}deg);">
            <span style="${i > 9 ? 'left: -9px;' : ''} transform: rotate(${-i * 30}deg);">${i}</span>
        </span>`;
    }
    hour_num.html(hour_str);

    const hour_hand = $('#hour-hand');
    const min_hand = $('#min-hand');
    const sec_hand = $('#sec-hand');
    clock_go();
    function clock_go() {
        const date = new Date();
        const sec = date.getSeconds() * 6;
        const min = date.getMinutes() * 6 + sec / 360 * 6;
        const hour = (date.getHours() > 11 ? date.getHours() - 12 : date.getHours()) * 30 + (min / 360 * 30);

        hour_hand.css('transform', `rotate(${hour}deg)`);
        min_hand.css('transform', `rotate(${min}deg)`);
        sec_hand.css('transform', `rotate(${sec}deg)`);
        setTimeout(() => {
            requestAnimationFrame(clock_go);
        }, 1000);
    }
})();
// 获取标签云
; (function () {
    const tag_box = $('#tag-box');
    var imgArr = [];
    ajax({ url: '/index/article/getArticleTag' }).then((tagList = []) => {
        let tag_str = '';
        tagList.forEach(tag_item => {
            imgArr.push(`${host}/${tag_item.img}`);
            tag_str += `<a href="#article?tag=${tag_item.tag_name}&page=1" class="com-icon tag-item">
                <i class="com-icon__pic" style="background-image: url(${host}/${tag_item.img})"></i>
                <span class="com-icon__text">${tag_item.tag_name}</span>
            </a>`;
        });
        tag_box.html(tag_str);
        Snow(imgArr);
        // 右边栏自动固定定位
        // rightBarFixed();
        tagClick()();
    });
    function tagClick() {
        var prev = $();
        return () => {
            $('.tag-item').on('click', function () {
                prev.removeClass('act');
                prev = $(this).addClass('act');
            });
        }
    }
})();