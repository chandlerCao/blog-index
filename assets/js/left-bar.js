import { Tooltip } from "../com/js/com";
import { imgload } from "./blog-public";
// 联系方式
; (function () {
    // 微信二维码
    imgload('./assets/img/WeChat-qr-code.jpg').then(img => {
        const wechatImg = $(img);
        wechatImg.attr({
            width: 100,
            alt: '微信二维码'
        });
        new Tooltip({
            el: $('#wechat__icon'),
            theme: 'light',
            content: wechatImg.prop('outerHTML')
        });
    });
    // qq二维码
    imgload('./assets/img/QQ-qr-code.jpg').then(img => {
        const qqImg = $(img);
        qqImg.attr({
            width: 100,
            alt: 'QQ二维码'
        });
        new Tooltip({
            el: $('#qq__icon'),
            theme: 'light',
            content: qqImg.prop('outerHTML')
        });
    });
    // 邮箱
    new Tooltip({
        el: $('#email__icon'),
        theme: 'light',
        content: '597649635@qq.com'
    });
})();