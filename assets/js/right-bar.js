import { toZero, ajax } from './blog-public';
// 右边栏固定定位
; (function () {
    const side_bar = $('#side-bar');
    const side_bar_pos = side_bar.offset().top + side_bar.height();
    $('#app').scroll(function () {
        if ($(this).scrollTop() >= side_bar_pos && !side_bar.hasClass('fixed')) side_bar.addClass('fixed');
        else if ($(this).scrollTop() < side_bar_pos && side_bar.hasClass('fixed')) side_bar.removeClass('fixed');
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
        const hour = (date.getHours() > 11 ? date.getHours() - 12 : date.getHours()) * 30 + min / 360 * 30;

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
    ajax('/index/article/getArticleTag').then(data => {
        const tagData = data.tagList || [];
        let tag_str = '';
        tagData.forEach(tag_item => {
            tag_str += `<a href="#article?tag=${tag_item.tag_name}&page=1" class="tag-item" title="${tag_item.tag_name}">
                <span class="tag-text">${tag_item.tag_name}</span>
            </a>`;
        });
        tag_box.html(tag_str);
    });
})();