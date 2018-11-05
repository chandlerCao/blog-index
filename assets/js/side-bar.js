import { toZero } from './blog-public';
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
    setInterval(clock_go, 1000);
    function clock_go() {
        const date = new Date();
        const sec = date.getSeconds() * 6;
        const min = date.getMinutes() * 6 + sec / 360 * 6;
        const hour = (date.getHours() > 11 ? date.getHours() - 12 : date.getHours()) * 30 + min / 360 * 30;

        hour_hand.css('transform', `rotate(${hour}deg)`);
        min_hand.css('transform', `rotate(${min}deg)`);
        sec_hand.css('transform', `rotate(${sec}deg)`);
    }
})();